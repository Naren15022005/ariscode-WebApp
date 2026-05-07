import { Conversation, ConversationMessage } from '@ariscode/shared';
import { IConversationRepository } from '../../domain/repositories';
import { getSharedStorage } from './sqlite.service';

export class SqliteConversationRepository implements IConversationRepository {
  private get storage() {
    return getSharedStorage();
  }

  private getConversations(): Conversation[] {
    return (this.storage.get('conversations') as Conversation[]) ?? [];
  }

  private getMessagesList(): ConversationMessage[] {
    return (this.storage.get('conversation_messages') as ConversationMessage[]) ?? [];
  }

  async findById(id: string): Promise<Conversation | null> {
    const conv = this.getConversations().find((c) => c.id === id) ?? null;
    if (!conv) return null;
    return { ...conv, messages: await this.getMessages(id) };
  }

  async findAll(userId?: string): Promise<Conversation[]> {
    const all = this.getConversations();
    const filtered = userId ? all.filter((c) => c.userId === userId) : all;
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async create(conversation: Conversation): Promise<void> {
    const list = this.getConversations();
    list.push({ ...conversation, messages: [] });
    this.storage.set('conversations', list);
  }

  async update(id: string, partial: Partial<Conversation>): Promise<void> {
    const list = this.getConversations();
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...partial, updatedAt: Date.now() };
      this.storage.set('conversations', list);
    }
  }

  async delete(id: string): Promise<void> {
    this.storage.set(
      'conversations',
      this.getConversations().filter((c) => c.id !== id),
    );
    this.storage.set(
      'conversation_messages',
      this.getMessagesList().filter((m) => m.conversationId !== id),
    );
  }

  async addMessage(message: ConversationMessage): Promise<void> {
    const msgs = this.getMessagesList();
    msgs.push(message);
    this.storage.set('conversation_messages', msgs);
    await this.update(message.conversationId, { updatedAt: Date.now() } as any);
  }

  async getMessages(conversationId: string): Promise<ConversationMessage[]> {
    return this.getMessagesList()
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }
}
