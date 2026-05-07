import { GetTemplatesUseCase, SqlitePatternRepository, initializeSharedStorage } from '@ariscode/core';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const repository = new SqlitePatternRepository();
const useCase = new GetTemplatesUseCase(repository as any);

export async function GET(request: NextRequest) {
  try {
    await initializeSharedStorage();
    const templates = await useCase.execute();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
