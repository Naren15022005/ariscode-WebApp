import { Session } from '@ariscode/shared';
import { ISessionRepository } from '../../domain/repositories';
import { getSharedStorage } from './sqlite.service';

export class SqliteSessionRepository implements ISessionRepository {
  private get sessions(): Session[] {
    return (getSharedStorage().get('sessions') as Session[]) ?? [];
  }

  private save(sessions: Session[]) {
    getSharedStorage().set('sessions', sessions);
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessions.find((s) => s.id === id) ?? null;
  }

  async findActive(userId: string): Promise<Session[]> {
    const now = Date.now();
    return this.sessions.filter(
      (s) => s.userId === userId && s.isActive && (!s.expiresAt || s.expiresAt > now),
    );
  }

  async create(session: Session): Promise<void> {
    this.save([...this.sessions, session]);
  }

  async updateActivity(id: string): Promise<void> {
    const list = this.sessions;
    const idx = list.findIndex((s) => s.id === id);
    if (idx !== -1) {
      list[idx].lastActivityAt = Date.now();
      this.save(list);
    }
  }

  async deactivate(id: string): Promise<void> {
    const list = this.sessions;
    const idx = list.findIndex((s) => s.id === id);
    if (idx !== -1) {
      list[idx].isActive = false;
      this.save(list);
    }
  }

  async cleanExpired(): Promise<void> {
    const now = Date.now();
    this.save(
      this.sessions.map((s) =>
        s.expiresAt && s.expiresAt < now ? { ...s, isActive: false } : s,
      ),
    );
  }
}
