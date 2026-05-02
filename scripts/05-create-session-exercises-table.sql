-- Create session exercises table (exercises within a workout session)
CREATE TABLE IF NOT EXISTS session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  sets INTEGER,
  reps INTEGER,
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  weight DECIMAL(6,2),
  distance DECIMAL(6,2),
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view exercises in their sessions"
  ON session_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.workout_session_id
      AND ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create exercises in their sessions"
  ON session_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.workout_session_id
      AND ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update exercises in their sessions"
  ON session_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.workout_session_id
      AND ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete exercises in their sessions"
  ON session_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.workout_session_id
      AND ws.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_session_exercises_workout_session_id ON session_exercises(workout_session_id);
CREATE INDEX idx_session_exercises_exercise_id ON session_exercises(exercise_id);
CREATE INDEX idx_session_exercises_order ON session_exercises(workout_session_id, order_index);

-- Create updated_at trigger
CREATE TRIGGER update_session_exercises_updated_at
  BEFORE UPDATE ON session_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
