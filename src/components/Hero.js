import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUserProfile } from './UserProfileContext';
import cloud1 from '../Assets/cloud1.png';
import hero from '../Assets/hero.jpg';
import button from '../Assets/button.png';
import arrow from '../Assets/Arrow.png';

const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    animate={{ 
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0]
    }}
    transition={{ 
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  >
    {children}
  </motion.div>
);

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100); 
  }, []);

  return (
    <section className={`min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 via-blue-200 to-yellow-200 flex flex-col md:flex-row relative overflow-hidden transition-opacity duration-1000 ease-in-out ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['⭐', '🌟', '✨', '🎈', '🎨', '🌈', '🦄', '🎪'][i]}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col mt-20 items-center justify-center p-6 space-y-8 w-full md:w-1/2 z-10">
        
        {/* Animated Cloud Logo */}
        <FloatingElement>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative"
          >
            <img
              src={cloud1}
              className="h-20 object-cover rounded-full shadow-2xl border-4 border-white"
              alt="Cloud Logo"
            />
            <motion.div
              className="absolute -top-2 -right-2 text-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </motion.div>
        </FloatingElement>

        {/* User Welcome Card */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-300 relative overflow-hidden"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-50"></div>
            
            <div className="relative flex items-center space-x-4">
              <motion.div 
                className={`w-16 h-16 ${userProfile.avatar.color} rounded-full flex items-center justify-center shadow-lg border-3 border-white`}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <span className="text-3xl">{userProfile.avatar.emoji}</span>
              </motion.div>
              <div>
                <motion.h3 
                  className="font-black text-2xl text-gray-800"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                >
                  Hey {userProfile.name}! 🎉
                </motion.h3>
                <motion.p 
                  className="text-lg text-purple-600 font-bold"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Ready for FUN learning? 🚀
                </motion.p>
              </div>
            </div>
            
            {/* Floating mini stars around the card */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400 text-xl"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              >
                ⭐
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Main Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 font-mono mb-4"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          >
            SUPER VOCAB! 🌟
          </motion.h1>
          <motion.p
            className="text-2xl font-bold text-purple-700"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Where Learning is AWESOME! 🎮
          </motion.p>
        </motion.div>

        {/* Call to Action Button */}
        <motion.div 
          className="flex items-center justify-center space-x-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a href="#days-games">
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glowing effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <span className="text-white text-2xl font-black">
                    🚀 START ADVENTURE!
                  </span>
                </div>
              </div>
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-1 -right-1 text-yellow-300 text-xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
            </motion.div>
          </a>

          <FloatingElement delay={0.5}>
            <motion.img
              src={arrow}
              className="h-16 object-cover"
              alt="Arrow"
              animate={{ 
                x: [0, 15, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </FloatingElement>
        </motion.div>

        {/* Fun Stats */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex space-x-4"
          >
            <div className="bg-yellow-300 rounded-2xl p-3 shadow-lg">
              <div className="text-center">
                <div className="text-2xl">🏆</div>
                <div className="font-bold text-yellow-800">{userProfile.score}</div>
                <div className="text-xs text-yellow-700">Points</div>
              </div>
            </div>
            <div className="bg-blue-300 rounded-2xl p-3 shadow-lg">
              <div className="text-center">
                <div className="text-2xl">⭐</div>
                <div className="font-bold text-blue-800">Level {userProfile.level}</div>
                <div className="text-xs text-blue-700">Hero</div>
              </div>
            </div>
            <div className="bg-green-300 rounded-2xl p-3 shadow-lg">
              <div className="text-center">
                <div className="text-2xl">🎮</div>
                <div className="font-bold text-green-800">{userProfile.gamesCompleted}</div>
                <div className="text-xs text-green-700">Games</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hero Image Section */}
      <motion.div 
        className="flex items-center justify-center md:w-1/2 relative"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <motion.img
            src={hero}
            className="object-cover w-full max-w-[600px] rounded-3xl shadow-2xl border-8 border-white"
            alt="Hero Image"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating elements around hero image */}
          {[
            { emoji: '🎨', top: '10%', left: '10%' },
            { emoji: '📚', top: '20%', right: '10%' },
            { emoji: '🌟', bottom: '20%', left: '15%' },
            { emoji: '🎪', bottom: '10%', right: '15%' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                top: item.top,
                bottom: item.bottom,
                left: item.left,
                right: item.right,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;