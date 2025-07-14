"use client"

import { useState, useEffect } from "react"
import { CheckCircle, RotateCcw, Star, Heart, X } from "lucide-react"
// Re-importing original image paths, now backed by placeholder blob URLs
import wakeup from "../Assets/wake-up.png"
import teeth from "../Assets/brush-teeth.png"
import breakfest from "../Assets/breakfast.png"
import clothes from "../Assets/get-dressed.png"
import school from "../Assets/school.png"
import GameWrapper from "./GameSystem"

const DailyRoutineQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [toast, setToast] = useState(null)

  const questions = [
    {
      id: 1,
      image: wakeup,
      question: "What do I do when I wake up in the morning?",
      options: ["I wake up ", "I wayk up ", "I waik up "],
      correct: 0,
    },
    {
      id: 2,
      image: teeth,
      question: "What do I do to keep my teeth clean?",
      options: ["I bruch my teeth", "I brush my teeth", "I brushe my teeth"],
      correct: 1,
    },
    {
      id: 3,
      image: breakfest,
      question: "What do I do in the morning to get energy?",
      options: ["I have breakfast", "I hav breakfast", "I have breakfest"],
      correct: 0,
    },
    {
      id: 4,
      image: clothes,
      question: "What do I do to get ready for the day?",
      options: ["I put my clothes on", "I putt my clathes on", "I pute my clothos on"],
      correct: 0,
    },
    {
      id: 5,
      image: school,
      question: "Where do I go to learn new things?",
      options: ["I go to scool", "I go to skool", "I go to school"],
      correct: 2,
    },
  ]

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  const handleAnswerClick = (answerIndex, gameProps) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === questions[currentQuestion].correct) {
      setCorrectAnswers((prev) => prev + 1)
      gameProps.addPoints(20) // Award points for correct answer
      showToast("success", "🎉 Excellent! Well done!")
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          moveToNextQuestion()
        } else {
          setGameCompleted(true)
          setShowConfetti(true)
          gameProps.gameComplete() // Signal GameWrapper that the quiz part is complete
        }
      }, 2000)
    } else {
      // Wrong answer - lose a heart
      const canContinue = gameProps.loseHeart()
      if (!canContinue) {
        // Game over due to hearts - GameWrapper's onGameFail will be triggered
        return
      }
      showToast("error", "😊 Try again! You can do it!")
      setTimeout(() => {
        setSelectedAnswer(null)
        setShowResult(false)
      }, 1500)
    }
  }

  const moveToNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const getButtonClass = (index) => {
    if (!showResult) {
      return "bg-blue-50/20 backdrop-blur-sm hover:bg-blue-50/30 text-white shadow-md hover:shadow-lg transform hover:scale-105 border border-white/20"
    }

    if (index === selectedAnswer && index === questions[currentQuestion].correct) {
      return "bg-green-400 text-white shadow-lg"
    }

    if (index === selectedAnswer && index !== questions[currentQuestion].correct) {
      return "bg-red-400 text-white shadow-lg"
    }

    return "bg-white/10 backdrop-blur-sm text-white shadow-md border border-white/20"
  }

  const Toast = ({ type, message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 2700)
      return () => clearTimeout(timer)
    }, [onClose])

    const toastClasses = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
    }

    return (
      <div
        className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ease-in-out ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div
          className={`${toastClasses[type]} px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 min-w-64 backdrop-blur-xl`}
        >
          <span className="text-lg font-medium">{message}</span>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Custom Confetti component (as the original was also custom)
  const CustomConfetti = () => {
    const [particles, setParticles] = useState([])
    useEffect(() => {
      if (showConfetti) {
        const newParticles = Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: ["#FFB6C1", "#87CEEB", "#98FB98", "#F0E68C", "#DDA0DD"][Math.floor(Math.random() * 5)],
          size: Math.random() * 6 + 3,
          speedY: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 1,
        }))
        setParticles(newParticles)
        const interval = setInterval(() => {
          setParticles((prev) =>
            prev
              .map((particle) => ({
                ...particle,
                y: particle.y + particle.speedY,
                x: particle.x + particle.speedX,
              }))
              .filter((particle) => particle.y < 110),
          )
        }, 50)
        setTimeout(() => {
          clearInterval(interval)
          setShowConfetti(false)
        }, 3000)
        return () => clearInterval(interval)
      }
    }, [showConfetti])

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
            }}
          />
        ))}
      </div>
    )
  }

  const GameContent = (gameProps) => {
    // Add this useEffect hook at the beginning of the GameContent function
    useEffect(() => {
      if (gameProps.gameEnded) {
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
    }, [gameProps.gameEnded])

    if (gameCompleted) {
      // This means all questions have been processed and answered correctly
      return (
        <div className="h-screen -mt-24 overflow-hidden bg-gradient-to-b from-blue-100 to-pink-100 flex items-center justify-center p-4">
          {showConfetti && <CustomConfetti />}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center max-w-md w-full border border-white/20">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-black mb-2">Amazing Job!</h1>
              <p className="text-lg text-black/80">You know your daily routine perfectly!</p>
            </div>
            <div className="bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-2xl p-4 mb-6 border border-white/20">
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <p className="text-black text-lg font-medium">
                  {correctAnswers}/{questions.length} Perfect!
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
            onClick={() => (window.location.href = "/daily2")}
          >
            ⬅ Previous
          </button>
        </div>
        </div>
      )
    } else if (gameProps.gameEnded) {
      // This means game ended by GameWrapper (time/hearts) AND not all questions were completed
      return (
        <div className="h-screen -mt-24 overflow-hidden bg-gradient-to-b from-red-100 to-orange-100 flex items-center justify-center p-4">
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
                  Score: {gameProps.score} | Hearts Left: {gameProps.hearts}
                </p>
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
            onClick={() => (window.location.href = "/daily2")}
          >
            ⬅ Previous
          </button>
        </div>
        </div>
      )
    }

    // Default case: game is ongoing
    return (
      <div className="h-screen -mt-24 overflow-hidden bg-gradient-to-b from-blue-100 to-pink-100 flex items-center justify-center p-4">
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Choose the right answer</h1>
          </div>
          {/* Quiz Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl -mb-16 shadow-lg overflow-hidden border border-white/20">
            {/* Image Section */}
            <div className="bg-gradient-to-r from-yellow-200/20 to-orange-200/20 p-4 text-center">
              <img
                src={questions[currentQuestion].image || "/placeholder.svg"}
                alt="Daily routine activity"
                className="w-40 h-32 object-cover rounded-xl mx-auto"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml;base64,${btoa(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="128" viewBox="0 0 160 128">
                    <rect width="100%" height="100%" fill="#e5e7eb" rx="12"/>
                    <text x="50%" y="45%" text-anchor="middle" dy="0.3em" fill="#9ca3af" font-family="Arial" font-size="12">
                      Daily Routine
                    </text>
                    <text x="50%" y="65%" text-anchor="middle" dy="0.3em" fill="#9ca3af" font-family="Arial" font-size="12">
                      Picture
                    </text>
                  </svg>`,
                  )}`
                }}
              />
            </div>
            {/* Question Section */}
            <div className="p-6">
              {/* Answer Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index, gameProps)}
                    disabled={showResult || gameProps.gameEnded}
                    className={`w-full p-4 rounded-xl font-medium text-lg transition-all duration-300 ${getButtonClass(index)} ${
                      showResult ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-center text-black">
                      {option}
                      {showResult && index === selectedAnswer && index === questions[currentQuestion].correct && (
                        <CheckCircle className="w-5 h-5 ml-2 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
            <button
              className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
              onClick={() => (window.location.href = "/daily2")}
            >
              ⬅ Previous
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <GameWrapper
      gameName="Spell Daily"
      maxTime={240} // 4 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log("Game completed!", result)
        // Removed setTimeout here, custom end screen is now handled by GameContent
      }}
      onGameFail={(result) => {
        console.log("Game failed!", result)
        // No need to set a state here, gameProps.gameEnded will be true in GameContent
      }}
    >
      <GameContent />
    </GameWrapper>
  )
}

export default DailyRoutineQuiz
