import { useUserProfile } from './UserProfileContext';

export const useScoreManager = () => {
  const { updateScore, updateLevel, completeGame } = useUserProfile();

  const awardPoints = (points, reason = '') => {
    updateScore(points);
    
    // Show a nice animation or notification
    if (typeof window !== 'undefined') {
      // You can add a toast notification here
      console.log(`+${points} points! ${reason}`);
    }
  };

  const levelUp = (newLevel) => {
    updateLevel(newLevel);
    awardPoints(100, 'Level up bonus!');
  };

  const gameCompleted = (basePoints = 50) => {
    completeGame();
    awardPoints(basePoints, 'Game completed!');
  };

  const perfectScore = () => {
    awardPoints(200, 'Perfect score bonus!');
  };

  const firstTry = () => {
    awardPoints(50, 'First try bonus!');
  };

  const speedBonus = () => {
    awardPoints(25, 'Speed bonus!');
  };

  return {
    awardPoints,
    levelUp,
    gameCompleted,
    perfectScore,
    firstTry,
    speedBonus
  };
};