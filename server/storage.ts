import { type SearchHistory, type InsertSearchHistory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSearchHistory(): Promise<SearchHistory[]>;
  addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  clearSearchHistory(): Promise<void>;
}

export class MemStorage implements IStorage {
  private searchHistory: Map<string, SearchHistory>;

  constructor() {
    this.searchHistory = new Map();
  }

  async getSearchHistory(): Promise<SearchHistory[]> {
    return Array.from(this.searchHistory.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async addSearchHistory(insertSearch: InsertSearchHistory): Promise<SearchHistory> {
    const id = randomUUID();
    const search: SearchHistory = {
      ...insertSearch,
      id,
      timestamp: new Date(),
    };
    this.searchHistory.set(id, search);
    return search;
  }

  async clearSearchHistory(): Promise<void> {
    this.searchHistory.clear();
  }
}

export const storage = new MemStorage();
