import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateOrderRefund, estimateRefund, operationalFee, parseWarrantyDays } from "./refundCalc";

test("examples from S&K section 6", () => {
  assert.deepEqual(estimateRefund(20000, 30, 0), { remainingDays: 30, gross: 18000, amount: 18000 });
  assert.deepEqual(estimateRefund(20000, 30, 10), { remainingDays: 20, gross: 12000, amount: 12000 });
});

test("rounds down and hits zero when fully used", () => {
  assert.equal(estimateRefund(10001, 7, 3)?.amount, 5143);
  assert.equal(estimateRefund(20000, 30, 30)?.amount, 0);
});

test("rejects invalid input", () => {
  assert.equal(estimateRefund(-1, 30, 0), null);
  assert.equal(estimateRefund(20000, 0, 0), null);
  assert.equal(estimateRefund(20000, 30, 31), null);
  assert.equal(estimateRefund(20000, 30, -1), null);
  assert.equal(estimateRefund(NaN, 30, 0), null);
});


const base = {
  sellPrice: 20000,
  paymentMethod: "BALANCE",
  createdAt: new Date("2026-11-01T03:00:00Z"),
  completedAt: new Date("2026-11-01T05:00:00Z"),
  refundedAt: null,
  warrantyDays: 30,
  now: new Date("2026-11-20T05:00:00Z"),
};

test("parses supplier warranty text", () => {
  assert.equal(parseWarrantyDays("25 Hari"), 25);
  assert.equal(parseWarrantyDays("No Garansi"), null);
  assert.equal(parseWarrantyDays("0 Hari"), null);
});

test("used order: prorata from delivery date to issue date", () => {
  const r = estimateOrderRefund({ ...base, status: "COMPLETED", issueAt: new Date("2026-11-11T05:00:00Z") });
  assert.deepEqual(r, { eligible: true, kind: "USED", warrantyDays: 30, usedDays: 10, remainingDays: 20, gross: 12000, opFee: 0, amount: 12000 });
});

test("undelivered after 48h refunds 90%, even without warranty", () => {
  const r = estimateOrderRefund({ ...base, status: "PROCESSING", completedAt: null, warrantyDays: null, issueAt: base.now });
  assert.equal(r.eligible && r.amount, 18000);
});

test("not eligible cases", () => {
  const early = estimateOrderRefund({ ...base, status: "PROCESSING", issueAt: new Date("2026-11-02T03:00:00Z"), now: new Date("2026-11-02T03:00:00Z") });
  assert.equal(!early.eligible && early.eligibleAt?.toISOString(), "2026-11-03T03:00:00.000Z");
  assert.equal(early.eligible, false);
  const adminNow = new Date("2026-11-02T03:00:00Z");
  const adminEarly = estimateOrderRefund({ ...base, status: "PROCESSING", issueAt: adminNow, now: adminNow, ignoreWait: true });
  assert.equal(adminEarly.eligible && adminEarly.amount, 18000);
  assert.equal(estimateOrderRefund({ ...base, status: "COMPLETED", warrantyDays: null, issueAt: base.now }).eligible, false);
  assert.equal(estimateOrderRefund({ ...base, status: "COMPLETED", issueAt: new Date("2026-12-05T05:00:00Z"), now: new Date("2026-12-06T00:00:00Z") }).eligible, false);
  assert.equal(estimateOrderRefund({ ...base, status: "REJECTED", issueAt: base.now }).eligible, false);
  assert.equal(estimateOrderRefund({ ...base, status: "PENDING_PAYMENT", issueAt: base.now }).eligible, false);
});

test("operational fee: only QRIS Bridge, 0.7% + Rp300 rounded up", () => {
  assert.equal(operationalFee("QRIS_BRIDGE", 26000), 482);
  assert.equal(operationalFee("QRIS_BRIDGE", 5200), 337);
  assert.equal(operationalFee("QRIS_GATEWAY", 26000), 0);
  assert.equal(operationalFee("BALANCE", 26000), 0);
});

test("operational fee is subtracted after the prorata, never below 0", () => {
  assert.deepEqual(estimateRefund(26000, 30, 0, 482), { remainingDays: 30, gross: 23400, amount: 22918 });
  assert.equal(estimateRefund(5200, 30, 29, 337)?.amount, 0);
  const r = estimateOrderRefund({ ...base, sellPrice: 26000, paymentMethod: "QRIS_BRIDGE", status: "PROCESSING", completedAt: null, issueAt: base.now });
  assert.equal(r.eligible && r.amount, 22918);
});
