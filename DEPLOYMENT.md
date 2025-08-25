# 🚀 Deployment Guide

This guide will help you deploy AI Agent Builder to GitHub and Vercel.

## 📋 Prerequisites

Before deploying, ensure you have:

- [GitHub account](https://github.com)
- [Vercel account](https://vercel.com)
- [Supabase account](https://supabase.com)
- [Paystack account](https://paystack.com) (for payments)
- [OpenAI API key](https://platform.openai.com) (optional)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: AI Agent Builder"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `ai-agent-builder` (or your preferred name)
3. Make it public or private (your choice)
4. **Don't** initialize with README, .gitignore, or license (we already have these)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/yourusername/ai-agent-builder.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Connect to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 2.2 Configure Project Settings

**Project Name**: `ai-agent-builder` (or your preferred name)

**Framework Preset**: Next.js (should be auto-detected)

**Root Directory**: `./` (leave as default)

**Build Command**: `npm run build` (should be auto-detected)

**Output Directory**: `.next` (should be auto-detected)

**Install Command**: `npm install` (should be auto-detected)

### 2.3 Environment Variables

Add these environment variables in the Vercel dashboard:

#### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paystack Configuration
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### Optional Variables

```env
# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key

# n8n Configuration (optional)
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key
N8N_API_BASE_URL=https://your-n8n-instance.com/api/v1
```

### 2.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Your app will be available at `https://your-app.vercel.app`

## 🗄️ Step 3: Set Up Supabase

### 3.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Choose your organization
3. Set project name and database password
4. Select a region close to your users

### 3.2 Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'free' CHECK (role IN ('free', 'pro', 'business', 'enterprise')),
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage_logs table
CREATE TABLE usage_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflows table
CREATE TABLE workflows (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB,
  json_workflow JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own usage logs" ON usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage logs" ON usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own workflows" ON workflows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workflows" ON workflows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workflows" ON workflows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workflows" ON workflows FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, usage_count, max_usage)
  VALUES (new.id, 'free', 0, 50);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 3.3 Authentication Setup

1. Go to **Authentication > Settings** in Supabase
2. Configure your site URL: `https://your-app.vercel.app`
3. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`
4. Enable email confirmations (optional)
5. Configure OAuth providers if needed

### 3.4 Get API Keys

1. Go to **Settings > API** in Supabase
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## 💳 Step 4: Set Up Paystack

### 4.1 Create Paystack Account

1. Go to [Paystack](https://paystack.com) and create an account
2. Complete your business verification
3. Set up your bank account for payouts

### 4.2 Get API Keys

1. Go to **Settings > API Keys & Webhooks**
2. Copy the following:
   - **Secret Key** → `PAYSTACK_SECRET_KEY`
   - **Public Key** → `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

### 4.3 Configure Webhooks

1. Go to **Settings > API Keys & Webhooks**
2. Click "Add Webhook"
3. Set webhook URL: `https://your-app.vercel.app/api/paystack/webhook`
4. Select events:
   - `charge.success`
   - `subscription.create`
   - `subscription.disable`
5. Copy the webhook secret → `PAYSTACK_WEBHOOK_SECRET`

### 4.4 Create Payment Plans

Create these plans in your Paystack dashboard:

1. **Pro Plan** ($29/month)
2. **Business Plan** ($99/month)
3. **Enterprise Plan** (Custom pricing)

## 🤖 Step 5: Set Up OpenAI (Optional)

### 5.1 Get API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account or sign in
3. Go to **API Keys**
4. Create a new API key
5. Copy the key → `OPENAI_API_KEY`

### 5.2 Configure Usage Limits

1. Go to **Usage** in OpenAI dashboard
2. Set spending limits to control costs
3. Monitor usage regularly

## 🔄 Step 6: Update Environment Variables

### 6.1 Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add all the environment variables from Step 2.3
4. Make sure to use the correct values from your services

### 6.2 Redeploy

1. Go to **Deployments** in Vercel
2. Click "Redeploy" on your latest deployment
3. This will apply the new environment variables

## ✅ Step 7: Verify Deployment

### 7.1 Test Your Application

1. Visit your deployed app: `https://your-app.vercel.app`
2. Test the following features:
   - User registration and login
   - Agent builder wizard
   - Payment flow (use test cards)
   - Dashboard functionality

### 7.2 Test Payment Flow

Use Paystack test cards:

- **Success**: `4084 0840 8408 4081`
- **Declined**: `4084 0840 8408 4082`
- **Expired**: `4084 0840 8408 4083`

### 7.3 Monitor Logs

1. Check Vercel function logs for any errors
2. Monitor Supabase logs for database issues
3. Check Paystack webhook delivery status

## 🔧 Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain

1. Go to **Settings > Domains** in Vercel
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

### 8.2 Update Supabase Settings

1. Go to **Authentication > Settings** in Supabase
2. Update site URL to your custom domain
3. Add new redirect URLs

## 🚀 Step 9: Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Database migrations are applied
- [ ] Payment webhooks are configured
- [ ] SSL certificates are active
- [ ] Error monitoring is set up
- [ ] Analytics are configured
- [ ] Backup strategy is in place
- [ ] Performance is optimized
- [ ] Security headers are configured
- [ ] Rate limiting is implemented

## 📊 Step 10: Monitoring & Maintenance

### 10.1 Set Up Monitoring

- **Vercel Analytics**: Enable in project settings
- **Error Tracking**: Consider Sentry or similar
- **Performance Monitoring**: Use Vercel Speed Insights
- **Uptime Monitoring**: Set up external monitoring

### 10.2 Regular Maintenance

- Monitor API usage and costs
- Update dependencies regularly
- Review and rotate API keys
- Backup database regularly
- Monitor error logs
- Update security patches

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Authentication Issues**
   - Verify Supabase configuration
   - Check redirect URLs
   - Ensure RLS policies are correct

3. **Payment Issues**
   - Verify Paystack webhook configuration
   - Check webhook secret
   - Test with Paystack test cards

4. **Database Issues**
   - Check Supabase connection
   - Verify RLS policies
   - Check for missing tables

### Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Paystack Documentation**: [paystack.com/docs](https://paystack.com/docs)
- **GitHub Issues**: Create an issue in the repository

## 🎉 Congratulations!

Your AI Agent Builder is now deployed and ready for production! 

Remember to:
- Monitor your application regularly
- Keep dependencies updated
- Backup your data
- Monitor costs and usage
- Gather user feedback

Happy building! 🚀
