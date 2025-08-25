export interface SamplePrompt {
  id: string
  title: string
  prompt: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  useCase: string
}

export interface AgentTypePrompts {
  type: string
  name: string
  description: string
  icon: string
  prompts: SamplePrompt[]
}

export const SAMPLE_PROMPTS: AgentTypePrompts[] = [
  {
    type: 'personal-assistant',
    name: 'Personal Assistant Agent',
    description: 'Help with tasks, notes, scheduling, and daily productivity',
    icon: '👤',
    prompts: [
      {
        id: 'pa-1',
        title: 'Task Prioritization Assistant',
        prompt: 'You are my personal assistant. Help me manage daily tasks by prioritizing what is urgent vs. important. Always ask clarifying questions to understand my context better.',
        description: 'Prioritize tasks using the Eisenhower Matrix (urgent vs important)',
        difficulty: 'beginner',
        tags: ['productivity', 'prioritization', 'daily-tasks'],
        useCase: 'When you have too many tasks and need help deciding what to do first'
      },
      {
        id: 'pa-2',
        title: 'Appointment & Deadline Tracker',
        prompt: 'Keep track of my appointments, deadlines, and notes. Always remind me ahead of time and suggest preparation steps for important events.',
        description: 'Track and remind about important dates and appointments',
        difficulty: 'beginner',
        tags: ['calendar', 'reminders', 'deadlines'],
        useCase: 'Managing multiple appointments and project deadlines'
      },
      {
        id: 'pa-3',
        title: 'Schedule Optimizer',
        prompt: 'Suggest the most efficient schedule for my work and personal life. Consider my energy levels, commute times, and preferred work patterns.',
        description: 'Create optimal daily and weekly schedules',
        difficulty: 'intermediate',
        tags: ['scheduling', 'optimization', 'work-life-balance'],
        useCase: 'When you want to maximize productivity and reduce stress'
      },
      {
        id: 'pa-4',
        title: 'Note Organizer',
        prompt: 'Organize my notes into categories (work, personal, study). Create a logical folder structure and suggest tags for easy retrieval.',
        description: 'Categorize and organize scattered notes',
        difficulty: 'beginner',
        tags: ['organization', 'notes', 'categorization'],
        useCase: 'When you have notes scattered across different apps and need organization'
      },
      {
        id: 'pa-5',
        title: 'Goal Setting & Progress Tracker',
        prompt: 'Help me create daily, weekly, and monthly goals, and check my progress. Celebrate wins and suggest adjustments when I fall behind.',
        description: 'Set goals and track progress over time',
        difficulty: 'intermediate',
        tags: ['goals', 'progress-tracking', 'motivation'],
        useCase: 'Working towards long-term objectives and need accountability'
      },
      {
        id: 'pa-6',
        title: 'Meeting Note Summarizer',
        prompt: 'Summarize my meeting notes into action points, decisions made, and follow-up tasks. Highlight who is responsible for what.',
        description: 'Extract actionable items from meeting notes',
        difficulty: 'beginner',
        tags: ['meetings', 'summarization', 'action-items'],
        useCase: 'After meetings to ensure nothing falls through the cracks'
      },
      {
        id: 'pa-7',
        title: 'Task Completion Reminder',
        prompt: 'Remind me about unfinished tasks from previous days. Help me decide whether to continue, delegate, or drop them.',
        description: 'Track and follow up on incomplete tasks',
        difficulty: 'beginner',
        tags: ['follow-up', 'task-management', 'delegation'],
        useCase: 'When you have tasks that keep getting postponed'
      },
      {
        id: 'pa-8',
        title: 'Polite Reminder Generator',
        prompt: 'Draft polite reminder emails/messages when I forget commitments. Keep the tone friendly but professional.',
        description: 'Create gentle reminders for missed commitments',
        difficulty: 'intermediate',
        tags: ['communication', 'reminders', 'professional'],
        useCase: 'When you need to follow up on missed meetings or deadlines'
      },
      {
        id: 'pa-9',
        title: 'Stress Management Coach',
        prompt: 'Provide quick motivational advice when I seem stressed. Suggest simple breathing exercises or perspective shifts.',
        description: 'Offer stress relief and motivation',
        difficulty: 'beginner',
        tags: ['wellness', 'motivation', 'stress-management'],
        useCase: 'When feeling overwhelmed or demotivated'
      },
      {
        id: 'pa-10',
        title: 'Activity Logger & Optimizer',
        prompt: 'Log my activities and suggest improvements in time management. Identify patterns and recommend efficiency gains.',
        description: 'Track activities and suggest time management improvements',
        difficulty: 'advanced',
        tags: ['time-tracking', 'optimization', 'analytics'],
        useCase: 'When you want to understand how you spend your time and improve efficiency'
      }
    ]
  },
  {
    type: 'study-research',
    name: 'Study / Research Assistant Agent',
    description: 'Support with learning, summarization, and academic explanations',
    icon: '📚',
    prompts: [
      {
        id: 'sr-1',
        title: 'Document Summarizer',
        prompt: 'You are my research assistant. Summarize complex documents into simple explanations. Break down jargon and highlight key concepts.',
        description: 'Simplify complex academic documents',
        difficulty: 'beginner',
        tags: ['summarization', 'academic', 'simplification'],
        useCase: 'When reading dense academic papers or technical documents'
      },
      {
        id: 'sr-2',
        title: 'Concept Explainer',
        prompt: 'Explain difficult academic concepts step by step. Use analogies and real-world examples to make abstract ideas concrete.',
        description: 'Break down complex concepts with examples',
        difficulty: 'beginner',
        tags: ['explanation', 'education', 'analogies'],
        useCase: 'Learning new subjects or preparing to teach others'
      },
      {
        id: 'sr-3',
        title: 'Research Paper Comparator',
        prompt: 'Compare and contrast two research papers on the same topic. Highlight differences in methodology, findings, and conclusions.',
        description: 'Compare multiple research sources',
        difficulty: 'intermediate',
        tags: ['comparison', 'research', 'analysis'],
        useCase: 'When reviewing multiple sources for a literature review'
      },
      {
        id: 'sr-4',
        title: 'AI Research Trend Analyzer',
        prompt: 'Summarize the latest research trends in AI from top papers. Identify emerging themes and potential applications.',
        description: 'Track AI research trends and developments',
        difficulty: 'advanced',
        tags: ['ai-research', 'trends', 'analysis'],
        useCase: 'Staying updated with AI research developments'
      },
      {
        id: 'sr-5',
        title: 'Study Guide Creator',
        prompt: 'Turn this PDF into key takeaways and quiz questions. Create flashcards and practice tests to reinforce learning.',
        description: 'Generate study materials from documents',
        difficulty: 'intermediate',
        tags: ['study-guides', 'quizzes', 'learning'],
        useCase: 'Preparing for exams or training sessions'
      },
      {
        id: 'sr-6',
        title: 'Research Gap Identifier',
        prompt: 'Highlight gaps in this research that I can explore further. Suggest potential research questions and methodologies.',
        description: 'Identify research opportunities and gaps',
        difficulty: 'advanced',
        tags: ['research-gaps', 'methodology', 'opportunities'],
        useCase: 'Planning new research projects or thesis topics'
      },
      {
        id: 'sr-7',
        title: 'Interactive Study Guide',
        prompt: 'Generate a study guide with questions and answers. Include multiple choice, short answer, and essay questions.',
        description: 'Create comprehensive study materials',
        difficulty: 'intermediate',
        tags: ['study-materials', 'assessment', 'comprehensive'],
        useCase: 'Creating educational content or test preparation'
      },
      {
        id: 'sr-8',
        title: 'Literature Review Organizer',
        prompt: 'Help me write a literature review by grouping similar findings. Identify themes, controversies, and consensus in the field.',
        description: 'Organize research findings into themes',
        difficulty: 'advanced',
        tags: ['literature-review', 'organization', 'synthesis'],
        useCase: 'Writing academic papers or systematic reviews'
      },
      {
        id: 'sr-9',
        title: 'Multi-Level Concept Teacher',
        prompt: 'Explain a concept in three levels: beginner, intermediate, expert. Adapt the explanation based on the audience\'s background.',
        description: 'Teach concepts at multiple complexity levels',
        difficulty: 'intermediate',
        tags: ['teaching', 'adaptation', 'multi-level'],
        useCase: 'Teaching diverse audiences or creating educational content'
      },
      {
        id: 'sr-10',
        title: 'Theory Application Finder',
        prompt: 'Find practical applications of this theory in real-world industries. Connect academic concepts to business and social problems.',
        description: 'Bridge theory and practical applications',
        difficulty: 'advanced',
        tags: ['applications', 'theory', 'practical'],
        useCase: 'Making academic research relevant to real-world problems'
      }
    ]
  },
  {
    type: 'business-productivity',
    name: 'Business / Work Productivity Agent',
    description: 'Emails, reports, task tracking, and workplace assistance',
    icon: '💼',
    prompts: [
      {
        id: 'bp-1',
        title: 'Email Draft Generator',
        prompt: 'Draft professional emails based on quick bullet notes. Maintain appropriate tone for different audiences (colleagues, clients, executives).',
        description: 'Convert bullet points into polished emails',
        difficulty: 'beginner',
        tags: ['email', 'professional', 'communication'],
        useCase: 'When you need to send professional emails quickly'
      },
      {
        id: 'bp-2',
        title: 'Slack Thread Summarizer',
        prompt: 'Summarize long Slack threads into 3 key points + actions. Identify decisions made and next steps for the team.',
        description: 'Extract key information from chat threads',
        difficulty: 'beginner',
        tags: ['summarization', 'team-communication', 'action-items'],
        useCase: 'After long team discussions to capture decisions'
      },
      {
        id: 'bp-3',
        title: 'Meeting Agenda Creator',
        prompt: 'Create a meeting agenda with clear sections. Include time allocations, discussion topics, and desired outcomes.',
        description: 'Structure meetings for maximum productivity',
        difficulty: 'beginner',
        tags: ['meetings', 'agenda', 'planning'],
        useCase: 'Planning team meetings or client presentations'
      },
      {
        id: 'bp-4',
        title: 'Weekly Status Report Generator',
        prompt: 'Generate weekly status reports from task updates. Highlight accomplishments, challenges, and upcoming priorities.',
        description: 'Create professional status reports',
        difficulty: 'intermediate',
        tags: ['reporting', 'status-updates', 'professional'],
        useCase: 'Weekly team updates or client reporting'
      },
      {
        id: 'bp-5',
        title: 'Task Prioritization Engine',
        prompt: 'Help prioritize my workday tasks based on deadlines and importance. Consider dependencies and resource availability.',
        description: 'Optimize daily task order for productivity',
        difficulty: 'intermediate',
        tags: ['prioritization', 'productivity', 'planning'],
        useCase: 'When you have multiple competing priorities'
      },
      {
        id: 'bp-6',
        title: 'Data Analysis Summarizer',
        prompt: 'Analyze sales numbers and create a 5-sentence executive summary. Highlight trends, anomalies, and actionable insights.',
        description: 'Transform data into executive insights',
        difficulty: 'intermediate',
        tags: ['data-analysis', 'executive-summary', 'insights'],
        useCase: 'Presenting data to executives or stakeholders'
      },
      {
        id: 'bp-7',
        title: 'Client Response Generator',
        prompt: 'Draft polite responses to client inquiries. Address concerns professionally while maintaining company policies.',
        description: 'Create professional client communications',
        difficulty: 'intermediate',
        tags: ['client-communication', 'professional', 'customer-service'],
        useCase: 'Responding to customer inquiries or complaints'
      },
      {
        id: 'bp-8',
        title: 'Document Structure Organizer',
        prompt: 'Convert messy notes into structured documents. Create clear sections, headings, and logical flow.',
        description: 'Organize scattered information into documents',
        difficulty: 'beginner',
        tags: ['documentation', 'organization', 'structure'],
        useCase: 'Converting meeting notes into formal documents'
      },
      {
        id: 'bp-9',
        title: 'Kanban Board Manager',
        prompt: 'Turn tasks into a Kanban-style list: To-Do, Doing, Done. Help me move items through the workflow efficiently.',
        description: 'Manage tasks using Kanban methodology',
        difficulty: 'intermediate',
        tags: ['kanban', 'workflow', 'task-management'],
        useCase: 'Managing projects with multiple team members'
      },
      {
        id: 'bp-10',
        title: 'Presentation Outline Creator',
        prompt: 'Prepare a short presentation outline based on bullet points. Structure with clear sections and suggested talking points.',
        description: 'Create presentation structures from notes',
        difficulty: 'intermediate',
        tags: ['presentations', 'outlines', 'structure'],
        useCase: 'Preparing for meetings or client presentations'
      }
    ]
  },
  {
    type: 'information-research',
    name: 'Information / Research + Web Agent',
    description: 'Answering factual questions with tools (web search, APIs, databases)',
    icon: '🌍',
    prompts: [
      {
        id: 'ir-1',
        title: 'Factual Answer Provider',
        prompt: 'Always provide up-to-date answers with sources. When I ask a factual question, first check your knowledge, then verify with the web.',
        description: 'Provide accurate, sourced information',
        difficulty: 'beginner',
        tags: ['factual', 'sources', 'verification'],
        useCase: 'When you need reliable, current information'
      },
      {
        id: 'ir-2',
        title: 'Source Verification Expert',
        prompt: 'When I ask a factual question, first check your knowledge, then verify with the web. Always cite your sources and note any discrepancies.',
        description: 'Verify information across multiple sources',
        difficulty: 'intermediate',
        tags: ['verification', 'sources', 'fact-checking'],
        useCase: 'Researching topics where accuracy is critical'
      },
      {
        id: 'ir-3',
        title: 'Multi-Source Summarizer',
        prompt: 'Summarize the top 3 reliable sources for any topic I ask. Compare their perspectives and identify consensus vs. disagreements.',
        description: 'Compare multiple sources on the same topic',
        difficulty: 'intermediate',
        tags: ['comparison', 'sources', 'perspectives'],
        useCase: 'Getting a balanced view on controversial topics'
      },
      {
        id: 'ir-4',
        title: 'Weather Comparison Analyst',
        prompt: 'Compare today\'s weather forecast in Accra vs. London. Provide temperature, conditions, and any weather alerts for both locations.',
        description: 'Compare weather data across locations',
        difficulty: 'beginner',
        tags: ['weather', 'comparison', 'location'],
        useCase: 'Planning travel or comparing weather patterns'
      },
      {
        id: 'ir-5',
        title: 'Stock Market Analyst',
        prompt: 'Fetch the latest stock price of Apple and summarize expert opinions. Include technical analysis and market sentiment.',
        description: 'Analyze stock market data and expert opinions',
        difficulty: 'advanced',
        tags: ['stocks', 'analysis', 'financial'],
        useCase: 'Making investment decisions or market research'
      },
      {
        id: 'ir-6',
        title: 'News Headline Summarizer',
        prompt: 'Summarize top news headlines in tech and business. Provide context and identify potential impacts on different industries.',
        description: 'Summarize current news with context',
        difficulty: 'intermediate',
        tags: ['news', 'summarization', 'context'],
        useCase: 'Staying updated with industry news'
      },
      {
        id: 'ir-7',
        title: 'Term Definition Expert',
        prompt: 'Find definitions + examples for any unfamiliar term. Provide both technical and simple explanations with real-world applications.',
        description: 'Explain unfamiliar terms with examples',
        difficulty: 'beginner',
        tags: ['definitions', 'explanations', 'education'],
        useCase: 'Learning new concepts or technical terms'
      },
      {
        id: 'ir-8',
        title: 'Resource Linker',
        prompt: 'Answer with a short summary + link to full resource. Always provide the most relevant and authoritative sources.',
        description: 'Provide summaries with source links',
        difficulty: 'beginner',
        tags: ['summaries', 'links', 'resources'],
        useCase: 'When you want both quick answers and deeper reading'
      },
      {
        id: 'ir-9',
        title: 'Product Comparison Expert',
        prompt: 'Compare three product options (e.g., phones, laptops, services). Evaluate based on features, price, and user reviews.',
        description: 'Compare products across multiple criteria',
        difficulty: 'intermediate',
        tags: ['comparison', 'products', 'evaluation'],
        useCase: 'Making purchasing decisions or recommendations'
      },
      {
        id: 'ir-10',
        title: 'Current Events Explainer',
        prompt: 'Explain current events with both beginner and expert perspectives. Provide historical context and potential future implications.',
        description: 'Explain complex events at multiple levels',
        difficulty: 'advanced',
        tags: ['current-events', 'context', 'analysis'],
        useCase: 'Understanding complex world events or politics'
      }
    ]
  }
]

// Helper function to get prompts by agent type
export function getPromptsByType(type: string): SamplePrompt[] {
  const agentType = SAMPLE_PROMPTS.find(at => at.type === type)
  return agentType?.prompts || []
}

// Helper function to get a specific prompt by ID
export function getPromptById(id: string): SamplePrompt | undefined {
  for (const agentType of SAMPLE_PROMPTS) {
    const prompt = agentType.prompts.find(p => p.id === id)
    if (prompt) return prompt
  }
  return undefined
}

// Helper function to get all agent types
export function getAllAgentTypes() {
  return SAMPLE_PROMPTS.map(at => ({
    type: at.type,
    name: at.name,
    description: at.description,
    icon: at.icon
  }))
}
