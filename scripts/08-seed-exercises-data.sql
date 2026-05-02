-- Seed exercises table with initial data
INSERT INTO exercises (name, description, category, muscle_groups, equipment, difficulty, instructions, calories_per_minute) VALUES
  -- Strength exercises
  ('Push-ups', 'Classic upper body bodyweight exercise', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['none'], 'beginner', ARRAY['Start in plank position', 'Lower body to ground', 'Push back up', 'Repeat'], 7.5),
  ('Squats', 'Lower body compound movement', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['none'], 'beginner', ARRAY['Stand with feet shoulder-width', 'Lower hips back and down', 'Keep chest up', 'Return to standing'], 8.0),
  ('Deadlifts', 'Full body compound exercise', 'strength', ARRAY['back', 'glutes', 'hamstrings', 'core'], ARRAY['barbell', 'dumbbells'], 'intermediate', ARRAY['Stand with feet hip-width', 'Grip bar at shoulder width', 'Lift with legs and hips', 'Lower with control'], 9.5),
  ('Bench Press', 'Upper body pressing movement', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'intermediate', ARRAY['Lie on bench', 'Grip bar slightly wider than shoulders', 'Lower to chest', 'Press back up'], 7.0),
  ('Pull-ups', 'Upper body pulling exercise', 'strength', ARRAY['back', 'biceps', 'shoulders'], ARRAY['pull-up bar'], 'advanced', ARRAY['Hang from bar', 'Pull body up', 'Chin over bar', 'Lower with control'], 10.0),
  
  -- Cardio exercises
  ('Running', 'High-intensity cardio workout', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['none'], 'beginner', ARRAY['Maintain steady pace', 'Keep proper form', 'Breathe rhythmically'], 11.5),
  ('Jump Rope', 'Full body cardio exercise', 'cardio', ARRAY['legs', 'shoulders', 'cardiovascular'], ARRAY['jump rope'], 'intermediate', ARRAY['Hold rope handles', 'Jump with both feet', 'Maintain rhythm', 'Land softly'], 13.0),
  ('Burpees', 'High-intensity full body exercise', 'hiit', ARRAY['full body', 'cardiovascular'], ARRAY['none'], 'advanced', ARRAY['Start standing', 'Drop to plank', 'Do push-up', 'Jump feet forward', 'Explosive jump up'], 12.5),
  ('Mountain Climbers', 'Dynamic core and cardio exercise', 'hiit', ARRAY['core', 'shoulders', 'legs'], ARRAY['none'], 'intermediate', ARRAY['Start in plank position', 'Alternate bringing knees to chest', 'Keep core engaged', 'Maintain quick pace'], 10.5),
  
  -- Flexibility exercises
  ('Yoga Flow', 'Dynamic stretching sequence', 'yoga', ARRAY['full body', 'flexibility'], ARRAY['yoga mat'], 'beginner', ARRAY['Flow through poses', 'Focus on breathing', 'Hold each pose 30 seconds'], 4.5),
  ('Downward Dog', 'Classic yoga pose', 'yoga', ARRAY['hamstrings', 'shoulders', 'back'], ARRAY['yoga mat'], 'beginner', ARRAY['Start on hands and knees', 'Lift hips up and back', 'Straighten legs', 'Press heels down'], 3.5),
  ('Plank', 'Core stability exercise', 'strength', ARRAY['core', 'shoulders'], ARRAY['none'], 'beginner', ARRAY['Forearms on ground', 'Body in straight line', 'Engage core', 'Hold position'], 5.0),
  
  -- HIIT exercises
  ('Box Jumps', 'Explosive lower body exercise', 'hiit', ARRAY['legs', 'glutes', 'cardiovascular'], ARRAY['box', 'platform'], 'intermediate', ARRAY['Stand facing box', 'Jump explosively onto box', 'Land softly', 'Step down'], 11.0),
  ('Kettlebell Swings', 'Dynamic full body movement', 'hiit', ARRAY['glutes', 'hamstrings', 'shoulders', 'core'], ARRAY['kettlebell'], 'intermediate', ARRAY['Stand with feet wide', 'Swing kettlebell between legs', 'Thrust hips forward', 'Swing to shoulder height'], 12.0),
  
  -- Core exercises
  ('Crunches', 'Basic abdominal exercise', 'strength', ARRAY['abs'], ARRAY['none'], 'beginner', ARRAY['Lie on back', 'Knees bent', 'Lift shoulders off ground', 'Lower with control'], 6.0),
  ('Russian Twists', 'Rotational core exercise', 'strength', ARRAY['obliques', 'abs'], ARRAY['medicine ball'], 'intermediate', ARRAY['Sit with knees bent', 'Lean back slightly', 'Twist side to side', 'Touch ground each side'], 7.5)
ON CONFLICT DO NOTHING;
