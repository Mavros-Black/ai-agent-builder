-- Create Admin Test User
-- Run this in your Supabase SQL Editor

-- First, create a test user in auth.users (this would normally be done via signup)
-- For testing purposes, we'll create a user directly
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(), -- This will be the user ID
     'mavros.black@yahoo.com',
   crypt('Monster123', gen_salt('bf')), -- Password: Monster123
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin Test User"}',
  false,
  '',
  '',
  '',
  ''
);

-- Get the user ID we just created
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the user ID for our admin user
     SELECT id INTO admin_user_id 
   FROM auth.users 
   WHERE email = 'mavros.black@yahoo.com';
  
  -- Create the profile for the admin user with enterprise plan
  INSERT INTO profiles (
    id,
    role,
    usage_count,
    max_usage,
    created_at
  ) VALUES (
    admin_user_id,
    'enterprise',
    0,
    -1, -- unlimited usage
    now()
  );
  
  -- Insert enterprise plan into plans table if it doesn't exist
  INSERT INTO plans (id, name, price, features) 
  VALUES (
    4,
    'Enterprise',
    50000, -- ₦50,000
    '["Unlimited AI agents", "Multi-agent supervisor", "Advanced analytics", "Priority support", "Custom integrations", "White-label options", "Team collaboration", "Advanced security"]'
  ) ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
END $$;

-- Verify the admin user was created
SELECT 
  u.email,
  p.role,
  p.max_usage,
  p.created_at
FROM auth.users u
JOIN profiles p ON u.id = p.id
 WHERE u.email = 'mavros.black@yahoo.com';
