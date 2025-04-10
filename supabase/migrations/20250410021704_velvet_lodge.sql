/*
  # Initial schema setup for ingredients and custom units

  1. New Tables
    - `ingredients`
      - `id` (cuid, primary key)
      - `name` (text)
      - `description` (text, optional)
      - `imageUrl` (text, optional)
      - `baseUnit` (text)
      - `calories`, `carbs`, `fiber`, `sugar`, `totalFat`, `protein` (numeric)
      - Timestamps
    
    - `custom_units`
      - `id` (cuid, primary key)
      - `name` (text)
      - `amount` (numeric)
      - `ingredientId` (foreign key to ingredients)
      - Timestamps

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT,
  baseUnit TEXT NOT NULL DEFAULT 'gramos',
  calories DECIMAL NOT NULL DEFAULT 0,
  carbs DECIMAL NOT NULL DEFAULT 0,
  fiber DECIMAL NOT NULL DEFAULT 0,
  sugar DECIMAL NOT NULL DEFAULT 0,
  totalFat DECIMAL NOT NULL DEFAULT 0,
  protein DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create custom units table
CREATE TABLE IF NOT EXISTS custom_units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  ingredient_id TEXT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ingredient_id, name)
);

-- Enable RLS
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_units ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON ingredients FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON ingredients FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON custom_units FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON custom_units FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON custom_units FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON custom_units FOR DELETE USING (true);