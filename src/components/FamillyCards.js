import React from 'react';
import { motion } from 'framer-motion';
import innerImage from '../Assets/familly.jpg';
import { Link } from 'react-router-dom';

const GameCard = ({ route, index, title, description, emoji, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
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
            rotate: [0, 15, -15, 0],
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
            alt="Family Game"
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

const FamilyGames = () => {
  const games = [
    {
      route: "/famillywarmup",
      title: "Family Tree",
      description: "Build your amazing family tree!",
      emoji: "🌳",
      color: "bg-gradient-to-br from-green-300 to-emerald-400"
    },
    {
      route: "/familly2",
      title: "Who Am I?",
      description: "Guess the family members!",
      emoji: "🤔",
      color: "bg-gradient-to-br from-pink-300 to-rose-400"
    },
    {
      route: "/familly3",
      title: "Spell Family",
      description: "Spell family words correctly!",
      emoji: "📝",
      color: "bg-gradient-to-br from-purple-300 to-violet-400"
    }
  ];

  return (
    <div id="familly-games" className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-8 relative z-10"
      >
        <motion.div
          className="inline-block bg-white rounded-full px-6 py-3 shadow-lg border-2 border-pink-300 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-2xl font-black text-pink-600">
            👨‍👩‍👧‍👦 Family Fun
          </h2>
        </motion.div>
        <motion.p
          className="text-lg font-semibold text-red-700 bg-white/80 rounded-full px-4 py-2 inline-block"
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

export default FamilyGames;