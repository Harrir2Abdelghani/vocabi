import React, { useState } from "react";
import Confetti from "react-confetti";
import chef from '../Assets/chefcross.jpg'
import teacher from '../Assets/teachercross.jpg'
import nurse from '../Assets/nursecross.jpg'
import vet from '../Assets/vetcross.jpg'
import farmer from '../Assets/farmercross.jpg'
import lawyer from '../Assets/lawyercross.jpg'

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

  const handleLetterClick = (letter, row, col) => {
    if (gameComplete) return;
    if (foundLetters.some((pos) => pos.row === row && pos.col === col)) return;

    const newPosition = { letter, row, col };
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
      
      setTimeout(() => setPopupMessage(""), 3000);

      if (updatedFoundWords.length === jobs.length) {
        setGameComplete(true);
        setTimeout(() => setPopupMessage("🎉 Congratulations! You found all the jobs!"), 500);
      }
    } else if (newSelection.length > 1) {
      // Check if the current selection is part of any job word
      const isValidContinuation = jobs.some(job => 
        job.name.startsWith(formedWord) && 
        job.name.length >= formedWord.length
      );
      
      if (!isValidContinuation) {
        setWrongLetters(newSelection.slice(-1)); // Mark the last selected letter as wrong
        setPopupMessage("❌ Oops! That's not part of a job!");
        setTimeout(() => {
          setPopupMessage("");
          setWrongLetters([]);
          setSelectedWord([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center bg-blue-100 min-h-screen p-6">
      {gameComplete && <Confetti />}
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Wordle Jobs Game</h1>

      <div className="flex flex-row w-full justify-between mb-8">
        <div className="flex flex-col items-center space-y-7">
          {jobs.slice(0, 3).map((job, index) => (
            <div key={index} className="flex flex-col items-center ml-10">
              <img src={job.image} alt={job.name} className="w-24 h-24 object-cover mb-2" />
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
                  onClick={() => handleLetterClick(letter, rowIndex, colIndex)}
                  disabled={gameComplete || isFound}
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
              <img src={job.image} alt={job.name} className="w-24 h-24 object-cover mb-2" />
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
          className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
          onClick={() => window.location.href = '/jobs2'}
        >
          ⬅ Previous
        </button>
      </div>

      <div className="flex justify-center -mt-4">
        <button
          className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 flex items-center"
          onClick={() => window.location.reload()}
        >
          🔄 Restart Game
        </button>
      </div>
    </div>
  );
};

export default CrosswordGame;