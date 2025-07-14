"use client"

import { useState, useEffect } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd" // These are external libraries
import { HTML5Backend } from "react-dnd-html5-backend" // These are external libraries

// Original image imports - these will now be used directly
import familyTreeBg from "../Assets/tree.jpeg"
import grandfatherImg from "../Assets/grandfather.jpg"
import grandmotherImg from "../Assets/grandmother.jpg"
import fatherImg from "../Assets/father.png"
import motherImg from "../Assets/mother.jpg"
import brotherImg from "../Assets/brother.png"
import sisterImg from "../Assets/sister.png"
import meImg from "../Assets/mee.png"
import babyImg from "../Assets/baby.jpg"
import GameWrapper from "./GameSystem" // Assuming GameSystem is in the same directory

// Family Members Data
const initialFamilyMembers = [
  { id: 1, name: "Grandfather", position: { top: "4%", left: "27%" } },
  { id: 2, name: "Grandmother", position: { top: "4%", left: "60%" } },
  { id: 3, name: "Father", position: { top: "18%", left: "35%" } },
  { id: 4, name: "Mother", position: { top: "18%", right: "33%" } },
  { id: 5, name: "Brother", position: { top: "27%", right: "16%" } },
  { id: 6, name: "Sister", position: { top: "27%", right: "70%" } },
  { id: 7, name: "Me", position: { bottom: "44%", left: "32%" } },
  { id: 8, name: "Baby", position: { bottom: "43%", right: "30%" } },
]

// Image Mapping - Directly using imported image paths
const familyImages = {
  Grandfather: grandfatherImg,
  Grandmother: grandmotherImg,
  Father: fatherImg,
  Mother: motherImg,
  Brother: brotherImg,
  Sister: sisterImg,
  Me: meImg,
  Baby: babyImg,
}

const DraggableItem = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "familyMember",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  return (
    <div
      ref={drag}
      className={`p-2 bg-cyan-500 text-white rounded-lg cursor-pointer transition-transform duration-200 ${
        isDragging ? "opacity-50 scale-110" : "opacity-100"
      }`}
    >
      {name}
    </div>
  )
}

const DropTarget = ({ familyMember, onDrop, isPlaced }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "familyMember",
    drop: (item) => onDrop(item, familyMember),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  return (
    <div
      ref={drop}
      className={`absolute w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
        isOver ? "bg-green-700 scale-110" : "bg-transparent"
      }`}
      style={{
        top: familyMember.position.top || "auto",
        left: familyMember.position.left || "auto",
        right: familyMember.position.right || "auto",
        bottom: familyMember.position.bottom || "auto",
      }}
    >
      {isPlaced ? (
        <img
          src={familyImages[familyMember.name] || "/placeholder.svg"}
          alt={familyMember.name}
          className="w-full h-full p-0 rounded-full object-cover"
        />
      ) : (
        <div className="w-16 h-16 bg-transparent rounded-full"></div>
      )}
    </div>
  )
}

const FamilyTreeGame = () => {
  const [availableMembers, setAvailableMembers] = useState(initialFamilyMembers)
  const [placedMembers, setPlacedMembers] = useState([])

  // Local game state management, mirroring DayGame
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3) // Default maxHearts from GameWrapper
  const [finalTime, setFinalTime] = useState(240) // Default maxTime from GameWrapper

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

  const handleDrop = (item, target, gameProps) => {
    if (localGameEnded) return // Prevent interaction if game has ended

    if (item.name === target.name) {
      setPlacedMembers((prev) => [...prev, target])
      setAvailableMembers((prev) => prev.filter((member) => member.name !== item.name))
      gameProps.addPoints(12) // Award points for correct placement

      // Check for win condition immediately after a correct placement
      if (placedMembers.length + 1 === initialFamilyMembers.length) {
        setPlayerActuallyWon(true)
        setFinalScore(gameProps.score + 12) // Include the last points
        setFinalHearts(currentLocalHearts) // Use local hearts for final display
        setFinalTime(gameProps.timeLeft)
        setLocalGameEnded(true)
        // Do NOT call gameProps.gameComplete() here, as we handle the end screen
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
          // Do NOT call gameProps.gameFail() here
        }
        return newHearts
      })
    }
  }

  const isComplete = placedMembers.length === initialFamilyMembers.length

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
    }, [gameProps.timeLeft, localGameEnded, gameProps.score, currentLocalHearts]) // Add currentLocalHearts to dependencies

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-pink-200">
          {/* Main game content or end-game modal */}
          {localGameEnded ? (
            // End-game modal, centered
            <div className="flex flex-col items-center justify-center w-full h-full p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md w-full z-10 border border-white/20 text-white text-center">
                {playerActuallyWon ? (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-3xl font-bold mb-4 text-green-400">Congratulations! 🎉🎉</p>
                    <p className="text-lg mb-6">You completed the family tree!</p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">😢</div>
                    <p className="text-3xl font-bold mb-4 text-red-400">Oops! Try Again! 😔</p>
                    <p className="text-lg mb-6">You ran out of time or hearts.</p>
                  </>
                )}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span>Final Score:</span>
                    <span className="font-bold">{finalScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Time Left:</span>
                    <span className="font-bold">{formatTime(finalTime)}</span>
                  </div>
                </div>
                {/* The "Play Again" button is only for loss, so it stays here */}
                {!playerActuallyWon && (
                  <button
                    className="py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                    onClick={() => window.location.reload()}
                  >
                    Play Again
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Game content when not ended
            <>
              {/* Left Side Draggable Items */}
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 p-4">
                {availableMembers
                  .filter((member) => member.position.left)
                  .map((member) => (
                    <DraggableItem key={member.id} name={member.name} />
                  ))}
              </div>
              {/* Family Tree Background */}
              <div className="relative mt-20 flex items-center justify-center">
                <img src={familyTreeBg || "/placeholder.svg"} alt="Family Tree" className="w-[600px] h-[550px]" />
                {/* Drop Targets */}
                {initialFamilyMembers.map((member) => (
                  <DropTarget
                    key={member.id}
                    familyMember={member}
                    onDrop={(item, target) => handleDrop(item, target, gameProps)}
                    isPlaced={placedMembers.some((placed) => placed.id === member.id)}
                  />
                ))}
              </div>
              {/* Right Side Draggable Items */}
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 p-4">
                {availableMembers
                  .filter((member) => member.position.right)
                  .map((member) => (
                    <DraggableItem key={member.id} name={member.name} />
                  ))}
              </div>
            </>
          )}

          {/* Navigation buttons - always show, but disabled based on game state */}
          <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
            <button
              className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
              onClick={() => (window.location.href = "/")}
            >
              ⬅ Previous
            </button>
            <button
              // Enabled only if game has ended AND player actually won
              disabled={!localGameEnded || !playerActuallyWon}
              className={`py-2 px-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
                localGameEnded && playerActuallyWon
                  ? "bg-red-500/80 hover:bg-red-600/80 text-white"
                  : "bg-gray-400/50 cursor-not-allowed text-gray-300"
              }`}
              onClick={() => localGameEnded && playerActuallyWon && (window.location.href = "/familly2")}
            >
              Next ➡
            </button>
          </div>
        </div>
      </DndProvider>
    )
  }

  return (
    <GameWrapper
      gameName="Family Tree"
      maxTime={240} // 4 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log("Game completed!", result)
        // We handle the win screen locally, so no direct redirect here
      }}
      onGameFail={(result) => {
        console.log("Game failed!", result)
        // We handle the loss screen locally, so no direct redirect here
        // This callback from GameWrapper might still fire, but our local state takes precedence
        if (!localGameEnded) {
          // Only update if not already ended by local logic
          setPlayerActuallyWon(false)
          setFinalScore(result.score || 0)
          setFinalHearts(result.hearts || 0) // Use GameWrapper's hearts if it's the one ending the game
          setFinalTime(result.timeLeft || 0)
          setLocalGameEnded(true)
        }
      }}
    >
      <GameContent />
    </GameWrapper>
  )
}

export default FamilyTreeGame
