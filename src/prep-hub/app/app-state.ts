/**
 * CAU English Prep Hub — Application State Container
 * Section 25 of Enhanced Architecture Specification
 */
import { PracticeMode, Level } from "../domain/types";

export type SessionStatus = "idle" | "active" | "submitted" | "completed";

export interface PracticeState {
  sessionId: string;
  mode: PracticeMode;
  level: Level;
  questionIds: string[];
  currentIndex: number;
  answered: number;
  correct: number;
  status: SessionStatus;
  startedAt: number;
}

export function createInitialPracticeState(
  mode: PracticeMode = "daily",
  level: Level = "B1"
): PracticeState {
  return {
    sessionId: "sess-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    mode,
    level,
    questionIds: [],
    currentIndex: 0,
    answered: 0,
    correct: 0,
    status: "idle",
    startedAt: Date.now(),
  };
}
