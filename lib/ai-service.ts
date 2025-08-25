import OpenAI from 'openai';

// Only initialize OpenAI on the server side
let openai: OpenAI | null = null;

if (typeof window === 'undefined') {
  // Server-side only
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface AIRecommendation {
  agentType: string;
  tools: string[];
  systemPrompt: string;
  reasoning: string;
  confidence: number;
}

export interface AIInsight {
  type: 'usage' | 'performance' | 'upgrade' | 'optimization';
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AIWorkflowOptimization {
  originalWorkflow: any;
  optimizedWorkflow: any;
  improvements: string[];
  estimatedPerformanceGain: number;
}

// Helper function to clean and parse JSON responses
function parseAIResponse(content: string): any {
  console.log('🔍 Original AI Response:', content);
  
  if (!content) throw new Error('No response from AI');
  
  let cleanContent = content.trim();
  console.log('🔍 After trim:', cleanContent);
  
  // Remove markdown code blocks
  cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  cleanContent = cleanContent.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  
  console.log('🔍 After removing markdown:', cleanContent);
  
  // Remove any leading/trailing whitespace
  cleanContent = cleanContent.trim();
  
  // If it still doesn't look like JSON, try to extract JSON from the content
  if (!cleanContent.startsWith('{') && !cleanContent.startsWith('[')) {
    console.log('🔍 Content does not start with { or [, trying to extract JSON...');
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
      console.log('🔍 Extracted JSON:', cleanContent);
    } else {
      console.log('🔍 No JSON found in content');
    }
  }
  
  console.log('🔍 Final content to parse:', cleanContent);
  
  try {
    const result = JSON.parse(cleanContent);
    console.log('✅ Successfully parsed JSON:', result);
    return result;
  } catch (error) {
    console.error('❌ JSON parse error:', error);
    console.error('❌ Failed content:', cleanContent);
    throw error;
  }
}

export class AIService {
  // AI-powered agent recommendations
  static async getAgentRecommendations(userInput: string): Promise<AIRecommendation> {
    if (!openai) {
      // Fallback for client-side
      return {
        agentType: 'personal-assistant',
        tools: ['search', 'calendar'],
        systemPrompt: 'You are a helpful AI assistant that helps with daily tasks and productivity.',
        reasoning: 'Default recommendation (AI service not available on client-side)',
        confidence: 0.5
      };
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI expert specializing in workflow automation and AI agents. 
            Analyze the user's needs and recommend the best agent type, tools, and configuration.
            
            Available agent types:
            - personal-assistant: For daily productivity and task management
            - study-research: For learning, research, and academic work
            - business-productivity: For professional work and business tasks
            - information-research: For finding and verifying information
            
            Available tools:
            - search: Web search for current information
            - calendar: Schedule and manage calendar events
            - notion: Read and write to Notion databases
            - email: Send and receive emails
            
            Respond with a JSON object containing:
            {
              "agentType": "recommended agent type",
              "tools": ["array of recommended tools"],
              "systemPrompt": "optimized system prompt",
              "reasoning": "explanation of recommendations",
              "confidence": 0.95
            }`
          },
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return parseAIResponse(response.choices[0].message.content || '');
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Fallback to default recommendation
      return {
        agentType: 'personal-assistant',
        tools: ['search', 'calendar'],
        systemPrompt: 'You are a helpful AI assistant that helps with daily tasks and productivity.',
        reasoning: 'Default recommendation based on common use cases',
        confidence: 0.5
      };
    }
  }

  // AI-powered usage insights
  static async generateUsageInsights(usageData: any): Promise<AIInsight[]> {
    if (!openai) {
      // Fallback for client-side
      return [
        {
          type: 'usage',
          title: 'Usage Analytics',
          description: 'Track your workflow usage and performance',
          action: 'Monitor your dashboard regularly',
          priority: 'medium'
        }
      ];
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a data analyst specializing in AI workflow analytics.
            Analyze the usage data and provide actionable insights and recommendations.
            
            Generate insights in this JSON format:
            [
              {
                "type": "usage|performance|upgrade|optimization",
                "title": "Insight title",
                "description": "Detailed description",
                "action": "Recommended action",
                "priority": "low|medium|high"
              }
            ]
            
            Focus on:
            - Usage patterns and trends
            - Performance optimization opportunities
            - Upgrade recommendations
            - Workflow improvements`
          },
          {
            role: "user",
            content: JSON.stringify(usageData)
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      return parseAIResponse(response.choices[0].message.content || '');
    } catch (error) {
      console.error('AI insights error:', error);
      return [];
    }
  }

  // AI-powered workflow generation
  static async generateOptimizedWorkflow(agentConfig: any): Promise<any> {
    if (!openai) {
      // Fallback for client-side - return basic workflow
      return {
        name: `${agentConfig.name || 'AI Agent'} Workflow`,
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            position: [240, 300],
            parameters: {
              httpMethod: 'POST',
              path: 'ai-agent',
              responseMode: 'responseNode'
            }
          },
          {
            id: 'openai',
            type: 'n8n-nodes-base.openAi',
            position: [460, 300],
            parameters: {
              resource: 'chatCompletion',
              model: 'gpt-4o-mini',
              messages: '={{ $json.body.messages }}',
              systemMessage: agentConfig.systemPrompt || 'You are a helpful AI assistant.'
            }
          }
        ],
        connections: {
          webhook: {
            main: [['openai']]
          }
        }
      };
    }
    
    try {
      console.log('🤖 Calling OpenAI for workflow generation with config:', agentConfig);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an n8n workflow expert. Generate an optimized n8n workflow JSON for the given AI agent configuration.
            
            The workflow should include:
            - Webhook trigger for incoming requests
            - OpenAI integration for AI processing
            - Tool integrations based on selected tools
            - Error handling and logging
            - Performance optimizations
            
            IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. The response must be parseable by JSON.parse().`
          },
          {
            role: "user",
            content: JSON.stringify(agentConfig)
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      console.log('🤖 OpenAI response received');
      return parseAIResponse(response.choices[0].message.content || '');
    } catch (error) {
      console.error('AI workflow generation error:', error);
      // Return a basic workflow template
      return {
        name: `${agentConfig.name || 'AI Agent'} Workflow`,
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            position: [240, 300],
            parameters: {
              httpMethod: 'POST',
              path: 'ai-agent',
              responseMode: 'responseNode'
            }
          },
          {
            id: 'openai',
            type: 'n8n-nodes-base.openAi',
            position: [460, 300],
            parameters: {
              resource: 'chatCompletion',
              model: 'gpt-4o-mini',
              messages: '={{ $json.body.messages }}',
              systemMessage: agentConfig.systemPrompt || 'You are a helpful AI assistant.'
            }
          }
        ],
        connections: {
          webhook: {
            main: [['openai']]
          }
        }
      };
    }
  }

  // AI-powered prompt optimization
  static async optimizeSystemPrompt(originalPrompt: string, context: string): Promise<string> {
    if (!openai) {
      // Fallback for client-side
      return originalPrompt;
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert at optimizing AI system prompts. 
            Take the original prompt and improve it based on the context provided.
            Make it more specific, actionable, and effective for the given use case.
            Return only the optimized prompt text.`
          },
          {
            role: "user",
            content: `Original prompt: "${originalPrompt}"
            Context: "${context}"
            
            Please optimize this prompt for better performance.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content || originalPrompt;
    } catch (error) {
      console.error('AI prompt optimization error:', error);
      return originalPrompt;
    }
  }

  // AI-powered business recommendations
  static async getBusinessRecommendations(businessData: any): Promise<any> {
    if (!openai) {
      // Fallback for client-side
      return {
        recommendations: [],
        estimatedROI: 0,
        priorityActions: []
      };
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a business consultant specializing in AI automation.
            Analyze the business data and provide recommendations for:
            - Workflow automation opportunities
            - Team structure optimization
            - Integration recommendations
            - ROI improvements
            
            IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. The response must be parseable by JSON.parse().`
          },
          {
            role: "user",
            content: JSON.stringify(businessData)
          }
        ],
        temperature: 0.6,
        max_tokens: 1500
      });

      return parseAIResponse(response.choices[0].message.content || '');
    } catch (error) {
      console.error('AI business recommendations error:', error);
      return {
        recommendations: [],
        estimatedROI: 0,
        priorityActions: []
      };
    }
  }

  // AI-powered support chatbot
  static async getSupportResponse(userQuestion: string, context: any = {}): Promise<string> {
    if (!openai) {
      // Fallback for client-side
      return 'I apologize, but I\'m experiencing technical difficulties. Please contact our support team for assistance.';
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI support assistant for an AI Agent Builder platform.
            You help users with:
            - Workflow creation and optimization
            - Tool integration questions
            - Platform usage guidance
            - Technical troubleshooting
            
            Be friendly, helpful, and provide actionable advice.
            If you don't know something, suggest contacting human support.`
          },
          {
            role: "user",
            content: `User question: "${userQuestion}"
            Context: ${JSON.stringify(context)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      return response.choices[0].message.content || 'I apologize, but I cannot provide a response at the moment. Please try again or contact support.';
    } catch (error) {
      console.error('AI support error:', error);
      return 'I apologize, but I\'m experiencing technical difficulties. Please contact our support team for assistance.';
    }
  }

  // AI-powered performance analysis
  static async analyzeWorkflowPerformance(workflowData: any): Promise<any> {
    if (!openai) {
      // Fallback for client-side
      return {
        bottlenecks: [],
        optimizations: [],
        estimatedImprovements: 0
      };
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a workflow performance analyst.
            Analyze the workflow data and provide:
            - Performance bottlenecks
            - Optimization suggestions
            - Resource usage insights
            - Scalability recommendations
            
            IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. The response must be parseable by JSON.parse().`
          },
          {
            role: "user",
            content: JSON.stringify(workflowData)
          }
        ],
        temperature: 0.5,
        max_tokens: 1200
      });

      return parseAIResponse(response.choices[0].message.content || '');
    } catch (error) {
      console.error('AI performance analysis error:', error);
      return {
        bottlenecks: [],
        optimizations: [],
        estimatedImprovements: 0
      };
    }
  }

  // AI-powered idea generation
  static async generateIdeaSuggestions(description: string, category: string = 'general'): Promise<string[]> {
    if (!openai) {
      // Fallback for client-side
      return [
        "Create a customer support chatbot that integrates with your existing CRM",
        "Build a content generation assistant for social media posts",
        "Develop a data analysis agent for business intelligence",
        "Design a workflow automation tool for repetitive tasks"
      ];
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI expert specializing in AI agent development and automation.
            Based on the user's description and category, generate 4-6 specific, actionable AI agent ideas.
            
            Each idea should be:
            - Specific and actionable
            - Include the main functionality
            - Mention potential integrations or tools
            - Be realistic and implementable
            
            IMPORTANT: Return ONLY valid JSON array of strings without any markdown formatting, code blocks, or additional text.`
          },
          {
            role: "user",
            content: `Description: "${description}"
            Category: ${category}
            
            Generate 4-6 AI agent ideas based on this description.`
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      });

      const result = parseAIResponse(response.choices[0].message.content || '');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('AI idea generation error:', error);
      return [
        "Create a customer support chatbot that integrates with your existing CRM",
        "Build a content generation assistant for social media posts",
        "Develop a data analysis agent for business intelligence",
        "Design a workflow automation tool for repetitive tasks"
      ];
    }
  }

  // AI-powered idea refinement
  static async refineIdea(idea: string): Promise<any> {
    if (!openai) {
      // Fallback for client-side
      return {
        title: 'Refined AI Agent Idea',
        description: idea,
        category: 'general',
        complexity: 'intermediate',
        potential: 'medium',
        suggestions: []
      };
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI expert specializing in AI agent development.
            Refine the given AI agent idea and provide:
            - A clear, descriptive title
            - Detailed description with features and capabilities
            - Appropriate category (customer-support, content-creation, data-analysis, automation, research, education, ecommerce, healthcare, finance, other)
            - Complexity level (beginner, intermediate, advanced)
            - Potential impact (low, medium, high)
            - Additional suggestions for implementation
            
            IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.`
          },
          {
            role: "user",
            content: `Refine this AI agent idea: "${idea}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return parseAIResponse(response.choices[0].message.content || '');
    } catch (error) {
      console.error('AI idea refinement error:', error);
      return {
        title: 'Refined AI Agent Idea',
        description: idea,
        category: 'general',
        complexity: 'intermediate',
        potential: 'medium',
        suggestions: []
      };
    }
  }
}
