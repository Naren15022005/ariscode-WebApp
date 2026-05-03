import { Project } from '@ariscode/shared';
import { IProjectRepository } from '../../domain/repositories';
import { getSharedStorage } from './sqlite.service';

const TABLE_NAME = 'projects';

export class SqliteProjectRepository implements IProjectRepository {
  async findById(id: string): Promise<Project | null> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    return table.find((p: any) => p.id === id) || null;
  }

  async findAll(): Promise<Project[]> {
    const storage = getSharedStorage();
    return storage.get(TABLE_NAME) || [];
  }

  async create(project: Project): Promise<void> {
    const storage = getSharedStorage();
    if (!storage.has(TABLE_NAME)) storage.set(TABLE_NAME, []);
    const table = storage.get(TABLE_NAME)!;
    if (!project.id) {
      project.id = `project-${Date.now()}`;
    }
    table.push(project);
  }

  async update(id: string, updates: Partial<Project>): Promise<void> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const index = table.findIndex((p: any) => p.id === id);
    if (index >= 0) {
      table[index] = { ...table[index], ...updates };
    }
  }

  async delete(id: string): Promise<void> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    const index = table.findIndex((p: any) => p.id === id);
    if (index >= 0) {
      table.splice(index, 1);
    }
  }

  async findRecent(limit: number): Promise<Project[]> {
    const storage = getSharedStorage();
    const table = storage.get(TABLE_NAME) || [];
    return table
      .sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, limit);
  }
}
