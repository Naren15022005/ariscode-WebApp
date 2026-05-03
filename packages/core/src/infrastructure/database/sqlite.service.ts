import { DB_PATH } from '@ariscode/shared';

// Shared in-memory storage for development mode
const sharedStorage: Map<string, any[]> = new Map();

export function getSharedStorage() {
  return sharedStorage;
}

// Stub implementation for development (better-sqlite3 requires C++ build tools on Windows)
// TODO: Use better-sqlite3 in production or sql.js for cross-platform support
export class SqliteService {
  private static instance: any = null;

  static getInstance(): any {
    if (!SqliteService.instance) {
      SqliteService.instance = {
        prepare: (sql: string) => {
          return {
            get: (id: string) => null,
            all: (...args: any[]) => [],
            run: (...args: any[]) => ({ changes: 1 }),
          };
        },
        exec: (sql: string) => {},
        pragma: (pragma: string) => {},
        close: () => {},
      };
    }
    return SqliteService.instance;
  }

  static initialize(): void {
    console.log('⚠️  Using in-memory stub database (development mode)');
    console.log('For production: install Visual Studio Build Tools or use sql.js');
  }

  static close(): void {
    SqliteService.instance = null;
    sharedStorage.clear();
  }
}

