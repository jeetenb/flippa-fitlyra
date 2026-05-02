-- Create users_metadata table
CREATE TABLE IF NOT EXISTS public.users_metadata (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_plan TEXT NOT NULL DEFAULT 'FREE',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  lifetime_access BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own metadata"
  ON public.users_metadata
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own metadata"
  ON public.users_metadata
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_users_metadata_user_id ON public.users_metadata(user_id);
