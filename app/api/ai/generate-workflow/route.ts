import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // The wizard sends the config object directly, not wrapped in agentConfig
    const agentConfig = body.agentConfig || body

    if (!agentConfig) {
      return NextResponse.json(
        { error: 'Agent configuration is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!agentConfig.type || !agentConfig.systemPrompt) {
      return NextResponse.json(
        { error: 'Agent type and system prompt are required' },
        { status: 400 }
      )
    }

    // Generate optimized workflow using AI
    const optimizedWorkflow = await AIService.generateOptimizedWorkflow(agentConfig)

    return NextResponse.json({
      success: true,
      workflow: optimizedWorkflow,
      message: 'Workflow generated successfully'
    })

  } catch (error) {
    console.error('AI workflow generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate workflow' },
      { status: 500 }
    )
  }
}
