import { SearchSolutionsByErrorUseCase, SqliteSolutionRepository } from '@ariscode/core';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const repository = new SqliteSolutionRepository();
const useCase = new SearchSolutionsByErrorUseCase(repository);

export async function GET(request: NextRequest) {
  try {
    const error = request.nextUrl.searchParams.get('error') || '';
    const solutions = await useCase.execute(error);
    return NextResponse.json(solutions);
  } catch (error) {
    console.error('Error searching solutions:', error);
    return NextResponse.json({ error: 'Failed to search solutions' }, { status: 500 });
  }
}
