import React from 'react';
import { motion } from 'framer-motion';
import innerImage from '../Assets/jobs.jpg';
import { Link } from 'react-router-dom';

const GameCard = ({ route, index, title, description, emoji, color }) => (
  <motion.div
    initial={{ opacity: 0, rotate: index % 2 === 0 ? -45 : 45 }}
    animate={{ opacity: 1, rotate: 0 }}
    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
    whileHover={{ 
      scale: 1.05,
      y: -5
    }}
    className="group"
  >
    <Link to={route}>
      <div className={`relative rounded-2xl overflow-hidden h-[300px] w-72 shadow-lg border-2 border-white ${color} transition-all duration-300`}>
        
        {/* Level indicator */}
        <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 shadow-md z-30">
          <span className="text-xs font-bold text-gray-700">{index + 1}</span>
        </div>

        {/* Main emoji */}
        <motion.div
          className="absolute top-3 right-3 text-2xl z-30"
          animate={{
            rotate: [0, 25, -25, 0],
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
        <div className="relative flex items-center justify-center h-full p-4">
          <motion.img
            src={innerImage}
            alt="Jobs Game"
            className="w-40 h-48 object-contain z-20 rounded-xl shadow-md"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Game Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
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
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-8 relative z-10"
      >
        <motion.div
          className="inline-block bg-white rounded-full px-6 py-3 shadow-lg border-2 border-green-300 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-2xl font-black text-green-600">
            👷‍♂️ Jobs Adventure
          </h2>
        </motion.div>
        <motion.p
          className="text-lg font-semibold text-green-700 bg-white/80 rounded-full px-4 py-2 inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Ready to learn? Pick a game! 🎮
        </motion.p>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl relative z-10">
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
    </div>
  );
};

export default JobsGames;