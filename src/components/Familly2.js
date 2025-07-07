import React, { useState } from 'react';
import Confetti from "react-confetti";
import brother from '../Assets/brotherquizz.jpg';
import sister from '../Assets/sisterquizz.jpg';
import mother from '../Assets/motherquizz.jpg';
import father from '../Assets/fatherquizz.jpg';
import grandfather from '../Assets/grandpaquizz.jpg';
import grandmother from '../Assets/grandmaquizz.jpg';
import GameWrapper from './GameSystem';

const FamilyMemberQuiz = () => {
  const questions = [
    { question: "Who is the father's father?", options: ["Mother", "Grandfather", "Sister", "Brother"], answer: "Grandfather", image: grandfather },
    { question: "Who is the mother's mother?", options: ["Grandfather", "Grandmother", "Brother", "Sister"], answer: "Grandmother", image: grandmother },
    { question: "Who is your father's brother?", options: ["Brother", "Mother", "Sister", "Grandfather"], answer: "Brother", image: brother },
    { question: "Who is your father's daughter?", options: ["Father", "Mother", "Grandfather", "Grandmother"], answer: "Father", image: father },
    { question: "Who is your mother's sister?", options: ["Sister", "Mother", "Aunt", "Grandmother"], answer: "Mother", image: mother },
    { question: "Who is your mother's son?", options: ["Sister", "Mother", "Grandfather", "Brother"], answer: "Sister", image: sister },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerClick = (choice, gameProps) => {
    setSelectedAnswer(choice);
    if (choice === questions[currentQuestion].answer) {
      gameProps.addPoints(15); // Award points for correct answer
      setFeedbackMessage("Correct! Great job!");
      setIsAnswerCorrect(true);

      if (currentQuestion + 1 === questions.length) {
        setShowConfetti(true);
        setTimeout(() => {
          setQuizComplete(true);
          gameProps.gameComplete(); // Complete the game
        }, 3000);
      } else {
        setTimeout(() => {
          setFeedbackMessage("");
          setSelectedAnswer(null);
          setIsAnswerCorrect(null);
          setCurrentQuestion(currentQuestion + 1);
        }, 1000);
      }
    } else {
      // Wrong answer - lose a heart
      const canContinue = gameProps.loseHeart();
      if (!canContinue) {
        return; // Game over
      }
      setFeedbackMessage("Oops! Try again.");
      setIsAnswerCorrect(false);
    }
  };

  const GameContent = (gameProps) => {
    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight - 50} />}
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-xl max-w-lg w-full mx-4 text-center border border-white/20">
          <h1 className="text-3xl font-bold mb-6 text-white">Guess the family member!</h1>
          {!quizComplete ? (
            <div className="w-full text-center">
              <img src={questions[currentQuestion].image} alt="Family Member" className="w-40 h-40 object-contain mx-auto mb-4 border-4 border-blue-300 rounded-full" />
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerClick(option, gameProps)}
                    disabled={gameProps.gameEnded}
                    className={`py-3 px-5 rounded-xl text-lg font-medium transition-all shadow-md hover:shadow-lg ${
                      selectedAnswer === option
                        ? isAnswerCorrect === false
                          ? 'bg-red-500 text-white' 
                          : 'bg-green-500 text-white'
                        : 'bg-yellow-400 hover:bg-yellow-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedbackMessage && (
                <p className={`mt-4 text-lg font-semibold ${isAnswerCorrect ? 'text-green-400' : 'text-red-400'}`}>{feedbackMessage}</p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl text-green-400 font-bold">🎉 Congratulations! You completed the quiz!</p>
            </div>
          )}
        </div>
        <div className="w-full fixed bottom-4 left-0 flex justify-between px-6">
          <button
            className="py-3 px-6 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => window.location.href = '/famillywarmup'}
          >
            ⬅ Previous
          </button>
          <button
            className={`py-3 px-6 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              quizComplete ? 'bg-red-500/80 hover:bg-red-600/80 text-white' : 'bg-gray-400/50 cursor-not-allowed text-gray-300'
            }`}
            onClick={() => window.location.href = '/familly3'}
            disabled={!quizComplete}
          >
            Next ➡
          </button>
        </div>
      </div>
    );
  };

  return (
    <GameWrapper
      gameName="Who Am I?"
      maxTime={180} // 3 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        setTimeout(() => {
          window.location.href = '/familly3';
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

export default FamilyMemberQuiz;