"use client"

import { useState, useRef, useEffect } from "react"
import Confetti from "react-confetti"
import { motion, AnimatePresence } from "framer-motion"
import GameWrapper from "./GameSystem"

const DayGame = () => {
  // List of days with associated Tailwind color classes
  const daysData = [
    { name: "Monday", color: "bg-red-500" },
    { name: "Tuesday", color: "bg-blue-500" },
    { name: "Wednesday", color: "bg-green-500" },
    { name: "Thursday", color: "bg-yellow-500" },
    { name: "Friday", color: "bg-purple-500" },
    { name: "Saturday", color: "bg-pink-500" },
    { name: "Sunday", color: "bg-indigo-500" },
  ]

  // State for available days, target day, and emoji animations
  const [availableDays, setAvailableDays] = useState(daysData)
  const getRandomDay = (daysList) => daysList[Math.floor(Math.random() * daysList.length)]
  const [targetDay, setTargetDay] = useState(getRandomDay(daysData))
  const [emojiAnimations, setEmojiAnimations] = useState([])

  // Local game state management
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3)
  const [finalTime, setFinalTime] = useState(180)

  // Refs for container (to position the emoji) and for buttons.
  const containerRef = useRef(null)
  const buttonRefs = useRef({})

  // Hide GameWrapper's modal when our local game ends
  useEffect(() => {
    if (localGameEnded) {
      // Find and hide the GameWrapper's modal
      const hideGameWrapperModal = () => {
        const modals = document.querySelectorAll('[class*="fixed"][class*="inset-0"]')
        modals.forEach((modal) => {
          if (modal.textContent?.includes("Congratulations") || modal.textContent?.includes("Game Over")) {
            modal.style.display = "none"
          }
        })
      }

      // Hide immediately and keep checking
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

  // When a day button is clicked...
  const handleDayClick = (day, gameProps) => {
    if (!containerRef.current || localGameEnded) return

    const buttonEl = buttonRefs.current[day.name]
    if (buttonEl) {
      // Get the bounding rectangles of the container and button.
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = buttonEl.getBoundingClientRect()
      // Calculate the center of the button.
      const centerX = (buttonRect.left + buttonRect.right) / 2
      const centerY = (buttonRect.top + buttonRect.bottom) / 2
      // Compute coordinates relative to the container.
      const relativeX = centerX - containerRect.left
      const relativeY = centerY - containerRect.top
      // Determine the emoji type: "success" for correct (✅) and "error" for wrong (❌)
      const isCorrect = day.name === targetDay.name
      const animType = isCorrect ? "success" : "error"
      const newAnim = {
        id: day.name + "-" + Date.now(),
        type: animType,
        x: relativeX,
        y: relativeY,
      }
      // Add the emoji animation.
      setEmojiAnimations((prev) => [...prev, newAnim])
      // Remove the emoji after 2 seconds.
      setTimeout(() => {
        setEmojiAnimations((prev) => prev.filter((anim) => anim.id !== newAnim.id))
      }, 2000)
    }

    // Game logic: if correct answer, update score and remove the day.
    if (day.name === targetDay.name) {
      gameProps.addPoints(10)
      const newDays = availableDays.filter((d) => d.name !== day.name)
      setAvailableDays(newDays)

      // Update the target day after 2 seconds (to allow the emoji animation)
      setTimeout(() => {
        if (newDays.length > 0) {
          setTargetDay(getRandomDay(newDays))
        } else {
          // All days found - ACTUAL WIN!
          setPlayerActuallyWon(true)
          setFinalScore(gameProps.score + 10) // Include the last 10 points
          setFinalHearts(gameProps.hearts)
          setFinalTime(gameProps.timeLeft)
          setLocalGameEnded(true)
          // DON'T call gameComplete to prevent GameWrapper from ending
          // gameProps.gameComplete()
        }
      }, 2000)
    } else {
      // Wrong answer - lose a heart
      const canContinue = gameProps.loseHeart()
      if (!canContinue) {
        // Game over due to hearts - ACTUAL LOSS
        setPlayerActuallyWon(false)
        setFinalScore(gameProps.score)
        setFinalHearts(0) // No hearts left
        setFinalTime(gameProps.timeLeft)
        setLocalGameEnded(true)
      }
    }
  }

  // Helper: add extra classes to the last button in a row.
  const getButtonExtraClasses = (index, total) => {
    let classes = ""
    const isLastItem = index === total - 1
    if (total % 1 === 1 && isLastItem) {
      classes += " col-span-2"
    }
    if (total % 3 === 1 && isLastItem) {
      classes += " sm:col-start-2"
    }
    return classes
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

    return (
      <div ref={containerRef} className="-mt-4 -mb-10 flex flex-col items-center justify-center p-4 relative">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md w-full z-10 border border-white/20">
          {availableDays.length > 0 && !localGameEnded ? (
            <>
              {/* Animated target day display */}
              <p className="text-xl text-center mb-6 text-white">
                <span>Find: </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={targetDay.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                    className="font-bold inline-block ml-2 text-yellow-300 text-2xl"
                  >
                    {targetDay.name}
                  </motion.span>
                </AnimatePresence>
              </p>
              {/* Grid of day buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {availableDays.map((day, index) => (
                  <motion.button
                    key={day.name}
                    ref={(el) => (buttonRefs.current[day.name] = el)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDayClick(day, gameProps)}
                    className={`${day.color} hover:opacity-90 text-white py-3 px-2 rounded-lg shadow-lg transition-all duration-300 font-bold${getButtonExtraClasses(
                      index,
                      availableDays.length,
                    )}`}
                    disabled={localGameEnded}
                  >
                    {day.name}
                  </motion.button>
                ))}
              </div>
            </>
          ) : localGameEnded && playerActuallyWon ? (
            // Show congratulations message when won
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold mb-4 text-green-400"
              >
                Congratulations! 🎉🎉
              </motion.p>
              <p className="text-white text-lg mb-6">You found all the matches!</p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-white">
                  <span>Final Score:</span>
                  <span className="font-bold">{finalScore}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Hearts Left:</span>
                  <span className="font-bold">{finalHearts}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Time Left:</span>
                  <span className="font-bold">{formatTime(finalTime)}</span>
                </div>
              </div>
            </div>
          ) : localGameEnded && !playerActuallyWon ? (
            // Show failure message when lost
            <div className="text-center">
              <motion.div className="text-6xl mb-4">😢</motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold mb-4 text-red-400"
              >
                Oops! Try Again! 😔
              </motion.p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-white">
                  <span>Final Score:</span>
                  <span className="font-bold">{finalScore}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Hearts Left:</span>
                  <span className="font-bold">{finalHearts}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Time Left:</span>
                  <span className="font-bold">{formatTime(finalTime)}</span>
                </div>
              </div>
              <button
                className="py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </div>
          ) : null}
        </div>
        {/* Animated emoji feedback overlay */}
        <AnimatePresence>
          {emojiAnimations.map((anim) => (
            <div
              key={anim.id}
              style={{
                position: "absolute",
                left: anim.x,
                top: anim.y,
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -50, scale: 1.5 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 2 }}
                className="text-3xl"
              >
                {anim.type === "success" ? "✅" : "❌"}
              </motion.div>
            </div>
          ))}
        </AnimatePresence>

        {/* Show confetti when won */}
        {localGameEnded && playerActuallyWon && <Confetti width={window.innerWidth} height={window.innerHeight} />}

        {/* Navigation buttons - always show */}
        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => (window.location.href = "/")}
          >
            ⬅ Previous
          </button>
          <button
            disabled={!localGameEnded || !playerActuallyWon}
            className={`py-2 px-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              !localGameEnded || !playerActuallyWon
                ? "bg-gray-400/50 cursor-not-allowed text-gray-300"
                : "bg-red-500/80 hover:bg-red-600/80 text-white"
            }`}
            onClick={() => localGameEnded && playerActuallyWon && (window.location.href = "/days2")}
          >
            ➡ Next
          </button>
        </div>
      </div>
    )
  }

  return (
    <GameWrapper
      gameName="Days Matcher"
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

export default DayGame
