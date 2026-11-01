import { describe, it, expect } from "vitest";
import { determineNextBestAction } from "../../src/prep-hub/learning/next-action";
import { AnswerEvent } from "../../src/prep-hub/domain/types";

describe("Next Best Action Engine", () => {
  const createEvent = (skill: any, tag: string, correct: boolean): AnswerEvent => ({
    id: Math.random().toString(),
    questionId: "q-" + Math.random(),
    questionVersion: 1,
    timestamp: Date.now(),
    sessionId: "sess-1",
    moduleId: "mod-1",
    level: "B1",
    skill,
    errorTag: tag,
    correct,
    responseMs: 2000,
    hintUsed: false,
    mode: "daily",
    selectedOptionId: "opt-1",
  });

  it("recommends diagnostic baseline when no practice events exist", () => {
    const action = determineNextBestAction({
      events: [],
      mistakesCount: 0,
    });
    expect(action.type).toBe("diagnostic");
    expect(action.title).toContain("Diagnostic Baseline");
    expect(action.ctaText).toBe("Start Diagnostic Baseline");
  });

  it("recommends reviewing mistakes when review queue has unresolved errors", () => {
    const events: AnswerEvent[] = [
      createEvent("grammar", "run-on", false),
      createEvent("grammar", "run-on", false),
      createEvent("vocabulary", "false-cognate", true),
    ];

    const action = determineNextBestAction({
      events,
      mistakesCount: 3,
    });

    expect(action.type).toBe("review_mistakes");
    expect(action.title).toContain("Review 3 Missed Questions");
    expect(action.ctaText).toBe("Review Mistakes Queue");
    expect(action.targetErrorTag).toBe("run-on");
  });

  it("recommends building evidence for missing skills when gated", () => {
    // 5 grammar questions answered, 0 reading or pragmatics
    const events: AnswerEvent[] = [
      createEvent("grammar", "run-on", true),
      createEvent("grammar", "run-on", true),
      createEvent("grammar", "run-on", true),
      createEvent("grammar", "run-on", true),
      createEvent("grammar", "run-on", true),
    ];

    const action = determineNextBestAction({
      events,
      mistakesCount: 0,
    });

    expect(action.type).toBe("skill_practice");
    expect(action.title).toContain("Build Evidence");
    expect(action.evidenceBasis).toContain("Readiness index gated");
  });

  it("recommends higher level challenge when performance and evidence are strong", () => {
    // Satisfy all 12+ criteria with 100% accuracy
    const events: AnswerEvent[] = [
      createEvent("grammar", "tag", true),
      createEvent("grammar", "tag", true),
      createEvent("grammar", "tag", true),
      createEvent("grammar", "tag", true),
      createEvent("vocabulary", "tag", true),
      createEvent("vocabulary", "tag", true),
      createEvent("vocabulary", "tag", true),
      createEvent("vocabulary", "tag", true),
      createEvent("reading", "tag", true),
      createEvent("reading", "tag", true),
      createEvent("pragmatics", "tag", true),
      createEvent("pragmatics", "tag", true),
    ];

    const action = determineNextBestAction({
      events,
      mistakesCount: 0,
    });

    expect(action.type).toBe("level_challenge");
    expect(action.title).toContain("Challenge Next Level");
    expect(action.ctaText).toBe("Start Timed Sprint");
  });
});
