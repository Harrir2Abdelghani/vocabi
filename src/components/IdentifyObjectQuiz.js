import React, { useState, useEffect } from 'react';

// Define API endpoints
const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';
const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random?query=object&client_id=OwC0iinqyhIlF9xvFjP1qUL2mLc28-3Wv7BmwUZAQ-4';

// Helper function to fetch image from a specific API
const fetchImage = async (apiUrl) => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return apiUrl.includes('thecatapi') ? data[0].url : data.message;
};

// Define questions dynamically with images fetched on component mount
const IdentifyObjectQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  // Load questions dynamically on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      const catImage = await fetchImage(CAT_API_URL);
      const dogImage = await fetchImage(DOG_API_URL);
      const objectImage = await fetchImage(UNSPLASH_API_URL);

      setQuestions([
        { id: 1, image: catImage, answer: 'CAT', options: ['DOG', 'CAT', 'RABBIT','LION'] },
        { id: 2, image: dogImage, answer: 'DOG', options: ['CAT', 'FISH', 'DOG', 'RABBIT'] },
        { id: 3, image: objectImage, answer: 'OBJECT', options: ['CAR', 'OBJECT', 'TREE', 'HOUSE'] },
      ]);
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].answer) {
      setFeedback('Correct! 🎉');
    } else {
      setFeedback('Oops! Try again. 😢');
    }
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setFeedback('');
  };

  if (loading) {
    return <div className="p-4 text-center">Loading quiz...</div>;
  }

  if (currentQuestion >= questions.length) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold">Quiz Completed!</h2>
        <p className="text-lg">Great job! You answered all the questions!</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-center bg-gradient-to-b from-blue-100 to-blue-50 min-h-screen flex flex-col items-center justify-center space-y-6">
  <h2 className="text-3xl font-extrabold text-blue-700 mb-6">Identify the Object Quiz</h2>
  
  <div className="flex items-center justify-center h-64 mb-6">
    <img
      src={questions[currentQuestion].image}
      alt="Quiz object"
      className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
    />
  </div>

  <p className="text-xl font-medium text-gray-700 mb-4">What is this?</p>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 w-full max-w-md">
    {questions[currentQuestion].options.map((option) => (
      <button
        key={option}
        onClick={() => handleAnswer(option)}
        className="bg-purple-500 text-white py-3 rounded-lg w-full transition-transform transform hover:scale-105 hover:bg-purple-600"
      >
        {option}
      </button>
    ))}
  </div>

  {feedback && (
    <p className="text-lg font-semibold text-green-600 mb-4 animate-pulse">
      {feedback}
    </p>
  )}

  {feedback && currentQuestion < questions.length - 1 && (
    <button
      onClick={nextQuestion}
      className="bg-purple-600 text-white py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:bg-purple-700"
    >
      Next Question
    </button>
  )}
</div>

  );
};

export default IdentifyObjectQuiz;
