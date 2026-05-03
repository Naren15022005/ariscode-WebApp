import { Index } from 'flexsearch';
import { ISearchIndex } from '../../domain/repositories';

export class FlexSearchIndex implements ISearchIndex {
  private searchIndex: Index;

  constructor() {
    this.searchIndex = new Index({
      tokenize: 'full',
      resolution: 9,
    } as any);
  }

  index(items: any[]): void {
    items.forEach((item, idx) => {
      const searchText = [item.name, item.description, item.framework, item.language, item.category || '', item.keywords?.join(' ') || ''].join(' ');
      this.searchIndex.add(idx, searchText);
    });
  }

  search(query: string): string[] {
    if (!query || query.trim().length === 0) {
      return [];
    }
    const results = this.searchIndex.search(query, { limit: 50 });
    return results as string[];
  }

  clear(): void {
    (this.searchIndex as any).clear();
  }
}
