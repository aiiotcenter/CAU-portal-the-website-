export type AssistantQuotaOptions = {
  limit: number;
  windowMs: number;
  maxEntries?: number;
};

type WindowState = { count: number; resetAt: number };

/**
 * Bounded, fixed-window protection for the public assistant. The deployment
 * gateway remains the preferred place for a cross-instance rate limit; this
 * guard prevents a single runtime from being exhausted in the meantime.
 */
export class AssistantQuota {
  private readonly entries = new Map<string, WindowState>();
  private readonly maxEntries: number;

  constructor(private readonly options: AssistantQuotaOptions) {
    this.maxEntries = options.maxEntries ?? 5_000;
  }

  take(clientKey: string, now = Date.now()): boolean {
    this.prune(now);
    const current = this.entries.get(clientKey);

    if (!current || current.resetAt <= now) {
      this.entries.set(clientKey, { count: 1, resetAt: now + this.options.windowMs });
      return true;
    }

    if (current.count >= this.options.limit) return false;
    current.count += 1;
    return true;
  }

  private prune(now: number) {
    Array.from(this.entries.entries()).forEach(([key, entry]) => {
      if (entry.resetAt <= now) this.entries.delete(key);
    });

    while (this.entries.size >= this.maxEntries) {
      const oldestKey = this.entries.keys().next().value;
      if (!oldestKey) break;
      this.entries.delete(oldestKey);
    }
  }
}
