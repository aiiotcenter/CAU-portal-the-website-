import { describe, it, expect } from "vitest";
import { exportService } from "../../src/prep-hub/services/export-service";

describe("ExportService Validation & Import Pipeline", () => {
  it("rejects non-json string", () => {
    const result = exportService.validateImport("not valid json");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Malformed JSON");
  });

  it("rejects wrong export format identifier", () => {
    const payload = JSON.stringify({
      format: "random-format",
      schemaVersion: 1,
      answers: [],
    });
    const result = exportService.validateImport(payload);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unsupported file format");
  });

  it("rejects payload missing answers array", () => {
    const payload = JSON.stringify({
      format: "cau-english-hub-export",
      schemaVersion: 2,
    });
    const result = exportService.validateImport(payload);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Missing answers array");
  });

  it("rejects answer item with missing required fields", () => {
    const payload = JSON.stringify({
      format: "cau-english-hub-export",
      schemaVersion: 2,
      answers: [
        {
          questionId: "q1",
          // missing correct and timestamp
        },
      ],
    });
    const result = exportService.validateImport(payload);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid answer record at index 0");
  });

  it("accepts valid student export data", () => {
    const payload = JSON.stringify({
      format: "cau-english-hub-export",
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      pseudonymousId: "CAU-TEST-USER-1",
      answers: [
        {
          id: "evt-1",
          questionId: "cau-q-a2-gram-001",
          questionVersion: 1,
          timestamp: Date.now(),
          sessionId: "sess-1",
          moduleId: "mod-1",
          level: "A2",
          skill: "grammar",
          errorTag: "subject-verb-agreement",
          correct: true,
          responseMs: 1400,
          hintUsed: false,
          mode: "daily",
          selectedOptionId: "opt-1",
        },
      ],
    });

    const result = exportService.validateImport(payload);
    expect(result.valid).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.answers.length).toBe(1);
    expect(result.data?.pseudonymousId).toBe("CAU-TEST-USER-1");
  });
});
