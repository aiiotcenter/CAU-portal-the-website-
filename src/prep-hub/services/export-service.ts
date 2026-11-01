import { AnswerEvent, StudentExport } from "../domain/types";
import { prepDb } from "../storage/db";

export class ExportService {
  /**
   * Generates student portable JSON export
   */
  async generateExport(pseudonymousId: string): Promise<StudentExport> {
    let answers: AnswerEvent[] = [];
    try {
      answers = await prepDb.getAllAnswerEvents();
    } catch {
      answers = [];
    }

    return {
      format: "cau-english-hub-export",
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      pseudonymousId: pseudonymousId || "CAU-PREP-STUDENT",
      answers,
    };
  }

  /**
   * Validates imported JSON string against schema
   */
  validateImport(jsonText: string): { valid: boolean; data?: StudentExport; error?: string } {
    if (!jsonText || jsonText.length > 10 * 1024 * 1024) { // 10MB cap
      return { valid: false, error: "File exceeds maximum permitted size (10MB)" };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err: any) {
      return { valid: false, error: "Malformed JSON file: " + err.message };
    }

    if (parsed.format !== "cau-english-hub-export") {
      return { valid: false, error: "Unsupported file format. Expected 'cau-english-hub-export'." };
    }

    if (!Array.isArray(parsed.answers)) {
      return { valid: false, error: "Missing answers array in export payload." };
    }

    // Validate that answers conform to event structure
    for (let i = 0; i < parsed.answers.length; i++) {
      const a = parsed.answers[i];
      if (!a.questionId || typeof a.correct !== "boolean" || !a.timestamp) {
        return { valid: false, error: `Invalid answer record at index ${i}` };
      }
    }

    return { valid: true, data: parsed as StudentExport };
  }

  /**
   * Imports validated records with duplicate avoidance into IndexedDB
   */
  async applyImport(exported: StudentExport): Promise<{ importedCount: number; duplicateCount: number }> {
    let existingEvents: AnswerEvent[] = [];
    try {
      existingEvents = await prepDb.getAllAnswerEvents();
    } catch {}

    const existingIds = new Set(existingEvents.map(e => e.id));
    let importedCount = 0;
    let duplicateCount = 0;

    for (const item of exported.answers) {
      if (existingIds.has(item.id)) {
        duplicateCount++;
        continue;
      }
      try {
        await prepDb.saveAnswerEvent(item);
        importedCount++;
      } catch {}
    }

    return { importedCount, duplicateCount };
  }

  /**
   * Student privacy deletion control (Delete My Data)
   */
  async deleteMyData(): Promise<void> {
    try {
      await prepDb.clearAllData();
    } catch {}

    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("cauXP");
      localStorage.removeItem("cauStreak");
      localStorage.removeItem("cauBadges");
      localStorage.removeItem("cauMemberPass");
      localStorage.removeItem("cauEventRsvps");
    }
  }
}

export const exportService = new ExportService();
