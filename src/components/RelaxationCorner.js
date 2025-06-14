import React, { useRef, useState, useEffect } from "react";
import image from "../Assets/cloud.png"; // You can use this image as background or decoration

const RelaxationCorner = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ff6b81");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth < 640 ? window.innerWidth - 40 : 640;
    canvas.height = 360;
    context.fillStyle = "#fdf6e3";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getMouseOrTouch = (event) => {
    const isTouch = event.touches && event.touches.length > 0;
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = isTouch
      ? event.touches[0].clientX - rect.left
      : event.nativeEvent.offsetX;
    const offsetY = isTouch
      ? event.touches[0].clientY - rect.top
      : event.nativeEvent.offsetY;
    return { offsetX, offsetY };
  };

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    setIsDrawing(true);
    ctx.beginPath();
    const { offsetX, offsetY } = getMouseOrTouch(e);
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    const { offsetX, offsetY } = getMouseOrTouch(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fdf6e3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Tic Tac Toe
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [difficulty, setDifficulty] = useState("Easy");

  const checkWinner = (b) => {
    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, bIdx, c] of winCombos) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
    }
    return b.includes(null) ? null : "Tie";
  };

  const handleCellClick = (i) => {
    if (!board[i] && isPlayerTurn && !winner) {
      const newBoard = [...board];
      newBoard[i] = "🌟";
      setBoard(newBoard);
      setIsPlayerTurn(false);
    }
  };

  const cpuMove = () => {
    const emptyCells = board
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);
    let move;
    if (difficulty === "Hard") {
      move = emptyCells.find((i) => {
        const test = [...board];
        test[i] = "💫";
        return checkWinner(test) === "💫";
      });
    }
    if (move === undefined) {
      move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    if (move !== undefined) {
      const newBoard = [...board];
      newBoard[move] = "💫";
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      setTimeout(cpuMove, 700);
    }
    const result = checkWinner(board);
    if (result) setWinner(result);
  }, [board, isPlayerTurn, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 min-h-screen flex flex-col items-center">
      <h2 className="text-4xl font-extrabold text-pink-600 mb-2">🎨 Relaxation Corner 🎨</h2>
      <p className="text-lg font-medium text-gray-700 mb-6">Draw or play a fun game!</p>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* Drawing area */}
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className="rounded-lg border-4 border-black"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="flex space-x-2 mt-4">
            {["#ff6b81", "#6bc5ff", "#6bff95", "#f3ff6b"].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full border-2 border-white"
                style={{ backgroundColor: c }}
              ></button>
            ))}
          </div>
          <button
            onClick={clearCanvas}
            className="mt-3 px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded-full shadow-md transition"
          >
            Clear
          </button>
        </div>

        {/* Game area */}
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center w-full md:w-1/2">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setDifficulty("Easy")}
              className={`px-3 py-1 rounded-full ${
                difficulty === "Easy"
                  ? "bg-yellow-300 text-yellow-800"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty("Hard")}
              className={`px-3 py-1 rounded-full ${
                difficulty === "Hard"
                  ? "bg-red-300 text-red-800"
                  : "bg-red-100 text-red-600"
              }`}
            >
              Hard
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, i) => (
              <div
                key={i}
                onClick={() => handleCellClick(i)}
                className="w-20 h-20 bg-gradient-to-br from-yellow-50 to-pink-50 border-2 border-purple-300 flex items-center justify-center text-3xl md:text-4xl cursor-pointer rounded-lg hover:scale-110 transition"
              >
                {cell}
              </div>
            ))}
          </div>
          {winner && (
            <div className="mt-4 text-xl font-bold text-purple-600 animate-bounce">
              {winner === "Tie" ? "🤝 It's a Tie!" : `${winner} Wins! 🎉`}
            </div>
          )}
          <button
            onClick={resetGame}
            className="mt-4 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-full shadow-md transition"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelaxationCorner;
