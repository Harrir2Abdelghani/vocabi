import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUserProfile } from './UserProfileContext';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100); 
  }, []);

  return (
    <section className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-6 transition-opacity duration-1000 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      
      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto">
        
        {/* Logo & Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          >
            VOCABI
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl font-bold text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Learn • Play • Grow 🌟
          </motion.p>
        </motion.div>

        {/* User Welcome */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 mb-8 max-w-md mx-auto"
          >
            <div className="flex items-center justify-center space-x-4">
              <motion.div 
                className={`w-16 h-16 ${userProfile.avatar?.color || 'bg-purple-400'} rounded-full flex items-center justify-center shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <span className="text-3xl">{userProfile.avatar?.emoji || '😊'}</span>
              </motion.div>
              <div className="text-left">
                <h3 className="font-black text-2xl text-gray-800">
                  Hi {userProfile.name}! 👋
                </h3>
                <p className="text-lg text-purple-600 font-bold">
                  Ready for fun learning?
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="flex flex-col items-center space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="text-xl md:text-2xl font-semibold text-gray-600 bg-white/80 rounded-full px-6 py-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Choose your adventure below! 🎮
          </motion.p>

          <motion.div
            className="text-4xl"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}
          >
            ⬇️
          </motion.div>
        </motion.div>

        {/* Stats */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center space-x-4 mt-8"
          >
            <div className="bg-yellow-100 rounded-2xl p-4 shadow-lg">
              <div className="text-center">
                <div className="text-3xl mb-1">🏆</div>
                <div className="font-black text-xl text-yellow-700">{userProfile.score || 0}</div>
                <div className="text-sm text-yellow-600 font-bold">Points</div>
              </div>
            </div>
            <div className="bg-blue-100 rounded-2xl p-4 shadow-lg">
              <div className="text-center">
                <div className="text-3xl mb-1">⭐</div>
                <div className="font-black text-xl text-blue-700">Level {userProfile.level || 1}</div>
                <div className="text-sm text-blue-600 font-bold">Hero</div>
              </div>
            </div>
            <div className="bg-green-100 rounded-2xl p-4 shadow-lg">
              <div className="text-center">
                <div className="text-3xl mb-1">🎮</div>
                <div className="font-black text-xl text-green-700">{userProfile.games_completed || userProfile.gamesCompleted || 0}</div>
                <div className="text-sm text-green-600 font-bold">Games</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Hero;