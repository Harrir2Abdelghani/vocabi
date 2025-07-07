import React, { useState, useRef } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import GameWrapper from './GameSystem';

const DayGame = () => {
  // List of days with associated Tailwind color classes
  const daysData = [
    { name: "Monday", color: "bg-red-500" },
    { name: "Tuesday", color: "bg-blue-500" },
    { name: "Wednesday", color: "bg-green-500" },
    { name: "Thursday", color: "bg-yellow-500" },
    { name: "Friday", color: "bg-purple-500" },
    { name: "Saturday", color: "bg-pink-500" },
    { name: "Sunday", color: "bg-indigo-500" },
  ];

  // State for available days, target day, score, and emoji animations
  const [availableDays, setAvailableDays] = useState(daysData);
  const getRandomDay = (daysList) =>
    daysList[Math.floor(Math.random() * daysList.length)];
  const [targetDay, setTargetDay] = useState(getRandomDay(daysData));
  const [emojiAnimations, setEmojiAnimations] = useState([]);

  // Refs for container (to position the emoji) and for buttons.
  const containerRef = useRef(null);
  const buttonRefs = useRef({});

  // When a day button is clicked...
  const handleDayClick = (day, gameProps) => {
    if (!containerRef.current) return;
    const buttonEl = buttonRefs.current[day.name];
    if (buttonEl) {
      // Get the bounding rectangles of the container and button.
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = buttonEl.getBoundingClientRect();

      // Calculate the center of the button.
      const centerX = (buttonRect.left + buttonRect.right) / 2;
      const centerY = (buttonRect.top + buttonRect.bottom) / 2;

      // Compute coordinates relative to the container.
      const relativeX = centerX - containerRect.left;
      const relativeY = centerY - containerRect.top;

      // Determine the emoji type: "success" for correct (✅) and "error" for wrong (❌)
      const isCorrect = day.name === targetDay.name;
      const animType = isCorrect ? "success" : "error";
      const newAnim = {
        id: day.name + '-' + Date.now(),
        type: animType,
        x: relativeX,
        y: relativeY,
      };

      // Add the emoji animation.
      setEmojiAnimations((prev) => [...prev, newAnim]);

      // Remove the emoji after 2 seconds.
      setTimeout(() => {
        setEmojiAnimations((prev) =>
          prev.filter((anim) => anim.id !== newAnim.id)
        );
      }, 2000);
    }

    // Game logic: if correct answer, update score and remove the day.
    if (day.name === targetDay.name) {
      gameProps.addPoints(10);
      const newDays = availableDays.filter((d) => d.name !== day.name);
      setAvailableDays(newDays);
      
      // Update the target day after 2 seconds (to allow the emoji animation)
      setTimeout(() => {
        if (newDays.length > 0) {
          setTargetDay(getRandomDay(newDays));
        } else {
          // Game completed!
          gameProps.gameComplete();
        }
      }, 2000);
    } else {
      // Wrong answer - lose a heart
      const canContinue = gameProps.loseHeart();
      if (!canContinue) {
        // Game over
        return;
      }
    }
  };

  // Helper: add extra classes to the last button in a row.
  const getButtonExtraClasses = (index, total) => {
    let classes = "";
    const isLastItem = index === total - 1;
    if (total % 1 === 1 && isLastItem) {
      classes += " col-span-2";
    }
    if (total % 3 === 1 && isLastItem) {
      classes += " sm:col-start-2";
    }
    return classes;
  };

  const GameContent = (gameProps) => {
    if (gameProps.gameEnded) {
      return null; // GameWrapper handles the end screen
    }

    return (
      <div
        ref={containerRef}
        className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      >
        {/* Confetti effect when game is complete */}
        {availableDays.length === 0 && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}

        <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md w-full z-10 border border-white/20">
          <h1 className="text-4xl font-extrabold text-center mb-6 text-white">
            Find the match!
          </h1>
          {availableDays.length > 0 ? (
            <>
              {/* Animated target day display */}
              <p className="text-xl text-center mb-6 text-white">
                <span>Find: </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={targetDay.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                    className="font-bold inline-block ml-2 text-yellow-300 text-2xl"
                  >
                    {targetDay.name}
                  </motion.span>
                </AnimatePresence>
              </p>

              {/* Grid of day buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {availableDays.map((day, index) => (
                  <motion.button
                    key={day.name}
                    // Save each button's ref.
                    ref={(el) => (buttonRefs.current[day.name] = el)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDayClick(day, gameProps)}
                    className={`${day.color} hover:opacity-90 text-white py-3 px-2 rounded-lg shadow-lg transition-all duration-300 font-bold${getButtonExtraClasses(
                      index,
                      availableDays.length
                    )}`}
                    disabled={gameProps.gameEnded}
                  >
                    {day.name}
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            // Game completion message
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold mb-4 text-green-400"
              >
                Congratulations! 🎉🎉
              </motion.p>
            </div>
          )}
        </div>

        {/* Animated emoji feedback overlay */}
        <AnimatePresence>
          {emojiAnimations.map((anim) => (
            // The wrapping div ensures the emoji's center aligns with the computed (x, y)
            <div
              key={anim.id}
              style={{
                position: 'absolute',
                left: anim.x,
                top: anim.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -50, scale: 1.5 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 2 }}
                className="text-3xl"
              >
                {anim.type === "success" ? "✅" : "❌"}
              </motion.div>
            </div>
          ))}
        </AnimatePresence>

        <div className="w-full fixed bottom-4 left-0 flex justify-between px-4">
          <button
            className="py-2 px-4 bg-red-500/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-red-600/80 border border-white/20"
            onClick={() => window.location.href = '/'}
          >
            ⬅ Previous
          </button>
          <button
            disabled={availableDays.length > 0}
            className={`py-2 px-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm ${
              availableDays.length > 0 
                ? "bg-gray-400/50 cursor-not-allowed text-gray-300" 
                : "bg-red-500/80 hover:bg-red-600/80 text-white"
            }`}
            onClick={() => !availableDays.length && (window.location.href = '/days2')}
          >
            ➡ Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <GameWrapper
      gameName="Days Matcher"
      maxTime={180} // 3 minutes
      maxHearts={3}
      onGameComplete={(result) => {
        console.log('Game completed!', result);
        // Navigate to next game after a delay
        setTimeout(() => {
          window.location.href = '/days2';
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

export default DayGame;