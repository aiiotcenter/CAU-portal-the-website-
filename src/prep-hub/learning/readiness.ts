import { AnswerEvent, Skill } from "../domain/types";

export interface ReadinessRequirement {
  skill: Skill;
  minimumAttempts: number;
}

export const DEFAULT_READINESS_REQUIREMENTS: ReadinessRequirement[] = [
  { skill: "grammar", minimumAttempts: 4 },
  { skill: "vocabulary", minimumAttempts: 4 },
  { skill: "reading", minimumAttempts: 2 },
  { skill: "pragmatics", minimumAttempts: 2 },
];

export interface ReadinessSkillDetail {
  skill: Skill;
  attempts: number;
  required: number;
  accuracy: number;
  satisfied: boolean;
}

export interface ReadinessResult {
  ready: boolean;
  score?: number; // 0 to 100
  missingSkills: string[];
  evidenceDetails: ReadinessSkillDetail[];
  disclaimer: string;
}

/**
 * Calculates evidence-gated readiness score.
 * Never gives a speculative prediction without minimum practice evidence.
 */
export function calculateReadiness(
  events: AnswerEvent[],
  requirements: ReadinessRequirement[] = DEFAULT_READINESS_REQUIREMENTS
): ReadinessResult {
  const stats: Record<string, { attempts: number; correct: number }> = {};

  for (const req of requirements) {
    stats[req.skill] = { attempts: 0, correct: 0 };
  }

  for (const event of events) {
    if (stats[event.skill]) {
      stats[event.skill].attempts++;
      if (event.correct) {
        stats[event.skill].correct++;
      }
    }
  }

  const missingSkills: string[] = [];
  const evidenceDetails: ReadinessSkillDetail[] = [];
  let totalWeightedAccuracy = 0;
  let totalRequirementsMet = 0;

  for (const req of requirements) {
    const s = stats[req.skill];
    const satisfied = s.attempts >= req.minimumAttempts;
    const accuracy = s.attempts > 0 ? (s.correct / s.attempts) : 0;

    if (!satisfied) {
      missingSkills.push(req.skill);
    } else {
      totalRequirementsMet++;
    }

    totalWeightedAccuracy += accuracy;

    evidenceDetails.push({
      skill: req.skill,
      attempts: s.attempts,
      required: req.minimumAttempts,
      accuracy: Math.round(accuracy * 100),
      satisfied,
    });
  }

  const isReady = missingSkills.length === 0 && events.length >= 12;

  if (!isReady) {
    return {
      ready: false,
      missingSkills,
      evidenceDetails,
      disclaimer: "Readiness estimate unavailable. More evidence is needed across core preparatory curriculum skills.",
    };
  }

  const rawScore = Math.round((totalWeightedAccuracy / requirements.length) * 100);
  const score = Math.max(10, Math.min(100, rawScore));

  return {
    ready: true,
    score,
    missingSkills: [],
    evidenceDetails,
    disclaimer: "Based on sufficient practice evidence. This is a practice readiness indicator and not a prediction of your official exam result.",
  };
}
