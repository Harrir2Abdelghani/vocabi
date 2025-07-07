import React, { useState } from 'react';
import arrow from '../Assets/Arrow.png';
import GameWrapper from './GameSystem';

const mathEquations = [
  { equation: '15 + 24 =', answer: 'THIRTYNINE' },
  { equation: '10 + 10 =', answer: 'TWENTY' },
  { equation: '44 + 06 =', answer: 'FIFTY' },
  { equation: '05 + 03 =', answer: 'EIGHT' },
  { equation: '99 + 01 =', answer: 'ONEHUNDRED' },
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const MathGame = () => {
  const [draggedLetters, setDraggedLetters] = useState({});
  const [letterColors, setLetterColors] = useState({});

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData('letter', letter);
  };

  const handleDrop = (e, index, letterIdx, gameProps) => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('letter');

    const newLetters = { ...draggedLetters };
    if (!newLetters[index]) newLetters[index] = [];
    newLetters[index][letterIdx] = letter;
    setDraggedLetters(newLetters);

    checkLetter(index, letterIdx, letter, gameProps);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const checkLetter = (index, letterIdx, letter, gameProps) => {
    const correctLetter = mathEquations[index].answer[letterIdx];
    const newColors = { ...letterColors };
    if (!newColors[index]) newColors[index] = [];
    
    if (letter === correctLetter) {
      newColors[index][letterIdx] = 'green';
      gameProps.addPoints(5); // Award points for correct letter
      
      // Check if entire word is completed
      const currentWord = draggedLetters[index] || [];
      const isWordComplete = mathEquations[index].answer.split('').every((char, i) => 
        i === 0 || currentWord[i] === char
      );
      
      if (isWordComplete) {
        gameProps.addPoints(20); // Bonus for completing word
        
        // Check if all equations are solved
        const allCompleted = mathEquations.every((eq, eqIndex) => {
          const wordLetters = draggedLetters[eqIndex] || [];
          return eq.answer.split('').every((char, i) => 
            i === 0 || wordLetters[i] === char
          );
        });
        
        if (allCompleted) {
          gameProps.gameComplete();
        }
      }
    } else {
      newColors[index][letterIdx] = 'red';
      // Wrong letter - lose a heart
      const canContinue = gameProps.loseHeart();
      if (!canContinue) {
        return; // Game over
      }
    }
    
    setLetterColors(newColors);
  };

  const GameContent = (gameProps) => {
    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }

    return (
      <div className="flex flex-col lg:flex-row justify-between items-center h-screen p-4 lg:p-8">
        <div className="w-full lg:w-2/3">
          <h1 className="text-xl lg:text-1xl font-bold mb-8 text-blue-700 text-center lg:text-left">Solve the math problem and write the answer using the alphabet table</h1>
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
                <div key={idx} className="flex justify-center lg:justify-start items-center space-x-2">
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
                        onDrop={i > 0 ? (e) => handleDrop(e, idx, i, gameProps) : undefined}
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
        
        <div className="w-full lg:w-1/3 mt-12 mr-[40px] lg:mt-8">
          <h2 className="text-xl lg:text-2xl font-bold mb-4 text-center">Alphabet Table</h2>
          <div className="grid grid-cols-5 gap-2">
            {alphabet.map((letter, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, letter)}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-300 flex items-center justify-center cursor-pointer border-2 border-gray-300"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => window.location.href = '/numbers2'}
          >
            ⬅ Previous
          </button>
        </div>
      </div>
    );
  };

  return (
    <GameWrapper
      gameName="Math Magic"
      maxTime={360} // 6 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }}
      onGameFail={(result) => {
        console.log('Game failed!', result);
      }}
    >
      <GameContent />
    </GameWrapper>
  );
};

export default MathGame;