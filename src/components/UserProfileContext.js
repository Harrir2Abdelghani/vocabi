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
      try {
        const profile = JSON.parse(savedProfile);
        // Validate that the profile has required fields
        if (profile && profile.name && profile.avatar) {
          setUserProfile(profile);
          setIsProfileComplete(true);
        } else {
          // Clear invalid profile
          localStorage.removeItem('vocabiUserProfile');
        }
      } catch (error) {
        console.error('Error parsing saved profile:', error);
        localStorage.removeItem('vocabiUserProfile');
      }
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile && userProfile.name && userProfile.avatar) {
      try {
        localStorage.setItem('vocabiUserProfile', JSON.stringify(userProfile));
      } catch (error) {
        console.error('Error saving profile to localStorage:', error);
      }
    }
  }, [userProfile]);

  const updateProfile = (newProfile) => {
    // Ensure the profile has all required fields
    const completeProfile = {
      name: newProfile.name || '',
      gender: newProfile.gender || '',
      avatar: newProfile.avatar || {},
      score: newProfile.score || 0,
      level: newProfile.level || 1,
      gamesCompleted: newProfile.gamesCompleted || 0,
      ...newProfile
    };
    
    setUserProfile(completeProfile);
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
    try {
      localStorage.removeItem('vocabiUserProfile');
      setUserProfile(null);
      setIsProfileComplete(false);
    } catch (error) {
      console.error('Error removing profile from localStorage:', error);
    }
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