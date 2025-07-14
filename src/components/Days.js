"use client"
import { useState, useEffect } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useNavigate } from "react-router-dom" // Reverted to react-router-dom
import caterpillarImage from "../Assets/days.jpg" // Reverted to original path
import Confetti from "react-confetti"
import GameWrapper from "./GameSystem" // Reverted to original relative path

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const DraggableDay = ({ day }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "day",
    item: { day },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  return (
    <div
      ref={drag}
      className={`p-3 rounded-full text-center bg-blue-400 text-black shadow-md cursor-pointer transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {day}
    </div>
  )
}

const DropZone = ({ day, correctDay, onDrop, style }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "day",
    drop: (item) => onDrop(item.day, correctDay),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))
  const isPlaced = !!day
  return (
    <div
      ref={drop}
      className={`absolute w-28 h-28 rounded-full flex items-center justify-center border-4 border-green-300 ${
        isOver && canDrop ? "bg-gray-200" : ""
      }`}
      style={{
        ...style,
        backgroundColor: isPlaced ? "green" : "transparent",
        color: isPlaced ? "white" : "black",
      }}
    >
      {day}
    </div>
  )
}

const DaysOfWeekGame = () => {
  const [placements, setPlacements] = useState({})
  const [availableDays, setAvailableDays] = useState(shuffleArray(days))
  const navigate = useNavigate() // Reverted to useNavigate

  // Local game state management
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3)
  const [finalTime, setFinalTime] = useState(240)

  // NEW: Local heart counter for precise control
  const MAX_HEARTS = 3 // Define max hearts here
  const [currentLocalHearts, setCurrentLocalHearts] = useState(MAX_HEARTS)

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

  const handleDrop = (draggedDay, targetDay, gameProps) => {
    // Prevent interaction if game has ended or no local hearts left
    if (localGameEnded || currentLocalHearts <= 0) return

    if (draggedDay === targetDay) {
      setPlacements((prev) => ({
        ...prev,
        [targetDay]: true,
      }))
      setAvailableDays((prev) => prev.filter((day) => day !== draggedDay))
      gameProps.addPoints(15) // Award points for correct placement

      // Check for win condition immediately after a correct placement
      // Use a temporary object to check the state *after* the current placement
      const nextPlacements = { ...placements, [targetDay]: true }
      if (Object.keys(nextPlacements).length === days.length) {
        // All days placed - ACTUAL WIN!
        setPlayerActuallyWon(true)
        setFinalScore(gameProps.score + 15) // Include the last points
        setFinalHearts(currentLocalHearts) // Use local hearts for final display
        setFinalTime(gameProps.timeLeft)
        setLocalGameEnded(true)
        // DON'T call gameProps.gameComplete()
      }
    } else {
      // Wrong placement - decrement local hearts
      setCurrentLocalHearts((prevHearts) => {
        const newHearts = prevHearts - 1
        // Also call GameWrapper's loseHeart to keep its state somewhat in sync (optional)
        gameProps.loseHeart()
        if (newHearts <= 0) {
          // Game over due to hearts - ACTUAL LOSS
          setPlayerActuallyWon(false)
          setFinalScore(gameProps.score)
          setFinalHearts(0) // Explicitly set to 0 for display
          setFinalTime(gameProps.timeLeft)
          setLocalGameEnded(true)
        }
        return newHearts
      })
    }
  }

  const GameContent = (gameProps) => {
    // Check if time ran out
    useEffect(() => {
      if (gameProps.timeLeft === 0 && !localGameEnded) {
        // Time ran out - ACTUAL LOSS
        setPlayerActuallyWon(false)
        setFinalScore(gameProps.score)
        setFinalHearts(currentLocalHearts) // Use local hearts for final display
        setFinalTime(0)
        setLocalGameEnded(true)
      }
    }, [gameProps.timeLeft, localGameEnded, gameProps.score, currentLocalHearts])

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
                <p className="text-lg mb-6 text-white">You placed all the days correctly!</p>
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
  <div className="flex flex-wrap justify-center gap-4 mt-6">
    <button
      onClick={() => navigate("/dayswarmup")}
      className="py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-bold transition-transform hover:scale-105"
    >
      ⬅ Previous
    </button>
    <button
      onClick={() => navigate("/days3")}
      className="py-3 px-6 bg-green-500/80 hover:bg-green-700/80 text-white rounded-xl font-bold transition-transform hover:scale-105"
    >
      Next ➡
    </button>
  </div>
) : (
  <div className="flex flex-wrap justify-center gap-4 mt-6">
    <button
      className="py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
      onClick={() => window.location.reload()}
    >
      🔄 Play Again
    </button>
    <button
      onClick={() => navigate("/")}
      className="py-3 px-6 bg-gray-300 hover:bg-gray-400 text-black rounded-xl font-bold transition-transform hover:scale-105"
    >
      🏠 Home
    </button>
  </div>
)}

          </div>
        </div>
      )
    }

    // Game content when not ended
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col items-center p-4 mt-6 relative">
          <div className="relative w-[768px] h-[532px] mb-6 items-center cursor-pointer">
            <div
              className="relative w-full h-full -mt-16"
              style={{
                backgroundImage: `url(${caterpillarImage || "/placeholder.svg"})`, // Reverted to original usage
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "700px",
              }}
            >
              <DropZone
                correctDay="Sunday"
                day={placements["Sunday"] ? "Sunday" : ""}
                onDrop={(draggedDay, targetDay) => handleDrop(draggedDay, targetDay, gameProps)}
                style={{ top: "38%", left: "11%" }}
              />
              <DropZone
                correctDay="Monday"
                day={placements["Monday"] ? "Monday" : ""}
                onDrop={(draggedDay, targetDay) => handleDrop(draggedDay, targetDay, gameProps)}
                style={{ top: "13%", left: "20%" }}
              />
              <DropZone
                correctDay="Tuesday"
                day={placements["Tuesday"] ? "Tuesday" : ""}
                onDrop={(draggedDay, targetDay) => handleDrop(draggedDay, targetDay, gameProps)}
                style={{ top: "8%", left: "41%" }}
              />
              <DropZone
                correctDay="Wednesday"
                day={placements["Wednesday"] ? "Wednesday" : ""}
                onDrop={(draggedDay, targetDay) => handleDrop(draggedDay, targetDay, gameProps)}
                style={{ top: "12%", left: "60%" }}
              />
              <DropZone
                correctDay="Thursday"
                day={placements["Thursday"] ? "Thursday" : ""}
                onDrop={(draggedDay, targetDay) => handleDrop(draggedDay, targetDay, gameProps)}
                style={{ top: "26%", left: "76%" }}
              />
              <DropZone
                correctDay="Friday"
                day={placements["Friday"] ? "Friday" : ""}
                onDrop={(draggedDay, targetDay) => handleDrop(draggedDay, targetDay, gameProps)}
                style={{ top: "52%", left: "77%" }}
              />
              <DropZone
                correctDay="Saturday"
                day={placements["Saturday"] ? "Saturday" : ""}
                onDrop={(draggedDay, targetDay) => handleDrop(draggedDay, targetDay, gameProps)}
                style={{ top: "69%", left: "63%" }}
              />
            </div>
            <div className="flex font-bold justify-center gap-2 -mt-4">
              {availableDays.map((day) => (
                <DraggableDay key={day} day={day} />
              ))}
            </div>
          </div>
          {/* Previous Button: Always visible */}
          <div className="absolute left-0 bottom-0 ml-4 mb-16">
            <button
              onClick={() => navigate("/dayswarmup")} // Reverted to navigate
              className="bg-blue-500/80 backdrop-blur-sm text-white px-4 py-2 rounded hover:bg-blue-700/80 border border-white/20"
            >
              ⬅ Previous
            </button>
          </div>
          {/* Next Button: Enabled only on successful completion */}
        </div>
      </DndProvider>
    )
  }

  return (
    <GameWrapper
      gameName="Week Builder"
      maxTime={240} // 4 minutes
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

export default DaysOfWeekGame
