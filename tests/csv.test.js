import test from "node:test";
import assert from "node:assert/strict";
import { csvCell, toCsv } from "../scripts/core/security.js";

test("escapes quotes", () => assert.equal(csvCell('He said "hi"'), '"He said ""hi"""'));
test("neutralises formulas", () => assert.equal(csvCell("=SUM(A1)"), `"'=SUM(A1)"`));
test("adds BOM for Excel", () => assert.ok(toCsv(["a"], [["b"]]).startsWith("\uFEFF")));
