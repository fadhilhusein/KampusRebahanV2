import { test } from "node:test";
import assert from "node:assert/strict";
import { calcCommission } from "./commission";

test("percent of sell price, rounded down", () => {
  assert.equal(calcCommission(45000, 30000, 5), 2250);
  assert.equal(calcCommission(12345, 0, 5), 617);
});

test("capped at margin", () => {
  assert.equal(calcCommission(10000, 9800, 5), 200);
});

test("never negative or paid on zero-margin/free orders", () => {
  assert.equal(calcCommission(10000, 10000, 5), 0);
  assert.equal(calcCommission(10000, 11000, 5), 0);
  assert.equal(calcCommission(0, 0, 5), 0);
});
