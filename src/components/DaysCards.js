import React from 'react';
import { motion } from 'framer-motion';
import cardImg from '../Assets/card.png';
import innerImage from '../Assets/week.jpg';
import { Link } from 'react-router-dom';
import arr from '../Assets/arr.png';

const GameCard = ({ route, index, title, description, emoji, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2 }}
    whileHover={{ 
      scale: 1.08, 
      rotate: index % 2 === 0 ? 2 : -2,
      y: -10
    }}
    className="group"
  >
    <Link to={route}>
      <div className={`relative rounded-3xl overflow-hidden h-[400px] w-80 shadow-2xl border-4 border-white ${color} transition-all duration-500`}>
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        
        {/* Floating emoji */}
        <motion.div
          className="absolute top-4 right-4 text-4xl z-30"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.3
          }}
        >
          {emoji}
        </motion.div>

        {/* Level indicator */}
        <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-lg z-30">
          <span className="text-sm font-bold text-gray-700">Level {index + 1}</span>
        </div>

        {/* Inner Image */}
        <div className="relative flex items-center justify-center h-full p-6">
          <motion.img
            src={innerImage}
            alt="Days Game"
            className="w-48 h-64 object-contain z-20 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Game Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-black text-xl text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
              🎮 PLAY NOW
            </span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-purple-500"
            >
              →
            </motion.div>
          </div>
        </div>

        {/* Sparkle effects */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 text-xl pointer-events-none"
            style={{
              left: `${20 + i * 30}%`,
              top: `${15 + i * 25}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.7 + index * 0.2
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </Link>
  </motion.div>
);

const AttentionGames = () => {
  const games = [
    {
      route: "/dayswarmup",
      title: "Day Matcher",
      description: "Match the days with fun activities!",
      emoji: "🌟",
      color: "bg-gradient-to-br from-yellow-300 to-orange-400"
    },
    {
      route: "/days2",
      title: "Week Builder",
      description: "Build the perfect week order!",
      emoji: "🏗️",
      color: "bg-gradient-to-br from-blue-300 to-purple-400"
    },
    {
      route: "/days3",
      title: "Letter Puzzle",
      description: "Solve the day letter mysteries!",
      emoji: "🧩",
      color: "bg-gradient-to-br from-green-300 to-teal-400"
    }
  ];

  return (
    <div id="days-games" className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            📅
          </motion.div>
        ))}
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 mt-8 relative z-10"
      >
        <motion.h2 
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4"
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          📅 DAYS ADVENTURE! 📅
        </motion.h2>
        <motion.p
          className="text-2xl font-bold text-purple-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Learn the days of the week with SUPER FUN games! 🎉
        </motion.p>
      </motion.div>

      {/* Animated Arrow */}
      <motion.div
        className="relative mb-8"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <img
          src={arr}
          alt="Arrow"
          className="w-32 h-32 opacity-80"
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-2xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ⭐
        </motion.div>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mb-14 relative z-10">
        {games.map((game, index) => (
          <GameCard
            key={index}
            route={game.route}
            index={index}
            title={game.title}
            description={game.description}
            emoji={game.emoji}
            color={game.color}
          />
        ))}
      </div>

      {/* Fun Footer Message */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-300 relative overflow-hidden"
      >
        <div className="text-center">
          <motion.div
            className="text-4xl mb-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎯
          </motion.div>
          <h3 className="font-black text-xl text-gray-800 mb-2">
            Ready to become a DAYS MASTER? 🏆
          </h3>
          <p className="text-gray-600">
            Complete all games to unlock special rewards! ✨
          </p>
        </div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50"></div>
      </motion.div>
    </div>
  );
};

export default AttentionGames;