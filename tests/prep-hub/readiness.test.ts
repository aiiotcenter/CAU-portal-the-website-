import { describe, it, expect } from "vitest";
import { calculateReadiness, DEFAULT_READINESS_REQUIREMENTS } from "../../src/prep-hub/learning/readiness";
import { AnswerEvent, Skill } from "../../src/prep-hub/domain/types";

describe("Evidence-Gated Readiness Index", () => {
  const createEvent = (skill: Skill, correct: boolean): AnswerEvent => ({
    id: Math.random().toString(),
    questionId: "q-" + Math.random(),
    questionVersion: 1,
    timestamp: Date.now(),
    sessionId: "sess-1",
    moduleId: "mod-1",
    level: "B1",
    skill,
    errorTag: "tag",
    correct,
    responseMs: 1500,
    hintUsed: false,
    mode: "daily",
    selectedOptionId: "opt-1",
  });

  it("returns ready: false with missingSkills when evidence is insufficient", () => {
    // Only 3 grammar questions answered (requires 4)
    const events: AnswerEvent[] = [
      createEvent("grammar", true),
      createEvent("grammar", true),
      createEvent("grammar", false),
    ];

    const result = calculateReadiness(events);
    expect(result.ready).toBe(false);
    expect(result.score).toBeUndefined();
    expect(result.missingSkills).toContain("grammar");
    expect(result.missingSkills).toContain("vocabulary");
    expect(result.missingSkills).toContain("reading");
    expect(result.missingSkills).toContain("pragmatics");
    expect(result.disclaimer).toContain("More evidence is needed");
  });

  it("returns ready: true and valid score when all skill criteria and total count are met", () => {
    // Default requirements: 4 grammar, 4 vocabulary, 2 reading, 2 pragmatics (sum = 12 events)
    const events: AnswerEvent[] = [
      // 4 grammar (all correct)
      createEvent("grammar", true),
      createEvent("grammar", true),
      createEvent("grammar", true),
      createEvent("grammar", true),
      // 4 vocabulary (all correct)
      createEvent("vocabulary", true),
      createEvent("vocabulary", true),
      createEvent("vocabulary", true),
      createEvent("vocabulary", true),
      // 2 reading (1 correct, 1 wrong)
      createEvent("reading", true),
      createEvent("reading", false),
      // 2 pragmatics (all correct)
      createEvent("pragmatics", true),
      createEvent("pragmatics", true),
    ];

    const result = calculateReadiness(events);
    expect(result.ready).toBe(true);
    expect(result.score).toBeDefined();
    expect(result.score).toBeGreaterThanOrEqual(10);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.missingSkills.length).toBe(0);
    expect(result.disclaimer).toContain("Based on sufficient practice evidence");
  });
});
