import { readdirSync, readFileSync } from "node:fs";
const dir = "data/questions";
let bad = 0;
for (const f of readdirSync(dir).filter(f => f.endsWith(".json"))) {
  const items = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  const ids = new Set();
  items.forEach((q, i) => {
    const where = `${f}#${i}`;
    if (ids.has(q.id)) { console.error(where, "duplicate id", q.id); bad++; }
    ids.add(q.id);
    if (!q.prompt || !Array.isArray(q.options) || q.options.length < 2) { console.error(where, "bad prompt/options"); bad++; }
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) { console.error(where, "bad answer index"); bad++; }
    if (!q.explanation) { console.error(where, "missing explanation"); bad++; }
  });
}
if (bad === 0) console.log("All question banks validated successfully (0 schema errors)!");
process.exit(bad ? 1 : 0);
