import React, { useState } from "react";
import Confetti from "react-confetti";

const jobs = [
  { name: "chef", image: "https://cdn3d.iconscout.com/3d/premium/thumb/chef-avatar-10106016-8179556.png?f=webp", color: "bg-red-200" },
  { name: "pilot", image: "https://cdn-icons-png.flaticon.com/512/5715/5715807.png", color: "bg-blue-200" },
  { name: "nurse", image: "https://png.pngtree.com/png-clipart/20230512/original/pngtree-free-vector-nurse-avatar-with-transparent-background-png-image_9159263.png", color: "bg-green-200" },
  { name: "teacher", image: "https://static.vecteezy.com/system/resources/previews/025/003/244/non_2x/3d-cute-cartoon-female-teacher-character-on-transparent-background-generative-ai-png.png", color: "bg-yellow-200" },
  { name: "artist", image: "https://cdn0.iconfinder.com/data/icons/people-jobs-set-2/128/jobs-10-512.png", color: "bg-purple-200" },
  { name: "driver", image: "https://cdn0.iconfinder.com/data/icons/taxi-12/500/SingleCartoonTaxiYulia_10-512.png", color: "bg-orange-200" },
];

const grid = [
  ["C", "H", "E", "F", "A", "B", "C", "D"],
  ["A", "P", "I", "L", "O", "T", "E", "R"],
  ["N", "R", "A", "N", "D", "O", "M", "I"],
  ["T", "E", "A", "C", "H", "E", "R", "V"],
  ["A", "R", "T", "I", "S", "T", "I", "E"],
  ["K", "L", "M", "N", "O", "D", "R", "R"],
  ["N", "U", "R", "S", "E", "I", "V", "E"],
  ["L", "M", "N", "O", "P", "Q", "R", "S"],
];

const CrosswordGame = () => {
  const [selectedWord, setSelectedWord] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundLetters, setFoundLetters] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleLetterClick = (letter, row, col) => {
    if (gameComplete) return;
    if (foundLetters.some((pos) => pos.row === row && pos.col === col)) return;

    const newSelection = [...selectedWord, { letter, row, col }];
    setSelectedWord(newSelection);

    const formedWord = newSelection.map((item) => item.letter).join("").toLowerCase();
    const matchingJob = jobs.find((job) => job.name === formedWord);

    if (matchingJob && !foundWords.includes(formedWord)) {
      const updatedFoundWords = [...foundWords, formedWord];
      setFoundWords(updatedFoundWords);
      setFoundLetters([...foundLetters, ...newSelection]);
      setPopupMessage(`🎉 Great! You found: ${formedWord}`);
      setTimeout(() => setPopupMessage(""), 3000);
      setSelectedWord([]);

      if (updatedFoundWords.length === jobs.length) {
        setGameComplete(true);
        setTimeout(() => setPopupMessage("🎉 Congratulations! You found all the jobs!"), 500);
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
            row.map((letter, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleLetterClick(letter, rowIndex, colIndex)}
                disabled={gameComplete || foundLetters.some(pos => pos.row === rowIndex && pos.col === colIndex)}
                className={`w-10 h-10 border text-xl font-bold ${
                  foundLetters.some(pos => pos.row === rowIndex && pos.col === colIndex)
                    ? jobs.find(job => job.name.includes(letter))?.color || "bg-green-300"
                    : selectedWord.some(item => item.row === rowIndex && item.col === colIndex)
                    ? "bg-blue-300"
                    : "bg-white"
                }`}
              >
                {letter}
              </button>
            ))
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
    onClick={() => window.location.href = '/'}
  >
    Previous
  </button>
  <button
    className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
    onClick={() => window.location.href = '/jobs2'}
  >
    Next
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
