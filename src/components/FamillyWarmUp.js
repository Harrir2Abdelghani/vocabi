import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Confetti from "react-confetti";
import familyTreeBg from "../Assets/tree.jpeg"; // Ensure this exists in your project
import "tailwindcss/tailwind.css";
import grandfatherImg from "../Assets/grandfather.jpg";
import grandmotherImg from "../Assets/grandmother.jpg";
import fatherImg from "../Assets/father.png";
import motherImg from "../Assets/mother.jpg";
import brotherImg from "../Assets/brother.png";
import sisterImg from "../Assets/sister.png";
import meImg from "../Assets/mee.png";
import babyImg from "../Assets/baby.jpg";

// Family Members Data
const initialFamilyMembers = [
  { id: 1, name: "Grandfather", position: { top: "4%", left: "27%" } },
  { id: 2, name: "Grandmother", position: { top: "4%", left: "60%" } },
  { id: 3, name: "Father", position: { top: "18%", left: "35%" } },
  { id: 4, name: "Mother", position: { top: "18%", right: "33%" } },
  { id: 5, name: "Brother", position: { top: "27%", right: "16%" } },
  { id: 6, name: "Sister", position: { top: "27%", right: "70%" } },
  { id: 7, name: "Me", position: { bottom: "44%", left: "32%" } },
  { id: 8, name: "Baby", position: { bottom: "43%", right: "30%" } },
];

// Image Mapping
const familyImages = {
  Grandfather: grandfatherImg,
  Grandmother: grandmotherImg,
  Father: fatherImg,
  Mother: motherImg,
  Brother: brotherImg,
  Sister: sisterImg,
  Me: meImg,
  Baby: babyImg,
};

// Draggable Component
const DraggableItem = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "familyMember",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 bg-cyan-500 text-white rounded-lg cursor-pointer transition-transform duration-200 ${
        isDragging ? "opacity-50 scale-110" : "opacity-100"
      }`}
    >
      {name}
    </div>
  );
};

// Drop Target Component
const DropTarget = ({ familyMember, onDrop, isPlaced }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "familyMember",
    drop: (item) => onDrop(item, familyMember),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`absolute w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
        isOver ? "bg-green-700 scale-110" : "bg-transparent"
      }`}
      style={{
        top: familyMember.position.top || "auto",
        left: familyMember.position.left || "auto",
        right: familyMember.position.right || "auto",
        bottom: familyMember.position.bottom || "auto",
      }}
    >
      {isPlaced ? (
        <img
          src={familyImages[familyMember.name]}
          alt={familyMember.name}
          className="w-full h-full p-0 rounded-full object-cover  "
        />
      ) : (
        <div className="w-16 h-16 bg-transparent rounded-full"></div> // Placeholder circle
      )}
    </div>
  );
};

// Main Component
const FamilyTreeGame = () => {
  const [availableMembers, setAvailableMembers] = useState(initialFamilyMembers);
  const [placedMembers, setPlacedMembers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle Drop
  const handleDrop = (item, target) => {
    if (item.name === target.name) {
      setPlacedMembers((prev) => [...prev, target]);
      setAvailableMembers((prev) => prev.filter((member) => member.name !== item.name));
    }
  };

  // Show Confetti When All Members Are Placed
  useEffect(() => {
    if (placedMembers.length === initialFamilyMembers.length) {
      setShowConfetti(true);
    }
  }, [placedMembers]);

  // Disable "Next" button if not all members are placed
  const isNextButtonDisabled = placedMembers.length !== initialFamilyMembers.length;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-pink-200">
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight - 50} />}

        {/* Left Side Draggable Items */}
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 p-4">
          {availableMembers
            .filter((member) => member.position.left)
            .map((member) => (
              <DraggableItem key={member.id} name={member.name} />
            ))}
        </div>

        {/* Family Tree Background */}
        <div className="relative mt-20 flex items-center justify-center">
          <img src={familyTreeBg} alt="Family Tree" className="w-[600px] h-[550px]" />

          {/* Drop Targets */}
          {initialFamilyMembers.map((member) => (
            <DropTarget
              key={member.id}
              familyMember={member}
              onDrop={handleDrop}
              isPlaced={placedMembers.some((placed) => placed.id === member.id)}
            />
          ))}
        </div>

        {/* Right Side Draggable Items */}
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 p-4">
          {availableMembers
            .filter((member) => member.position.right)
            .map((member) => (
              <DraggableItem key={member.id} name={member.name} />
            ))}
        </div>

        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
            onClick={() => window.location.href = '/'}
          >
            Previous
          </button>
          <button
            className={`py-2 px-4 rounded-lg shadow-lg ${isNextButtonDisabled ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white`}
            onClick={() => !isNextButtonDisabled && (window.location.href = '/familly2')}
            disabled={isNextButtonDisabled}
          >
            Next
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default FamilyTreeGame;