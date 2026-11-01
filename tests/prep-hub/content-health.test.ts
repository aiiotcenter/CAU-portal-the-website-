import { describe, it, expect } from "vitest";
import { analyzeContentHealth } from "../../src/prep-hub/learning/content-health";
import { AnswerEvent } from "../../src/prep-hub/domain/types";

describe("Content Health Analysis", () => {
  const makeEvent = (qId: string, correct: boolean, selectedOpt = "opt-1"): AnswerEvent => ({
    id: Math.random().toString(),
    questionId: qId,
    questionVersion: 1,
    timestamp: Date.now(),
    sessionId: "sess-1",
    moduleId: "mod-1",
    level: "B1",
    skill: "grammar",
    errorTag: "run-on",
    correct,
    responseMs: 2500,
    hintUsed: false,
    mode: "daily",
    selectedOptionId: selectedOpt,
  });

  it("identifies questions with unusually high failure rates", () => {
    // 8 attempts, 7 errors -> 87.5% error rate -> unusually_hard
    const events: AnswerEvent[] = [];
    for (let i = 0; i < 7; i++) events.push(makeEvent("q-hard", false));
    events.push(makeEvent("q-hard", true));

    const metrics = analyzeContentHealth(events);
    expect(metrics.length).toBe(1);
    expect(metrics[0].questionId).toBe("q-hard");
    expect(metrics[0].flag).toBe("unusually_hard");
    expect(metrics[0].reviewRecommended).toBe(true);
  });

  it("identifies questions with unbalanced distractor bias", () => {
    // 5 attempts, 4 errors, all 4 errors chose 'opt-trap'
    const events: AnswerEvent[] = [];
    for (let i = 0; i < 4; i++) events.push(makeEvent("q-distractor", false, "opt-trap"));
    events.push(makeEvent("q-distractor", true, "opt-correct"));

    const metrics = analyzeContentHealth(events);
    expect(metrics.length).toBe(1);
    expect(metrics[0].flag).toBe("unbalanced_distractors");
    expect(metrics[0].reviewRecommended).toBe(true);
  });

  it("skips questions with insufficient sample size (<4)", () => {
    const events = [makeEvent("q-tiny", false), makeEvent("q-tiny", true)];
    const metrics = analyzeContentHealth(events);
    expect(metrics.length).toBe(0);
  });
});
