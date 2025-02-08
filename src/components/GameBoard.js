import React from "react"; 
import Data from "./Data"; 
import Card from "./Card"; 
import Confetti from 'react-confetti';

function GameBoard() { 
  const [cardsArray, setCardsArray] = React.useState([]); 
  const [moves, setMoves] = React.useState(0); 
  const [firstCard, setFirstCard] = React.useState(null); 
  const [secondCard, setSecondCard] = React.useState(null); 
  const [stopFlip, setStopFlip] = React.useState(false); 
  const [won, setWon] = React.useState(0); 
  const [gameFinished, setGameFinished] = React.useState(false); // To track if game is finished
  const [currentRound, setCurrentRound] = React.useState(0); // Track the current round
  
  const totalRounds = 6; // Total rounds to win the game
  
  // This function starts a new game
  function NewGame() { 
    setTimeout(() => { 
      const randomOrderArray = Data.sort(() => 0.5 - Math.random()); 
      setCardsArray(randomOrderArray); 
      setMoves(0); 
      setFirstCard(null); 
      setSecondCard(null); 
      setWon(0); 
      setGameFinished(false); // Reset the game finished status
    }, 1200); 
  } 

  // This function helps in storing the firstCard and secondCard value
  function handleSelectedCards(item) { 
    if (firstCard !== null && firstCard.id !== item.id) { 
      setSecondCard(item); 
    } else { 
      setFirstCard(item); 
    } 
  } 

  // Check for card match and handle win condition
  React.useEffect(() => { 
    if (firstCard && secondCard) { 
      setStopFlip(true); 
      if (firstCard.name === secondCard.name) { 
        setCardsArray((prevArray) => { 
          return prevArray.map((unit) => { 
            if (unit.name === firstCard.name) { 
              return { ...unit, matched: true }; 
            } else { 
              return unit; 
            } 
          }); 
        }); 
        setWon((preVal) => preVal + 1); 
        removeSelection(); 
      } else { 
        setTimeout(() => { 
          removeSelection(); 
        }, 1000); 
      } 
    } 
  }, [firstCard, secondCard]); 

  // After the selected images have been checked, reset the selected cards
  function removeSelection() { 
    setFirstCard(null); 
    setSecondCard(null); 
    setStopFlip(false); 
    setMoves((prevValue) => prevValue + 1); 
  } 

  // Starts the game when the component loads
  React.useEffect(() => { 
    NewGame(); 
  }, []); 

  // Track when the game is finished
  React.useEffect(() => {
    if (won === totalRounds) {
      setGameFinished(true);
    }
  }, [won]);

  // Handle next and previous round buttons
  function handleNext() {
    if (gameFinished && currentRound < totalRounds - 1) {
      setCurrentRound(currentRound + 1);
      NewGame();
    }
  }

  function handlePrevious() {
    if (currentRound > 0) {
      setCurrentRound(currentRound - 1);
      NewGame();
    }
  }

  return ( 
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center"> 
      {gameFinished && <Confetti />} {/* Show confetti when the game is finished */}


      <div className="grid grid-cols-4 gap-4 mb-8 mt-10"> 
        { 
          cardsArray.map((item) => ( 
            <Card 
              item={item} 
              key={item.id} 
              handleSelectedCards={handleSelectedCards} 
              toggled={ 
                item === firstCard || 
                item === secondCard || 
                item.matched === true
              } 
              stopflip={stopFlip} 
            /> 
          )) 
        } 
      </div> 

      {won !== totalRounds ? ( 
        <div className="text-xl text-gray-700"></div> 
      ) : ( 
        <div className="text-2xl text-green-500 font-semibold">You Won! 🎉</div> 
      )}

<div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
  <button
    className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
    onClick={() => window.location.href = '/jobswarmup'}
  >
    Previous
  </button>
  <button
    className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
    onClick={() => window.location.href = '/jobs3'}
  >
    Next
  </button>
</div>

<div className="flex justify-center mt-4">
  <button
    className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 flex items-center"
    onClick={() => window.location.reload()}
  >
    🔄 Restart Game
  </button>
</div>
    </div> 
  ); 
} 

export default GameBoard;
