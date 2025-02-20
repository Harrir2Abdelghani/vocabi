import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const JobQuizGame = () => {
  const jobsQuiz = [
    {
      question: "I drive a bus!",
      options: ["Teacher", "Driver", "Chef", "Engineer"],
      answer: "Driver",
      image: "https://example.com/doctor-image.jpg"
    },
    {
      question: "I fix cars!",
      options: ["Artist", "Builder", "Pilot", "Mechanic"],
      answer: "Mechanic",
      image: "https://example.com/builder-image.jpg"
    },
    {
      question: "I bake bread!",
      options: ["Baker", "Chef", "Driver", "Writer"],
      answer: "Baker",
      image: "https://example.com/veterinarian-image.jpg"
    },
    {
      question: "I cut hair!",
      options: ["Teacher", "Nurse", "Artist", "Barber"],
      answer: "Barber",
      image: "https://example.com/teacher-image.jpg"
    },
    {
      question: "I put out fires!",
      options: ["Pilot", "Firefighter", "Driver", "Baker"],
      answer: "Firefighter",
      image: "https://example.com/driver-image.jpg"
    },
    {
      question: "I help sick people!",
      options: ["Doctor", "Baker", "Pilot", "Chef"],
      answer: "Doctor",
      image: "https://example.com/baker-image.jpg"
    },
    {
      question: "I serve food at restaurent!",
      options: ["Teacher", "Doctor", "Waiter", "Engineer"],
      answer: "Waiter",
      image: "https://example.com/doctor-image.jpg"
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [gameFinished, setGameFinished] = useState(false);

  const handleAnswer = (answer) => {
    if (answer === jobsQuiz[currentQuestion].answer) {
      setScore(score + 1);
      setFeedback("Correct!");
      setTimeout(() => {
        if (currentQuestion < jobsQuiz.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFeedback("");
        } else {
          setGameFinished(true);
        }
      }, 1000);
    } else {
      setFeedback("Try again.");
    }
    setSelectedAnswer(answer);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-400"
      style={{ backgroundImage: 'url(https://img.freepik.com/premium-vector/diverse-professional-presenting-empty-vertical-banner_74102-199.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {gameFinished && <Confetti />}
      <div className="bg-yellow-100 p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Job Quiz Game</h1>
        <div className="text-center mb-4">
          <p className="text-lg font-medium text-gray-600">{jobsQuiz[currentQuestion].question}</p>
        </div>
        <div className="space-y-3">
          {jobsQuiz[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`w-full p-3 rounded-lg border text-gray-800 font-semibold transition-colors ${
                selectedAnswer === option ? (option === jobsQuiz[currentQuestion].answer ? "bg-green-400" : "bg-red-400") : "bg-purple-400 hover:bg-gray-400"
              }`}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          {feedback && (
            <p className={`text-lg font-bold ${feedback === "Correct!" ? "text-green-600" : "text-red-600"}`}>
              {feedback}
            </p>
          )}
        </div>
      </div>
      <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
        <button
          className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
          onClick={() => window.location.href = '/jobswarmup'}
        >
          Previous
        </button>
        <button
  className={`py-2 px-4 text-white rounded-lg shadow-lg ${
    gameFinished ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"
  }`}
  onClick={() => window.location.href = '/jobs3'}
  disabled={!gameFinished} // Disable button if game is not finished
>
  Next
</button>

      </div>
      <div className="flex justify-center mt-4">
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

export default JobQuizGame;
