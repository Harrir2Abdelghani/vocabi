import React, { useState } from "react";
import grandmother from '../Assets/grandmother.jpg';
import mother from '../Assets/mother.jpg';
import father from '../Assets/father.png';
import sister from '../Assets/sister.png';
import brother from '../Assets/brother.png';
import grandfather from '../Assets/grandfather.jpg';

const FamilySpellingGame = () => {
  const familyMembers = [
    { img: mother, word: "m__h__", solution: "mother" },
    { img: father, word: "f__h__", solution: "father" },
    { img: sister, word: "s__t__", solution: "sister" },
    { img: brother, word: "b__t__r", solution: "brother" },
    { img: grandfather, word: "gr__d__th__", solution: "grandfather" },
    { img: grandmother, word: "gr__d__th__", solution: "grandmother" },
  ];

  const [answers, setAnswers] = useState(Array(familyMembers.length).fill(""));
  const [correctLetters, setCorrectLetters] = useState(Array(familyMembers.length).fill([]));
  const [wrongLetters, setWrongLetters] = useState([]);

  const handleDrop = (letter, memberIndex, position) => {
    const currentAnswer = answers[memberIndex] || familyMembers[memberIndex].word;
    const wordArray = currentAnswer.split("");
    
    if (familyMembers[memberIndex].solution[position] === letter) {
      wordArray[position] = letter;
      const updatedAnswers = [...answers];
      updatedAnswers[memberIndex] = wordArray.join("");
      
      const updatedCorrectLetters = [...correctLetters];
      updatedCorrectLetters[memberIndex] = [...updatedCorrectLetters[memberIndex], position];

      setAnswers(updatedAnswers);
      setCorrectLetters(updatedCorrectLetters);
    } else {
      setWrongLetters([...wrongLetters, letter]);
      setTimeout(() => {
        setWrongLetters(wrongLetters.filter(l => l !== letter));
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-pink-100 p-2">
      <h1 className="text-xl font-bold text-pink-600 mt-20 mb-1">Can you guess the missing letters ?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {familyMembers.map((member, memberIndex) => {
          const isWordComplete = answers[memberIndex] === member.solution;
          return (
            <div
              key={memberIndex}
              className={`flex flex-col items-center p-0 rounded-lg shadow-md transform hover:scale-105 transition-transform ${
                isWordComplete ? "bg-green-300" : "bg-yellow-200"
              }`}
            >
              <img src={member.img} alt={member.solution} className="w-28 h-24 mb-1 rounded-2xl" />
              <div className="flex items-center justify-center space-x-1 mb-2">
                {member.word.split("").map((char, i) => {
                  const isCorrect = correctLetters[memberIndex]?.includes(i) || char !== "_";
                  return (
                    <div
                      key={i}
                      onDrop={(e) => {
                        e.preventDefault();
                        const letter = e.dataTransfer.getData("text");
                        handleDrop(letter, memberIndex, i);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className={`w-8 h-8 border-2 text-center text-lg font-bold rounded ${
                        isCorrect
                          ? "bg-green-400 text-green-900"
                          : "bg-white"
                      }`}
                    >
                      {answers[memberIndex]?.[i] || char}
                    </div>
                  );
                })}
              </div>
              {isWordComplete && (
                <div className="text-green-700 font-semibold">
                  🎉 Correct! You spelled <span className="capitalize">{member.solution}</span>!
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center mt-2">
        {"abcdefghijklmnopqrstuvwxyz".split("").map((char) => (
          <div
            key={char}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text", char)}
            className={`w-12 h-12 m-1 flex items-center justify-center text-white text-xl font-bold rounded-full shadow-md cursor-pointer transition ${
              wrongLetters.includes(char) ? "bg-red-600 animate-bounce" : "bg-purple-600 hover:bg-pink-500"
            }`}
          >
            {char}
          </div>
        ))}
      </div>
      <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
        <button
          className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
          onClick={() => (window.location.href = "/familly2")}
        >
          ⬅ Previous
        </button>
      </div>
    </div>
  );
};

export default FamilySpellingGame;
