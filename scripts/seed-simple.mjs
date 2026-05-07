#!/usr/bin/env node
/**
 * Seed the database with base patterns.
 * Usage: node scripts/seed-simple.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../database/ariscode.db');
const SEED_SQL = path.join(__dirname, '../database/seed.sql');
const PATTERNS_DIR = path.join(__dirname, '../patterns/base');

async function main() {
  console.log('Initializing SQLite…');
  const SQL = await initSqlJs();

  // Load database (must exist after migrate)
  const data = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(data);

  // Run seed.sql
  const sql = fs.readFileSync(SEED_SQL, 'utf-8');
  db.run(sql);
  console.log('✓ Seeded base patterns and solutions');

  // Load pattern metadata
  const dirs = fs
    .readdirSync(PATTERNS_DIR)
    .filter((d) => fs.statSync(path.join(PATTERNS_DIR, d)).isDirectory());

  const upsert = db.prepare(`
    INSERT OR REPLACE INTO templates (id, name, description, framework, language, version, source, priority, files, configSchema, userModified)
    VALUES (?, ?, ?, ?, ?, ?, 'base', ?, ?, ?, 0)
  `);

  for (const dir of dirs) {
    const metaPath = path.join(PATTERNS_DIR, dir, 'metadata.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    upsert.bind([
      meta.id,
      meta.name,
      meta.description ?? '',
      meta.framework,
      meta.language,
      meta.version ?? '1.0.0',
      meta.priority ?? 3,
      JSON.stringify(meta.files ?? []),
      meta.configSchema ? JSON.stringify(meta.configSchema) : null,
    ]);
    upsert.step();
    console.log(`  ✓ ${meta.id}`);
  }
  upsert.free();

  // Save database
  const data2 = db.export();
  fs.writeFileSync(DB_PATH, data2);
  console.log(`\n✓ Database seeded and saved to ${DB_PATH}`);
}

main().catch(console.error);
