import React, { useState } from "react";
import Confetti from "react-confetti";
import chef from '../Assets/chefcross.jpg'
import teacher from '../Assets/teachercross.jpg'
import nurse from '../Assets/nursecross.jpg'
import vet from '../Assets/vetcross.jpg'
import farmer from '../Assets/farmercross.jpg'
import lawyer from '../Assets/lawyercross.jpg'
import GameWrapper from './GameSystem';

const jobs = [
  { name: "chef", image: chef, color: "bg-green-500" },
  { name: "farmer", image: farmer, color: "bg-green-500" },
  { name: "nurse", image: nurse, color: "bg-green-500" },
  { name: "teacher", image: teacher, color: "bg-green-500" },
  { name: "lawyer", image: lawyer, color: "bg-green-500" },
  { name: "vet", image: vet, color: "bg-green-500" },
];

const grid = [
  ["C", "H", "E", "F", "A", "B", "C", "D"],
  ["A", "F", "A", "R", "M", "E", "R", "Q"],
  ["N", "R", "A", "N", "D", "O", "M", "Y"],
  ["T", "E", "A", "C", "H", "E", "R", "W"],
  ["L", "A", "W", "Y", "E", "R", "I", "E"],
  ["K", "L", "M", "N", "O", "D", "X", "T"],
  ["N", "U", "R", "S", "E", "I", "V", "E"],
  ["L", "M", "V", "E", "T", "Q", "R", "S"],
];

const CrosswordGame = () => {
  const [selectedWord, setSelectedWord] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundLetters, setFoundLetters] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [wrongLetters, setWrongLetters] = useState([]);

  const handleLetterClick = (letter, row, col, gameProps) => {
    if (gameComplete) return;
    if (foundLetters.some((pos) => pos.row === row && pos.col === col)) return;
  
    const newPosition = { letter, row, col };
    
    // Check if this is the first letter or if it's adjacent to the last selected letter
    if (selectedWord.length === 0 || isAdjacent(selectedWord[selectedWord.length - 1], newPosition)) {
      const newSelection = [...selectedWord, newPosition];
      setSelectedWord(newSelection);
  
      const formedWord = newSelection.map((item) => item.letter).join("").toLowerCase();
      const matchingJob = jobs.find((job) => job.name === formedWord);
  
      if (matchingJob && !foundWords.includes(formedWord)) {
        // Correct word found
        const updatedFoundWords = [...foundWords, formedWord];
        setFoundWords(updatedFoundWords);
        setFoundLetters([...foundLetters, ...newSelection]);
        setPopupMessage(`🎉 Great! You found: ${formedWord}`);
        setWrongLetters([]);
        setSelectedWord([]);
        gameProps.addPoints(25); // Award points for finding a word
        setTimeout(() => setPopupMessage(""), 3000);
  
        if (updatedFoundWords.length === jobs.length) {
          setGameComplete(true);
          gameProps.gameComplete();
        }
      }
    } else {
      // Invalid selection - not adjacent
      const canContinue = gameProps.loseHeart();
      if (!canContinue) {
        return; // Game over
      }
      setWrongLetters([newPosition]);
      setPopupMessage("❌ Select letters that are next to each other!");
      setTimeout(() => {
        setPopupMessage("");
        setWrongLetters([]);
        setSelectedWord([]);
      }, 1000);
    }
  };
  
  // Helper function to check if two positions are adjacent
  const isAdjacent = (pos1, pos2) => {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  const GameContent = (gameProps) => {
    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }

    return (
      <div className="flex flex-col items-center bg-blue-100 min-h-screen p-6">
        {gameComplete && <Confetti />}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-blue-600 mt-14 mb-4">
            What job is it? Use the letters to write the correct word
          </h1>
        </div>

        <div className="flex flex-row w-full justify-between mb-8">
          <div className="flex flex-col items-center space-y-7">
            {jobs.slice(0, 3).map((job, index) => (
              <div key={index} className="flex flex-col items-center ml-10">
                <img src={job.image} alt={job.name} className="w-32 h-28 object-cover mb-0" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-8 gap-1">
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const isFound = foundLetters.some(pos => pos.row === rowIndex && pos.col === colIndex);
                const isSelected = selectedWord.some(item => item.row === rowIndex && item.col === colIndex);
                const isWrong = wrongLetters.some(pos => pos.row === rowIndex && pos.col === colIndex);

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleLetterClick(letter, rowIndex, colIndex, gameProps)}
                    disabled={gameComplete || isFound || gameProps.gameEnded}
                    className={`w-10 h-10 border text-xl font-bold flex items-center justify-center
                      ${isFound ? (jobs.find(job => job.name.includes(letter.toLowerCase()))?.color || "bg-green-300") : 
                        isWrong ? "bg-red-400 text-white" : 
                        isSelected ? "bg-blue-300" : 
                        "bg-white"}`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex flex-col items-center space-y-7">
            {jobs.slice(3).map((job, index) => (
              <div key={index + 3} className="flex flex-col items-center mr-10">
                <img src={job.image} alt={job.name} className="w-32 h-28 object-cover" />
              </div>
            ))}
          </div>
        </div>

        {popupMessage && (
          <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-center z-50">
            {popupMessage}
          </div>
        )}

        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => window.location.href = '/jobs2'}
          >
            ⬅ Previous
          </button>
        </div>

        <div className="flex justify-center -mt-8">
          <button
            className="py-2 px-4 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-blue-600/80 flex items-center border border-white/20"
            onClick={() => window.location.reload()}
          >
            🔄 Restart Game
          </button>
        </div>
      </div>
    );
  };

  return (
    <GameWrapper
      gameName="Word Search"
      maxTime={360} // 6 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }}
      onGameFail={(result) => {
        console.log('Game failed!', result);
      }}
    >
      <GameContent />
    </GameWrapper>
  );
};

export default CrosswordGame;