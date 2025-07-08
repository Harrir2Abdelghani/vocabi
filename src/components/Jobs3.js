import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import backgroundImage from '../Assets/quizpic.jpg';
import GameWrapper from './GameSystem';

const JobQuizGame = () => {
  const jobsQuiz = [
    {
      question: "I drive a bus!",
      options: ["Teacher", "Driver", "Chef", "Engineer"],
      answer: "Driver",
      image: "https://example.com/doctor-image.jpg"
    },
    {
      question: "I repair cars!",
      options: ["Artist", "Builder", "Pilot", "Mechanic"],
      answer: "Mechanic",
      image: "https://example.com/builder-image.jpg"
    },
    {
      question: "I cook delicious food!",
      options: ["Baker", "Chef", "Driver", "Writer"],
      answer: "Chef",
      image: "https://example.com/veterinarian-image.jpg"
    },
    {
      question: "I catch criminals!",
      options: ["Teacher", "Nurse", "Artist", "Policeman"],
      answer: "Policeman",
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
      question: "I give homeworks!",
      options: ["Teacher", "Doctor", "Waiter", "Engineer"],
      answer: "Teacher",
      image: "https://example.com/doctor-image.jpg"
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleAnswer = (answer, gameProps) => {
    if (answer === jobsQuiz[currentQuestion].answer) {
      gameProps.addPoints(15); // Award points for correct answer
      setCorrectAnswers(prev => prev + 1);
      setFeedback("Correct!");
      setTimeout(() => {
        if (currentQuestion < jobsQuiz.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFeedback("");
        } else {
          setGameFinished(true);
          gameProps.gameComplete();
        }
      }, 1000);
    } else {
      // Wrong answer - lose a heart
      const canContinue = gameProps.loseHeart();
      if (!canContinue) {
        return; // Game over
      }
      setFeedback("Try again.");
    }
    setSelectedAnswer(answer);
  };

  const GameContent = (gameProps) => {
    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-transparent"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {gameFinished && <Confetti />}
        <div className="bg-transparent p-6 rounded-lg w-120">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Choose the right answer</h1>
          <div className="text-center mb-4">
            <p className="text-xl font-bold text-black">{jobsQuiz[currentQuestion].question}</p>
          </div>
          <div className="space-y-3">
            {jobsQuiz[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`w-44 p-3 rounded-lg border text-gray-800 font-semibold transition-colors mx-auto block ${
                  selectedAnswer === option ? (option === jobsQuiz[currentQuestion].answer ? "bg-green-400" : "bg-red-400") : "bg-white hover:bg-gray-400"
                }`}
                onClick={() => handleAnswer(option, gameProps)}
                disabled={gameProps.gameEnded}
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
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => window.location.href = '/jobswarmup'}
          >
            ⬅ Previous
          </button>
          <button
            className={`py-2 px-4 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              gameFinished ? "bg-red-500/80 hover:bg-red-600/80" : "bg-gray-400/50 cursor-not-allowed"
            }`}
            onClick={() => window.location.href = '/jobs3'}
            disabled={!gameFinished}
          >
            Next ➡
          </button>
        </div>
        <div className="flex justify-center mt-4">
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
      gameName="Career Quiz"
      maxTime={210} // 3.5 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        setTimeout(() => {
          window.location.href = '/jobs3';
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

export default JobQuizGame;