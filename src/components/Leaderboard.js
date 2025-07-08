import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Trophy, Star, Medal, Award, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Leaderboard = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  // Auto-refresh leaderboard every 5 seconds when open
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        fetchLeaderboard();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Fetch all users ordered by score
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('score', { ascending: false })
        .limit(50); // Top 50 users

      if (data && !error) {
        // Add rank to each user
        const rankedUsers = data.map((user, index) => ({
          ...user,
          rank: index + 1
        }));
        
        setUsers(rankedUsers);
        
        // Find current user's rank
        const currentDeviceId = localStorage.getItem('vocabiDeviceId');
        const currentUser = rankedUsers.find(user => user.device_id === currentDeviceId);
        if (currentUser) {
          setCurrentUserRank(currentUser.rank);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-orange-500" />;
      default: return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-orange-500';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-red-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 1000) return 'text-purple-600';
    if (score >= 500) return 'text-blue-600';
    if (score >= 200) return 'text-green-600';
    return 'text-orange-600';
  };

  const calculateLevel = (gamesCompleted) => {
    return Math.floor(gamesCompleted / 3) + 1;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 text-white overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Crown className="w-8 h-8 text-yellow-400" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black">Global Leaderboard</h2>
                  <p className="text-white/80 text-sm">Top players worldwide</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Current User Rank */}
          {currentUserRank && (
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 border-b border-white/10">
              <div className="flex items-center justify-center space-x-3">
                <Award className="w-5 h-5 text-green-400" />
                <span className="text-white font-bold">
                  Your Rank: #{currentUserRank}
                </span>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          )}

          {/* Leaderboard Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
                />
                <span className="ml-3 text-white">Loading rankings...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-white/60">No players yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                      user.device_id === localStorage.getItem('vocabiDeviceId')
                        ? 'bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-400/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12">
                      {user.rank <= 3 ? (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {getRankIcon(user.rank)}
                        </motion.div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">#{user.rank}</span>
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className={`w-12 h-12 ${user.avatar?.color || 'bg-blue-500'} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-xl">{user.avatar?.emoji || '😊'}</span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white">{user.name}</h3>
                        {user.device_id === localStorage.getItem('vocabiDeviceId') && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">YOU</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <span>Level {calculateLevel(user.games_completed)}</span>
                        <span>•</span>
                        <span>{user.games_completed} games</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className={`font-black text-lg ${getScoreColor(user.score)}`}>
                        {user.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/60">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 border-t border-white/10">
            <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
              <Trophy className="w-4 h-4" />
              <span>Keep playing to climb the ranks!</span>
              <Star className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Leaderboard;