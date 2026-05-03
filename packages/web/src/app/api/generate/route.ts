import { GenerateProjectUseCase, SqlitePatternRepository, HandlebarsGenerator } from '@ariscode/core';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const patternRepository = new SqlitePatternRepository();
const generator = new HandlebarsGenerator();
const useCase = new GenerateProjectUseCase(patternRepository, patternRepository as any, generator);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patternId, variables } = body;

    if (!patternId) {
      return NextResponse.json({ error: 'patternId is required' }, { status: 400 });
    }

    const files = await useCase.execute({
      patternId,
      variables: variables || {},
    });

    return NextResponse.json({ files, success: true });
  } catch (error) {
    console.error('Error generating project:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
