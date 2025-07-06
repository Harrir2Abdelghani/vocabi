import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import logo from '../Assets/logo.jpg';
import { useUserProfile } from './UserProfileContext';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { userProfile, resetProfile } = useUserProfile();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); 
  }, []);

  const getScoreColor = (score) => {
    if (score >= 1000) return 'text-purple-600';
    if (score >= 500) return 'text-blue-600';
    if (score >= 200) return 'text-green-600';
    return 'text-orange-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 1000) return '👑';
    if (score >= 500) return '🏆';
    if (score >= 200) return '🌟';
    return '⭐';
  };

  const getLevelTitle = (level) => {
    if (level >= 10) return 'SUPER GENIUS! 🧠';
    if (level >= 7) return 'WORD WIZARD! 🧙‍♂️';
    if (level >= 5) return 'VOCAB HERO! 🦸‍♂️';
    if (level >= 3) return 'LEARNING STAR! ⭐';
    return 'BEGINNER! 🌱';
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 fixed w-full z-20 top-0 shadow-2xl border-b-4 border-white">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-3 mx-2">
        
        {/* Logo Section with Animation */}
        <motion.a
          href="/"
          className={`flex items-center space-x-3 transform transition-transform duration-1000 ${
            isVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <img src={logo} className="h-16 w-16 rounded-full shadow-lg border-4 border-white" alt="Logo" />
            <motion.div
              className="absolute -top-1 -right-1 text-yellow-300"
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              ✨
            </motion.div>
          </motion.div>
          
          <motion.span 
            className="self-center text-3xl font-black whitespace-nowrap"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          >
            <span className="text-red-300 drop-shadow-lg">V</span>
            <span className="text-orange-300 drop-shadow-lg">O</span>
            <span className="text-yellow-300 drop-shadow-lg">C</span>
            <span className="text-green-300 drop-shadow-lg">A</span>
            <span className="text-blue-300 drop-shadow-lg">B</span>
            <span className="text-purple-300 drop-shadow-lg">I</span>
          </motion.span>
        </motion.a>

        {/* User Profile Section */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            {/* Score Display */}
            <motion.div 
              className="hidden md:flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-yellow-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Trophy className="w-5 h-5 text-yellow-500" />
              </motion.div>
              <span className={`font-black text-lg ${getScoreColor(userProfile.score)}`}>
                {userProfile.score}
              </span>
              <motion.span 
                className="text-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {getScoreIcon(userProfile.score)}
              </motion.span>
            </motion.div>

            {/* Level Display */}
            <motion.div 
              className="hidden md:flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-blue-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-5 h-5 text-blue-500" />
              </motion.div>
              <span className="font-black text-lg text-blue-600">Level {userProfile.level}</span>
            </motion.div>

            {/* Games Completed Badge */}
            <motion.div 
              className="hidden lg:flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-green-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="text-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🎮
              </motion.span>
              <span className="font-black text-lg text-green-600">{userProfile.gamesCompleted}</span>
            </motion.div>

            {/* User Avatar */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all border-4 border-purple-300"
              >
                <motion.div 
                  className={`w-12 h-12 ${userProfile.avatar?.color || 'bg-purple-400'} rounded-full flex items-center justify-center border-2 border-white shadow-lg`}
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  <span className="text-2xl">{userProfile.avatar?.emoji || '😊'}</span>
                </motion.div>
                <span className="font-black text-gray-800 hidden sm:block text-lg">
                  {userProfile.name}
                </span>
                <motion.div
                  animate={{ rotate: showProfileMenu ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </motion.div>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border-4 border-purple-300 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white relative overflow-hidden">
                      {/* Floating stars */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-yellow-300 text-lg"
                          style={{
                            left: `${10 + i * 20}%`,
                            top: `${20 + (i % 2) * 40}%`,
                          }}
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0.5, 1, 0.5],
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                        >
                          ⭐
                        </motion.div>
                      ))}
                      
                      <div className="flex items-center space-x-4 relative z-10">
                        <motion.div 
                          className={`w-16 h-16 ${userProfile.avatar?.color || 'bg-purple-400'} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <span className="text-3xl">{userProfile.avatar?.emoji || '😊'}</span>
                        </motion.div>
                        <div>
                          <h3 className="font-black text-2xl">{userProfile.name}</h3>
                          <motion.p 
                            className="text-purple-100 text-lg font-bold"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {getLevelTitle(userProfile.level)}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 text-center">
                          <div className="text-3xl mb-1">🏆</div>
                          <div className={`font-black text-xl ${getScoreColor(userProfile.score)}`}>
                            {userProfile.score}
                          </div>
                          <div className="text-sm text-gray-600 font-bold">POINTS</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 text-center">
                          <div className="text-3xl mb-1">⭐</div>
                          <div className="font-black text-xl text-blue-600">
                            Level {userProfile.level}
                          </div>
                          <div className="text-sm text-gray-600 font-bold">HERO</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-4 text-center">
                        <div className="text-3xl mb-1">🎮</div>
                        <div className="font-black text-xl text-green-600">
                          {userProfile.gamesCompleted}
                        </div>
                        <div className="text-sm text-gray-600 font-bold">GAMES COMPLETED</div>
                      </div>
                      
                      <hr className="border-gray-200" />
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          resetProfile();
                          setShowProfileMenu(false);
                        }}
                        className="w-full py-3 px-6 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-2xl hover:from-red-500 hover:to-pink-500 transition-all font-black text-lg shadow-lg"
                      >
                        🔄 NEW ADVENTURE
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Navigation Links */}
        <div
          className={`items-center justify-between hidden lg:flex md:w-auto md:order-1 transform transition-transform duration-1000 ${
            isVisible ? 'translate-y-0' : '-translate-y-20'
          }`}
        >
          <ul className="flex space-x-6">
            {[
              { name: 'Home', href: '/', emoji: '🏠' },
              { name: 'Days', href: '#days-games', emoji: '📅' },
              { name: 'Numbers', href: '#numbers-games', emoji: '🔢' },
              { name: 'Jobs', href: '#jobs-games', emoji: '👷‍♂️' },
              { name: 'Family', href: '#familly-games', emoji: '👨‍👩‍👧‍👦' },
              { name: 'Daily', href: '#daily-games', emoji: '🌅' }
            ].map((item, index) => (
              <motion.li
                key={item.name}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={item.href}
                  className="flex flex-col items-center py-2 px-3 text-white rounded-2xl hover:bg-white/20 transition-all duration-200 font-black"
                >
                  <span className="text-2xl mb-1">{item.emoji}</span>
                  <span className="text-sm">{item.name}</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Score Display */}
      {userProfile && (
        <motion.div 
          className="lg:hidden bg-white/90 backdrop-blur-sm border-t-2 border-purple-300 px-4 py-3"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className={`font-black text-sm ${getScoreColor(userProfile.score)}`}>
                {userProfile.score} {getScoreIcon(userProfile.score)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-blue-500" />
              <span className="font-black text-sm text-blue-600">Level {userProfile.level}</span>
            </div>
            <div className="text-sm text-gray-600 font-bold">
              🎮 {userProfile.gamesCompleted}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;