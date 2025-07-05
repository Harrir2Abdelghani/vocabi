import React, { createContext, useContext, useState, useEffect } from 'react';

const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('vocabiUserProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setIsProfileComplete(true);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('vocabiUserProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const updateProfile = (newProfile) => {
    setUserProfile(newProfile);
    setIsProfileComplete(true);
  };

  const updateScore = (points) => {
    if (userProfile) {
      setUserProfile(prev => ({
        ...prev,
        score: prev.score + points
      }));
    }
  };

  const updateLevel = (newLevel) => {
    if (userProfile) {
      setUserProfile(prev => ({
        ...prev,
        level: Math.max(prev.level, newLevel)
      }));
    }
  };

  const completeGame = () => {
    if (userProfile) {
      setUserProfile(prev => ({
        ...prev,
        gamesCompleted: prev.gamesCompleted + 1
      }));
    }
  };

  const resetProfile = () => {
    localStorage.removeItem('vocabiUserProfile');
    setUserProfile(null);
    setIsProfileComplete(false);
  };

  const value = {
    userProfile,
    isProfileComplete,
    updateProfile,
    updateScore,
    updateLevel,
    completeGame,
    resetProfile
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};