#!/usr/bin/env node
/**
 * Run all SQL migrations in order.
 * Usage: node scripts/migrate-simple.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../database/ariscode.db');
const MIGRATIONS_DIR = path.join(
  __dirname,
  '../packages/core/src/infrastructure/database/migrations',
);

async function main() {
  console.log('Initializing SQLite…');
  const SQL = await initSqlJs();

  // Load or create database
  let data = null;
  try {
    if (fs.existsSync(DB_PATH)) {
      data = fs.readFileSync(DB_PATH);
      console.log('✓ Loaded existing database');
    }
  } catch (e) {
    console.warn('Could not load database file');
  }

  const db = data ? new SQL.Database(data) : new SQL.Database();

  // Create migrations table
  db.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Get applied migrations
  const stmt = db.prepare('SELECT filename FROM _migrations');
  const applied = new Set();
  while (stmt.step()) {
    applied.add(stmt.getAsObject().filename);
  }
  stmt.free();

  // Run pending migrations
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  ⊘ ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    try {
      db.run(sql);
      const ins = db.prepare('INSERT INTO _migrations (filename) VALUES (?)');
      ins.bind([file]);
      ins.step();
      ins.free();
      console.log(`  ✓ ${file}`);
    } catch (e) {
      console.error(`  ✗ ${file}:`, e);
    }
  }

  // Save database
  const data2 = db.export();
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, data2);
  console.log(`\n✓ Database saved to ${DB_PATH}`);
}

main().catch(console.error);
