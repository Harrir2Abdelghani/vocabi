"use client"

import { useRef, useState, useEffect, useCallback } from "react"

export default function RelaxationCorner() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#ff6b81")
  const [brushSize, setBrushSize] = useState(6)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    canvas.width = 640
    canvas.height = 360

    context.fillStyle = "#fdf6e3"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getMouseOrTouch = useCallback((event) => {
    const isTouch = event.touches && event.touches.length > 0
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { offsetX: 0, offsetY: 0 }

    const clientX = isTouch ? event.touches[0].clientX : event.clientX
    const clientY = isTouch ? event.touches[0].clientY : event.clientY

    const offsetX = clientX - rect.left
    const offsetY = clientY - rect.top
    return { offsetX, offsetY }
  }, [])

  const startDrawing = useCallback(
    (e) => {
      const ctx = canvasRef.current?.getContext("2d")
      if (!ctx) return

      setIsDrawing(true)
      ctx.beginPath()
      const { offsetX, offsetY } = getMouseOrTouch(e)
      ctx.moveTo(offsetX, offsetY)
    },
    [getMouseOrTouch],
  )

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return
      const ctx = canvasRef.current?.getContext("2d")
      if (!ctx) return

      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.lineCap = "round"
      const { offsetX, offsetY } = getMouseOrTouch(e)
      ctx.lineTo(offsetX, offsetY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(offsetX, offsetY)
    },
    [isDrawing, color, brushSize, getMouseOrTouch],
  )

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#fdf6e3"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // Tic Tac Toe
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [winner, setWinner] = useState(null)
  const [difficulty, setDifficulty] = useState("Easy")

  const checkWinner = useCallback((b) => {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (const [a, bIdx, c] of winCombos) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a]
    }
    return b.includes(null) ? null : "Tie"
  }, [])

  const cpuMove = useCallback(() => {
    const emptyCells = board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null)

    if (emptyCells.length === 0) {
      setIsPlayerTurn(true) // No moves left, ensure turn is reset if game is tied
      return
    }

    let move

    if (difficulty === "Hard") {
      // Try to win
      move = emptyCells.find((i) => {
        const test = [...board]
        test[i] = "💫"
        return checkWinner(test) === "💫"
      })
      // Block player
      if (move === undefined) {
        move = emptyCells.find((i) => {
          const test = [...board]
          test[i] = "🌟"
          return checkWinner(test) === "🌟"
        })
      }
    }

    if (move === undefined) {
      move = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    }

    if (move !== undefined) {
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard]
        newBoard[move] = "💫"
        return newBoard
      })
      setIsPlayerTurn(true)
    }
  }, [board, difficulty, checkWinner])

  const handleCellClick = useCallback(
    (i) => {
      if (!board[i] && isPlayerTurn && !winner) {
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard]
          newBoard[i] = "🌟"
          return newBoard
        })
        setIsPlayerTurn(false)
      }
    },
    [board, isPlayerTurn, winner],
  )

  useEffect(() => {
    const result = checkWinner(board)
    if (result) {
      setWinner(result)
    } else if (!isPlayerTurn && !result) {
      // Only make CPU move if game is not won/tied and it's CPU's turn
      setTimeout(cpuMove, 700)
    }
  }, [board, isPlayerTurn, winner, checkWinner, cpuMove])

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setWinner(null)
  }, [])

  // Helper function for conditional class names (replaces `cn` from `@/lib/utils`)
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="flex items-center justify-center">
  <h1 className="text-3xl font-extrabold text-purple-700 mb-4 drop-shadow-lg text-center">
    🎨 Relaxation Corner 🎨
  </h1>
</div>
      <p className="text-xl font-medium text-gray-600 mb-8 text-center max-w-2xl">
        Unwind with a creative drawing session or challenge yourself with a game of Tic-Tac-Toe!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Drawing Area Card */}
        <div className="flex flex-col items-center p-6 shadow-xl border-none bg-white/90 backdrop-blur-sm rounded-xl">
          <div className="w-full text-center mb-6">
            <h2 className="text-3xl text-pink-600 font-bold mb-2">Freehand Drawing</h2>
            <p className="text-gray-500">Unleash your creativity on the canvas.</p>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full max-w-[640px] aspect-[16/9] bg-[#fdf6e3] rounded-lg overflow-hidden border-4 border-gray-200 shadow-inner">
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["#ff6b81", "#6bc5ff", "#6bff95", "#f3ff6b", "#a06bff", "#ff956b", "#6bfff3", "#ff6bf3"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={classNames(
                    "w-10 h-10 rounded-full border-2 transition-all duration-200",
                    color === c ? "border-purple-500 scale-110 shadow-md" : "border-gray-300 hover:scale-105",
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                ></button>
              ))}
            </div>
            <div className="w-full max-w-xs mt-6 flex items-center gap-3">
              <span className="text-gray-500 text-2xl">🖌️</span> {/* Replaced Brush icon */}
              <input
                type="range"
                min="1"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                aria-label="Brush size slider"
              />
              <span className="text-sm text-gray-600 w-8 text-right">{brushSize}px</span>
            </div>
          </div>
          <div className="w-full flex justify-center mt-4">
            <button
              onClick={clearCanvas}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2
              text-pink-600 border-pink-300 hover:bg-pink-50 hover:text-pink-700 bg-transparent"
            >
              <span className="mr-2 text-lg">🗑️</span> {/* Replaced Eraser icon */} Clear Canvas
            </button>
          </div>
        </div>

        {/* Game Area Card */}
        <div className="flex flex-col items-center p-6 shadow-xl border-none bg-white/90 backdrop-blur-sm rounded-xl">
          <div className="w-full text-center mb-6">
            <h2 className="text-3xl text-blue-600 font-bold mb-2">Tic-Tac-Toe</h2>
            <p className="text-gray-500">Challenge the AI or a friend!</p>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-md font-medium text-gray-700">Difficulty:</span>
              <div className="relative">
                <select
                  onChange={(e) => setDifficulty(e.target.value)}
                  defaultValue={difficulty}
                  className="w-[120px] bg-gray-50 border border-gray-200 rounded-md py-2 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  aria-label="Select difficulty"
                >
                  <option value="Easy">Easy</option>
                  <option value="Hard">Hard</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">▼</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {board.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  className={classNames(
                    "w-full aspect-square bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 flex items-center justify-center text-5xl font-bold cursor-pointer rounded-xl shadow-sm",
                    !cell && !winner && "hover:scale-105 hover:bg-blue-100 transition-transform duration-150",
                    cell === "🌟" && "text-yellow-500",
                    cell === "💫" && "text-purple-500",
                    (cell || winner || !isPlayerTurn) && "cursor-not-allowed opacity-70", // Combined disabled state
                  )}
                  disabled={!!cell || !!winner || !isPlayerTurn}
                  aria-label={`Tic-Tac-Toe cell ${i + 1}`}
                >
                  {cell}
                </button>
              ))}
            </div>
            {winner && (
              <div className="mt-6 text-2xl font-extrabold text-purple-700 animate-bounce text-center">
                {winner === "Tie" ? "🤝 It's a Tie!" : `${winner} Wins! 🎉`}
              </div>
            )}
            {!winner && board.every((c) => c !== null) && (
              <div className="mt-6 text-2xl font-extrabold text-gray-700 text-center">Game Over! It's a Tie!</div>
            )}
            {!winner && !board.every((c) => c !== null) && (
              <div className="mt-6 text-xl font-semibold text-gray-600 text-center">
                {isPlayerTurn ? "Your Turn (🌟)" : "CPU's Turn (💫)"}
              </div>
            )}
          </div>
          <div className="w-full flex justify-center mt-4">
            <button
              onClick={resetGame}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2
              text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700 bg-transparent"
            >
              <span className="mr-2 text-lg">🔄</span> {/* Replaced RotateCcw icon */} Restart Game
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
