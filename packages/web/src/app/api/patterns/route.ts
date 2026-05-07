import { SearchPatternsUseCase, SqlitePatternRepository, initializeSharedStorage, getSharedStorage } from '@ariscode/core';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const repository = new SqlitePatternRepository();
const useCase = new SearchPatternsUseCase(repository);

export async function GET(request: NextRequest) {
  try {
    const cwd = process.cwd();
    const dbPath = path.join(cwd, 'database', 'ariscode.db');
    const altDbPath = path.join(cwd, '..', '..', 'database', 'ariscode.db');

    console.log(`[patterns API] CWD: ${cwd}`);
    console.log(`[patterns API] dbPath exists: ${fs.existsSync(dbPath)}`);
    console.log(`[patterns API] altDbPath exists: ${fs.existsSync(altDbPath)}`);

    const storage = await initializeSharedStorage();
    const tables = Array.from(storage.keys());
    console.log(`[patterns API] Storage tables: ${tables.join(', ')}`);
    console.log(`[patterns API] Templates in storage: ${storage.get('templates')?.length || 0}`);

    const query = request.nextUrl.searchParams.get('q') || '';
    const patterns = await useCase.execute(query);
    console.log(`[patterns API] Found ${patterns.length} patterns`);

    return NextResponse.json({
      patterns,
      debug: { cwd, dbPathExists: fs.existsSync(dbPath), tables }
    });
  } catch (error) {
    console.error('Error searching patterns:', error);
    return NextResponse.json({
      error: 'Failed to search patterns',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
