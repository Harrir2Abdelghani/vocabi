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

  // Load profile immediately on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const getDeviceId = () => {
    let deviceId = localStorage.getItem('vocabiDeviceId');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('vocabiDeviceId', deviceId);
    }
    return deviceId;
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // First check localStorage for immediate loading
      const localProfile = localStorage.getItem('vocabiUserProfile');
      if (localProfile) {
        try {
          const profile = JSON.parse(localProfile);
          if (profile && profile.name && profile.avatar) {
            setUserProfile(profile);
            setIsProfileComplete(true);
            setLoading(false);
            
            // Sync with Supabase in background
            syncWithSupabase(profile);
            return;
          }
        } catch (e) {
          console.error('Error parsing local profile:', e);
          localStorage.removeItem('vocabiUserProfile');
        }
      }

      // Try to load from Supabase
      const deviceId = getDeviceId();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (data && !error) {
        // Convert database format to app format
        const profileData = {
          name: data.name,
          gender: data.gender,
          avatar: data.avatar,
          score: data.score || 0,
          level: data.level || 1,
          gamesCompleted: data.games_completed || 0,
          totalPlaytime: data.total_playtime || 0,
          favoriteGame: data.favorite_game || '',
          streakDays: data.streak_days || 0,
          achievements: data.achievements || [],
          device_id: data.device_id
        };
        
        setUserProfile(profileData);
        setIsProfileComplete(true);
        localStorage.setItem('vocabiUserProfile', JSON.stringify(profileData));
      } else {
        // No profile found, user needs to create one
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setIsProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const syncWithSupabase = async (profile) => {
    try {
      const deviceId = getDeviceId();
      await supabase
        .from('user_profiles')
        .upsert({
          device_id: deviceId,
          name: profile.name,
          gender: profile.gender,
          avatar: profile.avatar,
          score: profile.score || 0,
          level: profile.level || 1,
          games_completed: profile.gamesCompleted || 0,
          total_playtime: profile.totalPlaytime || 0,
          favorite_game: profile.favoriteGame || '',
          streak_days: profile.streakDays || 0,
          achievements: profile.achievements || [],
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'device_id'
        });
    } catch (error) {
      console.error('Background sync failed:', error);
    }
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
        total_playtime: newProfile.totalPlaytime || 0,
        favorite_game: newProfile.favoriteGame || '',
        streak_days: newProfile.streakDays || 0,
        achievements: newProfile.achievements || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(completeProfile, { 
          onConflict: 'device_id'
        })
        .select()
        .single();

      let profileData;
      if (data && !error) {
        // Convert to app format
        profileData = {
          name: data.name,
          gender: data.gender,
          avatar: data.avatar,
          score: data.score || 0,
          level: data.level || 1,
          gamesCompleted: data.games_completed || 0,
          totalPlaytime: data.total_playtime || 0,
          favoriteGame: data.favorite_game || '',
          streakDays: data.streak_days || 0,
          achievements: data.achievements || [],
          device_id: data.device_id
        };
      } else {
        // Fallback to local data
        profileData = { 
          ...newProfile, 
          gamesCompleted: newProfile.gamesCompleted || 0,
          totalPlaytime: newProfile.totalPlaytime || 0,
          favoriteGame: newProfile.favoriteGame || '',
          streakDays: newProfile.streakDays || 0,
          achievements: newProfile.achievements || [],
          device_id: deviceId
        };
      }

      // Update local state
      setUserProfile(profileData);
      setIsProfileComplete(true);
      
      // Update localStorage
      localStorage.setItem('vocabiUserProfile', JSON.stringify(profileData));
    } catch (error) {
      console.error('Error saving profile:', error);
      // Fallback to localStorage only
      const fallbackProfile = { 
        ...newProfile, 
        gamesCompleted: newProfile.gamesCompleted || 0,
        totalPlaytime: newProfile.totalPlaytime || 0,
        favoriteGame: newProfile.favoriteGame || '',
        streakDays: newProfile.streakDays || 0,
        achievements: newProfile.achievements || [],
        device_id: getDeviceId()
      };
      setUserProfile(fallbackProfile);
      setIsProfileComplete(true);
      localStorage.setItem('vocabiUserProfile', JSON.stringify(fallbackProfile));
    }
  };

  const updateScore = async (points) => {
    if (!userProfile) return;
    
    const updatedProfile = {
      ...userProfile,
      score: userProfile.score + points
    };

    try {
      await supabase
        .from('user_profiles')
        .update({ 
          score: updatedProfile.score, 
          updated_at: new Date().toISOString() 
        })
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
      level: Math.max(userProfile.level, newLevel)
    };

    try {
      await supabase
        .from('user_profiles')
        .update({ 
          level: updatedProfile.level, 
          updated_at: new Date().toISOString() 
        })
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
      gamesCompleted: userProfile.gamesCompleted + 1
    };

    try {
      await supabase
        .from('user_profiles')
        .update({ 
          games_completed: updatedProfile.gamesCompleted, 
          updated_at: new Date().toISOString() 
        })
        .eq('device_id', getDeviceId());
    } catch (error) {
      console.error('Error updating games completed:', error);
    }

    setUserProfile(updatedProfile);
    localStorage.setItem('vocabiUserProfile', JSON.stringify(updatedProfile));
  };

  const updatePlaytime = async (minutes) => {
    if (!userProfile) return;
    
    const updatedProfile = {
      ...userProfile,
      totalPlaytime: userProfile.totalPlaytime + minutes
    };

    try {
      await supabase
        .from('user_profiles')
        .update({ 
          total_playtime: updatedProfile.totalPlaytime, 
          updated_at: new Date().toISOString() 
        })
        .eq('device_id', getDeviceId());
    } catch (error) {
      console.error('Error updating playtime:', error);
    }

    setUserProfile(updatedProfile);
    localStorage.setItem('vocabiUserProfile', JSON.stringify(updatedProfile));
  };

  const addAchievement = async (achievement) => {
    if (!userProfile) return;
    
    const achievements = userProfile.achievements || [];
    if (achievements.includes(achievement)) return; // Already has this achievement
    
    const updatedProfile = {
      ...userProfile,
      achievements: [...achievements, achievement]
    };

    try {
      await supabase
        .from('user_profiles')
        .update({ 
          achievements: updatedProfile.achievements, 
          updated_at: new Date().toISOString() 
        })
        .eq('device_id', getDeviceId());
    } catch (error) {
      console.error('Error adding achievement:', error);
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
      
      // Also clean up game sessions and stats
      await supabase
        .from('game_sessions')
        .delete()
        .eq('device_id', deviceId);
        
      await supabase
        .from('game_stats')
        .delete()
        .eq('device_id', deviceId);
      
      localStorage.removeItem('vocabiUserProfile');
      localStorage.removeItem('vocabiDeviceId');
      setUserProfile(null);
      setIsProfileComplete(false);
    } catch (error) {
      console.error('Error resetting profile:', error);
      // Fallback to just clearing localStorage
      localStorage.removeItem('vocabiUserProfile');
      localStorage.removeItem('vocabiDeviceId');
      setUserProfile(null);
      setIsProfileComplete(false);
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
    updatePlaytime,
    addAchievement,
    resetProfile
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};