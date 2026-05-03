import { Solution } from '@ariscode/shared';
import { ISolutionRepository } from '../../domain/repositories';
import { getSharedStorage } from './sqlite.service';

const TABLE_NAME = 'solutions';

export class SqliteSolutionRepository implements ISolutionRepository {
  async findById(id: string): Promise<Solution | null> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    return table.find((s: any) => s.id === id) || null;
  }

  async search(query: string): Promise<Solution[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const q = query.toLowerCase();
    return table.filter((s: any) =>
      s.title?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      (s.tags || []).some((tag: string) => tag.toLowerCase().includes(q))
    );
  }

  async searchByError(errorMessage: string): Promise<Solution[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const error = errorMessage.toLowerCase();
    return table.filter((s: any) =>
      (s.errorPattern || s.error || '').toLowerCase().includes(error) ||
      (s.tags || []).some((tag: string) => tag.toLowerCase().includes(error))
    );
  }

  async findAll(): Promise<Solution[]> {
    const storage = getSharedStorage();
    return storage.get(TABLE_NAME) || [];
  }

  async create(solution: Solution): Promise<void> {
    const storage = getSharedStorage();
    if (!storage.has(TABLE_NAME)) storage.set(TABLE_NAME, []);
    const table = storage.get(TABLE_NAME)!;
    if (!solution.id) {
      solution.id = `solution-${Date.now()}`;
    }
    table.push(solution);
  }

  async update(id: string, updates: Partial<Solution>): Promise<void> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const index = table.findIndex((s: any) => s.id === id);
    if (index >= 0) {
      table[index] = { ...table[index], ...updates };
    }
  }

  async delete(id: string): Promise<void> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const index = table.findIndex((s: any) => s.id === id);
    if (index >= 0) {
      table.splice(index, 1);
    }
  }

  async findPersonalSolutions(): Promise<Solution[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    return table.filter((s: any) => s.source === 'PERSONAL');
  }
}
