import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import caterpillarImage from "../Assets/days.jpg";
import Confetti from "react-confetti";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const DraggableDay = ({ day, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "day",
    item: { day },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 rounded-full text-center bg-blue-400 text-black shadow-md cursor-pointer transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {day}
    </div>
  );
};

const DropZone = ({ day, correctDay, onDrop, style }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "day",
    drop: (item) => onDrop(item.day, correctDay),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    canDrop: (item) => item.day === correctDay,
  }));

  const isPlaced = !!day;

  return (
    <div
      ref={drop}
      className={`absolute w-28 h-28 rounded-full flex items-center justify-center border-4 border-green-300 ${
        isOver && canDrop ? "bg-gray-200" : ""
      }`}
      style={{
        ...style,
        backgroundColor: isPlaced ? "green" : "transparent",
        color: isPlaced ? "white" : "black",
      }}
    >
      {day}
    </div>
  );
};

const DaysOfWeekGame = () => {
  const [placements, setPlacements] = useState({});
  const [availableDays, setAvailableDays] = useState(shuffleArray(days));
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  const handleDrop = (draggedDay, targetDay) => {
    if (draggedDay === targetDay) {
      setPlacements((prev) => ({
        ...prev,
        [targetDay]: true,
      }));
      setAvailableDays((prev) => prev.filter((day) => day !== draggedDay));
    }
  };

  useEffect(() => {
    if (Object.keys(placements).length === days.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
  }, [placements]);

  const isComplete = Object.keys(placements).length === days.length;

  const handlePrevious = () => {
    navigate("/dayswarmup");
  };

  const handleNext = () => {
    if (isComplete) {
      navigate("/days3");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center bg-pink-100 p-4 mt-12 relative">
        <div className="flex items-center">
          <h1 className="text-xs font-bold text-transparent mb-4">
            Arrange the Days in Order!
          </h1>
        </div>

        <div className="relative w-[768px] h-[532px] mb-6 items-center cursor-pointer">
          {showConfetti && <Confetti width={750} height={600} />}

          <div
            className="relative w-full h-full -mt-16"
            style={{
              backgroundImage: `url(${caterpillarImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: '700px'
            }}
            onClick={isComplete ? handleNext : undefined}
          >
            <DropZone correctDay="Sunday" day={placements["Sunday"] ? "Sunday" : ""} onDrop={handleDrop} style={{ top: "38%", left: "11%" }} />
            <DropZone correctDay="Monday" day={placements["Monday"] ? "Monday" : ""} onDrop={handleDrop} style={{ top: "13%", left: "20%" }} />
            <DropZone correctDay="Tuesday" day={placements["Tuesday"] ? "Tuesday" : ""} onDrop={handleDrop} style={{ top: "8%", left: "41%" }} />
            <DropZone correctDay="Wednesday" day={placements["Wednesday"] ? "Wednesday" : ""} onDrop={handleDrop} style={{ top: "12%", left: "60%" }} />
            <DropZone correctDay="Thursday" day={placements["Thursday"] ? "Thursday" : ""} onDrop={handleDrop} style={{ top: "26%", left: "76%" }} />
            <DropZone correctDay="Friday" day={placements["Friday"] ? "Friday" : ""} onDrop={handleDrop} style={{ top: "52%", left: "77%" }} />
            <DropZone correctDay="Saturday" day={placements["Saturday"] ? "Saturday" : ""} onDrop={handleDrop} style={{ top: "69%", left: "63%" }} />
          </div>

          <div className="flex font-bold justify-center gap-2 -mt-4">
            {availableDays.map((day) => (
              <DraggableDay key={day} day={day} onDrop={handleDrop} />
            ))}
          </div>

          {isComplete && (
            <h2 className="text-2xl font-bold text-green-500 text-center">
              Congratulations! You did it!
            </h2>
          )}
        </div>

        <div className="absolute left-0 bottom-0 ml-4 mb-16">
          <button
            onClick={handlePrevious}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ⬅ Previous
          </button>
        </div>
        <div className="absolute right-0 bottom-0 mr-4 mb-16">
          <button
            onClick={handleNext}
            className={`px-4 py-2 rounded ${
              isComplete ? "bg-green-500 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isComplete}
          >
            Next ➡
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default DaysOfWeekGame;
