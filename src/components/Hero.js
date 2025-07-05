import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUserProfile } from './UserProfileContext';
import cloud1 from '../Assets/cloud1.png';
import hero from '../Assets/hero.jpg';
import button from '../Assets/button.png';
import arrow from '../Assets/Arrow.png';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100); 
  }, []);

  return (
    <section className={`bg-gradient-to-br from-teal-100 via-blue-100 to-purple-100 flex flex-col md:flex-row transition-opacity duration-1000 ease-in-out ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="flex flex-col mt-20 items-center justify-center p-6 space-y-6 w-full md:w-1/3">
        <motion.img
          src={cloud1}
          className="h-16 object-cover rounded-lg"
          alt="Cloud Logo"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {userProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${userProfile.avatar.color} rounded-full flex items-center justify-center`}>
                <span className="text-2xl">{userProfile.avatar.emoji}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  Welcome back, {userProfile.name}! 👋
                </h3>
                <p className="text-sm text-gray-600">
                  Ready for more learning adventures?
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.h1 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-mono text-center mt-10 md:text-4xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your Vocabulary Grows Here! 🌱
        </motion.h1>

        <motion.div 
          className="flex items-center justify-center space-x-0"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a href="#days-games">
            <motion.div 
              className="relative w-40 ml-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={button}
                className="h-12 w-full object-cover rounded-lg mt-8 shadow-lg"
                alt="Button Logo"
              />
              <span className="absolute inset-0 flex items-center justify-center mt-0 text-black text-lg font-bold md:mt-0 md:text-xl">
                Explore Now ✨
              </span>
            </motion.div>
          </a>

          <motion.img
            src={arrow}
            className="h-16 object-cover rounded-lg mt-1"
            alt="Arrow Logo"
            animate={{ 
              x: [0, 10, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      <motion.div 
        className="flex items-center justify-center bg-transparent md:w-2/3"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <img
          src={hero}
          className="object-cover w-full max-w-[520px] -mr-40 rounded-3xl shadow-2xl"
          alt="Hero Image"
        />
      </motion.div>
    </section>
  );
};

export default Hero;