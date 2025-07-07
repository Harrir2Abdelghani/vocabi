import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUserProfile } from './UserProfileContext';
import cloud1 from '../Assets/cloud1.png';
import hero from '../Assets/hero.jpg';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100); 
  }, []);

  return (
    <section className={`min-h-screen -mt-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden transition-opacity duration-1000 ease-in-out ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <img
                src={cloud1}
                className="h-16 w-16 object-cover rounded-2xl shadow-lg"
                alt="Super Vocab"
              />
            </motion.div>

            {/* User Welcome (if logged in) */}
            {userProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-md border border-gray-100"
              >
                <div className={`w-8 h-8 ${userProfile.avatar?.color || 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                  <span className="text-sm">{userProfile.avatar?.emoji || '😊'}</span>
                </div>
                <span className="text-gray-700 font-medium">Welcome back, {userProfile.name}!</span>
              </motion.div>
            )}

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master vocabulary 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {" "}effortlessly
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Learn new words through engaging activities and track your progress with our intelligent learning system.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a href="#days-games">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  Start Learning
                </motion.button>
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-400 transition-colors duration-200"
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>

          {/* Hero Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 max-w-lg"
          >
            <div className="relative">
              <img
                src={hero}
                className="w-full h-auto rounded-3xl shadow-2xl"
                alt="Learning Experience"
              />
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;