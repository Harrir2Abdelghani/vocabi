import React, { useState, useEffect } from "react";
import { Volume2, RotateCcw, Star, Trophy } from "lucide-react";

// Import existing images
import brushTeethImg from "../Assets/brush-teeth.jpeg";
import lunchImg from "../Assets/lunch.jpeg";
import washFace from "../Assets/WashFace.jpeg";
import wakeUpImg from "../Assets/wakeUpImg.jpg";
import sleepImg from "../Assets/sleepImg.jpg";
import TvImg from "../Assets/TvImg.jpg";
import candyImg from "../Assets/candyImg.jpg";
import stayHomeImg from "../Assets/stayHomeImg.jpg";
import storyNightImg from "../Assets/storyNightImg.jpg";
import showerImg from "../Assets/showerImg.jpg";
import goSchoolImg from "../Assets/schoool.jpeg";

const DailyRoutineQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      text: "Get up",
      correctAnswer: 0,
      choices: [
        { image: wakeUpImg, alt: "Child waking up in bed" },
        { image: sleepImg, alt: "Child sleeping" },
        { image: TvImg, alt: "Child watching TV" },
      ],
    },
    {
      text: "Wash Face",
      correctAnswer: 0,
      choices: [
        { image: washFace, alt: "Child washing face" },
        { image: sleepImg, alt: "Child going to bed" },
        { image: storyNightImg, alt: "Reading bedtime story" },
      ],
    },
    {
      text: "Brush teeth",
      correctAnswer: 1,
      choices: [
        { image: candyImg, alt: "Candy and sweets" },
        { image: brushTeethImg, alt: "Child brushing teeth" },
        { image: TvImg, alt: "Child watching television" },
      ],
    },
    {
      text: "Eat lunch",
      correctAnswer: 0,
      choices: [
        { image: lunchImg, alt: "Child eating healthy lunch" },
        { image: wakeUpImg, alt: "Candy - unhealthy option" },
        { image: sleepImg, alt: "Child sleeping instead of eating" },
      ],
    },
    {
      text: "Go to school",
      correctAnswer: 2,
      choices: [
        { image: stayHomeImg, alt: "Child staying at home" },
        { image: showerImg, alt: "Child taking shower" },
        { image: goSchoolImg, alt: "Child going to school with backpack" },
      ],
    },
  ];

  // Define isNextButtonDisabled based on game completion
  const isNextButtonDisabled = !gameComplete;

  const playQuestion = () => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(
        questions[currentQuestion].text
      );
      utterance.lang = "en-GB"; // British accent
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerClick = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setShowResult(true);
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      setShowResult(true);
      setTimeout(() => setShowResult(false), 1000);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameComplete(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  useEffect(() => {
    if (!gameComplete && !showResult) {
      const timer = setTimeout(playQuestion, 500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, gameComplete, showResult]);

  if (gameComplete) {
    return (
      <div className="max-w-2xl mt-20 mx-auto p-6 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 rounded-3xl shadow-2xl">
        <div className="bg-white rounded-2xl p-8 text-center">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Quiz Complete!
          </h2>
          <div className="text-6xl mb-4">
            {score === questions.length ? "🎉" : score >= 3 ? "🌟" : "👍"}
          </div>
          <p className="text-xl text-gray-700 mb-4">
            You got <span className="font-bold text-purple-600">{score}</span>{" "}
            out of{" "}
            <span className="font-bold text-purple-600">
              {questions.length}
            </span>{" "}
            correct!
          </p>
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl text-xl font-bold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <RotateCcw className="w-6 h-6 inline mr-2" />
            Play Again
          </button>
        </div>
        
        {/* Navigation buttons - only show when game is complete */}
        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
            onClick={() => window.location.href = '/'}
          >
            ⬅ Previous
          </button>
          <button
            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg"
            onClick={() => window.location.href = '/daily2'}
          >
            Next ➡
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-20 mx-auto p-2 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl shadow-2xl">
      <div className="bg-white rounded-2xl p-2">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Daily Routine Quiz
              </h1>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="text-center mb-1">
          <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {questions[currentQuestion].text}
            </h2>
            <button
              onClick={playQuestion}
              disabled={isPlaying}
              className={`bg-blue-500 text-white px-6 py-3 rounded-2xl text-lg font-bold flex items-center mx-auto ${
                isPlaying
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600 transform hover:scale-105"
              } transition-all duration-200 shadow-lg`}
            >
              <Volume2 className="w-6 h-6 mr-2" />
              {isPlaying ? "Playing..." : "Listen Again 🔁"}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {questions[currentQuestion].choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              className={`border-4 rounded-2xl p-2 transition-all duration-300 transform hover:scale-105 shadow-lg w-full h-40 flex items-center justify-center overflow-hidden bg-white ${
                showResult && selectedAnswer === index
                  ? index === questions[currentQuestion].correctAnswer
                    ? "border-green-400 bg-green-50"
                    : "border-red-400 bg-red-50"
                  : "border-gray-200 hover:border-purple-400 hover:bg-purple-50"
              }`}
            >
              <img
                src={choice.image}
                alt={choice.alt}
                className="object-cover h-full w-full rounded-xl"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons - only show Previous during game, Next is disabled */}
      <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
        <button
          className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
          onClick={() => window.location.href = '/dailywarmup'}
        >
          ⬅ Previous
        </button>
        <button
          className={`py-2 px-4 rounded-lg shadow-lg ${isNextButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
          onClick={() => !isNextButtonDisabled && (window.location.href = '/daily3')}
          disabled={isNextButtonDisabled}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default DailyRoutineQuiz;