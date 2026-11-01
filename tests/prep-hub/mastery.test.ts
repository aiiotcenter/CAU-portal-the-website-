import { describe, it, expect } from "vitest";
import { sigmoid, updateMastery } from "../../src/prep-hub/learning/mastery";

describe("Mastery Model (Elo-Style)", () => {
  it("computes sigmoid probabilities correctly", () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 4);
    expect(sigmoid(10)).toBeCloseTo(1, 4);
    expect(sigmoid(-10)).toBeCloseTo(0, 4);
  });

  it("increases ability when answering correctly", () => {
    const initialAbility = 0.5;
    const itemDifficulty = 0.5;
    const result = updateMastery(initialAbility, itemDifficulty, true, 0.25);
    expect(result.ability).toBeGreaterThan(initialAbility);
    expect(result.expectedProbability).toBeCloseTo(0.5, 4);
  });

  it("decreases ability when answering incorrectly", () => {
    const initialAbility = 0.8;
    const itemDifficulty = 0.5;
    const result = updateMastery(initialAbility, itemDifficulty, false, 0.25);
    expect(result.ability).toBeLessThan(initialAbility);
  });

  it("rewards harder questions more than easier questions upon correct answer", () => {
    const ability = 0.5;
    const correctHard = updateMastery(ability, 1.5, true, 0.25);
    const correctEasy = updateMastery(ability, -0.5, true, 0.25);

    const gainHard = correctHard.ability - ability;
    const gainEasy = correctEasy.ability - ability;

    expect(gainHard).toBeGreaterThan(gainEasy);
  });

  it("penalizes easier questions more upon incorrect answer", () => {
    const ability = 0.5;
    const wrongHard = updateMastery(ability, 1.5, false, 0.25);
    const wrongEasy = updateMastery(ability, -0.5, false, 0.25);

    const lossHard = ability - wrongHard.ability;
    const lossEasy = ability - wrongEasy.ability;

    expect(lossEasy).toBeGreaterThan(lossHard);
  });
});
