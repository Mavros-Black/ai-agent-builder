export interface BusinessTemplate {
  id: string
  name: string
  description: string
  category: 'customer-support' | 'sales' | 'research' | 'knowledge'
  icon: string
  features: string[]
  recommendedTools: string[]
  systemPrompt: string
  workflow: {
    steps: string[]
    integrations: string[]
    estimatedTime: string
  }
  pricing: 'free' | 'pro' | 'business' | 'enterprise'
  useCase: string
  benefits: string[]
}

export const BUSINESS_TEMPLATES: BusinessTemplate[] = [
  {
    id: 'customer-support-faq',
    name: 'Customer Support FAQ Bot',
    description: 'Automated customer support with knowledge base integration',
    category: 'customer-support',
    icon: '🎧',
    features: [
      '24/7 customer support',
      'Knowledge base integration',
      'Ticket escalation',
      'Multi-language support',
      'Sentiment analysis'
    ],
    recommendedTools: ['notion', 'email', 'slack', 'search'],
    systemPrompt: `You are a professional customer support agent. Your role is to:
1. Provide accurate, helpful answers to customer inquiries
2. Access the knowledge base to find relevant information
3. Escalate complex issues to human agents when necessary
4. Maintain a friendly, professional tone
5. Track customer satisfaction and sentiment

Always prioritize customer satisfaction and provide clear, actionable solutions.`,
    workflow: {
      steps: [
        'Customer submits inquiry',
        'AI analyzes request and searches knowledge base',
        'AI provides relevant answer or escalates to human',
        'Follow-up and satisfaction tracking'
      ],
      integrations: ['Notion', 'Zendesk', 'Slack', 'Email'],
      estimatedTime: '5-10 minutes setup'
    },
    pricing: 'business',
    useCase: 'Perfect for companies with high customer support volume',
    benefits: [
      'Reduce support tickets by 60%',
      '24/7 availability',
      'Consistent response quality',
      'Faster resolution times'
    ]
  },
  {
    id: 'sales-outreach',
    name: 'Sales Outreach Agent',
    description: 'Personalized email campaigns and follow-up automation',
    category: 'sales',
    icon: '📈',
    features: [
      'Personalized email generation',
      'Follow-up automation',
      'Lead scoring',
      'CRM integration',
      'A/B testing'
    ],
    recommendedTools: ['email', 'search', 'calendar', 'notion'],
    systemPrompt: `You are an expert sales outreach specialist. Your role is to:
1. Generate personalized, compelling email content
2. Research prospects and companies for personalization
3. Create follow-up sequences that convert
4. Track engagement and optimize campaigns
5. Integrate with CRM systems

Focus on building relationships and providing value, not just selling.`,
    workflow: {
      steps: [
        'Import prospect list',
        'Research and personalize content',
        'Send initial outreach',
        'Track responses and follow up',
        'Update CRM with results'
      ],
      integrations: ['Gmail', 'HubSpot', 'Salesforce', 'LinkedIn'],
      estimatedTime: '15-20 minutes setup'
    },
    pricing: 'pro',
    useCase: 'Ideal for B2B sales teams and lead generation',
    benefits: [
      'Increase response rates by 40%',
      'Save 10+ hours per week',
      'Consistent follow-up',
      'Better lead qualification'
    ]
  },
  {
    id: 'market-research',
    name: 'Market Research Agent',
    description: 'Competitive analysis and market intelligence gathering',
    category: 'research',
    icon: '🔍',
    features: [
      'Competitor monitoring',
      'Market trend analysis',
      'News aggregation',
      'Report generation',
      'Alert system'
    ],
    recommendedTools: ['search', 'notion', 'email', 'calendar'],
    systemPrompt: `You are a market research analyst. Your role is to:
1. Monitor competitors and market trends
2. Analyze industry news and developments
3. Generate comprehensive research reports
4. Provide actionable insights
5. Set up alerts for important changes

Focus on providing strategic insights that drive business decisions.`,
    workflow: {
      steps: [
        'Define research parameters',
        'Gather data from multiple sources',
        'Analyze and synthesize information',
        'Generate insights and recommendations',
        'Deliver reports and alerts'
      ],
      integrations: ['Google Alerts', 'LinkedIn', 'News APIs', 'Notion'],
      estimatedTime: '20-30 minutes setup'
    },
    pricing: 'business',
    useCase: 'Perfect for product teams and strategic planning',
    benefits: [
      'Stay ahead of competitors',
      'Make data-driven decisions',
      'Save research time',
      'Identify new opportunities'
    ]
  },
  {
    id: 'internal-knowledge',
    name: 'Internal Knowledge Agent',
    description: 'Company knowledge base and employee support',
    category: 'knowledge',
    icon: '📚',
    features: [
      'Document search and retrieval',
      'Employee onboarding support',
      'Process documentation',
      'Training assistance',
      'Knowledge sharing'
    ],
    recommendedTools: ['notion', 'search', 'email', 'slack'],
    systemPrompt: `You are an internal knowledge management specialist. Your role is to:
1. Help employees find relevant information quickly
2. Assist with onboarding and training
3. Maintain and update knowledge base
4. Share best practices and processes
5. Support decision-making with company data

Be helpful, accurate, and maintain confidentiality of company information.`,
    workflow: {
      steps: [
        'Upload company documents',
        'Index and organize knowledge',
        'Answer employee questions',
        'Update and maintain content',
        'Track usage and improvements'
      ],
      integrations: ['Notion', 'Google Drive', 'Slack', 'Confluence'],
      estimatedTime: '30-45 minutes setup'
    },
    pricing: 'enterprise',
    useCase: 'Essential for growing companies and remote teams',
    benefits: [
      'Reduce onboarding time by 50%',
      'Improve knowledge retention',
      'Increase productivity',
      'Better decision making'
    ]
  }
]

export function getTemplatesByCategory(category: string): BusinessTemplate[] {
  return BUSINESS_TEMPLATES.filter(template => template.category === category)
}

export function getTemplateById(id: string): BusinessTemplate | undefined {
  return BUSINESS_TEMPLATES.find(template => template.id === id)
}

export function getTemplatesByPricing(pricing: string): BusinessTemplate[] {
  return BUSINESS_TEMPLATES.filter(template => template.pricing === pricing)
}
