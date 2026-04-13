import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services';
import { ChatRequestSchema } from '@/lib/utils/validation';
import type { ChatRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const chatRequest = ChatRequestSchema.parse(body) as ChatRequest;

    const response = await aiService.chat(chatRequest);

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Chat failed'
      },
      { status: 500 }
    );
  }
}
