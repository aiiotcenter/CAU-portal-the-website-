import { AnswerEvent, Question, PracticeMode } from "../domain/types";
import { prepDb } from "../storage/db";
import { updateMastery } from "../learning/mastery";

export interface SubmitAnswerInput {
  question: Question;
  selectedOptionId: string;
  responseMs: number;
  hintUsed: boolean;
  sessionId: string;
  moduleId: string;
  mode: PracticeMode;
  currentAbility: number;
}

export interface SubmitAnswerResult {
  event: AnswerEvent;
  isCorrect: boolean;
  newAbility: number;
  explanation: string;
  errorTag: string;
}

/**
 * Single application service controlling answer submission
 * UI components never write directly to database
 */
export async function submitAnswer(input: SubmitAnswerInput): Promise<SubmitAnswerResult> {
  const isCorrect = input.selectedOptionId === input.question.correctOptionId;

  // Create immutable AnswerEvent
  const event: AnswerEvent = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    questionId: input.question.id,
    questionVersion: input.question.version,
    timestamp: Date.now(),
    sessionId: input.sessionId,
    moduleId: input.moduleId,
    level: input.question.level,
    skill: input.question.skill,
    errorTag: input.question.errorTag,
    correct: isCorrect,
    responseMs: input.responseMs,
    hintUsed: input.hintUsed,
    mode: input.mode,
    selectedOptionId: input.selectedOptionId,
  };

  // Persist to IndexedDB
  try {
    await prepDb.saveAnswerEvent(event);
  } catch (err) {
    console.warn("Could not write to IndexedDB, fallback active:", err);
  }

  // Update student mastery
  const mastery = updateMastery(input.currentAbility, input.question.difficulty, isCorrect);

  return {
    event,
    isCorrect,
    newAbility: Math.round(mastery.ability * 100) / 100,
    explanation: input.question.explanation,
    errorTag: input.question.errorTag,
  };
}
