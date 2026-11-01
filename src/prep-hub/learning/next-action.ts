import { AnswerEvent, NextBestAction, StudentOnboardingProfile, Skill } from "../domain/types";
import { calculateFingerprint } from "./wilson";
import { calculateReadiness } from "./readiness";

export interface DetermineNextActionParams {
  events: AnswerEvent[];
  mistakesCount: number;
  onboarding?: StudentOnboardingProfile;
}

/**
 * Pure function to determine the student's Next Best Action
 * Sections 7.3 & 11 of CAU English Prep Hub Product Analysis & Workflow Plan
 */
export function determineNextBestAction(params: DetermineNextActionParams): NextBestAction {
  const { events, mistakesCount, onboarding } = params;

  // 1. Initial State: No practice history or diagnostic pending
  if (events.length === 0 || (onboarding && !onboarding.diagnosticCompleted)) {
    return {
      type: "diagnostic",
      title: "Complete 5-Question Diagnostic Baseline",
      description: "Establish your initial practice baseline across core preparatory curriculum skills (Grammar, Vocabulary, Reading, Pragmatics).",
      estimatedMinutes: 5,
      evidenceBasis: "New learner profile initialization (0 verified practice records).",
      ctaText: "Start Diagnostic Baseline",
    };
  }

  // 2. Unresolved Mistakes in Review Queue: Target weakness immediately
  if (mistakesCount >= 2) {
    const fingerprint = calculateFingerprint(events, { minimumAttempts: 2, maximumTags: 3 });
    const topTag = fingerprint[0]?.tag || "syntax-structure";
    const tagDisplay = topTag.replace(/-/g, " ");

    return {
      type: "review_mistakes",
      title: `Review ${mistakesCount} Missed Questions`,
      description: `Revisit questions focusing on '${tagDisplay}' to address recurring error patterns before moving forward.`,
      estimatedMinutes: Math.min(15, Math.max(5, mistakesCount * 2)),
      evidenceBasis: `${mistakesCount} unresolved errors recorded in local practice queue.`,
      targetErrorTag: topTag,
      reviewCount: mistakesCount,
      ctaText: "Review Mistakes Queue",
    };
  }

  // 3. Evidence-Gated Readiness: Target missing or weak skills
  const readiness = calculateReadiness(events);
  if (!readiness.ready && readiness.missingSkills.length > 0) {
    const targetSkill = (readiness.missingSkills[0] as Skill) || "grammar";
    const skillCapitalized = targetSkill.charAt(0).toUpperCase() + targetSkill.slice(1);
    const detail = readiness.evidenceDetails.find(d => d.skill === targetSkill);
    const attempts = detail ? detail.attempts : 0;
    const required = detail ? detail.required : 4;

    return {
      type: "skill_practice",
      title: `Build Evidence in ${skillCapitalized}`,
      description: `Complete targeted drills in ${skillCapitalized} to fulfill minimum evidence thresholds (${attempts}/${required} answered).`,
      estimatedMinutes: 8,
      evidenceBasis: `Readiness index gated: ${attempts}/${required} required answers in ${skillCapitalized}.`,
      targetSkill,
      ctaText: `Practice ${skillCapitalized}`,
    };
  }

  // 4. Low Accuracy Skill Focus
  const skillAgg: Record<string, { total: number; correct: number }> = {};
  for (const ev of events) {
    if (!skillAgg[ev.skill]) skillAgg[ev.skill] = { total: 0, correct: 0 };
    skillAgg[ev.skill].total++;
    if (ev.correct) skillAgg[ev.skill].correct++;
  }

  let lowestSkill: Skill | null = null;
  let lowestAcc = 1.0;
  for (const [sk, agg] of Object.entries(skillAgg)) {
    if (agg.total >= 3) {
      const acc = agg.correct / agg.total;
      if (acc < lowestAcc && acc < 0.65) {
        lowestAcc = acc;
        lowestSkill = sk as Skill;
      }
    }
  }

  if (lowestSkill) {
    const skCap = lowestSkill.charAt(0).toUpperCase() + lowestSkill.slice(1);
    const accPct = Math.round(lowestAcc * 100);
    return {
      type: "skill_practice",
      title: `Reinforce ${skCap} Fundamentals`,
      description: `Your recent accuracy in ${skCap} is ${accPct}%. Review core patterns to improve consistency.`,
      estimatedMinutes: 10,
      evidenceBasis: `${accPct}% accuracy across ${skillAgg[lowestSkill].total} attempts.`,
      targetSkill: lowestSkill,
      ctaText: `Drill ${skCap}`,
    };
  }

  // 5. High Mastery: Advance to Higher Challenge / Exam Mode
  return {
    type: "level_challenge",
    title: "Challenge Next Level / Exam Mode",
    description: "Solid performance maintained across core skills. Test your endurance under timed exam conditions.",
    estimatedMinutes: 10,
    evidenceBasis: `High consistency (>75% overall accuracy) over ${events.length} answer records.`,
    ctaText: "Start Timed Sprint",
  };
}
