import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MOJIBAKE = /Ã.|Â.|â€|â”|ðŸ/;
let bad = 0;

(function walk(d) {
  for (const n of readdirSync(d)) {
    if (n === "node_modules" || n === ".git" || n === "scratch" || n === "_releases" || n === "attached_assets" || n.startsWith(".")) continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|css|js|json|md)$/.test(n)) {
      const content = readFileSync(p, "utf8");
      if (MOJIBAKE.test(content)) {
        console.error("Possible mojibake:", p);
        bad++;
      }
    }
  }
})(".");

if (bad === 0) {
  console.log("Encoding check passed (no mojibake detected)!");
  process.exit(0);
} else {
  process.exit(1);
}
