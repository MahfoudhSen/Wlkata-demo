import { NextRequest, NextResponse } from 'next/server';
import { robotService } from '@/lib/services';
import { RobotCommandSchema } from '@/lib/utils/validation';
import type { RobotCommand } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const command = RobotCommandSchema.parse(body) as RobotCommand;

    const result = await robotService.executeCommand(command);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          error: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Command execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
