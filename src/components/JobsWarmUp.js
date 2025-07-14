"use client"

import { useState, useEffect } from "react"
import Confetti from "react-confetti"
import { RotateCcw, Star, Heart } from "lucide-react"
import chef from "../Assets/chefcross.jpg"
import teacher from "../Assets/teachercross.jpg"
import nurse from "../Assets/nursecross.jpg"
import vet from "../Assets/vetcross.jpg"
import farmer from "../Assets/farmercross.jpg"
import lawyer from "../Assets/lawyercross.jpg"
import GameWrapper from "./GameSystem"

const jobs = [
  { name: "chef", image: chef, color: "bg-green-500" },
  { name: "farmer", image: farmer, color: "bg-green-500" },
  { name: "nurse", image: nurse, color: "bg-green-500" },
  { name: "teacher", image: teacher, color: "bg-green-500" },
  { name: "lawyer", image: lawyer, color: "bg-green-500" },
  { name: "vet", image: vet, color: "bg-green-500" },
]

const grid = [
  ["C", "H", "E", "F", "A", "B", "C", "D"],
  ["A", "F", "A", "R", "M", "E", "R", "Q"],
  ["N", "R", "A", "N", "D", "O", "M", "Y"],
  ["T", "E", "A", "C", "H", "E", "R", "W"],
  ["L", "A", "W", "Y", "E", "R", "I", "E"],
  ["K", "L", "M", "N", "O", "D", "X", "T"],
  ["N", "U", "R", "S", "E", "I", "V", "E"],
  ["L", "M", "V", "E", "T", "Q", "R", "S"],
]

const CrosswordGame = () => {
  const [selectedWord, setSelectedWord] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [foundLetters, setFoundLetters] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [wrongLetters, setWrongLetters] = useState([])

  const handleLetterClick = (letter, row, col, gameProps) => {
    if (gameComplete || gameProps.gameEnded) return
    if (foundLetters.some((pos) => pos.row === row && pos.col === col)) return

    const newPosition = { letter, row, col }

    if (selectedWord.length === 0 || isAdjacent(selectedWord[selectedWord.length - 1], newPosition)) {
      const newSelection = [...selectedWord, newPosition]
      setSelectedWord(newSelection)
      const formedWord = newSelection
        .map((item) => item.letter)
        .join("")
        .toLowerCase()

      const matchingJob = jobs.find((job) => job.name === formedWord)

      if (matchingJob && !foundWords.includes(formedWord)) {
        // Correct word found
        const updatedFoundWords = [...foundWords, formedWord]
        setFoundWords(updatedFoundWords)
        setFoundLetters([...foundLetters, ...newSelection])
        setPopupMessage(`🎉 Great! You found: ${formedWord.toUpperCase()}`)
        setWrongLetters([])
        setSelectedWord([])
        gameProps.addPoints(25)

        setTimeout(() => setPopupMessage(""), 3000)

        if (updatedFoundWords.length === jobs.length) {
          setGameComplete(true)
          gameProps.gameComplete()
        }
      } else if (newSelection.length > 0 && !jobs.some((job) => job.name.startsWith(formedWord))) {
        // Wrong word or invalid path
        const canContinue = gameProps.loseHeart()
        if (!canContinue) {
          return
        }

        setWrongLetters(newSelection.map((pos) => ({ row: pos.row, col: pos.col })))
        setPopupMessage("❌ Wrong! That's not a valid job name.")

        setTimeout(() => {
          setPopupMessage("")
          setWrongLetters([])
          setSelectedWord([])
        }, 2000)
      }
    } else {
      // Non-adjacent selection
      const canContinue = gameProps.loseHeart()
      if (!canContinue) {
        return
      }

      setWrongLetters([newPosition])
      setPopupMessage("❌ Wrong! Select letters that are next to each other.")

      setTimeout(() => {
        setPopupMessage("")
        setWrongLetters([])
        setSelectedWord([])
      }, 2000)
    }
  }

  const isAdjacent = (pos1, pos2) => {
    const rowDiff = Math.abs(pos1.row - pos2.row)
    const colDiff = Math.abs(pos1.col - pos2.col)
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
  }

  const GameContent = (gameProps) => {
    // Hide GameWrapper's default modals
    useEffect(() => {
      if (gameProps.gameEnded || gameComplete) {
        const hideGameWrapperModal = () => {
          const modals = document.querySelectorAll('[class*="fixed"][class*="inset-0"]')
          modals.forEach((modal) => {
            // Only hide modals that are NOT our custom end screens
            if (
              !modal.classList.contains("custom-endscreen") &&
              (modal.textContent?.includes("Congratulations") ||
                modal.textContent?.includes("Game Over") ||
                modal.textContent?.includes("Final Score") ||
                modal.textContent?.includes("Play Again") ||
                modal.textContent?.includes("Home"))
            ) {
              modal.style.display = "none"
            }
          })
        }

        hideGameWrapperModal()
        const interval = setInterval(hideGameWrapperModal, 100)
        return () => clearInterval(interval)
      }
    }, [gameProps.gameEnded, gameComplete])

    if (gameComplete) {
      return (
        <div className="custom-endscreen fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-blue-100 to-pink-100">
          <Confetti />
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center max-w-md w-full border border-white/20">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-black mb-2">Amazing Job!</h1>
              <p className="text-lg text-black/80">You found all the jobs!</p>
            </div>
            <div className="bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-2xl p-4 mb-6 border border-white/20">
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <p className="text-black text-lg font-medium">
                  Score: {gameProps.score} | Words Found: {foundWords.length}/{jobs.length}
                </p>
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-full text-lg transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Play Again
            </button>
          </div>
          <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
            <button
              className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
              onClick={() => (window.location.href = "/jobs2")}
            >
              ⬅ Previous
            </button>
          </div>
        </div>
      )
    } else if (gameProps.gameEnded) {
      return (
        <div className="custom-endscreen fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-red-100 to-orange-100">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center max-w-md w-full border border-white/20">
            <div className="mb-6">
              <div className="text-6xl mb-4">😢</div>
              <h1 className="text-3xl font-bold text-black mb-2">Oops! Try Again!</h1>
              <p className="text-lg text-black/80">You ran out of time or tries.</p>
            </div>
            <div className="bg-gradient-to-r from-red-200/20 to-orange-200/20 rounded-2xl p-4 mb-6 border border-white/20">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-6 h-6 text-red-400" />
                <p className="text-black text-lg font-medium">
                  Score: {gameProps.score} | Hearts Left: 0
                </p>
                <Heart className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-400 to-orange-400 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-full text-lg transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Play Again
            </button>
          </div>
          <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
            <button
              className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
              onClick={() => (window.location.href = "/jobs2")}
            >
              ⬅ Previous
            </button>
          </div>
        </div>
      )
    }

    // Default case: game is ongoing
    return (
      <div className="flex flex-col items-center bg-blue-100 min-h-screen p-6 relative">
        {/* Custom game status bar */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-2 shadow-lg border border-white/20 z-40">
          <div className="flex items-center space-x-6 text-sm font-medium">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Hearts: {gameProps.hearts}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Score: {gameProps.score}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>
                ⏰ Time: {Math.floor(gameProps.timeLeft / 60)}:{(gameProps.timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>
                Found: {foundWords.length}/{jobs.length}
              </span>
            </div>
          </div>
        </div>

        {/* Popup message for right/wrong feedback */}
        {popupMessage && (
          <div
            className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              popupMessage.includes("Great!")
                ? "bg-green-500 border-green-400 shadow-green-200"
                : "bg-red-500 border-red-400 shadow-red-200"
            } text-white px-8 py-4 rounded-xl shadow-2xl text-center z-[9999] border-4 font-bold text-xl animate-bounce`}
            style={{ minWidth: "300px" }}
          >
            {popupMessage}
          </div>
        )}

        <div className="flex items-center -mt-32 justify-center">
          <h1 className="text-2xl font-bold text-black mt-20 mb-4">
            What job is it? Use the letters to write the correct word
          </h1>
        </div>

        <div className="flex flex-row w-full justify-between mb-8">
          <div className="flex flex-col items-center space-y-7">
            {jobs.slice(0, 3).map((job, index) => (
              <div key={index} className="flex flex-col items-center ml-10">
                <img
                  src={job.image || "/placeholder.svg"}
                  alt={job.name}
                  className="w-32 h-28 object-cover mb-0 rounded-lg shadow-md"
                />
                <div
                  className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    foundWords.includes(job.name) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {foundWords.includes(job.name) ? "✓ Found!" : job.name.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-8 gap-1">
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const isFound = foundLetters.some((pos) => pos.row === rowIndex && pos.col === colIndex)
                const isSelected = selectedWord.some((item) => item.row === rowIndex && item.col === colIndex)
                const isWrong = wrongLetters.some((pos) => pos.row === rowIndex && pos.col === colIndex)

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleLetterClick(letter, rowIndex, colIndex, gameProps)}
                    disabled={gameComplete || isFound || gameProps.gameEnded}
                    className={`w-10 h-10 border-2 text-xl font-bold flex items-center justify-center transition-all duration-200 rounded-md
                      ${
                        isFound
                          ? "bg-green-400 text-white border-green-500 shadow-md"
                          : isWrong
                            ? "bg-red-400 text-white border-red-500 animate-pulse"
                            : isSelected
                              ? "bg-blue-300 border-blue-500 scale-110"
                              : "bg-white border-gray-300 hover:bg-gray-50 hover:scale-105"
                      }`}
                  >
                    {letter}
                  </button>
                )
              }),
            )}
          </div>

          <div className="flex flex-col items-center space-y-7">
            {jobs.slice(3).map((job, index) => (
              <div key={index + 3} className="flex flex-col items-center mr-10">
                <img
                  src={job.image || "/placeholder.svg"}
                  alt={job.name}
                  className="w-32 h-28 object-cover rounded-lg shadow-md"
                />
                <div
                  className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    foundWords.includes(job.name) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {foundWords.includes(job.name) ? "✓ Found!" : job.name.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => (window.location.href = "/jobs2")}
          >
            ⬅ Previous
          </button>
        </div>

        <div className="flex justify-center -mt-8">
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
      gameName="Word Search"
      maxTime={360}
      maxHearts={3}
      onGameComplete={(result) => {
        console.log("Game completed!", result)
      }}
      onGameFail={(result) => {
        console.log("Game failed!", result)
      }}
    >
      <GameContent />
    </GameWrapper>
  )
}

export default CrosswordGame
