import { GenerateProjectUseCase, SqlitePatternRepository, HandlebarsGenerator, initializeSharedStorage } from '@ariscode/core';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const patternRepository = new SqlitePatternRepository();
const generator = new HandlebarsGenerator();
const useCase = new GenerateProjectUseCase(patternRepository, patternRepository as any, generator);

export async function POST(request: NextRequest) {
  try {
    await initializeSharedStorage();
    const body = await request.json();
    const { patternId, templateId, variables, projectName } = body;

    // Support both patternId and templateId for backwards compatibility
    const id = patternId || templateId;

    if (!id) {
      return NextResponse.json({ error: 'patternId or templateId is required' }, { status: 400 });
    }

    const files = await useCase.execute({
      patternId: id,
      variables: variables || {},
    });

    // Generate project ID
    const projectId = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      files,
      success: true,
      projectId,
      projectName: projectName || 'Untitled Project'
    });
  } catch (error) {
    console.error('Error generating project:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST /api/generate to generate a new project',
    example: {
      templateId: 'nestjs-crud',
      projectName: 'My CRUD API',
      variables: { moduleName: 'Product' },
    },
  });
}

