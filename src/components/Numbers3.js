"use client"

import { useState, useEffect } from "react"
import Confetti from "react-confetti"
import GameWrapper from "./GameSystem"

const mathEquations = [
  { equation: "15 + 24 =", answer: "THIRTYNINE" },
  { equation: "10 + 10 =", answer: "TWENTY" },
  { equation: "44 + 06 =", answer: "FIFTY" },
  { equation: "05 + 03 =", answer: "EIGHT" },
  { equation: "99 + 01 =", answer: "ONEHUNDRED" },
]

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const MathGame = () => {
  const [draggedLetters, setDraggedLetters] = useState({})
  const [letterColors, setLetterColors] = useState({})

  // Local game state management (same pattern as family game)
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3)
  const [finalTime, setFinalTime] = useState(360)

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

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData("letter", letter)
  }

  const handleDrop = (e, index, letterIdx, gameProps) => {
    if (localGameEnded) return

    e.preventDefault()
    const letter = e.dataTransfer.getData("letter")
    const newLetters = { ...draggedLetters }
    if (!newLetters[index]) newLetters[index] = []
    newLetters[index][letterIdx] = letter
    setDraggedLetters(newLetters)
    checkLetter(index, letterIdx, letter, gameProps)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const checkLetter = (index, letterIdx, letter, gameProps) => {
    const correctLetter = mathEquations[index].answer[letterIdx]
    const newColors = { ...letterColors }
    if (!newColors[index]) newColors[index] = []

    if (letter === correctLetter) {
      newColors[index][letterIdx] = "green"
      gameProps.addPoints(5) // Award points for correct letter

      // Check if entire word is completed
      const currentWord = draggedLetters[index] || []
      currentWord[letterIdx] = letter // Include the current letter
      const isWordComplete = mathEquations[index].answer
        .split("")
        .every((char, i) => (i === 0 ? true : currentWord[i] === char))

      if (isWordComplete) {
        gameProps.addPoints(20) // Bonus for completing word

        // Check if all equations are solved
        const updatedLetters = { ...draggedLetters, [index]: currentWord }
        const allCompleted = mathEquations.every((eq, eqIndex) => {
          const wordLetters = updatedLetters[eqIndex] || []
          return eq.answer.split("").every((char, i) => (i === 0 ? true : wordLetters[i] === char))
        })

        if (allCompleted) {
          // All equations completed successfully - ACTUAL WIN
          setPlayerActuallyWon(true)
          setFinalScore(gameProps.score + 25) // Include current points
          setFinalHearts(gameProps.hearts)
          setFinalTime(gameProps.timeLeft)
          setLocalGameEnded(true)
        }
      }
    } else {
      newColors[index][letterIdx] = "red"
      // Wrong letter - lose a heart
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
    }

    setLetterColors(newColors)
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
        <div className="flex flex-col -mt-20 items-center justify-center h-screen p-4 bg-gradient-to-br from-blue-100 to-purple-100">
          {playerActuallyWon && <Confetti width={window.innerWidth} height={window.innerHeight} />}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md w-full z-10 border border-white/20 text-center">
            {playerActuallyWon ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-3xl font-bold mb-4 text-green-400">🎉 Congratulations!</p>
                <p className="text-lg mb-6 text-gray-700">You solved all the math equations!</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😢</div>
                <p className="text-3xl font-bold mb-4 text-red-400">Oops! Try Again! 😔</p>
              </>
            )}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-gray-700">
                <span>Final Score:</span>
                <span className="font-bold">{finalScore}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Time Left:</span>
                <span className="font-bold">{formatTime(finalTime)}</span>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <button
                className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
                onClick={() => (window.location.href = "/numbers2")}
              >
                Previeus
              </button>
              {playerActuallyWon ? (
                <button
                  className=""
                  onClick={() => (window.location.href = "/")}
                >
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
      <div className="flex flex-col -mt-28 lg:flex-row justify-between items-center h-screen p-4 lg:p-8">
        <div className="w-full lg:w-2/3">
          <h1 className="text-xl lg:text-1xl font-bold mb-8 text-blue-700 text-center lg:text-left">
            Solve the math problem and write the answer using the alphabet table
          </h1>
          <div className="grid grid-cols-1 gap-4">
            {mathEquations.map((equation, idx) => {
              const answer = equation.answer
              const userLetters = draggedLetters[idx] || []
              let allFilled = true
              let isCorrect = true
              for (let i = 1; i < answer.length; i++) {
                const userLetter = userLetters[i]
                if (userLetter === undefined) {
                  allFilled = false
                  isCorrect = false
                  break
                }
                if (userLetter !== answer[i]) {
                  isCorrect = false
                }
              }
              return (
                <div key={idx} className="flex justify-center lg:justify-start items-center space-x-2">
                  <span className="text-lg lg:text-xl">{equation.equation}</span>
                  <div className="flex space-x-2">
                    {[...Array(equation.answer.length)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 lg:w-12 lg:h-12 border-2 flex items-center justify-center ${
                          i === 0
                            ? "bg-green-500 text-white"
                            : letterColors[idx] && letterColors[idx][i] === "green"
                              ? "bg-green-500 text-white"
                              : letterColors[idx] && letterColors[idx][i] === "red"
                                ? "bg-red-300 text-white"
                                : "border-gray-300"
                        }`}
                        onDrop={i > 0 ? (e) => handleDrop(e, idx, i, gameProps) : undefined}
                        onDragOver={i > 0 ? handleDragOver : undefined}
                      >
                        {i === 0 ? <span className="text-lg lg:text-xl font-bold">{answer[0]}</span> : userLetters[i]}
                      </div>
                    ))}
                  </div>
                  {allFilled && (
                    <span className={`text-sm lg:text-base ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full lg:w-1/3 mt-12 mr-[40px] lg:mt-8">
          <h2 className="text-xl lg:text-2xl font-bold mb-4 text-center">Alphabet Table</h2>
          <div className="grid grid-cols-5 gap-2">
            {alphabet.map((letter, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, letter)}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-300 flex items-center justify-center cursor-pointer border-2 border-gray-300"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => (window.location.href = "/numbers2")}
          >
            ⬅ Previous
          </button>
          
        </div>
      </div>
    )
  }

  return (
    <GameWrapper
      gameName="Math Magic"
      maxTime={360} // 6 minutes
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

export default MathGame
