"use client"

import { useState } from "react"
import Confetti from "react-confetti"
import backgroundImage from "../Assets/quizpic.jpg"
import { GameWrapper } from "./GameSystem"
import { RotateCcw } from "lucide-react"

const JobQuizGame = () => {
  const jobsQuiz = [
    {
      question: "I drive a bus!",
      options: ["Teacher", "Driver", "Chef", "Engineer"],
      answer: "Driver",
      image: "https://example.com/doctor-image.jpg",
    },
    {
      question: "I repair cars!",
      options: ["Artist", "Builder", "Pilot", "Mechanic"],
      answer: "Mechanic",
      image: "https://example.com/builder-image.jpg",
    },
    {
      question: "I cook delicious food!",
      options: ["Baker", "Chef", "Driver", "Writer"],
      answer: "Chef",
      image: "https://example.com/veterinarian-image.jpg",
    },
    {
      question: "I catch criminals!",
      options: ["Teacher", "Nurse", "Artist", "Policeman"],
      answer: "Policeman",
      image: "https://example.com/teacher-image.jpg",
    },
    {
      question: "I put out fires!",
      options: ["Pilot", "Firefighter", "Driver", "Baker"],
      answer: "Firefighter",
      image: "https://example.com/driver-image.jpg",
    },
    {
      question: "I help sick people!",
      options: ["Doctor", "Baker", "Pilot", "Chef"],
      answer: "Doctor",
      image: "https://example.com/baker-image.jpg",
    },
    {
      question: "I give homeworks!",
      options: ["Teacher", "Doctor", "Waiter", "Engineer"],
      answer: "Teacher",
      image: "https://example.com/doctor-image.jpg",
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [gameFinished, setGameFinished] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const handleQuizCompletion = () => {
    setGameFinished(true)
  }

  const handleAnswer = (answer, gameProps) => {
    if (answer === jobsQuiz[currentQuestion].answer) {
      gameProps.addPoints(15)
      setCorrectAnswers((prev) => prev + 1)
      setFeedback("Correct!")
      setTimeout(() => {
        if (currentQuestion < jobsQuiz.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
          setFeedback("")
        } else {
          setGameFinished(true)
          gameProps.gameComplete()
        }
      }, 1000)
    } else {
      const canContinue = gameProps.loseHeart()
      if (!canContinue) {
        return
      }
      setFeedback("Try again.")
    }
    setSelectedAnswer(answer)
  }

  const GameContent = (gameProps) => {
    if (gameFinished) {
      return (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          {gameFinished && <Confetti />}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-md text-center border border-white/20">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">Congratulations!</h1>
            <div className="text-center mb-4">
              <p className="text-xl font-bold text-black">You completed the quiz!</p>
            </div>
            <div className="space-y-3 mb-6">
              <p className="text-lg font-bold text-green-600">
                You got {correctAnswers} out of {jobsQuiz.length} correct!
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="py-3 px-6 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-blue-600/80 flex items-center justify-center mx-auto border border-white/20 transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Play Again
            </button>
          </div>
          <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
            <button
              className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
              onClick={() => (window.location.href = "/jobswarmup")}
            >
              ⬅ Previous
            </button>
            <button
              className={`py-2 px-4 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
                gameFinished ? "bg-red-500/80 hover:bg-red-600/80" : "bg-gray-400/50 cursor-not-allowed"
              }`}
              onClick={() => (window.location.href = "/jobs3")}
              disabled={!gameFinished}
            >
              Next ➡
            </button>
          </div>
        </div>
      )
    } else if (gameProps.gameEnded) {
      return (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-md text-center border border-white/20">
            <h1 className="text-3xl font-bold text-red-700 mb-4">Oops! Try Again! 😔</h1>
            <p className="text-xl font-bold text-black mb-4">You ran out of time or tries.</p>
            <p className="text-lg text-black mb-6">
              Score: {gameProps.score} | Hearts Left: {gameProps.hearts}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-3 px-6 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 flex items-center justify-center mx-auto border border-white/20 transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Play Again
            </button>
          </div>
          <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
            <button
              className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
              onClick={() => (window.location.href = "/jobswarmup")}
            >
              ⬅ Previous
            </button>
            <button
              className="py-2 px-4 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm bg-gray-400/50 cursor-not-allowed"
              disabled={true}
            >
              Next ➡
            </button>
          </div>
        </div>
      )
    }

    return (
      <div
        className="flex flex-col items-center justify-center h-screen bg-transparent"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
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
                  selectedAnswer === option
                    ? option === jobsQuiz[currentQuestion].answer
                      ? "bg-green-400"
                      : "bg-red-400"
                    : "bg-white hover:bg-gray-400"
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
            onClick={() => (window.location.href = "/jobswarmup")}
          >
            ⬅ Previous
          </button>
          <button
            className={`py-2 px-4 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              gameFinished ? "bg-red-500/80 hover:bg-red-600/80" : "bg-gray-400/50 cursor-not-allowed"
            }`}
            onClick={() => (window.location.href = "/jobs3")}
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
    )
  }

  return (
    <GameWrapper
      disableDefaultEndScreen={true}
      gameName="Career Quiz"
      maxTime={210} // 3.5 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log("Game completed!", result)
        // Removed setTimeout here to allow custom end screen to persist
      }}
      onGameFail={(result) => {
        console.log("Game failed!", result)
      }}
      questions={jobsQuiz}
      finalScore={correctAnswers}
      onQuizComplete={() => setGameFinished(true)}
    >
      <GameContent />
    </GameWrapper>
  )
}

export default JobQuizGame
