import { describe, it, expect, beforeEach } from "vitest";
import { getFeatureFlags, isFeatureEnabled, setFeatureFlag } from "../../src/prep-hub/app/feature-flags";
import { createInitialPracticeState } from "../../src/prep-hub/app/app-state";

describe("Feature Flags & App State", () => {
  it("provides default feature flags", () => {
    const flags = getFeatureFlags();
    expect(flags.calmMode).toBe(true);
    expect(flags.examMode).toBe(true);
    expect(flags.trapLab).toBe(false);
  });

  it("can toggle individual feature flag", () => {
    setFeatureFlag("trapLab", true);
    expect(isFeatureEnabled("trapLab")).toBe(true);
    setFeatureFlag("trapLab", false);
    expect(isFeatureEnabled("trapLab")).toBe(false);
  });

  it("initializes practice session state correctly", () => {
    const state = createInitialPracticeState("calm", "B2");
    expect(state.mode).toBe("calm");
    expect(state.level).toBe("B2");
    expect(state.status).toBe("idle");
    expect(state.answered).toBe(0);
    expect(state.correct).toBe(0);
    expect(state.sessionId).toContain("sess-");
  });
});
