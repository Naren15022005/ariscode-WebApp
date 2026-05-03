import { GetProjectsUseCase, SaveProjectUseCase, SqliteProjectRepository } from '@ariscode/core';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const repository = new SqliteProjectRepository();
const getProjectsUseCase = new GetProjectsUseCase(repository);
const saveProjectUseCase = new SaveProjectUseCase(repository);

export async function GET() {
  try {
    const projects = await getProjectsUseCase.execute(20);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, patternId, variables, files } = body;

    if (!name || !patternId) {
      return NextResponse.json({ error: 'name and patternId are required' }, { status: 400 });
    }

    await saveProjectUseCase.execute({
      id: `project-${Date.now()}`,
      name,
      patternId,
      variables,
      generatedFiles: files || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return NextResponse.json({ success: true, message: 'Project saved' });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}
