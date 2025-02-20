import React, { useState } from 'react';
import Confetti from "react-confetti";

const FamilyMemberQuiz = () => {
  const questions = [
    {
      question: "Who is the father's father?",
      options: ["Mother", "Grandfather", "Sister", "Brother"],
      answer: "Grandfather",
      image: "https://img.freepik.com/vecteurs-premium/grand-pere-personnage-personnage-avatar-vecteur-illustration-design_24877-15541.jpg", // Placeholder image, replace with actual image URLs
    },
    {
      question: "Who is the mother's mother?",
      options: ["Grandfather", "Grandmother", "Brother", "Sister"],
      answer: "Grandmother",
      image: "https://st3.depositphotos.com/10004292/16445/v/950/depositphotos_164457748-stock-illustration-half-body-grandmother-avatar-vector.jpg",
    },
    {
      question: "Who is your father's brother?",
      options: ["Brother", "Mother", "Sister", "Grandfather"],
      answer: "Brother",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4A9git5fha7pJkIBJscT1LOdgcP2NGbnWW6Mkoki_FRJiBs5fuDtvp3ncNeTLL3IuHdg&usqp=CAU",
    },
    {
      question: "Who is your father's daughter?",
      options: ["Father", "Mother", "Grandfather", "Grandmother"],
      answer: "Father",
      image: "https://cdn1.iconfinder.com/data/icons/family-avatar-flat-happy-party/1000/Asian_Female004-512.png",
    },
    {
      question: "Who is your mother's sister?",
      options: ["Sister", "Mother", "Aunt", "Grandmother"],
      answer: "Aunt",
      image: "https://cdn1.iconfinder.com/data/icons/family-avatar-flat-happy-party/1000/Asian_Female004-512.png",
    },
    {
      question: "Who is your mother's son?",
      options: ["Sister", "Mother", "Grandfather", "Brother"],
      answer: "Brother",
      image: "https://cdn1.iconfinder.com/data/icons/family-avatar-flat-happy-party/1000/Asian_Female004-512.png",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAnswerClick = (choice) => {
    setSelectedAnswer(choice);
    if (choice === questions[currentQuestion].answer) {
      setScore(score + 1);
      setFeedbackMessage("Correct! Great job!");
      setIsAnswerCorrect(true);
      if (currentQuestion + 1 === questions.length) {
        setShowConfetti(true);
        setCurrentQuestion(questions.length); // Move to the last question to show completion message
      } else {
        setTimeout(() => {
          setFeedbackMessage("");
          setSelectedAnswer(null);
          setIsAnswerCorrect(null);
          setCurrentQuestion(currentQuestion + 1);
        }, 1000);
      }
    } else {
      setFeedbackMessage("Oops! Try again.");
      setIsAnswerCorrect(false);
    }
  };

  const isQuizComplete = currentQuestion === questions.length;

  // Disable "Next" button if not all questions are answered
  const isNextButtonDisabled = !isQuizComplete;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight - 50} />}
      <div className="flex flex-col items-center bg-white p-10 rounded-lg shadow-lg max-w-lg w-full mx-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Family Members Quiz</h1>

        {!isQuizComplete ? (
          <div className="w-full text-center flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-xl mb-4">{questions[currentQuestion].question}</p>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerClick(option)}
                    className={`py-2 px-4 rounded-lg text-lg font-medium ${
                      selectedAnswer === option ? 
                        isAnswerCorrect === false ? 'bg-red-500' : 'bg-yellow-300'
                        : 'bg-yellow-300'
                    } hover:bg-yellow-200 shadow-md transition-all`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedbackMessage && (
                <p className={`mt-4 text-lg font-semibold ${isAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {feedbackMessage}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl text-green-600 font-bold">Congratulations! You completed the quiz!</p>
          </div>
        )}
      </div>

      <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
        <button
          className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
          onClick={() => window.location.href = '/famillywarmup'}
        >
          Previous
        </button>
        <button
          className={`py-2 px-4 rounded-lg shadow-lg ${isNextButtonDisabled ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white`}
          onClick={() => window.location.href = '/familly3'}
          disabled={isNextButtonDisabled}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FamilyMemberQuiz;