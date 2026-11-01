/**
 * CAU English Prep Hub — Enhanced Domain Types
 * Based on Version 2.0 Enhanced Architecture & Development Specification
 */

export type Skill =
  | "grammar"
  | "vocabulary"
  | "reading"
  | "listening"
  | "writing"
  | "speaking"
  | "pragmatics";

export type Level = "A2" | "B1" | "B2" | "C1";

export type QuestionStatus = "draft" | "approved" | "retired";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  version: number;
  level: Level;
  skill: Skill;
  difficulty: number;
  errorTag: string;
  l1Risk?: string[];
  prompt: string;
  passage?: string | null;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  sourceType: "original" | "licensed";
  status: QuestionStatus;
}

export type PracticeMode = "daily" | "review" | "calm" | "exam" | "diagnostic";

export interface AnswerEvent {
  id: string;
  questionId: string;
  questionVersion: number;
  timestamp: number;
  sessionId: string;
  moduleId: string;
  level: Level;
  skill: Skill;
  errorTag: string;
  correct: boolean;
  responseMs: number;
  hintUsed: boolean;
  mode: PracticeMode;
  selectedOptionId: string;
}

export interface PracticeSession {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: PracticeMode;
  level: Level;
  questionCount: number;
  correctCount: number;
  status: "active" | "completed" | "abandoned";
}

export interface FeatureFlags {
  calmMode: boolean;
  examMode: boolean;
  fairLeagues: boolean;
  trapLab: boolean;
  linkerRadar: boolean;
  speakingStudio: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  calmMode: true,
  examMode: true,
  fairLeagues: true,
  trapLab: false,
  linkerRadar: true,
  speakingStudio: false,
};

export interface StudentExport {
  format: "cau-english-hub-export";
  schemaVersion: number;
  exportedAt: string;
  pseudonymousId: string;
  answers: AnswerEvent[];
}

export interface MondaySheetData {
  reportingPeriod: string;
  totalParticipants: number;
  totalSessions: number;
  topErrorPatterns: Array<{
    tag: string;
    totalAttempts: number;
    errorCount: number;
    errorRate: string;
    recommendation: string;
  }>;
  mostMissedQuestions: Array<{
    id: string;
    prompt: string;
    errorTag: string;
    missRate: string;
  }>;
  suggestedWarmUp: {
    title: string;
    duration: string;
    steps: string[];
  };
  positiveImprovements: string[];
}

export type NextActionType =
  | "diagnostic"
  | "review_mistakes"
  | "skill_practice"
  | "level_challenge";

export interface NextBestAction {
  type: NextActionType;
  title: string;
  description: string;
  estimatedMinutes: number;
  evidenceBasis: string;
  targetSkill?: Skill;
  targetLevel?: Level;
  targetErrorTag?: string;
  reviewCount?: number;
  ctaText: string;
}

export interface StudentOnboardingProfile {
  level: Level;
  goal: "module_pass" | "exit_exam" | "general_fluency";
  dailyTimeMinutes: number;
  diagnosticCompleted: boolean;
  baselineScore?: number;
}

export interface ContentHealthMetric {
  questionId: string;
  promptSnippet: string;
  attempts: number;
  errorRate: number; // 0 to 1
  flag: "normal" | "unusually_hard" | "unusually_easy" | "unbalanced_distractors";
  reviewRecommended: boolean;
}
