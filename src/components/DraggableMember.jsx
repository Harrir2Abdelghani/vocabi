// src/components/DraggableMember.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

function DraggableMember({ member }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'family',
    item: member,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`w-20 h-20 p-2 rounded-full shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <img src={member.image} alt={member.name} className="w-full h-full object-contain" />
      <p className="text-center mt-1">{member.name}</p>
    </div>
  );
}

export default DraggableMember;
