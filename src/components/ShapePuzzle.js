import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const shapes = [
  {
    id: "circle",
    name: "Circle",
    style: {
      borderRadius: "50%",
      backgroundColor: "red",
      width: "8rem",
      height: "8rem",
    },
  },
  {
    id: "square",
    name: "Square",
    style: {
      backgroundColor: "green",
      width: "8rem",
      height: "8rem",
    },
  },
  {
    id: "triangle",
    name: "Triangle",
    style: {
      width: 0,
      height: 0,
      borderLeft: "4rem solid transparent",
      borderRight: "4rem solid transparent",
      borderBottom: "8rem solid yellow",
      position: "center", // Add this for positioning
    },
  },
  {
    id: "star",
    name: "Star",
    style: {
      backgroundColor: "blue",
      width: "8rem",
      height: "8rem",
      clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    },
  },
  {
    id: "hexagon",
    name: "Hexagon",
    style: {
      backgroundColor: "pink",
      width: "8rem",
      height: "8rem",
      clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    },
  },
  {
    id: "heart",
    name: "Heart",
    style: {
      width: "8rem",
      height: "8rem",
      position: "relative",
      backgroundColor: "purple",
      clipPath: "polygon(50% 100%, 0% 60%, 0% 30%, 50% 0%, 100% 30%, 100% 60%)",
    },
  },
];

const levels = [
  { id: 1, shapes: ["circle", "square", "triangle"], name: "Level 1", timeLimit: 45 },
  { id: 2, shapes: ["star", "hexagon", "heart"], name: "Level 2", timeLimit: 45 },
];

const ShapePuzzle = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completed, setCompleted] = useState({});
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(levels[0].timeLimit);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const levelShapes = shapes.filter((shape) =>
    levels.find((level) => level.id === currentLevel).shapes.includes(shape.id)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      setFeedback("Time's up! Try again.");
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const playSound = (correct) => {
    if (!soundEnabled) return;
    const audio = new Audio(correct ? "/sounds/correct.mp3" : "/sounds/wrong.mp3");
  
    audio.addEventListener('canplaythrough', () => {
      audio.play();
    }, { once: true });
  
    audio.addEventListener('error', () => {
      console.error("Audio file could not be played.");
    });
  };
  

  const handleDragStart = (e, shape) => {
    e.dataTransfer.setData("shape", shape);
  };

  const handleDrop = (e, targetShape) => {
    e.preventDefault();
    const draggedShape = e.dataTransfer.getData("shape");

    if (draggedShape === targetShape) {
      playSound(true);
      setCompleted((prev) => ({ ...prev, [targetShape]: true }));
      setFeedback(`Great! You matched the ${targetShape}!`);
      setScore((prev) => prev + 10);
    } else {
      playSound(false);
      setFeedback("Oops! Try again.");
    }
  };

  const resetLevel = () => {
    setCompleted({});
    setFeedback("");
    setTimeLeft(levels.find((level) => level.id === currentLevel).timeLimit);
  };

  const nextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel((prev) => prev + 1);
      resetLevel();
    }
  };

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <div className="p-8 mt-40 text-center bg-teal-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-extrabold text-indigo-600 mb-6">
        {levels.find((level) => level.id === currentLevel).name}
      </h2>

      <p className="text-lg mb-2">Drag the shapes to their correct drop zones!</p>
      <div className="mb-4">
        <button
          onClick={toggleSound}
          className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>
      </div>

      <div className="flex justify-center space-x-6 mb-6">
        {levelShapes.map((shape) => (
          <motion.div
            key={shape.id}
            draggable
            onDragStart={(e) => handleDragStart(e, shape.id)}
            style={shape.style}
            className="flex items-center justify-center cursor-pointer"
            animate={{ rotateY: 360 }}
            transition={{ duration: 4, repeat: Infinity }} // Slowed down the animation
          >
            {/* Center the text inside shapes */}
            <span
              style={{
                position: shape.id === "triangle" ? "absolute" : "relative",
                top: shape.id === "triangle" ? "3.5rem" : "0",
                textAlign: "center",
                color: "black",
              }}
            >
              {shape.name}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {levelShapes.map((shape) => (
          <div
            key={shape.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, shape.id)}
            className={`w-32 h-32 border-4 border-dashed rounded-lg transition-all duration-300 ${
              completed[shape.id]
                ? "border-green-500 bg-green-100"
                : "border-gray-300"
            } flex items-center justify-center relative`}
          >
            {completed[shape.id] ? `✔ ${shape.name}` : `Drop ${shape.name}`}
          </div>
        ))}
      </div>

      <p className="text-xl text-green-600">{feedback}</p>
      <p className="text-lg text-gray-700">Score: {score}</p>
      <p className="text-lg text-red-600">Time Left: {timeLeft}s</p>

      <div className="mt-6">
        {Object.keys(completed).length === levelShapes.length ? (
          currentLevel < levels.length ? (
            <button
              onClick={nextLevel}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Next Level
            </button>
          ) : (
            <p className="text-2xl mt-4">🎉 You've completed all levels! 🎉</p>
          )
        ) : (
          <button
            onClick={resetLevel}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Restart Level
          </button>
        )}
      </div>
    </div>
  );
};

export default ShapePuzzle;
