import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Settings, User } from 'lucide-react';
import logo from '../Assets/logo.jpg';
import button from '../Assets/button.png';
import { Link } from 'react-router-dom';
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

  return (
    <nav className="bg-gradient-to-r from-teal-100 to-blue-100 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-2 mx-2">
        {/* Logo Section with Animation from Left */}
        <motion.a
          href="/"
          className={`flex items-center -space-x-3 rtl:space-x-reverse transform transition-transform duration-1000 ${
            isVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <img src={logo} className="h-16 w-18 rounded-full shadow-md" alt="Logo" />
          <span className="self-center text-3xl font-mono font-semibold whitespace-nowrap">
            <span className="text-red-400">V</span>
            <span className="text-orange-400">O</span>
            <span className="text-yellow-400">C</span>
            <span className="text-green-400">A</span>
            <span className="text-blue-400">B</span>
            <span className="text-purple-400">I</span>
          </span>
        </motion.a>

        {/* User Profile Section */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4"
          >
            {/* Score Display */}
            <div className="hidden md:flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className={`font-bold ${getScoreColor(userProfile.score)}`}>
                {userProfile.score}
              </span>
              <span className="text-lg">{getScoreIcon(userProfile.score)}</span>
            </div>

            {/* Level Display */}
            <div className="hidden md:flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
              <Star className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-blue-600">Level {userProfile.level}</span>
            </div>

            {/* User Avatar and Name */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className={`w-10 h-10 ${userProfile.avatar.color} rounded-full flex items-center justify-center`}>
                  <span className="text-xl">{userProfile.avatar.emoji}</span>
                </div>
                <span className="font-semibold text-gray-800 hidden sm:block">
                  {userProfile.name}
                </span>
              </motion.button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${userProfile.avatar.color} rounded-full flex items-center justify-center`}>
                        <span className="text-2xl">{userProfile.avatar.emoji}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{userProfile.name}</h3>
                        <p className="text-purple-100 text-sm">Level {userProfile.level} Player</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Score:</span>
                      <span className={`font-bold ${getScoreColor(userProfile.score)}`}>
                        {userProfile.score} {getScoreIcon(userProfile.score)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Games Completed:</span>
                      <span className="font-bold text-green-600">{userProfile.gamesCompleted}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <button
                      onClick={() => {
                        resetProfile();
                        setShowProfileMenu(false);
                      }}
                      className="w-full py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      Reset Profile
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Navbar Links with Animation from Top */}
        <div
          className={`items-center justify-between hidden w-full md:flex md:w-auto md:order-1 transform transition-transform duration-1000 ${
            isVisible ? 'translate-y-0' : '-translate-y-20'
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-bold text-lg font-mono border border-gray-100 rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            {[
              { name: 'Home', href: '/' },
              { name: 'Days', href: '#days-games' },
              { name: 'Numbers', href: '#numbers-games' },
              { name: 'Jobs', href: '#jobs-games' },
              { name: 'Family', href: '#familly-games' },
              { name: 'Daily', href: '#daily-games' }
            ].map((item, index) => (
              <motion.li
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={item.href}
                  className="block py-2 px-3 text-gray-700 rounded hover:bg-white hover:text-blue-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 transition-all duration-200"
                >
                  {item.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Score Display */}
      {userProfile && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className={`font-bold text-sm ${getScoreColor(userProfile.score)}`}>
                {userProfile.score} {getScoreIcon(userProfile.score)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-sm text-blue-600">Level {userProfile.level}</span>
            </div>
            <div className="text-sm text-gray-600">
              Games: {userProfile.gamesCompleted}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;