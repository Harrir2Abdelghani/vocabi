import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const NumberMatchQuiz = () => {
  const quizData = [
    { question: "Twenty Seven", answer: 27, options: [27, 13, 72, 20] },
    { question: "Sixty", answer: 60, options: [60, 22, 6, 16] },
    { question: "Eighty Eight", answer: 88, options: [88, 54, 80, 18] },
    { question: "Eleven", answer: 11, options: [11, 100, 12, 47] },
    { question: "Thirty Four", answer: 34, options: [34, 56, 30, 43] },
    { question: "Nine", answer: 9, options: [9, 66, 19, 90] },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    setShuffledOptions(quizData.map((q) => shuffleArray(q.options)));
  }, []);

  useEffect(() => {
    const correctCount = Object.keys(selectedAnswers).filter(
      key => selectedAnswers[key].status === "correct"
    ).length;
    
    if (correctCount === quizData.length) {
      setConfetti(true);
      setGameCompleted(true);
      setShowCongrats(true);
      setTimeout(() => {
        setConfetti(false);
      }, 10000);
    }
  }, [selectedAnswers]);

  const handleAnswer = (selectedAnswer, questionIndex) => {
    const isAnswerCorrect = selectedAnswer === quizData[questionIndex].answer;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: { 
        choice: selectedAnswer, 
        status: isAnswerCorrect ? "correct" : "incorrect" 
      }
    }));

    setPopupMessage(isAnswerCorrect ? "🎉 Correct!" : "❌ Oops! Try again!");
    setPopupColor(isAnswerCorrect ? "bg-green-500" : "bg-red-500");

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4 relative">
      <h1 className="text-4xl font-bold text-white mb-6">Number Match Quiz 🎲</h1>
      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizData.map((question, questionIndex) => (
          <div key={questionIndex} className="bg-white p-6 rounded-2xl shadow-lg text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">{`Find number: ${question.question}`}</h2>
            <div className="flex justify-center gap-4">
              {shuffledOptions[questionIndex]?.map((option) => {
                const selected = selectedAnswers[questionIndex]?.choice === option;
                const isCorrect = selectedAnswers[questionIndex]?.status === "correct";
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option, questionIndex)}
                    disabled={isCorrect}
                    className={`w-16 h-16 text-2xl font-bold text-white rounded-full shadow-lg transition-all transform hover:scale-110 
                      ${selected ? (isCorrect ? "bg-green-400" : "bg-red-400") : "bg-yellow-400"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed top-[500px] transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 text-xl font-semibold text-white rounded-lg shadow-lg ${popupColor}`}
          >
            {popupMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                🎉 Congratulations!
              </h2>
              <p className="text-xl text-gray-700">
                You got all answers correct!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
        <button 
          className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600" 
          onClick={() => window.location.href = '/numberswarmup'}
        >
          ⬅ Previous
        </button>
        <button
          className={`py-2 px-4 text-white rounded-lg shadow-lg ${
            gameCompleted ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => window.location.href = '/numbers3'}
          disabled={!gameCompleted}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default NumberMatchQuiz;