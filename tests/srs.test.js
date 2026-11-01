import test from "node:test";
import assert from "node:assert/strict";
import { review, dueIds } from "../scripts/core/srs.js";

test("correct moves up a box, wrong resets to 1", () => {
  assert.equal(review({ box: 2 }, true, 10).box, 3);
  assert.equal(review({ box: 4 }, false, 10).box, 1);
});
test("due items are returned lowest box first", () => {
  const ids = dueIds({ a: { box: 3, due: 5 }, b: { box: 1, due: 5 }, c: { box: 2, due: 99 } }, 10);
  assert.deepEqual(ids, ["b", "a"]);
});
