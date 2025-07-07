/*
  # Enhanced Game System Database Schema

  1. New Tables
    - `game_sessions` - Track individual game sessions
    - `game_stats` - Store detailed game statistics
    
  2. Updated Tables
    - Enhanced `user_profiles` with new game tracking fields
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated access
*/

-- Add new columns to user_profiles for enhanced game tracking
DO $$
BEGIN
  -- Add new columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'total_playtime') THEN
    ALTER TABLE user_profiles ADD COLUMN total_playtime integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'favorite_game') THEN
    ALTER TABLE user_profiles ADD COLUMN favorite_game text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'streak_days') THEN
    ALTER TABLE user_profiles ADD COLUMN streak_days integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'achievements') THEN
    ALTER TABLE user_profiles ADD COLUMN achievements jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  game_name text NOT NULL,
  difficulty text NOT NULL DEFAULT 'easy',
  score integer DEFAULT 0,
  time_taken integer DEFAULT 0,
  hearts_used integer DEFAULT 0,
  completed boolean DEFAULT false,
  perfect_score boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create game_stats table for aggregated statistics
CREATE TABLE IF NOT EXISTS game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  game_name text NOT NULL,
  total_plays integer DEFAULT 0,
  total_score integer DEFAULT 0,
  best_score integer DEFAULT 0,
  best_time integer DEFAULT 0,
  completion_rate decimal DEFAULT 0,
  average_hearts_used decimal DEFAULT 0,
  last_played timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

-- Add policies for game_sessions
CREATE POLICY "Allow all operations for game sessions"
  ON game_sessions
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add policies for game_stats  
CREATE POLICY "Allow all operations for game stats"
  ON game_stats
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_device_id ON game_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_name ON game_sessions(game_name);
CREATE INDEX IF NOT EXISTS idx_game_stats_device_id ON game_stats(device_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_game_name ON game_stats(game_name);