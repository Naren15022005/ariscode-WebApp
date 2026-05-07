import fs from 'fs';
import path from 'path';
import { SqliteService } from './sqlite.service';

export class DatabaseMigrator {
  static async runMigrations(): Promise<void> {
    const db = await SqliteService.getInstance();
    const migrationsDir = path.join(__dirname, 'migrations');

    if (!fs.existsSync(migrationsDir)) {
      console.log('[Migrations] No migrations directory found');
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        db.exec(sql);
        console.log(`✓ Migration executed: ${file}`);
      } catch (e) {
        console.error(`✗ Migration failed: ${file}`, e);
      }
    }

    await SqliteService.save();
    console.log('✓ All migrations completed');
  }

  static async runSeed(seedPath: string): Promise<void> {
    const db = await SqliteService.getInstance();

    if (!fs.existsSync(seedPath)) {
      console.log('[Seed] Seed file not found:', seedPath);
      return;
    }

    const sql = fs.readFileSync(seedPath, 'utf-8');

    try {
      db.exec(sql);
      console.log('✓ Seed data loaded');
    } catch (e) {
      console.error('✗ Seed failed', e);
    }

    await SqliteService.save();
  }
}
