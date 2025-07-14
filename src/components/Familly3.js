"use client"

import { useState, useEffect } from "react"
import grandmother from "../Assets/grandmother.jpg"
import mother from "../Assets/mother.jpg"
import father from "../Assets/father.png"
import sister from "../Assets/sister.png"
import brother from "../Assets/brother.png"
import grandfather from "../Assets/grandfather.jpg"
import GameWrapper from "./GameSystem"

const FamilySpellingGame = () => {
  const familyMembers = [
    { img: mother, word: "m__h__", solution: "mother" },
    { img: father, word: "f__h__", solution: "father" },
    { img: sister, word: "s__t__", solution: "sister" },
    { img: brother, word: "b__t__r", solution: "brother" },
    { img: grandfather, word: "gr__d__th__", solution: "grandfather" },
    { img: grandmother, word: "gr__d__th__", solution: "grandmother" },
  ]

  const [answers, setAnswers] = useState(Array(familyMembers.length).fill(""))
  const [correctLetters, setCorrectLetters] = useState(Array(familyMembers.length).fill([]))
  const [wrongLetters, setWrongLetters] = useState([])

  // Local game state management (same pattern as your other games)
  const [localGameEnded, setLocalGameEnded] = useState(false)
  const [playerActuallyWon, setPlayerActuallyWon] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalHearts, setFinalHearts] = useState(3)
  const [finalTime, setFinalTime] = useState(300)

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

  const handleDrop = (letter, memberIndex, position, gameProps) => {
    if (localGameEnded) return

    const currentAnswer = answers[memberIndex] || familyMembers[memberIndex].word
    const wordArray = currentAnswer.split("")

    if (familyMembers[memberIndex].solution[position] === letter) {
      wordArray[position] = letter
      const updatedAnswers = [...answers]
      updatedAnswers[memberIndex] = wordArray.join("")

      const updatedCorrectLetters = [...correctLetters]
      updatedCorrectLetters[memberIndex] = [...updatedCorrectLetters[memberIndex], position]
      setAnswers(updatedAnswers)
      setCorrectLetters(updatedCorrectLetters)
      gameProps.addPoints(5)

      // Check if all words are completed
      const allCompleted = updatedAnswers.every((answer, idx) => answer === familyMembers[idx].solution)
      if (allCompleted) {
        // ACTUAL WIN - set local state
        setPlayerActuallyWon(true)
        setFinalScore(gameProps.score + 5)
        setFinalHearts(gameProps.hearts)
        setFinalTime(gameProps.timeLeft)
        setLocalGameEnded(true)
        // DON'T call gameProps.gameComplete()
      }
    } else {
      // Wrong letter - lose a heart
      const canContinue = gameProps.loseHeart()
      if (!canContinue) {
        // ACTUAL LOSS - set local state
        setPlayerActuallyWon(false)
        setFinalScore(gameProps.score)
        setFinalHearts(0)
        setFinalTime(gameProps.timeLeft)
        setLocalGameEnded(true)
      }
      setWrongLetters([...wrongLetters, letter])
      setTimeout(() => {
        setWrongLetters(wrongLetters.filter((l) => l !== letter))
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
        <div className="min-h-screen -mt-20 flex flex-col items-center justify-center bg-pink-100 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md w-full z-10 border border-white/20 text-center">
            {playerActuallyWon ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-3xl font-bold mb-4 text-green-400">Congratulations! 🎉🎉</p>
                <p className="text-lg mb-6 text-white">You completed all the words!</p>
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
      )
    }

    return (
      <div className="min-h-screen -mt-28 flex flex-col items-center bg-pink-100 p-2">
        <h1 className="text-xl font-bold text-pink-600 mt-20 mb-1">Can you guess the missing letters ?</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {familyMembers.map((member, memberIndex) => {
            const isWordComplete = answers[memberIndex] === member.solution
            return (
              <div
                key={memberIndex}
                className={`flex flex-col items-center p-0 rounded-lg shadow-md transform hover:scale-105 transition-transform ${
                  isWordComplete ? "bg-green-300" : "bg-yellow-200"
                }`}
              >
                <img
                  src={member.img || "/placeholder.svg"}
                  alt={member.solution}
                  className="w-28 h-24 mb-1 rounded-2xl"
                />
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {member.word.split("").map((char, i) => {
                    const isCorrect = correctLetters[memberIndex]?.includes(i) || char !== "_"
                    return (
                      <div
                        key={i}
                        onDrop={(e) => {
                          e.preventDefault()
                          const letter = e.dataTransfer.getData("text")
                          handleDrop(letter, memberIndex, i, gameProps)
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        className={`w-8 h-8 border-2 text-center text-lg font-bold rounded ${
                          isCorrect ? "bg-green-400 text-green-900" : "bg-white"
                        }`}
                      >
                        {answers[memberIndex]?.[i] || char}
                      </div>
                    )
                  })}
                </div>
                {isWordComplete && (
                  <div className="text-green-700 font-semibold">
                    🎉 Correct! You spelled <span className="capitalize">{member.solution}</span>!
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap justify-center mt-2">
          {"abcdefghijklmnopqrstuvwxyz".split("").map((char) => (
            <div
              key={char}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text", char)}
              className={`w-12 h-12 m-1 flex items-center justify-center text-white text-xl font-bold rounded-full shadow-md cursor-pointer transition ${
                wrongLetters.includes(char) ? "bg-red-600 animate-bounce" : "bg-purple-600 hover:bg-pink-500"
              }`}
            >
              {char}
            </div>
          ))}
        </div>
        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => (window.location.href = "/familly2")}
          >
            ⬅ Previous
          </button>
        </div>
      </div>
    )
  }

  return (
    <GameWrapper
      gameName="Spell Family"
      maxTime={300}
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

export default FamilySpellingGame
