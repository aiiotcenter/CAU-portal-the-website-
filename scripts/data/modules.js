export const PREP_MODULES = Object.freeze({
  m1: { id: "m1", cefr: "A2", label: "Module 1: Elementary (A2)", emoji: "📚", file: "a2" },
  m2: { id: "m2", cefr: "B1", label: "Module 2: Pre-Intermediate (B1)", emoji: "📘", file: "b1" },
  m3: { id: "m3", cefr: "B2", label: "Module 3: Upper-Intermediate (B2)", emoji: "📙", file: "b2" },
  m4: { id: "m4", cefr: "C1", label: "Module 4: Proficiency / Exit (C1)", emoji: "🎓", file: "c1" },
});

// Ordered ascending by minXp. Tier is derived, never stored.
export const TIERS = Object.freeze([
  { minXp: 0, id: "sleuth", name: "Syntax Sleuth", cefr: "A2" },
  { minXp: 100, id: "builder", name: "Sentence Architect", cefr: "B1" },
  { minXp: 200, id: "pro", name: "Pragmatics Pro", cefr: "B2" },
  { minXp: 350, id: "fellow", name: "Scholarly Fellow", cefr: "C1" },
  { minXp: 450, id: "titan", name: "Exit Exam Titan", cefr: "C2" },
]);
