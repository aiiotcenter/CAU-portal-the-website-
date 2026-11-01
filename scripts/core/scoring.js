import { TIERS } from "../data/modules.js";

export function tierForXp(xp) {
  let t = TIERS[0];
  for (const tier of TIERS) if (xp >= tier.minXp) t = tier;
  return t;
}

export function scoreAnswer({ correct, elapsedMs, limitMs, combo, hintUsed }) {
  if (!correct) return { points: 0, speedBonus: 0, comboBonus: 0, nextCombo: 0 };
  const base = hintUsed ? 6 : 10;
  const ratioLeft = Math.max(0, 1 - elapsedMs / limitMs);
  const speedBonus = Math.round(ratioLeft * 10);
  const nextCombo = combo + 1;
  const comboBonus = Math.min(10, Math.max(0, (nextCombo - 1) * 2));
  return { points: base + speedBonus + comboBonus, speedBonus, comboBonus, nextCombo };
}

// Deterministic PRNG so the whole cohort gets the same "Daily 5"
export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(arr, seed) {
  const rnd = mulberry32(seed), a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const epochDay = (d = new Date()) =>
  Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);

export function nextStreak(prevStreak, lastDay, today = epochDay()) {
  if (lastDay === today) return prevStreak; // already counted today
  if (lastDay === today - 1) return prevStreak + 1; // consecutive day
  return 1; // restart
}
