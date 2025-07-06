import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  const [loading, setLoading] = useState(true);

  // Load profile from Supabase on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // First try localStorage for immediate loading
      const localProfile = localStorage.getItem('vocabiUserProfile');
      if (localProfile) {
        const profile = JSON.parse(localProfile);
        if (profile && profile.name && profile.avatar) {
          setUserProfile(profile);
          setIsProfileComplete(true);
        }
      }

      // Then sync with Supabase
      const deviceId = getDeviceId();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('device_id', deviceId)
        .single();

      if (data && !error) {
        setUserProfile(data);
        setIsProfileComplete(true);
        // Update localStorage
        localStorage.setItem('vocabiUserProfile', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceId = () => {
    let deviceId = localStorage.getItem('vocabiDeviceId');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('vocabiDeviceId', deviceId);
    }
    return deviceId;
  };

  const updateProfile = async (newProfile) => {
    try {
      const deviceId = getDeviceId();
      const completeProfile = {
        device_id: deviceId,
        name: newProfile.name || '',
        gender: newProfile.gender || '',
        avatar: newProfile.avatar || {},
        score: newProfile.score || 0,
        level: newProfile.level || 1,
        games_completed: newProfile.gamesCompleted || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(completeProfile, { 
          onConflict: 'device_id',
          returning: 'representation'
        })
        .single();

      if (error) throw error;

      // Update local state
      setUserProfile(data);
      setIsProfileComplete(true);
      
      // Update localStorage
      localStorage.setItem('vocabiUserProfile', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving profile:', error);
      // Fallback to localStorage only
      const fallbackProfile = { ...newProfile, gamesCompleted: newProfile.gamesCompleted || 0 };
      setUserProfile(fallbackProfile);
      setIsProfileComplete(true);
      localStorage.setItem('vocabiUserProfile', JSON.stringify(fallbackProfile));
    }
  };

  const updateScore = async (points) => {
    if (!userProfile) return;
    
    const updatedProfile = {
      ...userProfile,
      score: userProfile.score + points,
      updated_at: new Date().toISOString()
    };

    try {
      await supabase
        .from('user_profiles')
        .update({ score: updatedProfile.score, updated_at: updatedProfile.updated_at })
        .eq('device_id', getDeviceId());
    } catch (error) {
      console.error('Error updating score:', error);
    }

    setUserProfile(updatedProfile);
    localStorage.setItem('vocabiUserProfile', JSON.stringify(updatedProfile));
  };

  const updateLevel = async (newLevel) => {
    if (!userProfile) return;
    
    const updatedProfile = {
      ...userProfile,
      level: Math.max(userProfile.level, newLevel),
      updated_at: new Date().toISOString()
    };

    try {
      await supabase
        .from('user_profiles')
        .update({ level: updatedProfile.level, updated_at: updatedProfile.updated_at })
        .eq('device_id', getDeviceId());
    } catch (error) {
      console.error('Error updating level:', error);
    }

    setUserProfile(updatedProfile);
    localStorage.setItem('vocabiUserProfile', JSON.stringify(updatedProfile));
  };

  const completeGame = async () => {
    if (!userProfile) return;
    
    const updatedProfile = {
      ...userProfile,
      games_completed: userProfile.games_completed + 1,
      updated_at: new Date().toISOString()
    };

    try {
      await supabase
        .from('user_profiles')
        .update({ games_completed: updatedProfile.games_completed, updated_at: updatedProfile.updated_at })
        .eq('device_id', getDeviceId());
    } catch (error) {
      console.error('Error updating games completed:', error);
    }

    setUserProfile(updatedProfile);
    localStorage.setItem('vocabiUserProfile', JSON.stringify(updatedProfile));
  };

  const resetProfile = async () => {
    try {
      const deviceId = getDeviceId();
      await supabase
        .from('user_profiles')
        .delete()
        .eq('device_id', deviceId);
      
      localStorage.removeItem('vocabiUserProfile');
      setUserProfile(null);
      setIsProfileComplete(false);
    } catch (error) {
      console.error('Error resetting profile:', error);
    }
  };

  const value = {
    userProfile,
    isProfileComplete,
    loading,
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