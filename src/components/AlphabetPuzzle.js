import React, { useState, useEffect } from 'react';

const lettersByLevel = {
  1: ['A', 'B', 'C', 'D', 'E', 'F'],
  2: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
  3: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
};

const AlphabetPuzzle = () => {
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);

  useEffect(() => {
    startLevel();
  }, [level]);

  const shuffleLetters = (letters) => {
    return letters.sort(() => Math.random() - 0.5);
  };

  const startLevel = () => {
    const letters = lettersByLevel[level];
    setShuffledLetters(shuffleLetters([...letters]));
    setCompleted(false);
    setCorrectLetters([]);
  };

  const handleDrop = (e, letter) => {
    e.preventDefault();
    const draggedLetter = e.dataTransfer.getData('text');
    if (draggedLetter === letter) {
      setCorrectLetters((prev) => [...prev, letter]);
      setShuffledLetters((prev) => prev.filter((l) => l !== letter));
    }
    if (shuffledLetters.length === 1) {
      setCompleted(true);
    }
  };

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData('text', letter);
  };

  return (
    <div className="p-8 min-h-screen flex flex-col items-center bg-teal-100 text-center">
      <h2 className="text-2xl mt-24 font-extrabold text-blue-700 mb-6">
        Alphabet Puzzle - Level {level}
      </h2>
      <p className="text-lg mb-6 text-gray-700">Arrange the letters in the correct order!</p>

      <div className="grid grid-cols-6 gap-3 mb-8">
        {shuffledLetters.map((letter) => (
          <div
            key={letter}
            draggable
            onDragStart={(e) => handleDragStart(e, letter)}
            className="bg-white text-lg text-purple-700 font-semibold w-14 h-14 flex items-center justify-center rounded-lg shadow-md cursor-pointer transform transition hover:scale-110"
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-3 mb-6">
        {lettersByLevel[level].map((letter) => (
          <div
            key={letter}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, letter)}
            className={`border-2 border-dashed h-20 w-20 rounded-lg flex items-center justify-center transition-colors ${
              correctLetters.includes(letter)
                ? 'bg-green-300 text-white font-bold'
                : 'bg-red-400 text-gray-600'
            }`}
          >
            {letter}
          </div>
        ))}
      </div>

      {completed && (
        <div className="mt-6">
          <p className="text-lg font-bold text-green-600 animate-pulse">
            Well done! Level {level} completed! 🎉
          </p>
          <button
            onClick={() => setLevel(level + 1)}
            className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg transform transition hover:scale-105 hover:bg-purple-600"
          >
            Next Level
          </button>
        </div>
      )}
    </div>
  );
};

export default AlphabetPuzzle;
