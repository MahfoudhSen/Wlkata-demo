import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { description, language } = await request.json();

    if (!description || !language) {
      return NextResponse.json(
        { success: false, error: 'Missing description or language' },
        { status: 400 }
      );
    }

    const code = await aiService.generateRobotCode(description, language);

    return NextResponse.json({
      success: true,
      data: { code }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Code generation failed'
      },
      { status: 500 }
    );
  }
}
