import React, { useRef, useState, useEffect } from 'react';
import image from '../Assets/cloud.png'

const RelaxationCorner = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('black');

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth < 640 ? window.innerWidth : 640; // Responsive width
    canvas.height = 360; // Fixed height

    // Set initial background color
    context.fillStyle = '#ffffff'; // Background color
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    setIsDrawing(true);
    context.beginPath();
    const { offsetX, offsetY } = getMouseOrTouch(event);
    context.moveTo(offsetX, offsetY);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.lineCap = 'round';

    const { offsetX, offsetY } = getMouseOrTouch(event);
    context.lineTo(offsetX, offsetY);
    context.stroke();
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff'; // Reset background color
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getMouseOrTouch = (event) => {
    const isTouch = event.touches && event.touches.length > 0;
    const offsetX = isTouch ? event.touches[0].clientX - canvasRef.current.getBoundingClientRect().left : event.nativeEvent.offsetX;
    const offsetY = isTouch ? event.touches[0].clientY - canvasRef.current.getBoundingClientRect().top : event.nativeEvent.offsetY;
    return { offsetX, offsetY };
  };


  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [difficulty, setDifficulty] = useState("Easy"); // Easy or Hard

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes(null) ? null : "Tie";
  };

  const handleCellClick = (index) => {
    if (!board[index] && isPlayerTurn && !winner) {
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      setIsPlayerTurn(false);
    }
  };

  const cpuMove = () => {
    const emptyCells = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);

    let move;
    if (difficulty === "Hard") {
      // Simple AI: If a winning move exists, take it
      move = emptyCells.find((index) => {
        const testBoard = [...board];
        testBoard[index] = "O";
        return checkWinner(testBoard) === "O";
      });
    }

    if (move === undefined) {
      // Random move for Easy or fallback for Hard
      move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const newBoard = [...board];
    newBoard[move] = "O";
    setBoard(newBoard);
    setIsPlayerTurn(true);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      setTimeout(cpuMove, 1000);
    }

    const winnerCheck = checkWinner(board);
    if (winnerCheck) setWinner(winnerCheck);
  }, [board, isPlayerTurn, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };
  
  return (
    <div className="p-4 text-center space-x-10 bg-gray-200 ">
      <h2 className="text-3xl font-bold mb-4 mt-4">Relaxation Corner</h2>
      <p className="text-lg2xl mb-4">Take a break! Draw or play!</p>
      <div className="flex flex-col md:flex-row items-center md:items-start space-x-4">
        {/* Left Column - Drawing Section */}
        <div className="flex flex-col items-center md:w-1/2 p-4">
          <canvas
            ref={canvasRef}
            className="border-2 mb-4 border-red-500"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="mb-4">
            <button onClick={clearCanvas} className="bg-teal-500 text-white p-2 rounded-full">Clear Canvas</button>
          </div>
        </div>
        {/* Right Column - Tic Tac Tao */}
        <div className="border-2 border-red-500 w-1/2 mt-4  flex flex-col items-center justify-center  space-y-6 p-4">
      {/* Difficulty Selector */}
      <div className="flex justify-center space-x-4">
  <button
    className={`px-4 font-bold py-2 rounded-lg ${difficulty === "Easy" ? "bg-yellow-300" : "bg-yellow-100"} hover:bg-yellow-300 transition`}
    onClick={() => setDifficulty("Easy")}
  >
    Easy
  </button>
  <button
    className={`px-4 font-bold py-2 rounded-lg ${difficulty === "Hard" ? "bg-red-400" : "bg-red-200"} hover:bg-red-300 transition`}
    onClick={() => setDifficulty("Hard")}
  >
    Hard
  </button>
</div>


      {/* Game Board */}
      <div className="grid grid-cols-3 gap-1 mr-20">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`w-16 h-16 md:w-16 md:h-16 ml-24 bg-white border-2 border-purple-400 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 ${
              cell === "X" ? "text-blue-500" : "text-red-500"
            }`}
            onClick={() => handleCellClick(index)}
          >
            <span className="text-4xl md:text-6xl font-fun">{cell}</span>
          </div>
        ))}
      </div>

      {/* Winner Modal */}
      {winner && (
        <div className="bg-transparent -p-2 ml-24  rounded-lg  text-center  animate-bounce">
          <h2 className="text-xl font-bold text-center mr-24">
  {winner === "Tie" ? "It's a Tie!" : `${winner} Wins! 🎉`}
</h2>

          
        </div>
      )}

      {/* Restart Button */}
      <button
  className="mt-4 px-6 py-3 mx-auto  bg-teal-500 text-white rounded-full shadow-md hover:bg-purple-700 transition-all"
  onClick={resetGame}
>
  Restart Game
</button>

    </div>
      </div>
    </div>
  );
};

export default RelaxationCorner;
