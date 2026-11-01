import { describe, it, expect } from "vitest";
import { chooseQuestion } from "../../src/prep-hub/learning/selector";

describe("Adaptive Question Selector", () => {
  interface DummyQ {
    id: string;
    difficulty: number;
  }

  const candidates: DummyQ[] = [
    { id: "q-easy", difficulty: -1.0 },
    { id: "q-medium", difficulty: 0.0 },
    { id: "q-target", difficulty: 0.8 },
    { id: "q-hard", difficulty: 2.0 },
  ];

  it("selects question that yields success probability closest to target (0.7)", () => {
    // Student ability = 1.65.
    // For q-target (diff 0.8): ability - diff = 0.85 -> sigmoid(0.85) = 1/(1+e^-0.85) ≈ 0.7005 -> gap ≈ 0.0005!
    const selected = chooseQuestion(candidates, 1.65, new Set<string>());
    expect(selected).toBeDefined();
    expect(selected?.id).toBe("q-target");
  });

  it("excludes questions in the usedIds set", () => {
    const used = new Set<string>(["q-target"]);
    const selected = chooseQuestion(candidates, 1.65, used);
    expect(selected).toBeDefined();
    expect(selected?.id).not.toBe("q-target");
  });

  it("returns undefined when no candidates remain", () => {
    const used = new Set<string>(["q-easy", "q-medium", "q-target", "q-hard"]);
    const selected = chooseQuestion(candidates, 1.65, used);
    expect(selected).toBeUndefined();
  });
});
