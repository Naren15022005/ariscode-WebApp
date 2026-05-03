import { SearchPatternsUseCase, SqlitePatternRepository } from '@ariscode/core';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const repository = new SqlitePatternRepository();
const useCase = new SearchPatternsUseCase(repository);

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q') || '';
    const patterns = await useCase.execute(query);
    return NextResponse.json(patterns);
  } catch (error) {
    console.error('Error searching patterns:', error);
    return NextResponse.json({ error: 'Failed to search patterns' }, { status: 500 });
  }
}
