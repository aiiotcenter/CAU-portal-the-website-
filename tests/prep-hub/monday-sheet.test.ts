import { describe, it, expect } from "vitest";
import { mondaySheetService } from "../../src/prep-hub/services/monday-sheet-service";
import { AnswerEvent } from "../../src/prep-hub/domain/types";

describe("Teacher Monday Sheet Generation", () => {
  it("generates structured aggregate Monday Sheet without individual tracking", () => {
    const events: AnswerEvent[] = [
      {
        id: "ev1",
        questionId: "q-1",
        questionVersion: 1,
        timestamp: Date.now(),
        sessionId: "s1",
        moduleId: "mod1",
        level: "B1",
        skill: "grammar",
        errorTag: "run-on",
        correct: false,
        responseMs: 2000,
        hintUsed: false,
        mode: "daily",
        selectedOptionId: "opt-a",
      },
      {
        id: "ev2",
        questionId: "q-1",
        questionVersion: 1,
        timestamp: Date.now(),
        sessionId: "s2",
        moduleId: "mod1",
        level: "B1",
        skill: "grammar",
        errorTag: "run-on",
        correct: false,
        responseMs: 2200,
        hintUsed: false,
        mode: "daily",
        selectedOptionId: "opt-a",
      },
      {
        id: "ev3",
        questionId: "q-2",
        questionVersion: 1,
        timestamp: Date.now(),
        sessionId: "s1",
        moduleId: "mod1",
        level: "B1",
        skill: "grammar",
        errorTag: "dangling-modifier",
        correct: true,
        responseMs: 1800,
        hintUsed: false,
        mode: "daily",
        selectedOptionId: "opt-b",
      },
    ];

    const sheet = mondaySheetService.generateSheet(events, 25, 40);

    expect(sheet.reportingPeriod).toBeDefined();
    expect(sheet.totalParticipants).toBe(25);
    expect(sheet.totalSessions).toBe(40);
    expect(sheet.topErrorPatterns.length).toBeGreaterThan(0);
    expect(sheet.topErrorPatterns[0].tag).toBe("run-on");
    expect(sheet.suggestedWarmUp.title).toContain("Clause Boundary");
    expect(sheet.suggestedWarmUp.steps.length).toBeGreaterThan(0);
    expect(sheet.mostMissedQuestions.length).toBeGreaterThan(0);
    expect(sheet.positiveImprovements.length).toBeGreaterThan(0);
  });
});
