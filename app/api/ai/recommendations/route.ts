import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json();

    if (!userInput) {
      return NextResponse.json(
        { error: 'User input is required' },
        { status: 400 }
      );
    }

    const recommendation = await AIService.getAgentRecommendations(userInput);

    return NextResponse.json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
