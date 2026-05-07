import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: SqlJsDatabase | null = null;
let SQL: any = null;
let sharedStorageInstance: Map<string, any> | null = null;

function getDbPath() {
  const cwd = process.cwd();
  const potentialPaths = [
    path.join(cwd, 'database', 'ariscode.db'),
    path.join(cwd, '..', '..', 'database', 'ariscode.db'),
    path.join(cwd, '..', 'database', 'ariscode.db'),
  ];
  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      console.log(`[SharedStorage] Found database at: ${p}`);
      return p;
    }
  }
  console.log(`[SharedStorage] Database not found in any path, using: ${potentialPaths[0]}`);
  return potentialPaths[0];
}

async function initSQL() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

export async function initializeSharedStorage() {
  if (sharedStorageInstance) return sharedStorageInstance;

  try {
    const SQL = await initSQL();
    let data = null;

    const DB_PATH = getDbPath();
    if (fs.existsSync(DB_PATH)) {
      data = fs.readFileSync(DB_PATH);
    }

    dbInstance = data ? new SQL.Database(data) : new SQL.Database();
    sharedStorageInstance = new Map();

    const tables = ['templates', 'projects', 'solutions', 'conversations', 'conversation_messages', 'sessions', 'github_repositories'];

    for (const table of tables) {
      try {
        const stmt = dbInstance!.prepare(`SELECT * FROM ${table}`);
        const rows: any[] = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        sharedStorageInstance.set(table, rows);
        console.log(`[SharedStorage] Loaded ${rows.length} rows from ${table}`);
      } catch (e) {
        sharedStorageInstance.set(table, []);
      }
    }
  } catch (e) {
    console.error('[SharedStorage] Error initializing:', e);
    sharedStorageInstance = new Map();
  }

  return sharedStorageInstance;
}

export function getSharedStorage() {
  if (!sharedStorageInstance) {
    sharedStorageInstance = new Map();
  }
  return sharedStorageInstance;
}

export class SqliteService {
  private static instance: any = null;
  private static initialized = false;

  static async getInstance(): Promise<any> {
    if (SqliteService.instance && SqliteService.initialized) {
      return SqliteService.instance;
    }

    try {
      const SQL = await initSQL();

      // Try to load from file if it exists
      let data = null;
      try {
        const DB_PATH = getDbPath();
        if (fs.existsSync(DB_PATH)) {
          data = fs.readFileSync(DB_PATH);
        }
      } catch (e) {
        console.warn('Could not load database file:', e);
      }

      dbInstance = data ? new SQL.Database(data) : new SQL.Database();

      SqliteService.instance = {
        prepare: (sql: string) => {
          return {
            get: (...params: any[]) => {
              try {
                const stmt = dbInstance!.prepare(sql);
                if (params.length > 0) stmt.bind(params);
                const result = stmt.step() ? stmt.getAsObject() : null;
                stmt.free();
                return result;
              } catch (e) {
                return null;
              }
            },
            all: (...params: any[]) => {
              try {
                const stmt = dbInstance!.prepare(sql);
                if (params.length > 0) stmt.bind(params);
                const results = [];
                while (stmt.step()) {
                  results.push(stmt.getAsObject());
                }
                stmt.free();
                return results;
              } catch (e) {
                return [];
              }
            },
            run: (...params: any[]) => {
              try {
                const stmt = dbInstance!.prepare(sql);
                if (params.length > 0) stmt.bind(params);
                stmt.step();
                stmt.free();
                return { changes: dbInstance!.getRowsModified() };
              } catch (e) {
                return { changes: 0 };
              }
            },
            step: () => {
              try {
                const stmt = dbInstance!.prepare(sql);
                return stmt;
              } catch (e) {
                return null;
              }
            },
          };
        },
        exec: (sql: string) => {
          try {
            dbInstance!.run(sql);
          } catch (e) {
            console.error('SQL exec error:', e);
          }
        },
        pragma: (pragma: string) => {
          // For development, ignore pragma
        },
        close: async () => {
          await SqliteService.save();
          dbInstance = null;
          SqliteService.instance = null;
          SqliteService.initialized = false;
        },
        run: (sql: string) => {
          try {
            dbInstance!.run(sql);
          } catch (e) {
            console.error('SQL run error:', e);
          }
        },
      };

      SqliteService.initialized = true;
    } catch (e) {
      console.error('Error initializing database:', e);
    }

    return SqliteService.instance;
  }

  static async save() {
    if (dbInstance) {
      try {
        const DB_PATH = getDbPath();
        const data = dbInstance.export();
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DB_PATH, data);
        console.log(`✓ Database saved to ${DB_PATH}`);
      } catch (e) {
        console.warn('Could not save database:', e);
      }
    }
  }

  static initialize(): void {
    console.log('✓ Using sql.js for SQLite (with real database file)');
    console.log(`  Database path: ${getDbPath()}`);
  }

  static async close(): Promise<void> {
    await SqliteService.save();
    dbInstance = null;
    SqliteService.instance = null;
    SqliteService.initialized = false;
  }
}



