import { describe, expect, it } from "vitest";
import { AssistantQuota } from "./quota";

describe("AssistantQuota", () => {
  it("limits a client within one window and allows requests after reset", () => {
    const quota = new AssistantQuota({ limit: 2, windowMs: 1_000 });

    expect(quota.take("192.0.2.1", 0)).toBe(true);
    expect(quota.take("192.0.2.1", 10)).toBe(true);
    expect(quota.take("192.0.2.1", 20)).toBe(false);
    expect(quota.take("192.0.2.1", 1_000)).toBe(true);
  });

  it("does not let one client consume another client’s quota", () => {
    const quota = new AssistantQuota({ limit: 1, windowMs: 1_000 });

    expect(quota.take("192.0.2.1", 0)).toBe(true);
    expect(quota.take("192.0.2.2", 0)).toBe(true);
  });
});
