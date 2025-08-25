# 🤖 AI Agent Builder

Build, design, and deploy powerful AI agents with n8n integration. No code required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-agent-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🎯 Agent Types**: Chat, RAG, Tool-Using, and Multi-Agent systems
- **⚡ Auto-Generate Workflows**: AI-powered n8n workflow generation
- **📊 Visual Diagrams**: Interactive Mermaid diagrams
- **🔧 Tool Integration**: Connect to Notion, Slack, Google Sheets, APIs
- **📥 One-Click Export**: Download ready-to-import n8n workflows
- **🚀 Deploy Anywhere**: Deploy to n8n cloud, self-hosted, or Docker
- **💰 Paystack Integration**: Secure payment processing
- **👥 Team Collaboration**: Role-based access control
- **📈 Analytics**: Usage tracking and performance insights

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-agent-builder.git
   cd ai-agent-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Paystack Configuration
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

   # OpenAI Configuration (optional)
   OPENAI_API_KEY=your_openai_api_key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**
   
   Run the SQL migrations in your Supabase SQL editor:
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
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Paystack
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

### Project Structure

```
ai-agent-builder/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── wizard/            # Agent builder wizard
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── paystack.ts       # Paystack integration
│   └── ai-service.ts     # AI service
├── public/               # Static assets
└── styles/               # Global styles
```

## 🚀 Deployment

### Deploy to Vercel

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Add environment variables in Vercel dashboard

3. **Deploy**
   - Vercel will automatically deploy on every push
   - Your app will be available at `https://your-app.vercel.app`

### Environment Variables for Production

Set these in your Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📱 Features

### 🤖 Agent Builder Wizard

- **Step 1**: Choose agent type (Personal Assistant, Study/Research, Business, Information/Research)
- **Step 2**: Configure tools and integrations
- **Step 3**: Design prompts and system messages
- **Step 4**: Review and generate n8n workflow
- **Step 5**: Export and deploy

### 💳 Payment Integration

- **Paystack Integration**: Secure payment processing
- **Subscription Management**: Automatic plan upgrades
- **Usage Tracking**: Monitor API usage and limits
- **Billing Dashboard**: View invoices and manage subscriptions

### 👥 Team Features

- **Role-based Access**: Admin, Manager, User roles
- **Team Workspace**: Collaborate on workflows
- **Usage Analytics**: Track team performance
- **Enterprise Features**: SSO, advanced security, custom integrations

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations
3. Configure authentication providers
4. Set up Row Level Security policies

### Paystack Setup

1. Create a Paystack account
2. Generate API keys
3. Configure webhooks
4. Set up payment plans

### OpenAI Setup

1. Get an OpenAI API key
2. Configure model settings
3. Set usage limits

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.aiagentbuilder.com](https://docs.aiagentbuilder.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-agent-builder/issues)
- **Discord**: [Join our community](https://discord.gg/aiagentbuilder)
- **Email**: support@aiagentbuilder.com

## 🙏 Acknowledgments

- [n8n](https://n8n.io) for workflow automation
- [Supabase](https://supabase.com) for backend services
- [Paystack](https://paystack.com) for payment processing
- [OpenAI](https://openai.com) for AI capabilities
- [Vercel](https://vercel.com) for deployment platform

## 📊 Status

![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-agent-builder)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-agent-builder)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ai-agent-builder)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/ai-agent-builder)

---

Made with ❤️ by the AI Agent Builder team
