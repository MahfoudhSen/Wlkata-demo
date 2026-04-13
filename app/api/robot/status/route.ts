import { NextResponse } from 'next/server';
import { robotService } from '@/lib/services';

export async function GET() {
  try {
    const status = robotService.getStatus();

    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
