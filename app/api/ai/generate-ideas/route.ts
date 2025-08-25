import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, category } = body

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    // Generate AI suggestions using the AI service
    const suggestions = await AIService.generateIdeaSuggestions(description, category)

    return NextResponse.json({
      success: true,
      suggestions,
      message: 'Ideas generated successfully'
    })

  } catch (error) {
    console.error('AI idea generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}
