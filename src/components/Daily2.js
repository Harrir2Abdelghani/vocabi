import React, { useState, useEffect } from "react";
import { Volume2, RotateCcw, Star, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import GameWrapper from './GameSystem';

// Import images
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
  const [gameComplete, setGameComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const goToNextPage = () => {
    navigate('/daily3');
  };

  const questions = [
    {
      text: "I get up",
      correctAnswer: 0,
      choices: [
        { image: wakeUpImg, alt: "Child waking up in bed" },
        { image: sleepImg, alt: "Child sleeping" },
        { image: TvImg, alt: "Child watching TV" },
      ],
    },
    {
      text: "I wash my face",
      correctAnswer: 0,
      choices: [
        { image: washFace, alt: "Child washing face" },
        { image: sleepImg, alt: "Child going to bed" },
        { image: storyNightImg, alt: "Reading bedtime story" },
      ],
    },
    {
      text: "I brush my teeth",
      correctAnswer: 1,
      choices: [
        { image: sleepImg, alt: "Candy and sweets" },
        { image: brushTeethImg, alt: "Child brushing teeth" },
        { image: TvImg, alt: "Child watching television" },
      ],
    },
    {
      text: "I have lunch",
      correctAnswer: 0,
      choices: [
        { image: lunchImg, alt: "Child eating healthy lunch" },
        { image: wakeUpImg, alt: "Candy - unhealthy option" },
        { image: sleepImg, alt: "Child sleeping instead of eating" },
      ],
    },
    {
      text: "I go to school",
      correctAnswer: 2,
      choices: [
        { image: stayHomeImg, alt: "Child staying at home" },
        { image: showerImg, alt: "Child taking shower" },
        { image: goSchoolImg, alt: "Child going to school with backpack" },
      ],
    },
  ];

  const playQuestion = () => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(
        questions[currentQuestion].text
      );
      utterance.lang = "en-GB";
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerClick = (index, gameProps) => {
    if (showResult) return;
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      gameProps.addPoints(15); // Award points for correct answer
      setShowResult(true);
      setTimeout(() => {
        nextQuestion(gameProps);
      }, 1500);
    } else {
      // Wrong answer - lose a heart
      const canContinue = gameProps.loseHeart();
      if (!canContinue) {
        return; // Game over
      }
      setShowResult(true);
      setTimeout(() => setShowResult(false), 1000);
    }
  };

  const nextQuestion = (gameProps) => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      gameProps.gameComplete();
    }
  };

  useEffect(() => {
    if (!gameComplete && !showResult) {
      const timer = setTimeout(playQuestion, 500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, gameComplete, showResult]);

  const GameContent = (gameProps) => {
    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }

    if (gameComplete) {
      return (
        <div className="max-w-2xl mt-20 mx-auto p-6 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 rounded-3xl shadow-2xl">
          {correctAnswers === questions.length && <Confetti width={width} height={height} />}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctAnswers === questions.length ? "Congratulations! 🎉" : "Quiz Complete!"}
            </h2>
            <div className="text-6xl mb-4">
              {correctAnswers === questions.length ? "🏆" : correctAnswers >= 3 ? "🌟" : "👍"}
            </div>
            <p className="text-xl text-white mb-4">
              You got <span className="font-bold text-yellow-300">{correctAnswers}</span> out of{" "}
              <span className="font-bold text-yellow-300">{questions.length}</span> correct!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl text-xl font-bold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <RotateCcw className="w-6 h-6 inline mr-2" />
              Play Again
            </button>
          </div>
          <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
            <button
              className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
              onClick={() => window.location.href = '/dailywarmup'}
            >
              ⬅ Previous
            </button>
            <button
              className="py-2 px-4 bg-red-500/80 backdrop-blur-sm hover:bg-red-600/80 text-white rounded-lg shadow-lg border border-white/20"
              onClick={goToNextPage}
            >
              Next ➡
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mt-20 mx-auto p-2 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl shadow-2xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100/20 rounded-full p-3">
                <Star className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Listen and choose the right picture
                </h1>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200/20 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <div className="text-center mb-1">
            <div className="bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-2xl p-6 mb-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                {questions[currentQuestion].text}
              </h2>
              <button
                onClick={playQuestion}
                disabled={isPlaying || gameProps.gameEnded}
                className={`bg-blue-500/80 backdrop-blur-sm text-white px-6 py-3 rounded-2xl text-lg font-bold flex items-center mx-auto border border-white/20 ${
                  isPlaying
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600/80 transform hover:scale-105"
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
                onClick={() => handleAnswerClick(index, gameProps)}
                disabled={gameProps.gameEnded}
                className={`border-4 rounded-2xl p-2 transition-all duration-300 transform hover:scale-105 shadow-lg w-full h-40 flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm ${
                  showResult && selectedAnswer === index
                    ? index === questions[currentQuestion].correctAnswer
                      ? "border-green-400 bg-green-50/20"
                      : "border-red-400 bg-red-50/20"
                    : "border-gray-200/30 hover:border-purple-400 hover:bg-purple-50/20"
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
        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => window.location.href = '/dailywarmup'}
          >
            ⬅ Previous
          </button>
          <button
            className={`py-2 px-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              gameComplete ? 'bg-red-500/80 hover:bg-red-600/80 text-white' : 'bg-gray-400/50 cursor-not-allowed text-gray-300'
            }`}
            onClick={() => !gameComplete || goToNextPage()}
            disabled={!gameComplete}
          >
            Next ➡
          </button>
        </div>
      </div>
    );
  };

  return (
    <GameWrapper
      gameName="Listen & Choose"
      maxTime={180} // 3 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        setTimeout(() => {
          navigate('/daily3');
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

export default DailyRoutineQuiz;