-- Create a function to initialize user metadata and profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert into users_metadata table
  INSERT INTO public.users_metadata (user_id, subscription_plan, created_at)
  VALUES (NEW.id, 'FREE', NOW())
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users
INSERT INTO public.profiles (id, email, full_name, created_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
  created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users_metadata (user_id, subscription_plan, created_at)
SELECT 
  id,
  'FREE',
  created_at
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
