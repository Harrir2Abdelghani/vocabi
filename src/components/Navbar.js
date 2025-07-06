import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Settings, User, Sparkles } from 'lucide-react';
import logo from '../Assets/logo.jpg';
import { Link } from 'react-router-dom';
import { useUserProfile } from './UserProfileContext';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { userProfile, resetProfile } = useUserProfile();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); 
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-20 top-0 shadow-lg border-b border-purple-200">
      <div className="max-w-screen-xl flex items-center justify-between p-4 mx-auto">
        
        {/* Logo Section */}
        <motion.a
          href="/"
          className={`flex items-center space-x-3 transform transition-transform duration-1000 ${
            isVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <img src={logo} className="h-12 w-12 rounded-full shadow-lg" alt="Logo" />
          <span className="text-2xl font-black text-purple-600">VOCABI</span>
        </motion.a>

        {/* User Profile Section */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4"
          >
            {/* Score Display */}
            <div className="hidden md:flex items-center space-x-2 bg-yellow-100 rounded-full px-4 py-2 shadow-md">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-yellow-700">{userProfile.score || 0}</span>
            </div>

            {/* Level Display */}
            <div className="hidden md:flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 shadow-md">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-700">Level {userProfile.level || 1}</span>
            </div>

            {/* User Avatar */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-purple-100 rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all"
              >
                <div className={`w-8 h-8 ${userProfile.avatar?.color || 'bg-purple-400'} rounded-full flex items-center justify-center`}>
                  <span className="text-lg">{userProfile.avatar?.emoji || '😊'}</span>
                </div>
                <span className="font-bold text-purple-700 hidden sm:block">
                  {userProfile.name}
                </span>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${userProfile.avatar?.color || 'bg-purple-400'} rounded-full flex items-center justify-center border-2 border-white`}>
                          <span className="text-2xl">{userProfile.avatar?.emoji || '😊'}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{userProfile.name}</h3>
                          <p className="text-purple-100 text-sm">Learning Hero!</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-yellow-50 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">🏆</div>
                          <div className="font-bold text-yellow-700">{userProfile.score || 0}</div>
                          <div className="text-xs text-yellow-600">Points</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">⭐</div>
                          <div className="font-bold text-blue-700">Level {userProfile.level || 1}</div>
                          <div className="text-xs text-blue-600">Hero</div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="text-2xl mb-1">🎮</div>
                        <div className="font-bold text-green-700">{userProfile.games_completed || userProfile.gamesCompleted || 0}</div>
                        <div className="text-xs text-green-600">Games Completed</div>
                      </div>
                      
                      <button
                        onClick={() => {
                          resetProfile();
                          setShowProfileMenu(false);
                        }}
                        className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-bold text-sm"
                      >
                        🔄 New Adventure
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;