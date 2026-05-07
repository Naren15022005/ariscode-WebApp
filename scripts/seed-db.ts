#!/usr/bin/env node
/**
 * Seed the database with base patterns and seed.sql data.
 * Usage: npx ts-node --esm scripts/seed-db.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SqliteService } from './packages/core/src/infrastructure/database/sqlite.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_SQL = path.join(__dirname, 'database/seed.sql');
const PATTERNS_DIR = path.join(__dirname, 'patterns/base');

async function main() {
  SqliteService.initialize();
  const db = await SqliteService.getInstance();

  const sql = fs.readFileSync(SEED_SQL, 'utf-8');
  db.exec(sql);
  console.log('✓ Seeded base patterns and solutions.');

  // Load pattern metadata from patterns/ directory
  const dirs = fs.readdirSync(PATTERNS_DIR).filter((d) => {
    return fs.statSync(path.join(PATTERNS_DIR, d)).isDirectory();
  });

  const upsert = db.prepare(`
    INSERT OR REPLACE INTO templates (id, name, description, framework, language, version, source, priority, files, configSchema, userModified)
    VALUES (?, ?, ?, ?, ?, ?, 'base', ?, ?, ?, 0)
  `);

  for (const dir of dirs) {
    const metaPath = path.join(PATTERNS_DIR, dir, 'metadata.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    upsert.run(
      meta.id,
      meta.name,
      meta.description ?? '',
      meta.framework,
      meta.language,
      meta.version ?? '1.0.0',
      meta.priority ?? 3,
      JSON.stringify(meta.files ?? []),
      meta.configSchema ? JSON.stringify(meta.configSchema) : null,
    );
    console.log(`  ✓ ${meta.id}`);
  }

  SqliteService.save();
  console.log('\n✓ Seed complete.');
}

main().catch(console.error);
