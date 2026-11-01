import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  version: number;
  level: string;
  skill: string;
  difficulty: number;
  errorTag: string;
  prompt: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
  status: string;
}

const VALID_LEVELS = new Set(["A2", "B1", "B2", "C1"]);
const VALID_SKILLS = new Set(["grammar", "vocabulary", "reading", "listening", "writing", "speaking", "pragmatics"]);

function validateContentFile(filePath: string): number {
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return 1;
  }

  const raw = readFileSync(filePath, "utf8");
  let items: Question[];
  try {
    items = JSON.parse(raw);
  } catch (err: any) {
    console.error(`JSON parse error in ${filePath}: ${err.message}`);
    return 1;
  }

  const ids = new Set<string>();
  let errors = 0;

  items.forEach((q, idx) => {
    const loc = `${filePath}#${idx} (${q.id || "no-id"})`;

    if (!q.id) {
      console.error(`${loc}: missing question id`);
      errors++;
    } else if (ids.has(q.id)) {
      console.error(`${loc}: duplicate question id '${q.id}'`);
      errors++;
    } else {
      ids.add(q.id);
    }

    if (!q.prompt || typeof q.prompt !== "string") {
      console.error(`${loc}: missing or empty prompt`);
      errors++;
    }

    if (!Array.isArray(q.options) || q.options.length < 2) {
      console.error(`${loc}: must have at least 2 options`);
      errors++;
    } else {
      const optIds = new Set<string>();
      let foundCorrect = false;

      q.options.forEach((opt, oIdx) => {
        if (!opt.id) {
          console.error(`${loc}: option at index ${oIdx} missing id`);
          errors++;
        } else if (optIds.has(opt.id)) {
          console.error(`${loc}: duplicate option id '${opt.id}'`);
          errors++;
        } else {
          optIds.add(opt.id);
        }

        if (opt.id === q.correctOptionId) {
          foundCorrect = true;
        }
      });

      if (!q.correctOptionId || !foundCorrect) {
        console.error(`${loc}: correctOptionId '${q.correctOptionId}' does not match any option id`);
        errors++;
      }
    }

    if (!q.explanation || typeof q.explanation !== "string") {
      console.error(`${loc}: missing explanation`);
      errors++;
    }

    if (!VALID_LEVELS.has(q.level)) {
      console.error(`${loc}: invalid level '${q.level}'. Expected one of: ${[...VALID_LEVELS].join(", ")}`);
      errors++;
    }

    if (!VALID_SKILLS.has(q.skill)) {
      console.error(`${loc}: invalid skill '${q.skill}'. Expected one of: ${[...VALID_SKILLS].join(", ")}`);
      errors++;
    }

    if (q.status !== "approved") {
      console.warn(`${loc}: question has non-approved status: '${q.status}'`);
    }
  });

  if (errors === 0) {
    console.log(`✓ ${filePath} verified successfully: ${items.length} approved questions, 0 errors.`);
  } else {
    console.error(`✗ ${filePath} failed validation with ${errors} error(s).`);
  }

  return errors;
}

const targetFile = resolve(process.cwd(), "public/content/questions.en.json");
const code = validateContentFile(targetFile);
process.exit(code > 0 ? 1 : 0);
