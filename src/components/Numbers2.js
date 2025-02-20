import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const NumberMatchQuiz = () => {
  const quizData = [
    { question: "Twenty Seven", answer: 27 },
    { question: "Sixty", answer: 60 },
    { question: "Eighty Eight", answer: 88 },
    { question: "Eleven", answer: 11 },
    { question: "Thirty Four", answer: 34 },
    { question: "Nine", answer: 9 },
  ];

  const answerOptions = [9, 88, 11, 60, 34, 27];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState(
    Array(6)
      .fill(null)
      .map(() => shuffleArray([...answerOptions]))
  );

  const [gameCompleted, setGameCompleted] = useState(false);

useEffect(() => {
  if (Object.keys(correctAnswers).length === quizData.length) {
    setConfetti(true);
    setGameCompleted(true); // Enable Next button when all answers are correct
    setTimeout(() => setConfetti(false), 10000);
  }
}, [correctAnswers]);
  const handleAnswer = (selectedAnswer, questionIndex) => {
    const isAnswerCorrect = selectedAnswer === quizData[questionIndex].answer;

    setSelectedAnswers((prev) => ({
      ...prev,
      [`${questionIndex}-${selectedAnswer}`]: isAnswerCorrect ? "correct" : "incorrect",
    }));

    if (isAnswerCorrect) {
      setCorrectAnswers((prev) => ({ ...prev, [`${questionIndex}-${selectedAnswer}`]: true }));
      setPopupMessage("🎉 Correct!");
      setPopupColor("bg-green-500");
    } else {
      setPopupMessage("❌ Oops! Try again!");
      setPopupColor("bg-red-500");
    }

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  useEffect(() => {
    // Check if all answers are correct
    if (Object.keys(correctAnswers).length === quizData.length) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 10000); 
    }
  }, [correctAnswers]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4 relative">
      <h1 className="text-4xl font-bold text-white mb-6">Number Match Quiz 🎲</h1>

      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizData.map((question, questionIndex) => (
          <div key={questionIndex} className="bg-white p-6 rounded-2xl shadow-lg text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">{`Find number: ${question.question}?`}</h2>

            <div className="flex justify-center gap-4">
              {shuffledOptions[questionIndex].map((option) => {
                const key = `${questionIndex}-${option}`;
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option, questionIndex)}
                    disabled={correctAnswers[key]} // Disable only correct answer
                    className={`w-16 h-16 text-2xl font-bold text-white rounded-full shadow-lg transition-all transform hover:scale-110 
                      ${
                        correctAnswers[key]
                          ? "bg-green-400 cursor-not-allowed" // Correct answer stays green
                          : selectedAnswers[key] === "incorrect"
                          ? "bg-red-400"
                          : "bg-yellow-400"
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Popup Message (Centered) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed top-[500px]  transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 text-xl font-semibold text-white rounded-lg shadow-lg ${popupColor}`}
          >
            {popupMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
  <button
    className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
    onClick={() => window.location.href = '/numberswarmup'}
  >
    Previous
  </button>
  <button
  className={`py-2 px-4 text-white rounded-lg shadow-lg ${
    gameCompleted ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"
  }`}
  onClick={() => window.location.href = '/numbers3'}
  disabled={!gameCompleted} // Disable button if game is not completed
>
  Next
</button>

</div>
    </div>
  );
};

export default NumberMatchQuiz;
