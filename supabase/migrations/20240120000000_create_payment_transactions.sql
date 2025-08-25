-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  plan_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  paystack_transaction_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON payment_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);

-- Add RLS policies
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own payment transactions" ON payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert own payment transactions" ON payment_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own transactions
CREATE POLICY "Users can update own payment transactions" ON payment_transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Add subscription fields to profiles table if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'payment_failed', 'expired'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payment_transactions
CREATE TRIGGER update_payment_transactions_updated_at 
  BEFORE UPDATE ON payment_transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
