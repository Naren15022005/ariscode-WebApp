import { SqliteService, seedPatterns } from '@ariscode/core';
import { NextResponse } from 'next/server';

async function initializeDatabase() {
  try {
    SqliteService.initialize();
    await seedPatterns();

    return NextResponse.json({
      success: true,
      message: 'Database initialized and seeded'
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return initializeDatabase();
}

export async function POST() {
  return initializeDatabase();
}
