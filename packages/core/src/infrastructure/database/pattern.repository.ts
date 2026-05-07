import { Pattern, PatternPriority } from '@ariscode/shared';
import { IPatternRepository } from '../../domain/repositories';
import { getSharedStorage } from './sqlite.service';

const TABLE_NAME = 'templates';

export class SqlitePatternRepository implements IPatternRepository {
  async findById(id: string): Promise<Pattern | null> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const row = table.find((r: any) => r.id === id);
    return row ? this.mapToPattern(row) : null;
  }

  async findByFramework(framework: string): Promise<Pattern[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    return table
      .filter((r: any) => r.framework === framework)
      .sort((a: any, b: any) => (a.priority || '').localeCompare(b.priority || ''))
      .map((row: any) => this.mapToPattern(row));
  }

  async findByLanguage(language: string): Promise<Pattern[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    return table
      .filter((r: any) => r.language === language)
      .sort((a: any, b: any) => (a.priority || '').localeCompare(b.priority || ''))
      .map((row: any) => this.mapToPattern(row));
  }

  async search(query: string): Promise<Pattern[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const searchTerm = query.toLowerCase();
    return table
      .filter((r: any) =>
        r.name?.toLowerCase().includes(searchTerm) ||
        r.description?.toLowerCase().includes(searchTerm) ||
        r.category?.toLowerCase().includes(searchTerm)
      )
      .map((row: any) => this.mapToPattern(row));
  }

  async findAll(): Promise<Pattern[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    console.log(`[PatternRepository.findAll] Storage tables: ${Array.from(storage.keys()).join(', ')}`);
    console.log(`[PatternRepository.findAll] Found ${table.length} patterns`);
    return table.map((row: any) => this.mapToPattern(row));
  }

  async create(pattern: Pattern): Promise<void> {
    const storage = getSharedStorage();
    if (!storage.has(TABLE_NAME)) storage.set(TABLE_NAME, []);
    const table = storage.get(TABLE_NAME)!;
    table.push(pattern);
    console.log(`[PatternRepository.create] Created pattern: ${pattern.id}, total: ${table.length}`);
  }

  async update(id: string, pattern: Partial<Pattern>): Promise<void> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const index = table.findIndex((r: any) => r.id === id);
    if (index >= 0) {
      table[index] = { ...table[index], ...pattern, updatedAt: Date.now() };
    }
  }

  async delete(id: string): Promise<void> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const index = table.findIndex((r: any) => r.id === id);
    if (index >= 0) {
      table.splice(index, 1);
    }
  }

  async findPersonalPatterns(): Promise<Pattern[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    return table
      .filter((r: any) => r.priority === PatternPriority.PERSONAL)
      .map((row: any) => this.mapToPattern(row));
  }

  private mapToPattern(row: any): Pattern {
    return row as Pattern;
  }
}
