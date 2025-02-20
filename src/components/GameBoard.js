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
  const [gameFinished, setGameFinished] = React.useState(false); 
  const [currentRound, setCurrentRound] = React.useState(0); 
  
  const totalRounds = 6; 
  
  
  function NewGame() { 
    setTimeout(() => { 
      const randomOrderArray = Data.sort(() => 0.5 - Math.random()); 
      setCardsArray(randomOrderArray); 
      setMoves(0); 
      setFirstCard(null); 
      setSecondCard(null); 
      setWon(0); 
      setGameFinished(false); 
    }, 1200); 
  } 

  
  function handleSelectedCards(item) { 
    if (firstCard !== null && firstCard.id !== item.id) { 
      setSecondCard(item); 
    } else { 
      setFirstCard(item); 
    } 
  } 

  
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

  
  function removeSelection() { 
    setFirstCard(null); 
    setSecondCard(null); 
    setStopFlip(false); 
    setMoves((prevValue) => prevValue + 1); 
  } 

  
  React.useEffect(() => { 
    NewGame(); 
  }, []); 

  
  React.useEffect(() => {
    if (won === totalRounds) {
      setGameFinished(true);
    }
  }, [won]);

  
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
    <div className="bg-gray-300 min-h-screen flex flex-col justify-center items-center"> 
      {gameFinished && <Confetti />} 


      <div className="grid grid-cols-4 gap-10 mb-4 mt-10"> 
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
    onClick={() => window.location.href = '/'}
  >
    Previous
  </button>
  <button
    className={`py-2 px-4 text-white rounded-lg shadow-lg ${
      gameFinished ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"
    }`}
    onClick={() => window.location.href = '/jobs2'}
    disabled={!gameFinished} // Disable button if game is not finished
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
