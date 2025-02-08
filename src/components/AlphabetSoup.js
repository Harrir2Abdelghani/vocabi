import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInterval } from "react-use"; // External package for interval hooks

const highlightColors = ["green", "blue", "red", "purple", "orange", "pink"];

const wordsLevel1 = ["ONE", "TWO", "THREE"];
const wordsLevel2 = ["SEVEN", "EIGHT", "NINE"];

const gridLevel1 = [
  ["H", "E", "I", "L", "O"],
  ["G", "O", "N", "E", "M"],
  ["R", "B", "K", "M", "E"],
  ["T", "W", "O", "E", "L"],
  ["T", "H", "R", "E", "E"],
];
const gridLevel2 = [
  ["C", "L", "A", "S", "S"],
  ["B", "O", "O", "K", "E"],
  ["H", "I", "B", "Y", "E"],
  ["M", "E", "L", "C", "K"],
  ["P", "O", "O", "K", "S"],
];

const AlphabetSoupGame = () => {
  const [level, setLevel] = useState(1);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60); // Timer for each level
  const [showConfetti, setShowConfetti] = useState(false);

  const words = level === 1 ? wordsLevel1 : wordsLevel2;
  const grid = level === 1 ? gridLevel1 : gridLevel2;

  useInterval(() => {
    if (timeLeft > 0) setTimeLeft(timeLeft - 1);
    else setMessage("⏰ Time's up! Try again.");
  }, timeLeft > 0 ? 1000 : null);

  const handleLetterClick = (letter, row, col) => {
    const newSelection = [...selectedLetters, { letter, row, col }];
    setSelectedLetters(newSelection);

    words.forEach((word) => {
      if (wordMatchesSelection(word, newSelection) && !foundWords.includes(word)) {
        setFoundWords([...foundWords, word]);
        setMessage(`🎉 You found the word: ${word}!`);
      }
    });
  };

  const wordMatchesSelection = (word, selection) => {
    const selectedWord = selection.map((s) => s.letter).join("");
    return selectedWord.includes(word);
  };

  const handleNextLevel = () => {
    if (foundWords.length === words.length) {
      setLevel(level + 1);
      setFoundWords([]);
      setSelectedLetters([]);
      setTimeLeft(60);
      setMessage("");
      setShowConfetti(true); // Show confetti animation
      setTimeout(() => setShowConfetti(false), 2000); // Hide after 2s
    } else {
      setMessage("Find all words to move to the next level!");
    }
  };

  const renderGrid = (grid) => (
    <div className="grid grid-cols-5 gap-2 mt-6">
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const isSelected = selectedLetters.some(
            (s) => s.row === rowIndex && s.col === colIndex
          );
          const color = getLetterColor(rowIndex, colIndex);

          return (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              className={`w-14 h-14 text-2xl font-bold flex items-center justify-center border-2 rounded-md
                ${isSelected ? `bg-${color}-400 text-white` : "bg-blue-400"}
                hover:scale-110 transition-transform duration-300`}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLetterClick(letter, rowIndex, colIndex)}
            >
              {letter}
            </motion.button>
          );
        })
      )}
    </div>
  );

  const getLetterColor = (row, col) => {
    for (let i = 0; i < foundWords.length; i++) {
      const word = foundWords[i];
      if (grid[row][col] === word[i]) {
        return highlightColors[i];
      }
    }
    return "gray";
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br mt-40 from-teal-100 to-indigo-200 flex flex-col items-center justify-center p-6">
    <div className='items-center justify-center p-6' >
      <div className="text-center">
        <motion.h1
          className="text-5xl font-extrabold text-indigo-600 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Alphabet Soup Game
        </motion.h1>
      </div>
      <p className="text-lg mb-4">Level {level}: Find the words below!</p>
      <p className="text-lg mb-4">Time Left: {timeLeft} seconds</p>

      <div className="flex space-x-4 mb-4">
        {words.map((word, index) => (
          <span
            key={word}
            className={`text-xl font-semibold text-${highlightColors[index]}-600`}
          >
            {word}
          </span>
        ))}
      </div>

      {renderGrid(grid)}

      <motion.button
        onClick={handleNextLevel}
        className="mt-6 bg-red-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
      >
        {level === 1 ? "Next Level" : "Play Again"}
      </motion.button>

      {message && (
        <motion.div
          className="mt-4 p-4 bg-green-200 text-green-800 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.div>
      )}

      {showConfetti && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🎉🎉🎉
        </motion.div>
      )}
    </div>
    </div>
  );
};

export default AlphabetSoupGame;
