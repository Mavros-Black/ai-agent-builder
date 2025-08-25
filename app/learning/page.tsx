'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Target, 
  Zap, 
  Code, 
  Database, 
  Globe,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  Users,
  Lightbulb,
  Rocket,
  Brain,
  Cpu,
  Network,
  Shield
} from 'lucide-react'

interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  topics: string[]
  resources: {
    type: 'video' | 'article' | 'tutorial' | 'documentation'
    title: string
    url: string
    duration?: string
  }[]
  prerequisites: string[]
  outcomes: string[]
}

interface Platform {
  name: string
  description: string
  icon: any
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  pros: string[]
  cons: string[]
  bestFor: string[]
  pricing: string
  learningPaths: LearningPath[]
}

export default function LearningPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('n8n')
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  const platforms: Platform[] = [
    {
      name: 'n8n',
      description: 'Open-source workflow automation platform with powerful AI integration capabilities',
      icon: Zap,
      difficulty: 'intermediate',
      pros: [
        'Completely free and open-source',
        'Self-hosted for full control',
        'Extensive node library',
        'Powerful AI integrations',
        'Visual workflow builder',
        'Active community'
      ],
      cons: [
        'Requires technical setup',
        'Steeper learning curve',
        'Self-maintenance required'
      ],
      bestFor: [
        'Technical teams',
        'Custom integrations',
        'Data privacy requirements',
        'Cost-conscious organizations'
      ],
      pricing: 'Free (self-hosted)',
      learningPaths: [
        {
          id: 'n8n-beginner',
          title: 'n8n Fundamentals',
          description: 'Learn the basics of n8n workflow automation',
          difficulty: 'beginner',
          duration: '2-3 hours',
          topics: [
            'Understanding n8n interface',
            'Creating your first workflow',
            'Basic nodes and connections',
            'Webhook triggers',
            'Data transformation'
          ],
          resources: [
            {
              type: 'video',
              title: 'n8n Getting Started Guide',
              url: 'https://docs.n8n.io/getting-started/',
              duration: '15 min'
            },
            {
              type: 'tutorial',
              title: 'Build Your First Workflow',
              url: 'https://docs.n8n.io/tutorials/',
              duration: '30 min'
            },
            {
              type: 'documentation',
              title: 'n8n Core Concepts',
              url: 'https://docs.n8n.io/workflows/'
            }
          ],
          prerequisites: ['Basic computer skills'],
          outcomes: [
            'Create simple workflows',
            'Understand n8n interface',
            'Use basic nodes effectively',
            'Set up webhook triggers'
          ]
        },
        {
          id: 'n8n-ai-integration',
          title: 'AI Integration with n8n',
          description: 'Integrate AI services into your n8n workflows',
          difficulty: 'intermediate',
          duration: '3-4 hours',
          topics: [
            'OpenAI integration',
            'AI-powered data processing',
            'Natural language processing',
            'AI decision making',
            'Error handling with AI'
          ],
          resources: [
            {
              type: 'tutorial',
              title: 'OpenAI Integration Guide',
              url: 'https://docs.n8n.io/integrations/nodes/n8n-nodes-base.openAi/',
              duration: '45 min'
            },
            {
              type: 'article',
              title: 'Building AI-Powered Workflows',
              url: 'https://n8n.io/blog/',
              duration: '20 min'
            }
          ],
          prerequisites: ['n8n Fundamentals', 'Basic AI concepts'],
          outcomes: [
            'Integrate OpenAI into workflows',
            'Process data with AI',
            'Build intelligent automation',
            'Handle AI responses'
          ]
        },
        {
          id: 'n8n-advanced',
          title: 'Advanced n8n AI Agents',
          description: 'Build sophisticated AI agents with complex logic',
          difficulty: 'advanced',
          duration: '5-6 hours',
          topics: [
            'Multi-agent systems',
            'Advanced AI prompting',
            'Memory and context management',
            'Performance optimization',
            'Production deployment'
          ],
          resources: [
            {
              type: 'tutorial',
              title: 'Building Multi-Agent Systems',
              url: 'https://docs.n8n.io/examples/',
              duration: '90 min'
            },
            {
              type: 'documentation',
              title: 'Production Best Practices',
              url: 'https://docs.n8n.io/hosting/'
            }
          ],
          prerequisites: ['AI Integration with n8n', 'JavaScript basics'],
          outcomes: [
            'Build complex AI agents',
            'Optimize workflow performance',
            'Deploy to production',
            'Manage multi-agent systems'
          ]
        }
      ]
    },
    {
      name: 'Make.com (Integromat)',
      description: 'Visual automation platform with extensive app integrations',
      icon: Network,
      difficulty: 'beginner',
      pros: [
        'User-friendly interface',
        'Extensive app integrations',
        'Visual scenario builder',
        'Good documentation',
        'Cloud-hosted solution'
      ],
      cons: [
        'Limited free tier',
        'Less customization than n8n',
        'Vendor lock-in',
        'Higher costs at scale'
      ],
      bestFor: [
        'Business users',
        'Quick integrations',
        'Non-technical teams',
        'SaaS-heavy workflows'
      ],
      pricing: 'Free tier + paid plans',
      learningPaths: [
        {
          id: 'make-beginner',
          title: 'Make.com Basics',
          description: 'Get started with Make.com automation',
          difficulty: 'beginner',
          duration: '1-2 hours',
          topics: [
            'Understanding scenarios',
            'Connecting apps',
            'Basic data mapping',
            'Filters and routers',
            'Error handling'
          ],
          resources: [
            {
              type: 'video',
              title: 'Make.com Quick Start',
              url: 'https://www.make.com/en/help',
              duration: '20 min'
            },
            {
              type: 'tutorial',
              title: 'Your First Scenario',
              url: 'https://www.make.com/en/help/apps',
              duration: '25 min'
            }
          ],
          prerequisites: ['Basic computer skills'],
          outcomes: [
            'Create simple scenarios',
            'Connect different apps',
            'Map data between services',
            'Handle basic errors'
          ]
        },
        {
          id: 'make-ai',
          title: 'AI Integration in Make',
          description: 'Add AI capabilities to your Make scenarios',
          difficulty: 'intermediate',
          duration: '2-3 hours',
          topics: [
            'OpenAI integration',
            'AI-powered data processing',
            'Natural language workflows',
            'AI decision making',
            'Advanced data mapping'
          ],
          resources: [
            {
              type: 'tutorial',
              title: 'OpenAI in Make.com',
              url: 'https://www.make.com/en/help/apps/openai',
              duration: '40 min'
            }
          ],
          prerequisites: ['Make.com Basics'],
          outcomes: [
            'Integrate AI into scenarios',
            'Process text with AI',
            'Build intelligent workflows',
            'Optimize AI usage'
          ]
        }
      ]
    },
    {
      name: 'Zapier',
      description: 'Popular automation platform with thousands of app integrations',
      icon: Cpu,
      difficulty: 'beginner',
      pros: [
        'Extremely user-friendly',
        'Massive app ecosystem',
        'Excellent documentation',
        'Reliable service',
        'Quick setup'
      ],
      cons: [
        'Limited customization',
        'Expensive at scale',
        'No self-hosting option',
        'Vendor lock-in'
      ],
      bestFor: [
        'Small businesses',
        'Quick automations',
        'Non-technical users',
        'Standard integrations'
      ],
      pricing: 'Free tier + paid plans',
      learningPaths: [
        {
          id: 'zapier-basics',
          title: 'Zapier Fundamentals',
          description: 'Learn the basics of Zapier automation',
          difficulty: 'beginner',
          duration: '1-2 hours',
          topics: [
            'Understanding Zaps',
            'Connecting apps',
            'Basic triggers and actions',
            'Data formatting',
            'Testing and monitoring'
          ],
          resources: [
            {
              type: 'video',
              title: 'Zapier Getting Started',
              url: 'https://zapier.com/learn/',
              duration: '15 min'
            }
          ],
          prerequisites: ['Basic computer skills'],
          outcomes: [
            'Create simple Zaps',
            'Connect popular apps',
            'Automate basic tasks',
            'Monitor Zap performance'
          ]
        }
      ]
    },
    {
      name: 'Custom Development',
      description: 'Build AI agents from scratch using programming languages',
      icon: Code,
      difficulty: 'advanced',
      pros: [
        'Complete customization',
        'No platform limitations',
        'Full control over data',
        'Cost-effective at scale',
        'Unique capabilities'
      ],
      cons: [
        'Requires programming skills',
        'Longer development time',
        'Maintenance overhead',
        'Security responsibility'
      ],
      bestFor: [
        'Developers',
        'Custom requirements',
        'Large-scale deployments',
        'Unique use cases'
      ],
      pricing: 'Development costs + hosting',
      learningPaths: [
        {
          id: 'custom-python',
          title: 'Python AI Agents',
          description: 'Build AI agents using Python and modern frameworks',
          difficulty: 'advanced',
          duration: '10-15 hours',
          topics: [
            'Python fundamentals',
            'OpenAI API integration',
            'LangChain framework',
            'Vector databases',
            'Web frameworks (FastAPI/Flask)',
            'Deployment strategies'
          ],
          resources: [
            {
              type: 'tutorial',
              title: 'Building AI Agents with Python',
              url: 'https://python.langchain.com/',
              duration: '120 min'
            },
            {
              type: 'documentation',
              title: 'OpenAI API Documentation',
              url: 'https://platform.openai.com/docs'
            }
          ],
          prerequisites: ['Python programming', 'API concepts'],
          outcomes: [
            'Build custom AI agents',
            'Integrate multiple AI services',
            'Deploy scalable solutions',
            'Optimize performance'
          ]
        }
      ]
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Star className="w-4 h-4" />
      case 'intermediate': return <Target className="w-4 h-4" />
      case 'advanced': return <Rocket className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const selectedPlatformData = platforms.find(p => p.name === selectedPlatform)

  return (
    <DashboardLayout 
      title="Introduction & Learning"
      description="Master AI agent creation across different platforms"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agent Learning Center</h1>
            <p className="text-gray-600 mt-2">Comprehensive guides from beginner to advanced across multiple platforms</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              <GraduationCap className="w-3 h-3 mr-1" />
              Learning Paths
            </Badge>
          </div>
        </div>

        {/* Skill Level Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Assess Your Skill Level
            </CardTitle>
            <CardDescription>
              Choose your current level to get personalized learning recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <Card 
                  key={level}
                  className={`cursor-pointer transition-all border-2 ${
                    userLevel === level 
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                      : 'hover:shadow-sm border-gray-100'
                  }`}
                  onClick={() => setUserLevel(level)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {getDifficultyIcon(level)}
                      <h3 className="font-semibold capitalize">{level}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {level === 'beginner' && 'New to automation and AI agents'}
                      {level === 'intermediate' && 'Some experience with automation tools'}
                      {level === 'advanced' && 'Experienced with complex integrations'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {platforms.map((platform) => (
              <TabsTrigger key={platform.name} value={platform.name} className="flex items-center gap-2">
                <platform.icon className="w-4 h-4" />
                {platform.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {platforms.map((platform) => (
            <TabsContent key={platform.name} value={platform.name} className="space-y-6">
              {/* Platform Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <platform.icon className="w-5 h-5" />
                        {platform.name}
                      </CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(platform.difficulty)}>
                          {getDifficultyIcon(platform.difficulty)}
                          {platform.difficulty}
                        </Badge>
                        <Badge variant="outline">{platform.pricing}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
                          <ul className="space-y-1">
                            {platform.pros.map((pro, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2">Cons</h4>
                          <ul className="space-y-1">
                            {platform.cons.map((con, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-4 h-4 text-red-500">×</div>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-700 mb-2">Best For</h4>
                        <div className="flex flex-wrap gap-2">
                          {platform.bestFor.map((useCase, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {useCase}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Start Guide */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-orange-500" />
                      Quick Start
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">1</span>
                        </div>
                        <p className="text-sm">Choose your skill level</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">2</span>
                        </div>
                        <p className="text-sm">Follow learning path</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">3</span>
                        </div>
                        <p className="text-sm">Build your first agent</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">4</span>
                        </div>
                        <p className="text-sm">Deploy and optimize</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Learning Paths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    Learning Paths
                  </CardTitle>
                  <CardDescription>
                    Structured learning paths from beginner to advanced
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platform.learningPaths
                      .filter(path => userLevel === 'beginner' || path.difficulty !== 'beginner')
                      .map((path) => (
                        <Card key={path.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">{path.title}</h3>
                                  <Badge className={getDifficultyColor(path.difficulty)}>
                                    {getDifficultyIcon(path.difficulty)}
                                    {path.difficulty}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {path.duration}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <h4 className="font-medium text-sm text-gray-900 mb-2">Topics Covered</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {path.topics.map((topic, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {topic}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-gray-900 mb-2">Learning Outcomes</h4>
                                    <ul className="space-y-1">
                                      {path.outcomes.map((outcome, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs">
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                          {outcome}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium text-sm text-gray-900 mb-2">Resources</h4>
                                  <div className="space-y-2">
                                    {path.resources.map((resource, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs">
                                            {resource.type}
                                          </Badge>
                                          <span className="text-sm font-medium">{resource.title}</span>
                                          {resource.duration && (
                                            <span className="text-xs text-gray-500">{resource.duration}</span>
                                          )}
                                        </div>
                                        <Button size="sm" variant="ghost">
                                          <ExternalLink className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Additional Resources
            </CardTitle>
            <CardDescription>
              Extra resources to accelerate your AI agent learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold">Community Forums</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Connect with other AI agent builders and get help</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Join Community
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold">Code Examples</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Ready-to-use code snippets and templates</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Browse Examples
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold">Best Practices</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Security, performance, and deployment guidelines</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Read Guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
