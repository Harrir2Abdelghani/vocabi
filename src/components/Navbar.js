import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Home, Calendar, Hash, Briefcase, Users, Sun, Menu, X, ChevronDown, Gamepad2, Award, Clock, Heart, Crown } from 'lucide-react';

import logo from '../Assets/logo.jpg';
import { useUserProfile } from './UserProfileContext';
import Leaderboard from './Leaderboard';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showGamesMenu, setShowGamesMenu] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
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

  // Calculate level based on games completed (auto-level progression)
  const calculateLevel = (gamesCompleted) => {
    return Math.floor(gamesCompleted / 3) + 1; // Level up every 3 games
  };

  // Update level automatically based on games completed
  useEffect(() => {
    if (userProfile) {
      const expectedLevel = calculateLevel(userProfile.gamesCompleted);
      if (expectedLevel > userProfile.level) {
        // Auto level up!
        userProfile.level = expectedLevel;
      }
    }
  }, [userProfile?.gamesCompleted]);

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

  const gameCategories = [
    {
      name: 'Days of Week',
      href: '#days-games',
      icon: Calendar,
      emoji: '📅',
      color: 'from-blue-500 to-cyan-500',
      description: 'Learn weekdays with fun activities'
    },
    {
      name: 'Numbers',
      href: '#numbers-games',
      icon: Hash,
      emoji: '🔢',
      color: 'from-purple-500 to-pink-500',
      description: 'Count and solve number puzzles'
    },
    {
      name: 'Jobs & Careers',
      href: '#jobs-games',
      icon: Briefcase,
      emoji: '👷‍♂️',
      color: 'from-green-500 to-emerald-500',
      description: 'Discover different professions'
    },
    {
      name: 'Family',
      href: '#familly-games',
      icon: Users,
      emoji: '👨‍👩‍👧‍👦',
      color: 'from-orange-500 to-red-500',
      description: 'Learn about family members'
    },
    {
      name: 'Daily Activities',
      href: '#daily-games',
      icon: Sun,
      emoji: '🌅',
      color: 'from-yellow-500 to-orange-500',
      description: 'Practice daily routine words'
    }
  ];

  return (
    <>
      {/* Ultra Modern Glassmorphism Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        className={`fixed w-full z-50 top-0 transition-all duration-700 ${
          scrolled 
            ? 'bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
            : 'bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl'
        }`}
      >
        {/* Animated Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
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
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section - Enhanced */}
            <motion.div
              className="flex items-center space-x-3"
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
                  className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <span className="text-lg font-bold text-white">V</span>
                </motion.div>
                
                {/* Floating sparkles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-300 text-sm"
                    style={{
                      left: `${-10 + i * 25}%`,
                      top: `${-15 + (i % 2) * 30}%`,
                    }}
                    animate={{
                      y: [0, -15, 0],
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
                <h1 className="text-2xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                  VOCABI
                </h1>
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
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

            {/* Desktop Navigation - Modern Dropdown */}
            <div className="hidden lg:flex items-center space-x-2">
              
              {/* Home Button */}
              <motion.a
                href="/"
                className="relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white/90 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
                  <Home className="w-4 h-4" />
                  <span className="font-bold text-sm">Home</span>
                </div>
              </motion.a>

              {/* Games Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowGamesMenu(!showGamesMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white/90 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span className="font-bold text-sm">Games</span>
                  <motion.div
                    animate={{ rotate: showGamesMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                {/* Games Dropdown Menu - Enhanced Background */}
                <AnimatePresence>
                  {showGamesMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute top-full mt-2 left-0 w-80 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                      onMouseLeave={() => setShowGamesMenu(false)}
                    >
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 0.8, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="relative p-4">
                        <div className="text-white/90 text-xs font-bold uppercase tracking-wider mb-3 flex items-center">
                          <Sparkles className="w-3 h-3 mr-2" />
                          Choose Your Adventure
                        </div>
                        <div className="space-y-2">
                          {gameCategories.map((game, index) => (
                            <motion.a
                              key={game.name}
                              href={game.href}
                              className="group block"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setShowGamesMenu(false)}
                            >
                              <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20">
                                <div className={`w-10 h-10 bg-gradient-to-br ${game.color} rounded-lg flex items-center justify-center shadow-lg`}>
                                  <span className="text-lg">{game.emoji}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="text-white font-bold text-sm">{game.name}</div>
                                  <div className="text-white/60 text-xs">{game.description}</div>
                                </div>
                                <motion.div
                                  className="text-white/40 group-hover:text-white/80 transition-colors"
                                  whileHover={{ x: 5 }}
                                >
                                  →
                                </motion.div>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Leaderboard Button */}
              <motion.button
                onClick={() => setShowLeaderboard(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white/90 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Crown className="w-4 h-4" />
                <span className="font-bold text-sm">Leaderboard</span>
              </motion.button>
            </div>

            {/* User Profile & Stats - Real-time Updates */}
            <div className="flex items-center space-x-3">
              
              {/* Stats Display - Enhanced with Real-time Updates */}
              {userProfile && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="hidden md:flex items-center space-x-2"
                >
                  {/* Score */}
                  <motion.div
                    className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20"
                    whileHover={{ scale: 1.05, y: -2 }}
                    key={`score-${userProfile.score}`}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ['rgba(255,255,255,0.1)', 'rgba(34,197,94,0.3)', 'rgba(255,255,255,0.1)']
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Trophy className="w-3 h-3 text-yellow-400" />
                    </motion.div>
                    <motion.span 
                      className="font-black text-white text-xs"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        color: ['#ffffff', '#22c55e', '#ffffff']
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {userProfile.score.toLocaleString()}
                    </motion.span>
                  </motion.div>

                  {/* Level - Auto-calculated */}
                  <motion.div
                    className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20"
                    whileHover={{ scale: 1.05, y: -2 }}
                    key={`level-${calculateLevel(userProfile.gamesCompleted)}`}
                    animate={{ 
                      scale: [1, 1.15, 1],
                      backgroundColor: ['rgba(255,255,255,0.1)', 'rgba(59,130,246,0.3)', 'rgba(255,255,255,0.1)']
                    }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Star className="w-3 h-3 text-blue-400" />
                    <motion.span 
                      className="font-black text-white text-xs"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        color: ['#ffffff', '#3b82f6', '#ffffff']
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {calculateLevel(userProfile.gamesCompleted)}
                    </motion.span>
                  </motion.div>

                  {/* Games Completed */}
                  <motion.div
                    className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20"
                    whileHover={{ scale: 1.05, y: -2 }}
                    key={`games-${userProfile.gamesCompleted}`}
                    animate={{ 
                      scale: [1, 1.15, 1],
                      backgroundColor: ['rgba(255,255,255,0.1)', 'rgba(16,185,129,0.3)', 'rgba(255,255,255,0.1)']
                    }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Award className="w-3 h-3 text-green-400" />
                    <motion.span 
                      className="font-black text-white text-xs"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        color: ['#ffffff', '#10b981', '#ffffff']
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {userProfile.gamesCompleted}
                    </motion.span>
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
                      className={`w-10 h-10 ${userProfile.avatar?.color} rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg`}
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity
                      }}
                    >
                      <span className="text-lg">{userProfile.avatar?.emoji}</span>
                    </motion.div>
                    
                    {/* Status indicator */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  </motion.button>

                  {/* Profile Dropdown - Enhanced Background */}
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-4 w-72 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                      >
                        {/* Profile Header */}
                        <div className="relative p-4 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-blue-600/30 text-white overflow-hidden">
                          <div className="relative flex items-center space-x-3">
                            <motion.div
                              className={`w-12 h-12 ${userProfile.avatar?.color} rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg`}
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 10, repeat: Infinity }}
                            >
                              <span className="text-xl">{userProfile.avatar?.emoji}</span>
                            </motion.div>
                            <div>
                              <h3 className="font-black text-lg">{userProfile.name}</h3>
                              <motion.p
                                className="text-white/80 font-bold text-sm"
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                {getLevelTitle(calculateLevel(userProfile.gamesCompleted))}
                              </motion.p>
                            </div>
                          </div>
                        </div>

                        {/* Stats Section - Real-time Updates */}
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            <motion.div
                              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-3 text-center border border-white/10"
                              whileHover={{ scale: 1.05 }}
                              key={`profile-score-${userProfile.score}`}
                              animate={{ 
                                scale: [1, 1.1, 1],
                                backgroundColor: ['rgba(234,179,8,0.2)', 'rgba(234,179,8,0.4)', 'rgba(234,179,8,0.2)']
                              }}
                              transition={{ duration: 0.8 }}
                            >
                              <div className="text-lg mb-1">🏆</div>
                              <div className={`font-black text-sm ${getScoreColor(userProfile.score)}`}>
                                {userProfile.score.toLocaleString()}
                              </div>
                              <div className="text-xs text-white/60 font-bold">POINTS</div>
                            </motion.div>
                            
                            <motion.div
                              className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-3 text-center border border-white/10"
                              whileHover={{ scale: 1.05 }}
                              key={`profile-level-${calculateLevel(userProfile.gamesCompleted)}`}
                              animate={{ 
                                scale: [1, 1.1, 1],
                                backgroundColor: ['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.4)', 'rgba(59,130,246,0.2)']
                              }}
                              transition={{ duration: 0.8, delay: 0.1 }}
                            >
                              <div className="text-lg mb-1">⭐</div>
                              <div className="font-black text-sm text-blue-400">
                                {calculateLevel(userProfile.gamesCompleted)}
                              </div>
                              <div className="text-xs text-white/60 font-bold">LEVEL</div>
                            </motion.div>

                            <motion.div
                              className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-3 text-center border border-white/10"
                              whileHover={{ scale: 1.05 }}
                              key={`profile-games-${userProfile.gamesCompleted}`}
                              animate={{ 
                                scale: [1, 1.1, 1],
                                backgroundColor: ['rgba(16,185,129,0.2)', 'rgba(16,185,129,0.4)', 'rgba(16,185,129,0.2)']
                              }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            >
                              <div className="text-lg mb-1">🎮</div>
                              <div className="font-black text-sm text-green-400">
                                {userProfile.gamesCompleted}
                              </div>
                              <div className="text-xs text-white/60 font-bold">GAMES</div>
                            </motion.div>
                          </div>
                          
                          <motion.button
                            onClick={() => {
                              resetProfile();
                              setShowProfileMenu(false);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white rounded-xl font-black hover:from-red-600/80 hover:to-pink-600/80 transition-all shadow-lg text-sm"
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
                className="lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
              className="lg:hidden bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-2xl border-t border-white/20"
            >
              <div className="px-4 py-4 space-y-2">
                <motion.a
                  href="/"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5 text-white/80" />
                  <span className="font-bold text-white group-hover:text-white">Home</span>
                </motion.a>
                
                {gameCategories.map((game, index) => (
                  <motion.a
                    key={game.name}
                    href={game.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{game.emoji}</span>
                    <span className="font-bold text-white group-hover:text-white">
                      {game.name}
                    </span>
                  </motion.a>
                ))}

                {/* Mobile Leaderboard */}
                <motion.button
                  onClick={() => {
                    setShowLeaderboard(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all group w-full text-left"
                >
                  <Crown className="w-5 h-5 text-white/80" />
                  <span className="font-bold text-white group-hover:text-white">Leaderboard</span>
                </motion.button>
                
                {/* Mobile Stats */}
                {userProfile && (
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex justify-between items-center px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-sm text-white">
                          {userProfile.score}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-sm text-white">
                          Level {calculateLevel(userProfile.gamesCompleted)}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 font-bold">
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

      {/* Leaderboard Modal */}
      <Leaderboard 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
        key={userProfile?.score} // Force refresh when score changes
      />

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;