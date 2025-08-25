import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idea } = body

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea is required' },
        { status: 400 }
      )
    }

    // Refine the idea using the AI service
    const refinedIdea = await AIService.refineIdea(idea)

    return NextResponse.json({
      success: true,
      ...refinedIdea,
      message: 'Idea refined successfully'
    })

  } catch (error) {
    console.error('AI idea refinement error:', error)
    return NextResponse.json(
      { error: 'Failed to refine idea' },
      { status: 500 }
    )
  }
}
