import {
  SyncGitHubUseCase,
  SyncCronService,
  GitHubScraper,
  QualityScorer,
  ASTAnalyzer,
  IssueExtractor,
  SqlitePatternRepository,
  SqliteSolutionRepository,
} from '@ariscode/core';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const patternRepo = new SqlitePatternRepository();
    const solutionRepo = new SqliteSolutionRepository();
    const scraper = new GitHubScraper();
    const scorer = new QualityScorer();
    const analyzer = new ASTAnalyzer();
    const extractor = new IssueExtractor();

    const syncService = new SyncCronService(
      patternRepo,
      solutionRepo,
      scraper,
      scorer,
      analyzer,
      extractor
    );

    const useCase = new SyncGitHubUseCase(syncService);
    const result = await useCase.execute();

    return NextResponse.json({
      success: true,
      message: 'GitHub sync completed',
      stats: result,
    });
  } catch (error) {
    console.error('Error during sync:', error);
    return NextResponse.json(
      { error: 'Failed to sync GitHub' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'POST to trigger GitHub sync',
    lastSync: null,
  });
}
