import { describe, it, expect } from "vitest";
import { wilsonLower, calculateFingerprint } from "../../src/prep-hub/learning/wilson";
import { AnswerEvent } from "../../src/prep-hub/domain/types";

describe("Wilson Score & Error Fingerprint", () => {
  it("computes wilson lower bound correctly for boundary cases", () => {
    expect(wilsonLower(0, 0)).toBe(0);
    expect(wilsonLower(0, 5)).toBe(0);
    
    // For n=10, correct=10, lower bound should be positive and less than 1.0
    const lowerBoundAllCorrect = wilsonLower(10, 10);
    expect(lowerBoundAllCorrect).toBeGreaterThan(0.6);
    expect(lowerBoundAllCorrect).toBeLessThanOrEqual(1.0);

    // 1/1 should have a lower confidence bound than 10/10
    const singleAttemptBound = wilsonLower(1, 1);
    expect(lowerBoundAllCorrect).toBeGreaterThan(singleAttemptBound);
  });

  it("calculates error fingerprint and flags tags with sufficient evidence", () => {
    const makeEvent = (tag: string, correct: boolean): AnswerEvent => ({
      id: Math.random().toString(),
      questionId: "q-" + Math.random(),
      questionVersion: 1,
      timestamp: Date.now(),
      sessionId: "s1",
      moduleId: "mod-1",
      level: "B1",
      skill: "grammar",
      errorTag: tag,
      correct,
      responseMs: 2500,
      hintUsed: false,
      mode: "daily",
      selectedOptionId: "opt-1",
    });

    // 5 attempts on 'run-on' (4 errors, 1 correct) -> total: 5, sufficient evidence >= 4
    // 2 attempts on 'article' (2 errors) -> total: 2, insufficient evidence (< 4)
    const events: AnswerEvent[] = [
      makeEvent("run-on", false),
      makeEvent("run-on", false),
      makeEvent("run-on", false),
      makeEvent("run-on", false),
      makeEvent("run-on", true),
      makeEvent("article", false),
      makeEvent("article", false),
    ];

    const fingerprint = calculateFingerprint(events, { minimumAttempts: 4, maximumTags: 5 });

    expect(fingerprint.length).toBe(2);

    const runOnMetric = fingerprint.find(m => m.tag === "run-on");
    expect(runOnMetric).toBeDefined();
    expect(runOnMetric?.totalAttempts).toBe(5);
    expect(runOnMetric?.errorCount).toBe(4);
    expect(runOnMetric?.hasSufficientEvidence).toBe(true);
    expect(runOnMetric?.recommendation).toContain("Separate independent clauses");

    const articleMetric = fingerprint.find(m => m.tag === "article");
    expect(articleMetric).toBeDefined();
    expect(articleMetric?.totalAttempts).toBe(2);
    expect(articleMetric?.hasSufficientEvidence).toBe(false);
  });

  it("limits fingerprint output to maximumTags", () => {
    const events: AnswerEvent[] = [];
    const tags = ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"];
    tags.forEach(t => {
      for (let i = 0; i < 5; i++) {
        events.push({
          id: Math.random().toString(),
          questionId: "q-" + Math.random(),
          questionVersion: 1,
          timestamp: Date.now(),
          sessionId: "s1",
          moduleId: "mod-1",
          level: "B1",
          skill: "grammar",
          errorTag: t,
          correct: false,
          responseMs: 1200,
          hintUsed: false,
          mode: "daily",
          selectedOptionId: "opt-1",
        });
      }
    });

    const fingerprint = calculateFingerprint(events, { minimumAttempts: 3, maximumTags: 3 });
    expect(fingerprint.length).toBe(3);
  });
});
