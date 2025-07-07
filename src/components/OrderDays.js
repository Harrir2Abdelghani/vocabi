import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import mainSectionBg from "../Assets/kids.jpg";
import { useNavigate } from "react-router-dom";
import GameWrapper from './GameSystem';

// Days of the week list
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const shuffle = (word) => word.split("").sort(() => Math.random() - 0.5);

const KidsDaysGame = () => {
  const [remainingDays, setRemainingDays] = useState(daysOfWeek);
  const [currentDay, setCurrentDay] = useState("");
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (remainingDays.length > 0) {
      setRandomDay();
    } else {
      setShowConfetti(true);
    }
  }, [remainingDays]);

  const setRandomDay = () => {
    const day = remainingDays[Math.floor(Math.random() * remainingDays.length)];
    setCurrentDay(day);
    setShuffledLetters(shuffle(day));
    setUserOrder(new Array(day.length).fill(""));
  };

  const handleDropZone = (e, index, gameProps) => {
    e.preventDefault();
    const letter = e.dataTransfer.getData("text/plain");

    // If the letter matches the correct index in currentDay
    if (letter === currentDay[index]) {
      const newOrder = [...userOrder];
      newOrder[index] = letter;
      setUserOrder(newOrder);

      // Check if the word is completed
      if (newOrder.join("") === currentDay) {
        setIsCorrect(true);
        gameProps.addPoints(20); // Award points for completing a word
        setRemainingDays((prev) => prev.filter((d) => d !== currentDay));
        setTimeout(() => {
          setIsCorrect(false);
          if (remainingDays.length === 1) { // Last day completed
            gameProps.gameComplete();
          }
        }, 2000);
      }
    } else {
      // Wrong placement - lose a heart
      const canContinue = gameProps.loseHeart();
      if (!canContinue) {
        return; // Game over
      }
      setPopUpMessage("Oops Wrong placement! Try again.");
      setTimeout(() => {
        setPopUpMessage("");
      }, 2000);
    }
  };

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData("text/plain", letter);
  };

  const GameContent = (gameProps) => {
    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{
          backgroundImage: `url(${mainSectionBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

        <div className="w-full py-6 text-center bg-transparent -mt-10">
          <h1 className="text-4xl font-extrabold text-black">Can you fix the mixed-up letters? Find the day of the week!</h1>
        </div>

        {remainingDays.length > 0 && currentDay && (
          <div className="flex flex-col items-center space-y-4 mt-6">
            <motion.div className="flex space-x-2">
              {shuffledLetters.map((letter, idx) => (
                <motion.div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter)}
                  className="bg-cyan-800 text-xl font-bold p-4 rounded-lg shadow-md cursor-pointer hover:bg-yellow-400"
                  whileHover={{ scale: 1.2 }}
                  disabled={gameProps.gameEnded}
                >
                  {letter}
                </motion.div>
              ))}
            </motion.div>

            <div className="flex space-x-2">
              {Array(currentDay.length)
                .fill("")
                .map((_, idx) => (
                  <motion.div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropZone(e, idx, gameProps)}
                    className={`w-14 h-14 border-2 border-dashed rounded-lg flex items-center justify-center text-xl ${
                      userOrder[idx] ? "bg-green-700" : "bg-white"
                    }`}
                  >
                    {userOrder[idx]}
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {remainingDays.length === 0 && (
          <div className="text-center mt-6">
            <h2 className="text-3xl font-bold text-green-600">🎉 Congratulations! You did it! 🎉</h2>
          </div>
        )}

        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-green-500 text-white rounded-lg duration-1000"
          >
            🎉 Correct! Keep Going!
          </motion.div>
        )}

        {/* Pop-Up Message */}
        {popUpMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="top-50 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg"
          >
            {popUpMessage}
          </motion.div>
        )}

        <div className="absolute left-0 bottom-0 ml-4 mb-4">
          <button
            onClick={() => navigate("/days2")}
            className="bg-blue-500/80 backdrop-blur-sm text-white px-4 py-2 rounded hover:bg-blue-700/80 border border-white/20"
          >
            ⬅ Previous
          </button>
        </div>
      </div>
    );
  };

  return (
    <GameWrapper
      gameName="Letter Puzzle"
      maxTime={300} // 5 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        setTimeout(() => {
          navigate('/');
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

export default KidsDaysGame;