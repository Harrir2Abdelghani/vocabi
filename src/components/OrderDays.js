"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import GameWrapper from "./GameSystem"
import { useUserProfile } from "./UserProfileContext" // Import the user profile context

// Days of the week list
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const shuffle = (word) => word.split("").sort(() => Math.random() - 0.5)

const KidsDaysGame = () => {
  // Access user profile and update functions from context
  const { userProfile, addPoints: updateUserPoints, completeGame: updateGamesCompleted } = useUserProfile()

  // KidsDaysGame's own game state management (hearts and time remain local)
  const [hearts, setHearts] = useState(3)
  const [timeLeft, setTimeLeft] = useState(300)
  const [gameStarted, setGameStarted] = useState(false)
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)

  // Final stats for display on the end screen (score will come from userProfile)
  const [finalScoreDisplay, setFinalScoreDisplay] = useState(0)
  const [finalHeartsDisplay, setFinalHeartsDisplay] = useState(0)
  const [finalTimeDisplay, setFinalTimeDisplay] = useState(0)

  // Game specific states
  const [remainingDays, setRemainingDays] = useState(daysOfWeek)
  const [currentDay, setCurrentDay] = useState("")
  const [shuffledLetters, setShuffledLetters] = useState([])
  const [userOrder, setUserOrder] = useState([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [popUpMessage, setPopUpMessage] = useState("")

  // Refs for container (to position the emoji) and for buttons.
  const containerRef = useRef(null)

  // Timer effect for KidsDaysGame's own timer
  useEffect(() => {
    // Start the game immediately when component mounts
    if (!gameStarted) {
      setGameStarted(true)
      setRandomDay()
    }

    if (gameStarted && !localGameEnded && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setFinalTimeDisplay(0) // Set final time to 0 when time runs out
            handleGameFail("Time up!") // Call KidsDaysGame's own fail handler
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, localGameEnded, timeLeft])

  // Effect to hide GameWrapper's modal and manage body overflow
  useEffect(() => {
    if (localGameEnded) {
      // Hide GameWrapper's modal (just in case it tries to show up)
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

      // Prevent body scrolling
      document.body.style.overflow = "hidden"

      return () => {
        clearInterval(interval)
        document.body.style.overflow = "" // Reset body overflow on unmount
      }
    } else {
      document.body.style.overflow = "" // Ensure body overflow is reset if game restarts
    }
  }, [localGameEnded])

  // Effect to set a new random day or end game when remainingDays changes
  useEffect(() => {
    if (gameStarted && !localGameEnded) {
      if (remainingDays.length === 0) {
        // All days completed - ACTUAL WIN!
        handleGameComplete()
      } else {
        setRandomDay()
      }
    }
  }, [remainingDays, gameStarted, localGameEnded]) // Added dependencies

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // KidsDaysGame's own game logic functions
  const loseHeart = () => {
    if (hearts > 1) {
      setHearts((prev) => prev - 1)
      return true // Game continues
    } else {
      // Game over due to hearts - ACTUAL LOSS
      setFinalHeartsDisplay(0) // Explicitly set final hearts to 0
      handleGameFail("No hearts left!") // Call KidsDaysGame's own fail handler
      return false // Game ends
    }
  }

  // This function now calls the context's addPoints
  const addPoints = (points) => {
    if (updateUserPoints) {
      // Check if the function exists
      updateUserPoints(points)
    }
  }

  const handleGameComplete = () => {
    if (localGameEnded) return // Prevent multiple calls
    setPlayerActuallyWon(true)
    setFinalScoreDisplay(userProfile ? userProfile.score : 0) // Use score from context for final display
    setFinalHeartsDisplay(hearts) // Capture current hearts
    setFinalTimeDisplay(timeLeft) // Capture current time
    setLocalGameEnded(true)
    if (updateGamesCompleted) {
      // Check if the function exists
      updateGamesCompleted() // Mark game as completed in context
    }
  }

  const handleGameFail = (reason) => {
    if (localGameEnded) return // Prevent multiple calls
    setPlayerActuallyWon(false)
    setFinalScoreDisplay(userProfile ? userProfile.score : 0) // Capture current score from context
    // finalHeartsDisplay and finalTimeDisplay are set at the point of failure (loseHeart or timer useEffect)
    setLocalGameEnded(true)
  }

  const setRandomDay = () => {
    const day = remainingDays[Math.floor(Math.random() * remainingDays.length)]
    setCurrentDay(day)
    setShuffledLetters(shuffle(day))
    setUserOrder(new Array(day.length).fill(""))
  }

  const handleDropZone = (e, index) => {
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
        addPoints(10) // Award 10 points for completing a word via context (CHANGED FROM 20 TO 10)
        setRemainingDays((prev) => prev.filter((d) => d !== currentDay))
        setTimeout(() => {
          setIsCorrect(false)
        }, 2000)
      }
    } else {
      // Wrong placement - lose a heart
      loseHeart()
      setPopUpMessage("Oops! Wrong placement! Try again.")
      setTimeout(() => {
        setPopUpMessage("")
      }, 2000)
    }
  }

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData("text/plain", letter)
  }

  const GameContent = () => {
    if (localGameEnded) {
      return null // Let the overlay handle the end screen
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
          <div className="text-center text-white text-2xl font-bold mb-4">
            Score: {userProfile ? userProfile.score : 0}
          </div>
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
                  // Disable dragging if game ended
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
                    onDrop={(e) => handleDropZone(e, idx)}
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
        {/* Pop-Up Message */}
        {popUpMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="afixed bottom-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg z-50"
          >
            {popUpMessage}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: "relative" }}>
      {/* GameWrapper now only provides the HUD and acts as a container */}
      <GameWrapper
        gameName="Letter Puzzle"
        maxTime={timeLeft} // Pass KidsDaysGame's time
        maxHearts={hearts} // Pass KidsDaysGame's hearts
        score={userProfile ? userProfile.score : 0} // Pass score from userProfile context
        gameStarted={gameStarted} // Pass KidsDaysGame's gameStarted
        gameEnded={localGameEnded} // Pass KidsDaysGame's localGameEnded
        // IMPORTANT: These callbacks are now empty or just log, as KidsDaysGame manages its own end state
        onGameComplete={(result) => {
          console.log("GameWrapper completed its game logic:", result)
        }}
        onGameFail={(result) => {
          console.log("GameWrapper failed its game logic:", result)
        }}
      >
        <GameContent />
      </GameWrapper>

      {/* OUR CUSTOM END SCREEN - THIS IS THE ONLY ONE THAT SHOULD SHOW */}
      <AnimatePresence>
        {localGameEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
            style={{ zIndex: 99999 }} // Higher than GameWrapper's modal
          >
            {playerActuallyWon && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center"
            >
              <motion.div
                animate={{ rotate: playerActuallyWon ? [0, 360] : 0 }}
                transition={{ duration: 2, repeat: playerActuallyWon ? Number.POSITIVE_INFINITY : 0 }}
                className="text-6xl mb-4"
              >
                {playerActuallyWon ? "🎉" : "😢"}
              </motion.div>
              <h3 className="text-2xl font-black text-white mb-4">
                {playerActuallyWon ? "Congratulations!" : "Oops! Try Again!"}
              </h3>
              {playerActuallyWon ? (
                <p className="text-white text-lg mb-6">You found all the matches!</p>
              ) : (
                <p className="text-white text-lg mb-6">You ran out of time or hearts.</p>
              )}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-white">
                  <span>Final Score:</span>
                  <span className="font-bold">{finalScoreDisplay}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Hearts Left:</span>
                  <span className="font-bold">{finalHeartsDisplay}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Time Left:</span>
                  <span className="font-bold">{formatTime(finalTimeDisplay)}</span>
                </div>
              </div>
              <div className="flex space-x-3 justify-center">
                {" "}
                {/* Centered buttons */}
                {/* Play Again button always present on end screen */}
                <motion.button
                  onClick={() => window.location.reload()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
                <motion.button
                  onClick={() => (window.location.href = "/")}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Home
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons - only "Previous" remains */}
      <div className="w-full fixed bottom-4 left-0 flex justify-start px-4 z-50">
        {" "}
        {/* Changed to justify-start */}
        <button
          className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
          onClick={() => (window.location.href = "/days2")}
        >
          ⬅ Previous
        </button>
        {/* Removed the "Next" button entirely */}
      </div>
    </div>
  )
}

export default KidsDaysGame
