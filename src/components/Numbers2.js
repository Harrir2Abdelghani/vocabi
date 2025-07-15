"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import GameWrapper from "./GameSystem"

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5)
}

const NumberMatchQuiz = () => {
  const quizData = [
    { question: "Twenty Seven", answer: 27, options: [27, 13, 72, 20] },
    { question: "Sixty", answer: 60, options: [60, 22, 6, 16] },
    { question: "Eighty Eight", answer: 88, options: [88, 54, 80, 18] },
    { question: "Eleven", answer: 11, options: [11, 100, 12, 47] },
    { question: "Thirty Four", answer: 34, options: [34, 56, 30, 43] },
    { question: "Nine", answer: 9, options: [9, 66, 19, 90] },
  ]

  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [popupColor, setPopupColor] = useState("")
  const [shuffledOptions, setShuffledOptions] = useState([])

  // Local game state management (same pattern as family game)
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3)
  const [finalTime, setFinalTime] = useState(180)

  useEffect(() => {
    setShuffledOptions(quizData.map((q) => shuffleArray(q.options)))
  }, [])

  // Hide GameWrapper's modal when our local game ends
  useEffect(() => {
    if (localGameEnded) {
      const hideGameWrapperModal = () => {
        const modals = document.querySelectorAll('[class*="fixed"][class*="inset-0"]')
        modals.forEach((modal) => {
          if (modal.textContent?.includes("Congratulations") || modal.textContent?.includes("Game Over")) {
            modal.style.display = "none"
          }
        })
      }
      hideGameWrapperModal()
      const interval = setInterval(hideGameWrapperModal, 100)
      return () => clearInterval(interval)
    }
  }, [localGameEnded])

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const correctCount = Object.keys(selectedAnswers).filter((key) => selectedAnswers[key].status === "correct").length

    if (correctCount === quizData.length && !localGameEnded) {
      // All questions answered correctly - ACTUAL WIN
      setPlayerActuallyWon(true)
      setLocalGameEnded(true)
    }
  }, [selectedAnswers, localGameEnded])

  const handleAnswer = (selectedAnswer, questionIndex, gameProps) => {
    if (localGameEnded) return

    const isAnswerCorrect = selectedAnswer === quizData[questionIndex].answer
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        choice: selectedAnswer,
        status: isAnswerCorrect ? "correct" : "incorrect",
      },
    }))

    if (isAnswerCorrect) {
      gameProps.addPoints(15) // Award points for correct answer
      setPopupMessage("🎉 Correct!")
      setPopupColor("bg-green-500")
    } else {
      // Wrong answer - lose a heart
      const canContinue = gameProps.loseHeart()
      if (!canContinue) {
        // ACTUAL LOSS - set local state
        setPlayerActuallyWon(false)
        setFinalScore(gameProps.score)
        setFinalHearts(0)
        setFinalTime(gameProps.timeLeft)
        setLocalGameEnded(true)
        return
      }
      setPopupMessage("❌ Oops! Try again!")
      setPopupColor("bg-red-500")
    }

    setShowPopup(true)
    setTimeout(() => {
      setShowPopup(false)
    }, 2000)
  }

  const GameContent = (gameProps) => {
    // Check if time ran out
    useEffect(() => {
      if (gameProps.timeLeft === 0 && !localGameEnded) {
        // Time ran out - ACTUAL LOSS
        setPlayerActuallyWon(false)
        setFinalScore(gameProps.score)
        setFinalHearts(gameProps.hearts)
        setFinalTime(0)
        setLocalGameEnded(true)
      }
    }, [gameProps.timeLeft])

    // Update final scores when game ends successfully
    useEffect(() => {
      if (localGameEnded && playerActuallyWon) {
        setFinalScore(gameProps.score)
        setFinalHearts(gameProps.hearts)
        setFinalTime(gameProps.timeLeft)
      }
    }, [localGameEnded, playerActuallyWon, gameProps.score, gameProps.hearts, gameProps.timeLeft])

    if (localGameEnded) {
      // Show our own end screen
      return (
        <div className="min-h-screen -mt-20 bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4 relative">
          {playerActuallyWon && <Confetti width={window.innerWidth} height={window.innerHeight} />}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md w-full z-10 border border-white/20 text-center">
            {playerActuallyWon ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-3xl font-bold mb-4 text-green-400">🎉 Congratulations!</p>
                <p className="text-lg mb-6 text-white">You got all answers correct!</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😢</div>
                <p className="text-3xl font-bold mb-4 text-red-400">Oops! Try Again! 😔</p>
              </>
            )}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-white">
                <span>Final Score:</span>
                <span className="font-bold">{finalScore}</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span>Time Left:</span>
                <span className="font-bold">{formatTime(finalTime)}</span>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <button
                className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
                onClick={() => (window.location.href = "/numberswarmup")}
              >
                Home
              </button>
              {playerActuallyWon ? (
                <button
                  className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
                  onClick={() => (window.location.href = "/numbers3")}
                >
                  Next ➡
                </button>
              ) : (
                <button
                  className="py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                  onClick={() => window.location.reload()}
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen -mt-20 bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4 relative">
        <h1 className="text-4xl font-bold text-white mb-6">Choose the right number</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizData.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg text-center space-y-4 border border-white/20"
            >
              <h2 className="text-2xl font-semibold text-white">{`Find number: ${question.question}`}</h2>
              <div className="flex justify-center gap-4">
                {shuffledOptions[questionIndex]?.map((option) => {
                  const selected = selectedAnswers[questionIndex]?.choice === option
                  const isCorrect = selectedAnswers[questionIndex]?.status === "correct"
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option, questionIndex, gameProps)}
                      disabled={isCorrect || localGameEnded}
                      className={`w-16 h-16 text-2xl font-bold text-white rounded-full shadow-lg transition-all transform hover:scale-110
                        ${selected ? (isCorrect ? "bg-green-400" : "bg-red-400") : "bg-yellow-400"}`}
                    >
                      {option}
                    </button>
                  )
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

        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => (window.location.href = "/numberswarmup")}
          >
            ⬅ Previous
          </button>
          <button
            className={`py-2 px-4 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              localGameEnded && playerActuallyWon
                ? "bg-red-500/80 hover:bg-red-600/80"
                : "bg-gray-400/50 cursor-not-allowed"
            }`}
            onClick={() => localGameEnded && playerActuallyWon && (window.location.href = "/numbers3")}
            disabled={!localGameEnded || !playerActuallyWon}
          >
            Next ➡
          </button>
        </div>
      </div>
    )
  }

  return (
    <GameWrapper
      gameName="Number Quiz"
      maxTime={180} // 3 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log("Game completed!", result)
        setTimeout(() => {
          window.location.href = "/numbers3"
        }, 3000)
      }}
      onGameFail={(result) => {
        console.log("Game failed!", result)
        if (!localGameEnded) {
          setPlayerActuallyWon(false)
          setFinalScore(result.score || 0)
          setFinalHearts(result.hearts || 0)
          setFinalTime(result.timeLeft || 0)
          setLocalGameEnded(true)
        }
      }}
    >
      <GameContent />
    </GameWrapper>
  )
}

export default NumberMatchQuiz
