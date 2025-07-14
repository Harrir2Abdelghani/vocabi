"use client"

import React from "react"
import Data from "./Data"
import Card from "./Card"
import Confetti from "react-confetti"
import GameWrapper from "./GameSystem"

function GameBoard() {
  const [cardsArray, setCardsArray] = React.useState([])
  const [moves, setMoves] = React.useState(0)
  const [firstCard, setFirstCard] = React.useState(null)
  const [secondCard, setSecondCard] = React.useState(null)
  const [stopFlip, setStopFlip] = React.useState(false)
  const [won, setWon] = React.useState(0)
  const [gameFinished, setGameFinished] = React.useState(false)

  const totalRounds = 6 // This means 6 pairs need to be matched

  function NewGame() {
    setTimeout(() => {
      const randomOrderArray = Data.sort(() => 0.5 - Math.random())
      setCardsArray(randomOrderArray)
      setMoves(0)
      setFirstCard(null)
      setSecondCard(null)
      setWon(0)
      setGameFinished(false)
    }, 1200)
  }

  function handleSelectedCards(item) {
    if (firstCard !== null && firstCard.id !== item.id) {
      setSecondCard(item)
    } else {
      setFirstCard(item)
    }
  }

  React.useEffect(() => {
    if (firstCard && secondCard) {
      setStopFlip(true)
      if (firstCard.name === secondCard.name) {
        setCardsArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.name === firstCard.name) {
              return { ...unit, matched: true }
            } else {
              return unit
            }
          })
        })
        setWon((preVal) => preVal + 1)
        removeSelection()
      } else {
        setTimeout(() => {
          removeSelection()
        }, 1000)
      }
    }
  }, [firstCard, secondCard])

  function removeSelection() {
    setFirstCard(null)
    setSecondCard(null)
    setStopFlip(false)
    setMoves((prevValue) => prevValue + 1)
  }

  React.useEffect(() => {
    NewGame()
  }, [])

  React.useEffect(() => {
    if (won === totalRounds) {
      setGameFinished(true)
    }
  }, [won])

  const GameContent = (gameProps) => {
    // Check if game is complete
    React.useEffect(() => {
      if (gameFinished && !gameProps.gameEnded) {
        gameProps.gameComplete()
      }
    }, [gameFinished, gameProps])

    // Award points for matches, no penalty for wrong matches
    React.useEffect(() => {
      if (firstCard && secondCard && firstCard.name === secondCard.name) {
        gameProps.addPoints(20) // Award points for correct match
      }
      // The logic for losing a heart on a wrong match has been removed.
    }, [firstCard, secondCard, gameProps]) // Changed dependency array to directly react to card selections

    if (gameProps.gameEnded) {
      return null // GameWrapper handles the end screen
    }

    return (
      <div className="bg-gray-300 min-h-screen flex flex-col justify-center items-center">
        {gameFinished && <Confetti />}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-blue-600 mt-20 -mb-4">
            Click on the cards to find and match the job with its correct workplace
          </h1>
        </div>
        <div className="grid grid-cols-4 gap-10 mb-4 mt-6">
          {cardsArray.map((item) => (
            <Card
              item={item}
              key={item.id}
              handleSelectedCards={handleSelectedCards}
              toggled={item === firstCard || item === secondCard || item.matched === true}
              stopflip={stopFlip}
            />
          ))}
        </div>
        {won !== totalRounds ? (
          <div className="text-xl text-gray-700"></div>
        ) : (
          <div className="text-2xl text-green-500 font-semibold">You Won! 🎉</div>
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
              gameFinished ? "bg-red-500/80 hover:bg-red-600/80" : "bg-gray-400/50 cursor-not-allowed"
            }`}
            onClick={() => (window.location.href = "/jobs2")}
            disabled={!gameFinished}
          >
            Next ➡
          </button>
        </div>
        <div className="flex justify-center mt-1">
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
      gameName="Job Match"
      maxTime={300} // 5 minutes
      maxHearts={3} // Hearts are still displayed but not lost for wrong matches
      onGameComplete={(result) => {
        console.log("Game completed!", result)
        setTimeout(() => {
          window.location.href = "/jobs2"
        }, 3000)
      }}
      onGameFail={(result) => {
        console.log("Game failed!", result)
      }}
    >
      <GameContent />
    </GameWrapper>
  )
}

export default GameBoard
