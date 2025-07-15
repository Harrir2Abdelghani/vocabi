"use client"

import { useState, useEffect } from "react"
import Confetti from "react-confetti"
import { useNavigate } from "react-router-dom"
import backgroundImg from "../Assets/numbers-bg.jpg"
import GameWrapper from "./GameSystem"

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
]

const numberWords = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]

const CountAndDragGame = () => {
  const [questionsPool, setQuestionsPool] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [draggedNumber, setDraggedNumber] = useState(null)
  const [dropText, setDropText] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [shuffledNumbers, setShuffledNumbers] = useState([])
  const navigate = useNavigate()

  // Local game state management (same pattern as family game)
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3)
  const [finalTime, setFinalTime] = useState(240)

  // Initialize the game
  useEffect(() => {
    initializeGame()
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

  const initializeGame = () => {
    const shapesCopy = [...shapes]

    const randomQuestions = Array.from({ length: 9 }, (_, i) => {
      const number = i + 1
      const randomIndex = Math.floor(Math.random() * shapesCopy.length)
      const selectedShape = shapesCopy[randomIndex]

      return {
        count: number,
        word: numberWords[number - 1],
        shape: selectedShape,
      }
    })

    setQuestionsPool(randomQuestions)
    setCurrentQuestion(randomQuestions[0])
    setShuffledNumbers([...numberWords].sort(() => Math.random() - 0.5))
  }

  const handleDragStart = (word) => {
    setDraggedNumber(word)
  }

  const handleDrop = (gameProps) => {
    if (localGameEnded) return

    if (draggedNumber === currentQuestion.word) {
      setDropText(`Correct: ${draggedNumber}`)
      setIsCorrect(true)
      gameProps.addPoints(10) // Award points for correct answer

      setTimeout(() => {
        setIsCorrect(false)
        setDropText("")
        moveToNextQuestion(gameProps)
        setShuffledNumbers([...numberWords].sort(() => Math.random() - 0.5))
      }, 2000)
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
      setDropText("❌ Try again!")
      setIsCorrect(false)
    }
  }

  const moveToNextQuestion = (gameProps) => {
    const remainingQuestions = questionsPool.slice(1)
    if (remainingQuestions.length === 0) {
      // All questions completed successfully - ACTUAL WIN
      setPlayerActuallyWon(true)
      setFinalScore(gameProps.score)
      setFinalHearts(gameProps.hearts)
      setFinalTime(gameProps.timeLeft)
      setLocalGameEnded(true)
    } else {
      setQuestionsPool(remainingQuestions)
      setCurrentQuestion(remainingQuestions[0])
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
        <div
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="flex flex-col -mt-20 items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-blue-200 p-4 relative"
        >
          {playerActuallyWon && <Confetti width={window.innerWidth} height={window.innerHeight} />}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md w-full z-10 border border-white/20 text-center">
            {playerActuallyWon ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-3xl font-bold mb-4 text-green-400">🎉 You did it! Great job! 🎉</p>
                <p className="text-lg mb-6 text-white">You completed all the numbers!</p>
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
                onClick={() => (window.location.href = "/")}
              >
                Home
              </button>
              {playerActuallyWon ? (
                <button
                  className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
                  onClick={() => (window.location.href = "/numbers2")}
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
      <div
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex flex-col items-center -mt-20 justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-blue-200 p-4 relative"
      >
        {!localGameEnded && currentQuestion && (
          <>
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold text-blue-800 mb-10 -mt-10 text-center">
                Drag the Correct Number to Match the Shapes!
              </h1>
            </div>
            {/* Shapes Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center mb-4 animate-bounce border-2 border-red-200 rounded-xl">
                {Array.from({ length: currentQuestion.count }).map((_, idx) => (
                  <span key={idx} className="text-5xl mx-1 my-2" style={{ animationDelay: `${idx * 0.1}s` }}>
                    {currentQuestion.shape.icon}
                  </span>
                ))}
              </div>
              <div
                onDrop={() => handleDrop(gameProps)}
                onDragOver={(e) => e.preventDefault()}
                className={`w-48 h-16 rounded-lg flex items-center justify-center border-2 transition ${
                  isCorrect ? "bg-green-300 border-green-500" : "bg-white border-dashed border-blue-400"
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

        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => (window.location.href = "/")}
          >
            ⬅ Previous
          </button>
          <button
            className={`py-2 px-4 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              localGameEnded && playerActuallyWon
                ? "bg-red-500/80 hover:bg-red-600/80"
                : "bg-gray-400/50 cursor-not-allowed"
            }`}
            onClick={() => localGameEnded && playerActuallyWon && (window.location.href = "/numbers2")}
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
      gameName="Count & Match"
      maxTime={240} // 4 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log("Game completed!", result)
        setTimeout(() => {
          navigate("/numbers2")
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

export default CountAndDragGame
