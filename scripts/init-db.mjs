/**
 * Initialize database from SQLite file into shared storage (one-time on startup)
 * Usage: node scripts/init-db.mjs (called from Next.js startup)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../database/ariscode.db');

export async function initializeDatabase() {
  console.log('Loading SQLite database into memory…');

  if (!fs.existsSync(DB_PATH)) {
    console.warn('Database file not found. Running migrations first…');
    return null;
  }

  try {
    const SQL = await initSqlJs();
    const data = fs.readFileSync(DB_PATH);
    const db = new SQL.Database(data);

    // Load tables into shared storage
    const tables = ['templates', 'projects', 'solutions'];
    const sharedStorage = new Map();

    for (const table of tables) {
      const stmt = db.prepare(`SELECT * FROM ${table}`);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      sharedStorage.set(table, rows);
      console.log(`  ✓ Loaded ${rows.length} rows from ${table}`);
    }

    return sharedStorage;
  } catch (e) {
    console.error('Error loading database:', e);
    return null;
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase().then(() => {
    console.log('✓ Database initialized');
    process.exit(0);
  });
}
