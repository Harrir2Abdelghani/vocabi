import React, { useState } from 'react';

const FamilyMemberQuiz = () => {
  const questions = [
    {
      question: "Who is the father's father?",
      options: ["Mother", "Grandfather", "Sister", "Brother"],
      answer: "Grandfather",
      image: "https://img.freepik.com/vecteurs-premium/grand-pere-personnage-personnage-avatar-vecteur-illustration-design_24877-15541.jpg", // Placeholder image, replace with actual image URLs
    },
    {
      question: "Who is the father's mother?",
      options: ["Grandfather", "Grandmother", "Brother", "Sister"],
      answer: "Grandfather",
      image: "https://st3.depositphotos.com/10004292/16445/v/950/depositphotos_164457748-stock-illustration-half-body-grandmother-avatar-vector.jpg",
    },
    {
      question: "Who is your father's son?",
      options: ["Brother", "Mother", "Sister", "Grandfather"],
      answer: "Brother",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4A9git5fha7pJkIBJscT1LOdgcP2NGbnWW6Mkoki_FRJiBs5fuDtvp3ncNeTLL3IuHdg&usqp=CAU",
    },
    {
      question: "Who is your father's daughter?",
      options: ["Sister", "Mother", "Grandfather", "Grandmother"],
      answer: "Sister",
      image: "https://cdn1.iconfinder.com/data/icons/family-avatar-flat-happy-party/1000/Asian_Female004-512.png",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerClick = (choice) => {
    if (choice === questions[currentQuestion].answer) {
      setScore(score + 1);
      setFeedbackMessage("Correct! Great job!");
    } else {
      setFeedbackMessage("Oops! Try again.");
    }
    setSelectedAnswer(choice);
    setTimeout(() => {
      setFeedbackMessage("");
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }, 1000);
  };

  const isQuizComplete = currentQuestion === questions.length;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
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
                      selectedAnswer === option ? 'bg-yellow-300' : 'bg-yellow-300'
                    } hover:bg-yellow-200 shadow-md transition-all`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedbackMessage && (
                <p className="mt-4 text-lg font-semibold text-green-600">{feedbackMessage}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl text-green-600 font-bold">Congratulations! You completed the quiz!</p>
          </div>
        )}
      </div>

      <div className="flex justify-between w-full max-w-lg mt-6 px-4">
        <button
          className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
          onClick={() => window.location.href = '/famillywarmup'}
        >
          Previous
        </button>
        <button
          className={`py-2 px-4 rounded-lg shadow-lg ${
            isQuizComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-pink-300'
          } text-white`}
          disabled={!isQuizComplete}
          onClick={() => window.location.href = '/familly3'}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FamilyMemberQuiz;
