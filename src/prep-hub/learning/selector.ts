import { sigmoid } from "./mastery";

/**
 * Pure adaptive question selection function
 * Selects candidate matching student ability to achieve optimal target success probability (~70%)
 */
export function chooseQuestion<T extends { id: string; difficulty: number }>(
  candidates: T[],
  ability: number,
  usedIds: Set<string>,
  targetProbability = 0.7
): T | undefined {
  return candidates
    .filter(q => !usedIds.has(q.id))
    .map(question => ({
      question,
      gap: Math.abs(
        sigmoid(ability - question.difficulty) - targetProbability
      ),
    }))
    .sort((a, b) => a.gap - b.gap)[0]
    ?.question;
}
