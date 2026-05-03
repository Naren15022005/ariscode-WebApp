import { SqliteService } from '../database/sqlite.service';
import { SqlitePatternRepository } from '../database/pattern.repository';
import { SEED_PATTERNS } from './patterns';

export async function seedPatterns(): Promise<void> {
  const db = SqliteService.getInstance();
  const repository = new SqlitePatternRepository();

  const existingPatterns = await repository.findAll();
  if (existingPatterns.length > 0) {
    console.log('Patterns already seeded, skipping');
    return;
  }

  for (const pattern of SEED_PATTERNS) {
    await repository.create(pattern);
    console.log(`Seeded pattern: ${pattern.name}`);
  }

  console.log(`Seeded ${SEED_PATTERNS.length} patterns`);
}
