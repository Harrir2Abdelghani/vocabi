import React, { useState } from 'react';
import arrow from '../Assets/Arrow.png';

const mathEquations = [
  { equation: '1 + 1 =', answer: 'TWO' },
  { equation: '2 + 2 =', answer: 'FOUR' },
  { equation: '3 + 2 =', answer: 'FIVE' },
  { equation: '4 + 1 =', answer: 'FIVE' },
  { equation: '5 - 3 =', answer: 'TWO' },
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const MathGame = () => {
  const [draggedLetters, setDraggedLetters] = useState({});
  const [letterColors, setLetterColors] = useState({});

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData('letter', letter);
  };

  const handleDrop = (e, index, letterIdx) => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('letter');

    const newLetters = { ...draggedLetters };
    if (!newLetters[index]) newLetters[index] = [];
    newLetters[index][letterIdx] = letter;
    setDraggedLetters(newLetters);

    checkLetter(index, letterIdx, letter);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const checkLetter = (index, letterIdx, letter) => {
    const correctLetter = mathEquations[index].answer[letterIdx];
    const newColors = { ...letterColors };
    if (!newColors[index]) newColors[index] = [];
    newColors[index][letterIdx] = letter === correctLetter ? 'green' : 'red';
    setLetterColors(newColors);
  };

  const resetGame = () => {
    setDraggedLetters({});
    setLetterColors({});
  };

  return (
    <div style={{ backgroundImage: 'url(https://t4.ftcdn.net/jpg/00/58/53/09/360_F_58530900_9QKwaKK4Pp1ZF1F51WRsp7WnijyGSV9S.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="flex flex-col lg:flex-row justify-between items-center h-screen p-4 lg:p-8">
      <div className="w-full lg:w-2/3">
        <h1 className="text-xl lg:text-2xl font-bold mb-4 text-black text-center lg:text-left">Math Game</h1>
        <div className="grid grid-cols-1 gap-4">
          {mathEquations.map((equation, idx) => {
            const answer = equation.answer;
            const userLetters = draggedLetters[idx] || [];
            let allFilled = true;
            let isCorrect = true;

            for (let i = 1; i < answer.length; i++) {
              const userLetter = userLetters[i];
              if (userLetter === undefined) {
                allFilled = false;
                isCorrect = false;
                break;
              }
              if (userLetter !== answer[i]) {
                isCorrect = false;
              }
            }

            return (
              <div key={idx}  className="flex justify-center lg:justify-start items-center space-x-2">
                <span className="text-lg lg:text-xl">{equation.equation}</span>
                <div className="flex space-x-2">
                  {[...Array(equation.answer.length)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 lg:w-12 lg:h-12 border-2 flex items-center justify-center ${
                        i === 0
                          ? 'bg-green-500 text-white'
                          : letterColors[idx] && letterColors[idx][i] === 'green'
                          ? 'bg-green-500 text-white'
                          : letterColors[idx] && letterColors[idx][i] === 'red'
                          ? 'bg-red-300 text-white'
                          : 'border-gray-300'
                      }`}
                      onDrop={i > 0 ? (e) => handleDrop(e, idx, i) : undefined}
                      onDragOver={i > 0 ? handleDragOver : undefined}
                    >
                      {i === 0 ? (
                        <span className="text-lg lg:text-xl font-bold">{answer[0]}</span>
                      ) : (
                        userLetters[i]
                      )}
                    </div>
                  ))}
                </div>
                {allFilled && (
                  <span className={`text-sm lg:text-base ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="w-full lg:w-1/3 mt-12 mr-[600px] lg:mt-8">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-center lg:text-left">Alphabet Table</h2>
        <div className="grid grid-cols-5 gap-2">
          {alphabet.map((letter, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, letter)}
              className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-200 flex items-center justify-center cursor-pointer border-2 border-gray-300"
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
      


      <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
  <button
    className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
    onClick={() => window.location.href = '/numbers2'}
  >
    Previous
  </button>
  
</div>
    </div>
  );
};

export default MathGame;