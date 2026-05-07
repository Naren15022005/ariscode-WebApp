'use server';
import { GenerateProjectUseCase, SqlitePatternRepository, HandlebarsGenerator } from '@ariscode/core';

const repo = new SqlitePatternRepository();
const generator = new HandlebarsGenerator();
const useCase = new GenerateProjectUseCase(repo, repo as any, generator);

export async function generateProject(patternId: string, variables: Record<string, unknown>) {
  return useCase.execute({ patternId, variables });
}
