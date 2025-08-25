import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usageData } = body

    if (!usageData) {
      return NextResponse.json(
        { error: 'Usage data is required' },
        { status: 400 }
      )
    }

    // Generate AI insights
    const insights = await AIService.generateUsageInsights(usageData)

    return NextResponse.json({
      success: true,
      insights,
      message: 'Insights generated successfully'
    })

  } catch (error) {
    console.error('AI insights generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
