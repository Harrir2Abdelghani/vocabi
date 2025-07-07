import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Trophy, Star, Target, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUserProfile } from './UserProfileContext';

const GameSystemContext = createContext();

export const useGameSystem = () => {
  const context = useContext(GameSystemContext);
  if (!context) {
    throw new Error('useGameSystem must be used within a GameSystemProvider');
  }
  return context;
};

export const GameSystemProvider = ({ children }) => {
  const { userProfile, updateScore, updateLevel, completeGame } = useUserProfile();
  
  const value = {
    // Game system methods will be added here
  };

  return (
    <GameSystemContext.Provider value={value}>
      {children}
    </GameSystemContext.Provider>
  );
};

// Game Wrapper Component
export const GameWrapper = ({ 
  children, 
  gameName, 
  onGameComplete, 
  onGameFail,
  maxTime = 120, // 2 minutes default
  maxHearts = 3,
  difficulty = 'easy'
}) => {
  const [hearts, setHearts] = useState(maxHearts);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [gameSession, setGameSession] = useState(null);
  
  const { userProfile, updateScore: updateUserScore, completeGame: completeUserGame } = useUserProfile();

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameEnded && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameFail('Time up!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameEnded, timeLeft]);

  // Start game session
  const startGame = async (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultySelect(false);
    setGameStarted(true);
    
    // Adjust settings based on difficulty
    if (difficulty === 'hard') {
      setTimeLeft(Math.floor(maxTime * 0.7)); // 30% less time
      setHearts(Math.max(1, maxHearts - 1)); // One less heart
    }

    // Create game session in database
    try {
      const deviceId = localStorage.getItem('vocabiDeviceId');
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          device_id: deviceId,
          game_name: gameName,
          difficulty: difficulty,
          score: 0,
          time_taken: 0,
          hearts_used: 0,
          completed: false
        })
        .select()
        .single();
      
      if (data && !error) {
        setGameSession(data);
      }
    } catch (error) {
      console.error('Error creating game session:', error);
    }
  };

  // Handle losing a heart
  const loseHeart = () => {
    if (hearts > 1) {
      setHearts(prev => prev - 1);
      return true; // Game continues
    } else {
      handleGameFail('No hearts left!');
      return false; // Game ends
    }
  };

  // Handle game completion
  const handleGameComplete = async (finalScore = score) => {
    if (gameEnded) return;
    
    setGameEnded(true);
    const timeTaken = maxTime - timeLeft;
    const heartsUsed = maxHearts - hearts;
    
    // Calculate bonus points
    let bonusPoints = 0;
    if (selectedDifficulty === 'hard') bonusPoints += 50;
    if (hearts === maxHearts) bonusPoints += 30; // Perfect hearts bonus
    if (timeLeft > maxTime * 0.5) bonusPoints += 20; // Speed bonus
    
    const totalScore = finalScore + bonusPoints;
    
    // Update user profile
    updateUserScore(totalScore);
    completeUserGame();
    
    // Update game session in database
    try {
      if (gameSession) {
        await supabase
          .from('game_sessions')
          .update({
            score: totalScore,
            time_taken: timeTaken,
            hearts_used: heartsUsed,
            completed: true,
            perfect_score: hearts === maxHearts
          })
          .eq('id', gameSession.id);
      }
      
      // Update game stats
      await updateGameStats(totalScore, timeTaken, heartsUsed, true);
    } catch (error) {
      console.error('Error updating game session:', error);
    }
    
    if (onGameComplete) {
      onGameComplete({ 
        score: totalScore, 
        hearts: hearts, 
        timeLeft: timeLeft,
        difficulty: selectedDifficulty,
        bonusPoints
      });
    }
  };

  // Handle game failure
  const handleGameFail = async (reason) => {
    if (gameEnded) return;
    
    setGameEnded(true);
    const timeTaken = maxTime - timeLeft;
    const heartsUsed = maxHearts - hearts;
    
    // Update game session in database
    try {
      if (gameSession) {
        await supabase
          .from('game_sessions')
          .update({
            score: score,
            time_taken: timeTaken,
            hearts_used: heartsUsed,
            completed: false
          })
          .eq('id', gameSession.id);
      }
      
      // Update game stats
      await updateGameStats(score, timeTaken, heartsUsed, false);
    } catch (error) {
      console.error('Error updating game session:', error);
    }
    
    if (onGameFail) {
      onGameFail({ reason, score, hearts, timeLeft: timeLeft });
    }
  };

  // Update game statistics
  const updateGameStats = async (finalScore, timeTaken, heartsUsed, completed) => {
    try {
      const deviceId = localStorage.getItem('vocabiDeviceId');
      
      // Get existing stats
      const { data: existingStats } = await supabase
        .from('game_stats')
        .select('*')
        .eq('device_id', deviceId)
        .eq('game_name', gameName)
        .single();
      
      if (existingStats) {
        // Update existing stats
        const newTotalPlays = existingStats.total_plays + 1;
        const newTotalScore = existingStats.total_score + finalScore;
        const newBestScore = Math.max(existingStats.best_score, finalScore);
        const newBestTime = completed ? Math.min(existingStats.best_time || timeTaken, timeTaken) : existingStats.best_time;
        const newCompletionRate = ((existingStats.completion_rate * existingStats.total_plays) + (completed ? 1 : 0)) / newTotalPlays;
        const newAvgHearts = ((existingStats.average_hearts_used * existingStats.total_plays) + heartsUsed) / newTotalPlays;
        
        await supabase
          .from('game_stats')
          .update({
            total_plays: newTotalPlays,
            total_score: newTotalScore,
            best_score: newBestScore,
            best_time: newBestTime,
            completion_rate: newCompletionRate,
            average_hearts_used: newAvgHearts,
            last_played: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStats.id);
      } else {
        // Create new stats
        await supabase
          .from('game_stats')
          .insert({
            device_id: deviceId,
            game_name: gameName,
            total_plays: 1,
            total_score: finalScore,
            best_score: finalScore,
            best_time: completed ? timeTaken : null,
            completion_rate: completed ? 1 : 0,
            average_hearts_used: heartsUsed,
            last_played: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  // Add points during game
  const addPoints = (points) => {
    setScore(prev => prev + points);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Difficulty selection screen
  if (showDifficultySelect) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎮
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2">{gameName}</h2>
            <p className="text-white/80">Choose your difficulty level</p>
          </div>

          <div className="space-y-4">
            <motion.button
              onClick={() => startGame('easy')}
              className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">😊</span>
                  <div className="text-left">
                    <div>Easy Mode</div>
                    <div className="text-sm opacity-80">More time, more hearts</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(maxHearts)].map((_, i) => (
                    <Heart key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => startGame('hard')}
              className="w-full p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl text-white font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔥</span>
                  <div className="text-left">
                    <div>Hard Mode</div>
                    <div className="text-sm opacity-80">Less time, bonus points!</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(Math.max(1, maxHearts - 1))].map((_, i) => (
                      <Heart key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-yellow-300 text-sm">+50pts</span>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      {/* Game HUD */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-16 left-0 right-0 z-40 bg-white/10 backdrop-blur-xl border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Hearts */}
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-sm">Lives:</span>
              <div className="flex space-x-1">
                {[...Array(maxHearts)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={i < hearts ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: i < hearts ? Infinity : 0, repeatDelay: 2 }}
                  >
                    <Heart 
                      className={`w-6 h-6 ${i < hearts ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-white" />
              <motion.span 
                className={`font-bold text-lg ${timeLeft < 30 ? 'text-red-300' : 'text-white'}`}
                animate={timeLeft < 30 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: timeLeft < 30 ? Infinity : 0 }}
              >
                {formatTime(timeLeft)}
              </motion.span>
            </div>

            {/* Score */}
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <motion.span 
                className="font-bold text-lg text-white"
                key={score}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {score}
              </motion.span>
            </div>

            {/* Difficulty Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              selectedDifficulty === 'hard' 
                ? 'bg-red-500/80 text-white' 
                : 'bg-green-500/80 text-white'
            }`}>
              {selectedDifficulty.toUpperCase()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game Content */}
      <div className="pt-20">
        {React.cloneElement(children, {
          loseHeart,
          addPoints,
          gameComplete: handleGameComplete,
          gameFail: handleGameFail,
          hearts,
          timeLeft,
          score,
          difficulty: selectedDifficulty,
          gameStarted,
          gameEnded
        })}
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                {hearts > 0 ? '🎉' : '😢'}
              </motion.div>
              
              <h3 className="text-2xl font-black text-white mb-4">
                {hearts > 0 ? 'Congratulations!' : 'Game Over!'}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-white">
                  <span>Final Score:</span>
                  <span className="font-bold">{score}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Hearts Left:</span>
                  <span className="font-bold">{hearts}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Time Left:</span>
                  <span className="font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  onClick={() => window.location.reload()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
                <motion.button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Home
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameWrapper;