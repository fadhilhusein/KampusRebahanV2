import { test } from "node:test";
import assert from "node:assert/strict";
import { LOYALTY_HOLD_MS, loyaltyProgress, rewardDeduction } from "./loyaltyRules";

const t = (h: number) => new Date(Date.UTC(2026, 10, 1) + h * 3600_000);

test("unlocks 48h after the order that crosses the threshold", () => {
  const r = loyaltyProgress([{ sellPrice: 150000, completedAt: t(0) }, { sellPrice: 60000, completedAt: t(10) }], 200000);
  assert.equal(r.total, 210000);
  assert.equal(r.unlockAt?.getTime(), t(10).getTime() + LOYALTY_HOLD_MS);
});

test("order of completion matters, not order of input", () => {
  const r = loyaltyProgress([{ sellPrice: 200000, completedAt: t(5) }, { sellPrice: 10000, completedAt: t(1) }], 200000);
  assert.equal(r.unlockAt?.getTime(), t(5).getTime() + LOYALTY_HOLD_MS);
});

test("no unlock below threshold", () => {
  assert.equal(loyaltyProgress([{ sellPrice: 199999, completedAt: t(0) }], 200000).unlockAt, null);
});

const base = { remainingTotal: 0, threshold: 200000, couponRedeemed: true, alreadyClawedBack: false, rewardCost: 45000, refundAmount: 200000 };

test("deducts reward cost once when refund drops below threshold", () => {
  assert.equal(rewardDeduction(base), 45000);
  assert.equal(rewardDeduction({ ...base, alreadyClawedBack: true }), 0);
});

test("no deduction when still above threshold or coupon not redeemed", () => {
  assert.equal(rewardDeduction({ ...base, remainingTotal: 200000 }), 0);
  assert.equal(rewardDeduction({ ...base, couponRedeemed: false }), 0);
});

test("deduction never exceeds the refund", () => {
  assert.equal(rewardDeduction({ ...base, refundAmount: 30000 }), 30000);
});
