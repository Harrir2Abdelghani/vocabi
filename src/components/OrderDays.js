"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Confetti from "react-confetti"
import GameWrapper from "./GameSystem"

// Days of the week list
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const shuffle = (word) => word.split("").sort(() => Math.random() - 0.5)

const KidsDaysGame = () => {
  // Local game state management (same pattern as other games)
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3)
  const [finalTime, setFinalTime] = useState(300)

  // Game specific states
  const [remainingDays, setRemainingDays] = useState(daysOfWeek)
  const [currentDay, setCurrentDay] = useState("")
  const [shuffledLetters, setShuffledLetters] = useState([])
  const [userOrder, setUserOrder] = useState([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [popUpMessage, setPopUpMessage] = useState("")

  // Refs for container
  const containerRef = useRef(null)

  // Initialize game
  useEffect(() => {
    setRandomDay()
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
      document.body.style.overflow = "hidden"
      return () => {
        clearInterval(interval)
        document.body.style.overflow = ""
      }
    } else {
      document.body.style.overflow = ""
    }
  }, [localGameEnded])

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const setRandomDay = () => {
    if (remainingDays.length === 0) return
    const day = remainingDays[Math.floor(Math.random() * remainingDays.length)]
    setCurrentDay(day)
    setShuffledLetters(shuffle(day))
    setUserOrder(new Array(day.length).fill(""))
  }

  const handleDropZone = (e, index, gameProps) => {
    if (localGameEnded) return

    e.preventDefault()
    const letter = e.dataTransfer.getData("text/plain")

    // If the letter matches the correct index in currentDay
    if (letter === currentDay[index]) {
      const newOrder = [...userOrder]
      newOrder[index] = letter
      setUserOrder(newOrder)

      // Check if the word is completed
      if (newOrder.join("") === currentDay) {
        setIsCorrect(true)
        gameProps.addPoints(10) // Use GameWrapper's scoring system

        const newRemainingDays = remainingDays.filter((d) => d !== currentDay)
        setRemainingDays(newRemainingDays)

        // Check if all days completed
        if (newRemainingDays.length === 0) {
          // All days completed - ACTUAL WIN
          setPlayerActuallyWon(true)
          setFinalScore(gameProps.score + 10) // Include current points
          setFinalHearts(gameProps.hearts)
          setFinalTime(gameProps.timeLeft)
          setLocalGameEnded(true)
        } else {
          setTimeout(() => {
            setIsCorrect(false)
            setRandomDay()
          }, 2000)
        }
      }
    } else {
      // Wrong placement - lose a heart
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
      setPopUpMessage("Oops! Wrong placement! Try again.")
      setTimeout(() => {
        setPopUpMessage("")
      }, 2000)
    }
  }

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData("text/plain", letter)
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
          {playerActuallyWon && <Confetti width={window.innerWidth} height={window.innerHeight} />}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center">
            <div className="text-6xl mb-4">{playerActuallyWon ? "🎉" : "😢"}</div>
            <h3 className="text-2xl font-black text-white mb-4">
              {playerActuallyWon ? "Congratulations!" : "Oops! Try Again!"}
            </h3>
            {playerActuallyWon ? (
              <p className="text-white text-lg mb-6">You found all the matches!</p>
            ) : (
              <p className="text-white text-lg mb-6"></p>
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
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Play Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={containerRef}
        className="min-h-screen -mt-20 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"
      >
        <div className="w-full py-6 text-center bg-transparent -mt-10">
          <h1 className="text-4xl font-extrabold text-white">
            Can you fix the mixed-up letters? Find the day of the week!
          </h1>
        </div>

        {remainingDays.length > 0 && currentDay && (
          <div className="flex flex-col items-center space-y-4 mt-6">
            <motion.div className="flex space-x-2">
              {shuffledLetters.map((letter, idx) => (
                <motion.div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter)}
                  className="bg-cyan-800 text-xl font-bold p-4 rounded-lg shadow-md cursor-pointer text-white hover:bg-yellow-400 transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ pointerEvents: localGameEnded ? "none" : "auto" }}
                >
                  {letter}
                </motion.div>
              ))}
            </motion.div>
            <div className="flex space-x-2">
              {Array(currentDay.length)
                .fill("")
                .map((_, idx) => (
                  <motion.div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropZone(e, idx, gameProps)}
                    className={`w-14 h-14 border-2 border-dashed rounded-lg flex items-center justify-center text-xl font-bold ${
                      userOrder[idx] ? "bg-green-700 text-white" : "bg-white text-gray-800"
                    } transition-colors duration-300`}
                  >
                    {userOrder[idx]}
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-green-500 text-white rounded-lg duration-1000"
          >
            🎉 Correct! Keep Going!
          </motion.div>
        )}

        {popUpMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg z-50"
          >
            {popUpMessage}
          </motion.div>
        )}

        <div className="w-full fixed bottom-4 left-0 flex justify-start px-4 z-50">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => (window.location.href = "/days2")}
          >
            ⬅ Previous
          </button>
        </div>
      </div>
    )
  }

  return (
    <GameWrapper
      gameName="Letter Puzzle"
      maxTime={300} // 5 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log("Game completed!", result)
        setTimeout(() => {
          window.location.href = "/"
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

export default KidsDaysGame
