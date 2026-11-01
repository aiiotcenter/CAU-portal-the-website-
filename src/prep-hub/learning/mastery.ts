/**
 * Mastery Model (Elo-Style)
 * Section 12 of Enhanced Software Architecture Specification
 */

export const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));

export interface MasteryUpdateResult {
  ability: number;
  expectedProbability: number;
}

/**
 * Updates student ability using an Elo-style logistic progression.
 * Keeps item difficulty stable during the pilot phase.
 */
export function updateMastery(
  ability: number,
  difficulty: number,
  correct: boolean,
  userK = 0.25
): MasteryUpdateResult {
  const expected = sigmoid(ability - difficulty);
  const error = (correct ? 1 : 0) - expected;

  return {
    ability: ability + userK * error,
    expectedProbability: expected,
  };
}
