import { NextResponse } from 'next/server';
import { knowledgeService } from '@/lib/services';

export async function GET() {
  try {
    const modules = knowledgeService.getAllModules();

    return NextResponse.json({
      success: true,
      data: modules
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch modules'
      },
      { status: 500 }
    );
  }
}
