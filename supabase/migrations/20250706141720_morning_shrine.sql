/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `device_id` (text, unique)
      - `name` (text)
      - `gender` (text)
      - `avatar` (jsonb)
      - `score` (integer)
      - `level` (integer)
      - `games_completed` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for public access (since it's a kids app)
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text UNIQUE NOT NULL,
  name text NOT NULL,
  gender text,
  avatar jsonb,
  score integer DEFAULT 0,
  level integer DEFAULT 1,
  games_completed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for user profiles"
  ON user_profiles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create index for faster device_id lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_device_id ON user_profiles(device_id);