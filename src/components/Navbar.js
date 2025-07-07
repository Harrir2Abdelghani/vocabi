import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Home, Calendar, Hash, Briefcase, Users, Sun, Menu, X } from 'lucide-react';

import logo from '../Assets/logo.jpg';
import { useUserProfile } from './UserProfileContext';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userProfile, resetProfile } = useUserProfile();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home, emoji: '🏠', color: 'from-blue-500 to-purple-500' },
    { name: 'Days', href: '#days-games', icon: Calendar, emoji: '📅', color: 'from-green-500 to-teal-500' },
    { name: 'Numbers', href: '#numbers-games', icon: Hash, emoji: '🔢', color: 'from-orange-500 to-red-500' },
    { name: 'Jobs', href: '#jobs-games', icon: Briefcase, emoji: '👷‍♂️', color: 'from-yellow-500 to-orange-500' },
    { name: 'Family', href: '#familly-games', icon: Users, emoji: '👨‍👩‍👧‍👦', color: 'from-pink-500 to-purple-500' },
    { name: 'Daily', href: '#daily-games', icon: Sun, emoji: '🌅', color: 'from-indigo-500 to-blue-500' }
  ];

  return (
    <>
      {/* Glassmorphism Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        className={`fixed w-full z-50 top-0 transition-all duration-700 ${
          scrolled 
            ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl' 
            : 'bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-blue-600/80 backdrop-blur-lg'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
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
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <span className="text-2xl font-bold text-white">V</span>
                </motion.div>
                
                {/* Floating sparkles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-300 text-lg"
                    style={{
                      left: `${-10 + i * 30}%`,
                      top: `${-20 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                className="hidden sm:block"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity
                }}
              >
                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                  VOCABI
                </h1>
                <motion.div
                  className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
                  animate={{
                    scaleX: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="relative group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white/90 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
                    <motion.div
                      className="text-xl"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      {item.emoji}
                    </motion.div>
                    <span className="font-bold text-sm">{item.name}</span>
                  </div>
                  
                  {/* Hover effect */}
                  <motion.div
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color} rounded-full`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* User Profile & Mobile Menu */}
            <div className="flex items-center space-x-4">
              
              {/* User Profile */}
              {userProfile && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="hidden md:flex items-center space-x-3"
                >
                  {/* Score Display */}
                  <motion.div
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Trophy className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                    <span className="font-black text-white text-sm">
                      {userProfile.score}
                    </span>
                    <motion.span
                      className="text-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {getScoreIcon(userProfile.score)}
                    </motion.span>
                  </motion.div>

                  {/* Level Display */}
                  <motion.div
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <span className="font-black text-white text-sm">
                      Lv.{userProfile.level}
                    </span>
                  </motion.div>
                </motion.div>
              )}

              {/* Profile Avatar */}
              {userProfile && (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className={`w-12 h-12 ${userProfile.avatar?.color} rounded-full flex items-center justify-center border-2 border-white/50 shadow-xl`}
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity
                      }}
                    >
                      <span className="text-xl">{userProfile.avatar?.emoji}</span>
                    </motion.div>
                    
                    {/* Status indicator */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                      >
                        {/* Profile Header */}
                        <div className="relative p-6 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white overflow-hidden">
                          {/* Animated background */}
                          <div className="absolute inset-0">
                            {[...Array(15)].map((_, i) => (
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
                          
                          <div className="relative flex items-center space-x-4">
                            <motion.div
                              className={`w-16 h-16 ${userProfile.avatar?.color} rounded-full flex items-center justify-center border-3 border-white/50 shadow-xl`}
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 10, repeat: Infinity }}
                            >
                              <span className="text-2xl">{userProfile.avatar?.emoji}</span>
                            </motion.div>
                            <div>
                              <h3 className="font-black text-xl">{userProfile.name}</h3>
                              <motion.p
                                className="text-white/90 font-bold"
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                {getLevelTitle(userProfile.level)}
                              </motion.p>
                            </div>
                          </div>
                        </div>

                        {/* Stats Section */}
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <motion.div
                              className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4 text-center"
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="text-2xl mb-2">🏆</div>
                              <div className={`font-black text-lg ${getScoreColor(userProfile.score)}`}>
                                {userProfile.score}
                              </div>
                              <div className="text-xs text-gray-600 font-bold">POINTS</div>
                            </motion.div>
                            
                            <motion.div
                              className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4 text-center"
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="text-2xl mb-2">⭐</div>
                              <div className="font-black text-lg text-blue-600">
                                {userProfile.level}
                              </div>
                              <div className="text-xs text-gray-600 font-bold">LEVEL</div>
                            </motion.div>
                          </div>
                          
                          <motion.div
                            className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-4 text-center"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="text-2xl mb-2">🎮</div>
                            <div className="font-black text-lg text-green-600">
                              {userProfile.gamesCompleted}
                            </div>
                            <div className="text-xs text-gray-600 font-bold">GAMES COMPLETED</div>
                          </motion.div>
                          
                          <motion.button
                            onClick={() => {
                              resetProfile();
                              setShowProfileMenu(false);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-black hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            🔄 NEW ADVENTURE
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-white/20"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-purple-100 transition-all group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-bold text-gray-800 group-hover:text-purple-600">
                      {item.name}
                    </span>
                  </motion.a>
                ))}
                
                {/* Mobile Stats */}
                {userProfile && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-sm text-gray-700">
                          {userProfile.score} {getScoreIcon(userProfile.score)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-sm text-gray-700">
                          Level {userProfile.level}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 font-bold">
                        🎮 {userProfile.gamesCompleted}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;