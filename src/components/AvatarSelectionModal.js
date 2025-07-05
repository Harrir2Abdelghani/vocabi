import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, Sparkles } from 'lucide-react';

const AvatarSelectionModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [playerName, setPlayerName] = useState('');

  const avatars = {
    boy: [
      { id: 'boy1', emoji: '👦', name: 'Alex', color: 'bg-blue-400' },
      { id: 'boy2', emoji: '🧒', name: 'Sam', color: 'bg-green-400' },
      { id: 'boy3', emoji: '👨‍🎓', name: 'Max', color: 'bg-purple-400' },
      { id: 'boy4', emoji: '🧑‍🚀', name: 'Leo', color: 'bg-orange-400' }
    ],
    girl: [
      { id: 'girl1', emoji: '👧', name: 'Emma', color: 'bg-pink-400' },
      { id: 'girl2', emoji: '👩‍🎓', name: 'Lily', color: 'bg-rose-400' },
      { id: 'girl3', emoji: '👸', name: 'Sofia', color: 'bg-purple-400' },
      { id: 'girl4', emoji: '🧚‍♀️', name: 'Maya', color: 'bg-yellow-400' }
    ]
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setStep(2);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setPlayerName(avatar.name);
    setStep(3);
  };

  const handleComplete = () => {
    if (playerName.trim()) {
      const userProfile = {
        name: playerName,
        gender: selectedGender,
        avatar: selectedAvatar,
        score: 0,
        level: 1,
        gamesCompleted: 0
      };
      onComplete(userProfile);
    }
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl text-white relative">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Welcome to VOCABI!</h2>
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-center mt-2 text-purple-100">Let's create your profile</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Gender Selection */}
            {step === 1 && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">Choose your character type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenderSelect('boy')}
                    className="p-6 bg-blue-100 rounded-2xl border-2 border-transparent hover:border-blue-400 transition-all"
                  >
                    <div className="text-6xl mb-2">👦</div>
                    <span className="text-lg font-semibold text-blue-600">Boy</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenderSelect('girl')}
                    className="p-6 bg-pink-100 rounded-2xl border-2 border-transparent hover:border-pink-400 transition-all"
                  >
                    <div className="text-6xl mb-2">👧</div>
                    <span className="text-lg font-semibold text-pink-600">Girl</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Avatar Selection */}
            {step === 2 && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">Pick your avatar</h3>
                <div className="grid grid-cols-2 gap-4">
                  {avatars[selectedGender].map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`p-4 ${avatar.color} rounded-2xl text-white shadow-lg hover:shadow-xl transition-all`}
                    >
                      <div className="text-5xl mb-2">{avatar.emoji}</div>
                      <span className="text-lg font-semibold">{avatar.name}</span>
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {/* Step 3: Name Input */}
            {step === 3 && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">What's your name?</h3>
                <div className="mb-6">
                  <div className={`w-24 h-24 ${selectedAvatar.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-4xl">{selectedAvatar.emoji}</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={playerName}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl text-center text-lg font-semibold focus:border-purple-400 focus:outline-none transition-colors"
                  maxLength={15}
                />
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={!playerName.trim()}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Start Playing! 🎮
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AvatarSelectionModal;