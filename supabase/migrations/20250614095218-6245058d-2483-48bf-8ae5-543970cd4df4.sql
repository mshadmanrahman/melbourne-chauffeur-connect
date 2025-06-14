
-- 1. Create a table to store Stripe account details for drivers/posters
CREATE TABLE public.stripe_accounts (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stripe_accounts ENABLE ROW LEVEL SECURITY;

-- Allow each user to select their own record
CREATE POLICY "Allow users to view their own Stripe account" ON public.stripe_accounts
  FOR SELECT
  USING (auth.uid() = id);

-- Allow each user to insert their own Stripe account
CREATE POLICY "Allow users to insert their own Stripe account" ON public.stripe_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow each user to update their own Stripe account
CREATE POLICY "Allow users to update their own Stripe account" ON public.stripe_accounts
  FOR UPDATE
  USING (auth.uid() = id);
