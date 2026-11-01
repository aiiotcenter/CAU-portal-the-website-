import { AnswerEvent, ContentHealthMetric } from "../domain/types";

export interface QuestionPromptMap {
  [questionId: string]: string;
}

/**
 * Monitors question performance across aggregate answer events.
 * Identifies unusually hard, unusually easy, or ambiguous items.
 * Section 7.5 of CAU English Prep Hub Product Analysis & Workflow Plan.
 */
export function analyzeContentHealth(
  events: AnswerEvent[],
  promptMap: QuestionPromptMap = {}
): ContentHealthMetric[] {
  const qAgg: Record<
    string,
    { attempts: number; errors: number; optionCounts: Record<string, number> }
  > = {};

  for (const ev of events) {
    if (!qAgg[ev.questionId]) {
      qAgg[ev.questionId] = { attempts: 0, errors: 0, optionCounts: {} };
    }
    const item = qAgg[ev.questionId];
    item.attempts++;
    if (!ev.correct) {
      item.errors++;
      const opt = ev.selectedOptionId || "unknown";
      item.optionCounts[opt] = (item.optionCounts[opt] || 0) + 1;
    }
  }

  const results: ContentHealthMetric[] = [];

  for (const [qId, stats] of Object.entries(qAgg)) {
    if (stats.attempts < 4) continue; // insufficient sample size

    const errorRate = stats.errors / stats.attempts;
    let flag: ContentHealthMetric["flag"] = "normal";
    let reviewRecommended = false;

    if (stats.attempts >= 6 && errorRate >= 0.75) {
      flag = "unusually_hard";
      reviewRecommended = true;
    } else if (stats.attempts >= 10 && errorRate <= 0.05) {
      flag = "unusually_easy";
      reviewRecommended = true;
    } else if (stats.errors >= 4) {
      // Check for single distractor dominance (>80% of mistakes)
      const maxWrongOpt = Math.max(...Object.values(stats.optionCounts));
      if (maxWrongOpt / stats.errors >= 0.8) {
        flag = "unbalanced_distractors";
        reviewRecommended = true;
      }
    }

    results.push({
      questionId: qId,
      promptSnippet: promptMap[qId] || `Question #${qId}`,
      attempts: stats.attempts,
      errorRate: Math.round(errorRate * 100) / 100,
      flag,
      reviewRecommended,
    });
  }

  // Sort by review priority (flagged first, then highest error rate)
  results.sort((a, b) => {
    if (a.reviewRecommended && !b.reviewRecommended) return -1;
    if (!a.reviewRecommended && b.reviewRecommended) return 1;
    return b.errorRate - a.errorRate;
  });

  return results;
}
