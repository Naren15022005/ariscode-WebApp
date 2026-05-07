#!/usr/bin/env node
/**
 * Run all SQL migrations in order.
 * Usage: npx ts-node --esm scripts/migrate.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SqliteService } from '../packages/core/dist/infrastructure/database/sqlite.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(
  __dirname,
  '../packages/core/src/infrastructure/database/migrations',
);

async function main() {
  SqliteService.initialize();
  const db = await SqliteService.getInstance();

  // Track applied migrations
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const stmt = db.prepare('SELECT filename FROM _migrations');
  const applied = new Set(
    (stmt.all() as { filename: string }[]).map((r) => r.filename),
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip  ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    db.exec(sql);
    db.prepare('INSERT INTO _migrations (filename) VALUES (?)').run(file);
    console.log(`  ✓     ${file}`);
  }

  SqliteService.save();
  console.log('\n✓ Migrations complete.');
}

main().catch(console.error);

async function main() {
  SqliteService.initialize();
  const db = await SqliteService.getInstance();

  // Track applied migrations
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const stmt = db.prepare('SELECT filename FROM _migrations');
  const applied = new Set(
    (stmt.all() as { filename: string }[]).map((r) => r.filename),
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip  ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    db.exec(sql);
    db.prepare('INSERT INTO _migrations (filename) VALUES (?)').run(file);
    console.log(`  ✓     ${file}`);
  }

  SqliteService.save();
  console.log('\n✓ Migrations complete.');
}

main().catch(console.error);
