import { NextRequest, NextResponse } from 'next/server';
import { knowledgeService } from '@/lib/services';
import type { SearchQuery } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const query: SearchQuery = await request.json();

    if (!query.query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const results = await knowledgeService.searchDocumentation(query);

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed'
      },
      { status: 500 }
    );
  }
}
