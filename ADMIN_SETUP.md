# 🔧 Admin User Setup Guide

This guide shows you how to create admin test users for your AI Agent Builder application.

## 🚀 Quick Start

### Method 1: Using the Admin Script (Recommended)

```bash
# Create default admin user (enterprise plan)
./scripts/create-admin.sh

# Create custom admin user
./scripts/create-admin.sh "custom@test.com" "mypassword" "pro"

# Create multiple test users
./scripts/create-admin.sh "free@test.com" "test123" "free"
./scripts/create-admin.sh "pro@test.com" "test123" "pro"
./scripts/create-admin.sh "business@test.com" "test123" "business"
./scripts/create-admin.sh "enterprise@test.com" "test123" "enterprise"
```

### Method 2: Using the Admin Panel

1. **Start your server**: `npm run dev`
2. **Visit**: `http://localhost:3001/admin`
3. **Use the admin panel** to create test users with different plans

### Method 3: Using API Directly

```bash
# Create admin user via API
curl -X POST http://localhost:3001/api/admin/create-user \
  -H "Content-Type: application/json" \
     -d '{
     "email": "mavros.black@yahoo.com",
     "password": "Monster123",
     "role": "enterprise"
   }'
```

## 📋 Default Test Users

| Email | Password | Plan | Features |
|-------|----------|------|----------|
| `mavros.black@yahoo.com` | `Monster123` | Enterprise | All features unlocked |
| `free@test.com` | `test123` | Free | Chat agents only |
| `pro@test.com` | `test123` | Pro | Chat + RAG agents |
| `business@test.com` | `test123` | Business | Chat + RAG + Tool agents |
| `enterprise@test.com` | `test123` | Enterprise | All features |

## 🎯 Plan Features

### Free Plan
- ✅ Chat Agents
- ❌ RAG Agents
- ❌ Tool Agents
- ❌ Multi-Agent Supervisor
- 📊 50 workflow runs/month

### Pro Plan
- ✅ Chat Agents
- ✅ RAG Agents
- ❌ Tool Agents
- ❌ Multi-Agent Supervisor
- 📊 Unlimited workflow runs

### Business Plan
- ✅ Chat Agents
- ✅ RAG Agents
- ✅ Tool Agents
- ❌ Multi-Agent Supervisor
- 📊 Unlimited workflow runs
- 👥 Team collaboration (future)

### Enterprise Plan
- ✅ Chat Agents
- ✅ RAG Agents
- ✅ Tool Agents
- ✅ Multi-Agent Supervisor
- 📊 Unlimited workflow runs
- 👥 Team collaboration
- 🏷️ White-label options
- 🔒 Advanced security

## 🔧 Database Setup

Before creating admin users, ensure your database is set up:

### 1. Run Database Migrations

```sql
-- Run in Supabase SQL Editor
-- Copy content from: supabase/migrations/001_initial_schema.sql
-- Copy content from: supabase/migrations/002_workflows_schema.sql
-- Copy content from: supabase/migrations/003_create_admin_function.sql
```

### 2. Verify Tables Exist

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'plans', 'usage_logs', 'workflows');
```

## 🛠️ Admin Panel Features

Visit `http://localhost:3000/admin` for:

### Test Users Tab
- Create users with different plans
- View created admin users
- Copy login credentials

### System Status Tab
- View total users and workflows
- Check database connection
- Monitor system health

### Quick Actions Tab
- Pre-filled user templates
- Quick copy-paste credentials
- Common admin tasks

## 🔍 Troubleshooting

### Server Not Running
```bash
# Start the development server
npm run dev

# Check if server is accessible
curl http://localhost:3000
```

### Database Connection Issues
```bash
# Check environment variables
cat .env.local

# Ensure Supabase URL and keys are set
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Permission Errors
```bash
# Make script executable
chmod +x scripts/create-admin.sh

# Run with proper permissions
./scripts/create-admin.sh
```

### User Already Exists
The system will update existing users instead of creating duplicates. Check the response for status.

## 🎉 Testing Your Setup

1. **Create admin user**: `./scripts/create-admin.sh`
2. **Login**: Visit `http://localhost:3000/auth/login`
3. **Test features**:
   - Dashboard: `http://localhost:3000/dashboard`
   - Workflows: `http://localhost:3000/workflows`
   - Wizard: `http://localhost:3000/wizard`
   - Pricing: `http://localhost:3000/pricing`
   - Account: `http://localhost:3000/account`

## 🔐 Security Notes

- Admin creation is **development-only**
- Production builds will block admin creation
- Test users have simple passwords for development
- Always use strong passwords in production

## 📞 Support

If you encounter issues:

1. Check the server logs: `npm run dev`
2. Verify database migrations are applied
3. Ensure environment variables are set
4. Check Supabase dashboard for errors

---

**Happy testing! 🚀**
