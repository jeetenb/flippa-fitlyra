-- Add missing columns to workout_plans table
ALTER TABLE workout_plans 
ADD COLUMN IF NOT EXISTS experience_level TEXT,
ADD COLUMN IF NOT EXISTS equipment TEXT,
ADD COLUMN IF NOT EXISTS training_split TEXT,
ADD COLUMN IF NOT EXISTS plan_json JSONB;

-- Update existing records to have default values
UPDATE workout_plans 
SET 
  experience_level = COALESCE(experience_level, 'Beginner'),
  equipment = COALESCE(equipment, 'No Equipment (Home)'),
  training_split = COALESCE(training_split, '3 Days/Week')
WHERE experience_level IS NULL OR equipment IS NULL OR training_split IS NULL;
