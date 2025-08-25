import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, context } = body

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Get AI support response
    const response = await AIService.getSupportResponse(question, context)

    return NextResponse.json({
      success: true,
      response,
      message: 'Support response generated successfully'
    })

  } catch (error) {
    console.error('AI support error:', error)
    return NextResponse.json(
      { error: 'Failed to generate support response' },
      { status: 500 }
    )
  }
}
