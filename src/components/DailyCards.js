import React from 'react';
import { motion } from 'framer-motion';
import cardImg from '../Assets/card.png';
import innerImage from '../Assets/daily.jpg';
import { Link } from 'react-router-dom';
import arr from '../Assets/arr.png';

const GameCard = ({ route, index, title, description, emoji, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2, type: "spring", stiffness: 80 }}
    whileHover={{ 
      scale: 1.1, 
      rotate: index % 2 === 0 ? 4 : -4,
      y: -20
    }}
    className="group"
  >
    <Link to={route}>
      <div className={`relative rounded-3xl overflow-hidden h-[420px] w-80 shadow-2xl border-4 border-white ${color} transition-all duration-500`}>
        
        {/* Daily activity icons floating */}
        {['🌅', '🍽️', '🚿', '📚', '😴'].map((activity, i) => (
          <motion.div
            key={i}
            className="absolute text-white/40 text-2xl pointer-events-none"
            style={{
              left: `${12 + i * 20}%`,
              top: `${15 + (i % 2) * 30}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 360],
              scale: [0.8, 1.3, 0.8]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.6 + index * 0.2
            }}
          >
            {activity}
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
            rotate: [0, 20, -20, 0],
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
            alt="Daily Activities Game"
            className="w-52 h-72 object-contain z-20 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Game Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-black text-xl text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">
              🌅 DAILY FUN
            </span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-orange-500"
            >
              →
            </motion.div>
          </div>
        </div>

        {/* Time-based icons floating */}
        {['⏰', '🌞', '🌙', '⭐', '🌈'].map((time, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 text-xl pointer-events-none"
            style={{
              left: `${25 + i * 15}%`,
              top: `${25 + i * 20}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 180]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: i * 0.8 + index * 0.3
            }}
          >
            {time}
          </motion.div>
        ))}
      </div>
    </Link>
  </motion.div>
);

const DailyActivitiesGames = () => {
  const games = [
    {
      route: "/dailywarmup",
      title: "Daily Routine",
      description: "Learn your daily activities order!",
      emoji: "🌅",
      color: "bg-gradient-to-br from-orange-300 to-yellow-400"
    },
    {
      route: "/daily2",
      title: "Listen & Choose",
      description: "Listen and pick the right activity!",
      emoji: "👂",
      color: "bg-gradient-to-br from-pink-300 to-purple-400"
    },
    {
      route: "/daily3",
      title: "Spell Daily",
      description: "Spell daily activity words!",
      emoji: "✏️",
      color: "bg-gradient-to-br from-cyan-300 to-blue-400"
    }
  ];

  return (
    <div id="daily-games" className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100 flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* Background daily activity emojis */}
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
              y: [0, -45, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['🌅', '🍽️', '🚿', '📚', '😴', '🎮', '🏃‍♂️', '🛏️'][i]}
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
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 mb-4"
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          🌅 DAILY ADVENTURES! 🌅
        </motion.h2>
        <motion.p
          className="text-2xl font-bold text-orange-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Learn your daily routine with SUPER fun! 🎉
        </motion.p>
      </motion.div>

      {/* Animated Arrow with Clock */}
      <motion.div
        className="relative mb-8"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 12, -12, 0]
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
          ⏰
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
        className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-orange-300 relative overflow-hidden"
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
            📅
          </motion.div>
          <h3 className="font-black text-xl text-gray-800 mb-2">
            Every day is a NEW adventure! 🌟
          </h3>
          <p className="text-gray-600">
            Learn your daily routine and have amazing days! 🎮
          </p>
        </div>
        
        {/* Floating daily activity icons */}
        {['🌅', '🍽️', '🚿', '📚', '😴'].map((activity, i) => (
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
            {activity}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DailyActivitiesGames;