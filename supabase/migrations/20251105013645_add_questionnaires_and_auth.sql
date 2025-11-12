/*
  # Add Questionnaires and Authentication Tables

  1. New Tables
    - `questionnaires`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `questions` (jsonb)
      - `interpretation_guide` (jsonb)
      - `created_at` (timestamptz)
    
    - `questionnaire_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `questionnaire_id` (uuid, references questionnaires)
      - `responses` (jsonb)
      - `score` (numeric)
      - `interpretation` (text)
      - `completed_at` (timestamptz)
    
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `preferred_ai_model` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS questionnaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  questions jsonb NOT NULL,
  interpretation_guide jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  questionnaire_id uuid REFERENCES questionnaires(id) NOT NULL,
  responses jsonb NOT NULL,
  score numeric,
  interpretation text,
  completed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  preferred_ai_model text DEFAULT 'claude',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questionnaires are viewable by everyone"
  ON questionnaires FOR SELECT
  USING (true);

CREATE POLICY "Users can view own questionnaire responses"
  ON questionnaire_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own questionnaire responses"
  ON questionnaire_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_user ON questionnaire_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);