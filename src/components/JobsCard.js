import React from 'react';
import { motion } from 'framer-motion';
import cardImg from '../Assets/card.png';
import innerImage from '../Assets/jobs.jpg';
import { Link } from 'react-router-dom';
import arr from '../Assets/arr.png';

const GameCard = ({ route, index, title, description, emoji, color }) => (
  <motion.div
    initial={{ opacity: 0, rotate: index % 2 === 0 ? -45 : 45 }}
    animate={{ opacity: 1, rotate: 0 }}
    transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
    whileHover={{ 
      scale: 1.1, 
      rotate: index % 2 === 0 ? 3 : -3,
      y: -15
    }}
    className="group"
  >
    <Link to={route}>
      <div className={`relative rounded-3xl overflow-hidden h-[420px] w-80 shadow-2xl border-4 border-white ${color} transition-all duration-500`}>
        
        {/* Work tools floating */}
        {['🔧', '📚', '🩺', '🍳', '🚒'].map((tool, i) => (
          <motion.div
            key={i}
            className="absolute text-white/40 text-2xl pointer-events-none"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + (i % 2) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5 + index * 0.2
            }}
          >
            {tool}
          </motion.div>
        ))}

        {/* Level badge */}
        <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-lg z-30">
          <span className="text-sm font-bold text-gray-700">Level {index + 1}</span>
        </div>

        {/* Main emoji */}
        <motion.div
          className="absolute top-4 right-4 text-4xl z-30"
          animate={{
            rotate: [0, 25, -25, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: index * 0.3
          }}
        >
          {emoji}
        </motion.div>

        {/* Inner Image */}
        <div className="relative flex items-center justify-center h-full p-6">
          <motion.img
            src={innerImage}
            alt="Jobs Game"
            className="w-52 h-72 object-contain z-20 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Game Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-black text-xl text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
              👷‍♂️ CAREER FUN
            </span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-green-500"
            >
              →
            </motion.div>
          </div>
        </div>

        {/* Professional badges floating */}
        {['⭐', '🏆', '💼', '🎯', '🚀'].map((badge, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 text-xl pointer-events-none"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i * 15}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.7 + index * 0.3
            }}
          >
            {badge}
          </motion.div>
        ))}
      </div>
    </Link>
  </motion.div>
);

const JobsGames = () => {
  const games = [
    {
      route: "/jobswarmup",
      title: "Job Match",
      description: "Match workers with their tools!",
      emoji: "🔨",
      color: "bg-gradient-to-br from-green-300 to-teal-400"
    },
    {
      route: "/jobs2",
      title: "Career Quiz",
      description: "Guess what job people do!",
      emoji: "🎯",
      color: "bg-gradient-to-br from-orange-300 to-amber-400"
    },
    {
      route: "/jobs3",
      title: "Word Search",
      description: "Find job names in the puzzle!",
      emoji: "🔍",
      color: "bg-gradient-to-br from-red-300 to-pink-400"
    }
  ];

  return (
    <div id="jobs-games" className="min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* Background job emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.4, 1]
            }}
            transition={{
              duration: 7 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['👨‍⚕️', '👩‍🏫', '👨‍🍳', '👩‍🚒', '👨‍✈️', '👩‍💼', '👨‍🔧', '👩‍🎨'][i]}
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
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4"
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          👷‍♂️ JOBS ADVENTURE! 👷‍♀️
        </motion.h2>
        <motion.p
          className="text-2xl font-bold text-green-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Discover AMAZING careers and dream big! 🌟
        </motion.p>
      </motion.div>

      {/* Animated Arrow with Work Tools */}
      <motion.div
        className="relative mb-8"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, -10, 0]
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
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 360] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          💼
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
        className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-green-300 relative overflow-hidden"
      >
        <div className="text-center">
          <motion.div
            className="text-4xl mb-2"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎯
          </motion.div>
          <h3 className="font-black text-xl text-gray-800 mb-2">
            What do you want to BE? 🚀
          </h3>
          <p className="text-gray-600">
            Explore cool jobs and find your dream career! ✨
          </p>
        </div>
        
        {/* Floating career symbols */}
        {['👨‍⚕️', '👩‍🏫', '👨‍🍳', '👩‍🚒', '👨‍✈️'].map((job, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + (i % 2) * 50}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.5, 1, 0.5],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4
            }}
          >
            {job}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default JobsGames;