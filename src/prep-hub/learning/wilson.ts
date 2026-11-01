import { AnswerEvent } from "../domain/types";

/**
 * Wilson Score Lower Bound calculation
 * Avoids overreacting to small sample sizes (e.g. 1/1 error vs 10/20 errors).
 */
export function wilsonLower(
  correct: number,
  n: number,
  z = 1.96
): number {
  if (n <= 0) return 0;

  const p = correct / n;
  const z2 = z * z;

  const denominator = 1 + z2 / n;
  const centre = p + z2 / (2 * n);
  const margin =
    z * Math.sqrt(
      (p * (1 - p) + z2 / (4 * n)) / n
    );

  return Math.max(0, (centre - margin) / denominator);
}

export interface FingerprintConfig {
  minimumAttempts: number;
  maximumTags: number;
}

export const DEFAULT_FINGERPRINT_CONFIG: FingerprintConfig = {
  minimumAttempts: 4,
  maximumTags: 5,
};

export interface ErrorTagMetric {
  tag: string;
  totalAttempts: number;
  errorCount: number;
  correctCount: number;
  errorRate: number; // 0 to 1
  wilsonLowerBound: number; // confidence-adjusted lower bound of error rate
  hasSufficientEvidence: boolean;
  recommendation: string;
}

/**
 * Generates the student's Error Fingerprint from historical answer events
 */
export function calculateFingerprint(
  events: AnswerEvent[],
  config: FingerprintConfig = DEFAULT_FINGERPRINT_CONFIG
): ErrorTagMetric[] {
  const tagAgg: Record<string, { total: number; errors: number; correct: number }> = {};

  for (const event of events) {
    if (!event.errorTag) continue;
    if (!tagAgg[event.errorTag]) {
      tagAgg[event.errorTag] = { total: 0, errors: 0, correct: 0 };
    }
    tagAgg[event.errorTag].total++;
    if (event.correct) {
      tagAgg[event.errorTag].correct++;
    } else {
      tagAgg[event.errorTag].errors++;
    }
  }

  const recommendationsMap: Record<string, string> = {
    "dangling-modifier": "Ensure introductory participial clauses logically describe the main clause subject.",
    "run-on": "Separate independent clauses using coordinating conjunctions, semicolons, or full stops.",
    "false-cognate": "Distinguish false cognates (e.g. 'konferans' = lecture, not conference) in academic vocabulary.",
    "calque": "Avoid literal L1 direct translation (e.g. use 'defend thesis', not 'defend yourself').",
    "subject-verb-agreement": "Check singular/plural subject-verb congruence, particularly in complex noun phrases.",
    "article": "Review definite vs zero-article rules for general academic abstractions."
  };

  const metrics: ErrorTagMetric[] = Object.entries(tagAgg).map(([tag, agg]) => {
    const errorRate = agg.total > 0 ? agg.errors / agg.total : 0;
    // Calculate Wilson lower bound of the error rate
    const lowerBound = wilsonLower(agg.errors, agg.total);
    const hasSufficientEvidence = agg.total >= config.minimumAttempts;

    return {
      tag,
      totalAttempts: agg.total,
      errorCount: agg.errors,
      correctCount: agg.correct,
      errorRate: Math.round(errorRate * 100) / 100,
      wilsonLowerBound: Math.round(lowerBound * 100) / 100,
      hasSufficientEvidence,
      recommendation: recommendationsMap[tag] || "Focus on targeted sentence drills and error detection exercises."
    };
  });

  // Sort by error severity (weighted by evidence/lowerBound), descending
  metrics.sort((a, b) => b.wilsonLowerBound - a.wilsonLowerBound || b.errorCount - a.errorCount);

  return metrics.slice(0, config.maximumTags);
}
