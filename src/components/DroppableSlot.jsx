// src/components/DroppableSlot.jsx
import React from 'react';
import { useDrop } from 'react-dnd';

function DroppableSlot({ slot, placement, onDrop }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'family',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`w-24 h-24 p-2 border-2 rounded-full ${
        isOver ? 'border-green-400' : 'border-gray-300'
      }`}
    >
      {placement ? (
        <img src={placement.image} alt={placement.name} className="w-full h-full object-contain" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Drop Here
        </div>
      )}
    </div>
  );
}

export default DroppableSlot;
