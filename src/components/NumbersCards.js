import React from 'react';
import { motion } from 'framer-motion';
import innerImage from '../Assets/numbers.jpg';
import { Link } from 'react-router-dom';

const GameCard = ({ route, index, title, description, emoji, color }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ 
      scale: 1.05,
      y: -5
    }}
    className="group"
  >
    <Link to={route}>
      <div className={`relative rounded-3xl overflow-hidden h-96 w-72 shadow-xl ${color} transition-all duration-300`}>
        
        {/* Game number */}
        <div className="absolute top-4 left-4 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-30">
          <span className="text-sm font-black text-gray-700">{index + 1}</span>
        </div>

        {/* Emoji */}
        <div className="absolute top-4 right-4 text-3xl z-30">
          {emoji}
        </div>

        {/* Image */}
        <div className="flex items-center justify-center h-full p-6">
          <motion.img
            src={innerImage}
            alt="Numbers Game"
            className="w-60 h-78 object-cover rounded-2xl"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-black text-xl text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

const NumbersGames = () => {
  const games = [
    {
      route: "/numberswarmup",
      title: "Count & Match",
      description: "Count objects and match!",
      emoji: "🔢",
      color: "bg-gradient-to-br from-blue-400 to-cyan-500"
    },
    {
      route: "/numbers2",
      title: "Number Quiz",
      description: "Find the right numbers!",
      emoji: "🧮",
      color: "bg-gradient-to-br from-purple-400 to-indigo-500"
    },
    {
      route: "/numbers3",
      title: "Math Magic",
      description: "Solve math problems!",
      emoji: "🪄",
      color: "bg-gradient-to-br from-orange-400 to-red-500"
    }
  ];

  return (
    <div id="numbers-games" className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col items-center justify-center p-8">
      
      {/* Simple Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-black text-blue-700 mb-4">
          🔢 Numbers World
        </h2>
        <p className="text-xl text-gray-600">
          Pick a game to start learning! 🎯
        </p>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

export default NumbersGames;