import { useState, useEffect } from 'react';
import wakeUpImg from '../Assets/wake-up.png';
import breakfastImg from '../Assets/breakfast.png';
import brushTeethImg from '../Assets/brush-teeth.png';
import getDressedImg from '../Assets/get-dressed.png';
import backpackImg from '../Assets/backpack.png';
import schoolImg from '../Assets/school.png';
import GameWrapper from './GameSystem';

export default function DailyRoutineGame() {
  const [activities, setActivities] = useState([
    { id: 1, name: 'Wake Up', image: wakeUpImg, color: 'bg-yellow-200', order: null },
    { id: 2, name: 'Eat Breakfast', image: breakfastImg, color: 'bg-orange-200', order: null },
    { id: 3, name: 'Brush Teeth', image: brushTeethImg, color: 'bg-blue-200', order: null },
    { id: 4, name: 'Get Dressed', image: getDressedImg, color: 'bg-green-200', order: null },
    { id: 5, name: 'Pack Backpack', image: backpackImg, color: 'bg-purple-200', order: null },
    { id: 6, name: 'Go to School', image: schoolImg, color: 'bg-red-200', order: 5 }, 
  ]);
  
  const [draggingId, setDraggingId] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [shuffledActivities, setShuffledActivities] = useState([]);
  
  useEffect(() => {
    const shuffled = [...activities.filter(a => a.id !== 6)].sort(() => Math.random() - 0.5);
    setShuffledActivities(shuffled);
  }, []);
  
  useEffect(() => {
    if (activities.filter(activity => activity.id !== 6).every(activity => activity.order !== null)) {
      setGameCompleted(true);
    }
  }, [activities]);
  
  const handleDragStart = (id) => {
    setDraggingId(id);
  };
  
  const handleDrop = (index, gameProps) => {
    if (draggingId !== null) {
      const draggedActivity = activities.find(a => a.id === draggingId);
      const correctOrder = [1, 2, 3, 4, 5]; // Correct order of activities (excluding school)
      
      if (draggedActivity && correctOrder[index] === draggingId) {
        // Correct placement
        setActivities(activities.map(activity => 
          activity.id === draggingId ? { ...activity, order: index } : activity
        ));
        gameProps.addPoints(15); // Award points for correct placement
        setDraggingId(null);
      } else {
        // Wrong placement - lose a heart
        const canContinue = gameProps.loseHeart();
        if (!canContinue) {
          return; // Game over
        }
        setDraggingId(null);
      }
    }
  };
  
  const resetGame = () => {
    const resetActivities = activities.map(activity => 
      activity.id === 6 ? activity : { ...activity, order: null }
    );
    setActivities(resetActivities);
    
    const shuffled = [...resetActivities.filter(a => a.id !== 6)].sort(() => Math.random() - 0.5);
    setShuffledActivities(shuffled);
    
    setGameCompleted(false);
  };

  const GameContent = (gameProps) => {
    // Check if game is complete
    useEffect(() => {
      if (gameCompleted && !gameProps.gameEnded) {
        gameProps.gameComplete();
      }
    }, [gameCompleted, gameProps]);

    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }
    
    return (
      <div className="w-full max-w-6xl mt-20 mx-auto p-6 bg-gradient-to-b from-blue-50/20 to-purple-50/20 backdrop-blur-xl rounded-xl shadow-lg border border-white/20">
        <header className="mb-4 -mt-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">What is your daily routine before going to school!</h1>
        </header>
        
        {gameCompleted ? (
          <div className="mt-10 text-center animate-fade-in">
            <div className="text-4xl font-extrabold text-green-400 mb-4">
              🎉 Awesome Work! 🎉
            </div>

            <div className="p-6 bg-gradient-to-r from-yellow-100/20 to-yellow-200/20 rounded-xl shadow-lg mb-6 backdrop-blur-sm border border-white/20">
              <p className="text-2xl text-white font-semibold">
                You nailed your morning routine like a pro! 🌞👏
              </p>
              <p className="mt-2 text-lg text-white/80">
                Ready to play again or continue your journey?
              </p>
            </div>

            <button 
              onClick={resetGame}
              className="mb-6 px-8 py-4 bg-purple-600/80 backdrop-blur-sm text-white font-bold rounded-full shadow-xl hover:bg-purple-700/80 transform hover:scale-110 transition-all duration-300 border border-white/20"
            >
              🔁 Play Again
            </button>

            <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
              <button
                className="py-3 px-6 bg-red-500/80 backdrop-blur-sm text-white rounded-xl shadow-lg hover:bg-red-600/80 transition border border-white/20"
                onClick={() => window.location.href = '/'}
              >
                ⬅ Previous
              </button>
              <button
                className="py-3 px-6 bg-red-500/80 backdrop-blur-sm text-white rounded-xl shadow-lg hover:bg-red-600/80 transition border border-white/20"
                onClick={() => window.location.href = '/daily2'}
              >
                Next ➡
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {/* Source area - drag from here */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white/20">
              <div className="grid grid-cols-5 gap-3 -mb-4">
                {shuffledActivities.map((activity) => (
                  activity.order === null && (
                    <div
                      key={activity.id}
                      className={`p-2 w-52 h-44 ${activity.color} rounded-lg shadow-md cursor-move flex flex-col items-center justify-center transition-transform transform hover:scale-105`}
                      draggable
                      onDragStart={() => handleDragStart(activity.id)}
                    >
                      <img src={activity.image} alt={activity.name} className="w-48 h-40" />
                    </div>
                  )
                ))}
              </div>
            </div> 
            {/* Target area - drop here */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white/20">
              <h2 className="text-xl font-bold text-white mb-2 -mt-4">My Routine Order:</h2>
              <div className="grid grid-cols-6 gap-3">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const placedActivity = activities.find(a => a.order === index);
                  
                  return (
                    <div 
                      key={index}
                      className={`h-24 rounded-lg flex flex-col -mb-3 items-center justify-center ${
                        placedActivity 
                          ? placedActivity.color 
                          : 'bg-gray-100/20 border-2 border-dashed border-gray-300'
                      }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(index, gameProps)}
                    >
                      {placedActivity ? (
                        <>
                          <img src={placedActivity.image} alt={placedActivity.name} className="w-28 h-28" />
                        </>
                      ) : (
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div> 
            <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
              <button
                className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
                onClick={() => window.location.href = '/'}
              >
                ⬅ Previous
              </button>
              <button
                className={`py-2 px-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
                  gameCompleted ? 'bg-red-500/80 hover:bg-red-600/80 text-white' : 'bg-gray-400/50 cursor-not-allowed text-gray-300'
                }`}
                onClick={() => !gameCompleted || (window.location.href = '/daily2')}
                disabled={!gameCompleted}
              >
                Next ➡
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <GameWrapper
      gameName="Daily Routine"
      maxTime={300} // 5 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        setTimeout(() => {
          window.location.href = '/daily2';
        }, 3000);
      }}
      onGameFail={(result) => {
        console.log('Game failed!', result);
      }}
    >
      <GameContent />
    </GameWrapper>
  );
}