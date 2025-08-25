-- Create a function to create admin users
-- This function can be called from the application or directly in SQL

CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email text DEFAULT 'admin@test.com',
  admin_password text DEFAULT 'admin123',
  admin_role text DEFAULT 'enterprise'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  result json;
BEGIN
  -- Check if user already exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF admin_user_id IS NOT NULL THEN
    -- User exists, update their profile to admin
    UPDATE profiles 
    SET role = admin_role, max_usage = -1
    WHERE id = admin_user_id;
    
    result := json_build_object(
      'status', 'updated',
      'user_id', admin_user_id,
      'email', admin_email,
      'role', admin_role,
      'message', 'Admin user already existed, profile updated'
    );
  ELSE
    -- Create new user
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
      gen_random_uuid(),
      admin_email,
      crypt(admin_password, gen_salt('bf')),
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
    ) RETURNING id INTO admin_user_id;
    
    -- Create profile
    INSERT INTO profiles (
      id,
      role,
      usage_count,
      max_usage,
      created_at
    ) VALUES (
      admin_user_id,
      admin_role,
      0,
      -1, -- unlimited usage
      now()
    );
    
    result := json_build_object(
      'status', 'created',
      'user_id', admin_user_id,
      'email', admin_email,
      'role', admin_role,
      'message', 'Admin user created successfully'
    );
  END IF;
  
  -- Ensure enterprise plan exists
  INSERT INTO plans (id, name, price, features) 
  VALUES (
    4,
    'Enterprise',
    50000, -- ₦50,000
    '["Unlimited AI agents", "Multi-agent supervisor", "Advanced analytics", "Priority support", "Custom integrations", "White-label options", "Team collaboration", "Advanced security"]'
  ) ON CONFLICT (id) DO NOTHING;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_admin_user(text, text, text) TO authenticated;

-- Create a simple admin user creation function
CREATE OR REPLACE FUNCTION create_test_admin()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN create_admin_user('mavros.black@yahoo.com', 'Monster123', 'enterprise');
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_test_admin() TO authenticated;
