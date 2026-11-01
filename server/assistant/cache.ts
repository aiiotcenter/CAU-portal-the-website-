// server/assistant/cache.ts
// In-Memory LRU Cache with TTL for CAU Assistant Queries
// Delivers instant (< 1ms) responses on repeated queries

export interface CachedAnswer {
  answer: string;
  sourceIds: string[];
  suggestedChips?: Array<{ label: string; prompt: string }>;
  actionLinks?: Array<{ label: string; url: string; kind?: string }>;
  mode: "verified" | "fallback";
  timestamp: number;
}

export class AssistantCache {
  private cache = new Map<string, CachedAnswer>();
  private readonly maxEntries: number;
  private readonly ttlMs: number;

  constructor(maxEntries = 1000, ttlMs = 24 * 60 * 60 * 1000) {
    this.maxEntries = maxEntries;
    this.ttlMs = ttlMs;
  }

  public normalizeKey(query: string): string {
    return query
      .toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF\u0600-\u06FF\u0400-\u04FF\s]/gi, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  public get(rawQuery: string): CachedAnswer | null {
    const key = this.normalizeKey(rawQuery);
    if (!this.cache.has(key)) return null;

    const entry = this.cache.get(key)!;
    // Check TTL expiration
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry;
  }

  public set(rawQuery: string, data: Omit<CachedAnswer, 'timestamp'>): void {
    const key = this.normalizeKey(rawQuery);
    if (!key) return;

    if (this.cache.size >= this.maxEntries) {
      // Evict oldest (least recently used)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      ...data,
      timestamp: Date.now(),
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

export const globalAssistantCache = new AssistantCache();
