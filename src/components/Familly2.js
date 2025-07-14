"use client"

import { useState, useEffect } from "react"
import Confetti from "react-confetti"
import brother from "../Assets/brotherquizz.jpg"
import sister from "../Assets/sisterquizz.jpg"
import mother from "../Assets/motherquizz.jpg"
import father from "../Assets/fatherquizz.jpg"
import grandfather from "../Assets/grandpaquizz.jpg"
import grandmother from "../Assets/grandmaquizz.jpg"
import GameWrapper from "./GameSystem"

const FamilyMemberQuiz = () => {
  const questions = [
    {
      question: "Who is the father's father?",
      options: ["Mother", "Grandfather", "Sister", "Brother"],
      answer: "Grandfather",
      image: grandfather,
    },
    {
      question: "Who is the mother's mother?",
      options: ["Grandfather", "Grandmother", "Brother", "Sister"],
      answer: "Grandmother",
      image: grandmother,
    },
    {
      question: "Who is your father's brother?",
      options: ["Brother", "Mother", "Sister", "Grandfather"],
      answer: "Brother",
      image: brother,
    },
    {
      question: "Who is your father's daughter?",
      options: ["Father", "Mother", "Grandfather", "Grandmother"],
      answer: "Father",
      image: father,
    },
    {
      question: "Who is your mother's sister?",
      options: ["Sister", "Mother", "Aunt", "Grandmother"],
      answer: "Mother",
      image: mother,
    },
    {
      question: "Who is your mother's son?",
      options: ["Sister", "Mother", "Grandfather", "Brother"],
      answer: "Sister",
      image: sister,
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null)

  // Local game state management (same pattern as other games)
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3)
  const [finalTime, setFinalTime] = useState(180)

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

  const handleAnswerClick = (choice, gameProps) => {
    if (localGameEnded) return

    setSelectedAnswer(choice)

    if (choice === questions[currentQuestion].answer) {
      gameProps.addPoints(15)
      setFeedbackMessage("Correct! Great job!")
      setIsAnswerCorrect(true)

      if (currentQuestion + 1 === questions.length) {
        // All questions answered correctly - ACTUAL WIN
        setPlayerActuallyWon(true)
        setFinalScore(gameProps.score + 15)
        setFinalHearts(gameProps.hearts)
        setFinalTime(gameProps.timeLeft)
        setLocalGameEnded(true)
        // DON'T call gameProps.gameComplete()
      } else {
        // Move to next question after a short delay
        setTimeout(() => {
          setFeedbackMessage("")
          setSelectedAnswer(null)
          setIsAnswerCorrect(null)
          setCurrentQuestion(currentQuestion + 1)
        }, 1000)
      }
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
      }
      setFeedbackMessage("Oops! Try again.")
      setIsAnswerCorrect(false)

      // Reset selectedAnswer and feedback after a short delay to allow re-attempt
      setTimeout(() => {
        setFeedbackMessage("")
        setSelectedAnswer(null)
        setIsAnswerCorrect(null)
      }, 1000)
    }
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

    if (localGameEnded) {
      // Show our own end screen
      return (
        <div className="flex flex-col -mt-20 items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
          {playerActuallyWon && <Confetti width={window.innerWidth} height={window.innerHeight - 50} />}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md w-full z-10 border border-white/20 text-center">
            {playerActuallyWon ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-3xl font-bold mb-4 text-green-400">Congratulations! 🎉🎉</p>
                <p className="text-lg mb-6 text-white">You completed the quiz!</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😢</div>
                <p className="text-3xl font-bold mb-4 text-red-400">Oops! Try Again! 😔</p>
                <p className="text-lg mb-6 text-white">You ran out of time or hearts.</p>
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
            {playerActuallyWon ? (
              <button
                className="py-3 px-6 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-blue-600/80 border border-white/20"
                onClick={() => (window.location.href = "/familly3")}
              >
                Next ➡
              </button>
            ) : (
              <button
                className="py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            )}
          </div>
        </div>
      )
    }

    // Game content when not ended
    return (
      <div className="flex -mt-20 flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-xl max-w-lg w-full mx-4 text-center border border-white/20">
          <h1 className="text-3xl font-bold mb-2 -mt-6 text-black">Guess the family member!</h1>
          <div className="w-full text-center">
            <img
              src={questions[currentQuestion].image || "/placeholder.svg"}
              alt="Family Member"
              className="w-40 h-40 object-contain mx-auto mb-4 border-4 border-blue-300 rounded-full"
            />
            <p className="text-xl font-semibold mb-6 text-white">{questions[currentQuestion].question}</p>
            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(option, gameProps)}
                  disabled={selectedAnswer !== null || localGameEnded}
                  className={`py-3 px-5 rounded-xl text-lg font-medium transition-all shadow-md hover:shadow-lg ${
                    selectedAnswer === option
                      ? isAnswerCorrect === false
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                      : "bg-yellow-400 hover:bg-yellow-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedbackMessage && (
              <p className={`mt-4 text-lg font-semibold ${isAnswerCorrect ? "text-green-400" : "text-red-400"}`}>
                {feedbackMessage}
              </p>
            )}
          </div>
        </div>
        <div className="w-full fixed bottom-4 left-0 flex justify-between px-6">
          <button
            className="py-3 px-6 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => (window.location.href = "/famillywarmup")}
          >
            ⬅ Previous
          </button>
          <button
            className={`py-3 px-6 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              localGameEnded && playerActuallyWon
                ? "bg-red-500/80 hover:bg-red-600/80 text-white"
                : "bg-gray-400/50 cursor-not-allowed text-gray-300"
            }`}
            onClick={() => localGameEnded && playerActuallyWon && (window.location.href = "/familly3")}
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
      gameName="Who Am I?"
      maxTime={180} // 3 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log("Game completed!", result)
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

export default FamilyMemberQuiz
