import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import backgroundImg from '../Assets/numbers-bg.jpg'; 
import GameWrapper from './GameSystem';

const shapes = [
  { name: "stars", icon: "⭐" },
  { name: "apples", icon: "🍎" },
  { name: "hearts", icon: "❤️" },
  { name: "dogs", icon: "🐶" },
  { name: "flowers", icon: "🌻" },
  { name: "donuts", icon: "🍩" },
  { name: "fish", icon: "🐟" },
  { name: "leaves", icon: "🍃" },
  { name: "moons", icon: "🌙" },
];

const numberWords = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];

const CountAndDragGame = () => {
  const [questionsPool, setQuestionsPool] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [draggedNumber, setDraggedNumber] = useState(null);
  const [dropText, setDropText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shuffledNumbers, setShuffledNumbers] = useState([]);

  const navigate = useNavigate();

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shapesCopy = [...shapes];
  
    const randomQuestions = Array.from({ length: 9 }, (_, i) => {
      const number = i + 1; 
      const randomIndex = Math.floor(Math.random() * shapesCopy.length);
      const selectedShape = shapesCopy[randomIndex];
  
      return {
        count: number, 
        word: numberWords[number - 1], 
        shape: selectedShape, 
      };
    });
  
    setQuestionsPool(randomQuestions); 
    setCurrentQuestion(randomQuestions[0]); 
    setShuffledNumbers([...numberWords].sort(() => Math.random() - 0.5));
  };

  const handleDragStart = (word) => {
    setDraggedNumber(word);
  };

  const handleDrop = (gameProps) => {
    if (draggedNumber === currentQuestion.word) {
      setDropText(`Correct: ${draggedNumber}`);
      setIsCorrect(true);
      gameProps.addPoints(10); // Award points for correct answer
  
      setTimeout(() => {
        setIsCorrect(false);
        setDropText("");
        moveToNextQuestion(gameProps);
        setShuffledNumbers([...numberWords].sort(() => Math.random() - 0.5));
      }, 2000);
    } else {
      // Wrong answer - lose a heart
      const canContinue = gameProps.loseHeart();
      if (!canContinue) {
        return; // Game over
      }
      setDropText("❌ Try again!");
      setIsCorrect(false);
    }
  };

  const moveToNextQuestion = (gameProps) => {
    const remainingQuestions = questionsPool.slice(1);
    if (remainingQuestions.length === 0) {
      setShowConfetti(true);
      gameProps.gameComplete(); // Complete the game
    } else {
      setQuestionsPool(remainingQuestions);
      setCurrentQuestion(remainingQuestions[0]);
    }
  };

  const GameContent = (gameProps) => {
    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }

    return (
      <div  
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} 
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-blue-200 p-4 relative"
      >
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

        {!showConfetti && currentQuestion && (
          <>
            <div className='flex items-center justify-center'>
              <h1 className="text-3xl font-bold text-blue-800 mb-10 -mt-10 text-center">
                Drag the Correct Number to Match the Shapes!
              </h1>
            </div>

            {/* Shapes Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center mb-4 animate-bounce border-2 border-red-200 rounded-xl">
                {Array.from({ length: currentQuestion.count }).map((_, idx) => (
                  <span
                    key={idx}
                    className="text-5xl mx-1 my-2"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {currentQuestion.shape.icon}
                  </span>
                ))}
              </div>
              <div
                onDrop={() => handleDrop(gameProps)}
                onDragOver={(e) => e.preventDefault()}
                className={`w-48 h-16 rounded-lg flex items-center justify-center border-2 transition ${
                  isCorrect
                    ? "bg-green-300 border-green-500"
                    : "bg-white border-dashed border-blue-400"
                }`}
              >
                <span className="text-lg text-blue-600">{dropText}</span>
              </div>
            </div>

            {/* Numbers Section */}
            <div className="grid grid-cols-3 gap-4">
              {shuffledNumbers.map((word, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(word)}
                  className="px-4 py-2 bg-red-200 rounded shadow-md hover:bg-blue-300 text-blue-800 font-semibold -mt-2 text-lg cursor-pointer transition text-center"
                >
                  {word}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Game Completion Message */}
        {showConfetti && (
          <div className="mt-8 text-4xl font-bold text-green-700 text-center">
            🎉 You did it! Great job! 🎉
          </div>
        )}

        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => window.location.href = '/'}
          >
            ⬅ Previous
          </button>
          <button
            className={`py-2 px-4 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              showConfetti ? "bg-red-500/80 hover:bg-red-600/80" : "bg-gray-400/50 cursor-not-allowed"
            }`}
            onClick={() => window.location.href = '/numbers2'}
            disabled={!showConfetti}
          >
            Next ➡
          </button>
        </div>
      </div>
    );
  };

  return (
    <GameWrapper
      gameName="Count & Match"
      maxTime={240} // 4 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        setTimeout(() => {
          navigate('/numbers2');
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

export default CountAndDragGame;