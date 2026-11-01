import test from "node:test";
import assert from "node:assert/strict";
import { scoreAnswer, tierForXp, nextStreak, seededShuffle } from "../scripts/core/scoring.js";

test("wrong answer scores 0 and resets combo", () => {
  const r = scoreAnswer({ correct: false, elapsedMs: 1000, limitMs: 45000, combo: 4, hintUsed: false });
  assert.deepEqual(r, { points: 0, speedBonus: 0, comboBonus: 0, nextCombo: 0 });
});

test("instant correct answer gives max speed bonus", () => {
  const r = scoreAnswer({ correct: true, elapsedMs: 0, limitMs: 45000, combo: 0, hintUsed: false });
  assert.equal(r.points, 20);
});

test("hint lowers base points", () => {
  const a = scoreAnswer({ correct: true, elapsedMs: 45000, limitMs: 45000, combo: 0, hintUsed: true });
  assert.equal(a.points, 6);
});

test("combo bonus is capped at +10", () => {
  const r = scoreAnswer({ correct: true, elapsedMs: 45000, limitMs: 45000, combo: 20, hintUsed: false });
  assert.equal(r.comboBonus, 10);
});

test("tiers follow thresholds", () => {
  assert.equal(tierForXp(0).id, "sleuth");
  assert.equal(tierForXp(100).id, "builder");
  assert.equal(tierForXp(449).id, "fellow");
  assert.equal(tierForXp(450).id, "titan");
});

test("streak logic", () => {
  assert.equal(nextStreak(3, 100, 100), 3); // same day
  assert.equal(nextStreak(3, 99, 100), 4); // consecutive
  assert.equal(nextStreak(3, 90, 100), 1); // broken
});

test("seeded shuffle is deterministic", () => {
  const a = seededShuffle([1, 2, 3, 4, 5, 6], 42);
  const b = seededShuffle([1, 2, 3, 4, 5, 6], 42);
  assert.deepEqual(a, b);
});
