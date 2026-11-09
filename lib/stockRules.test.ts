import { test } from "node:test";
import assert from "node:assert/strict";
import { availableStock, isBankTransferExpired, isHolding, parseGatewayTime } from "./stockRules";

const created = new Date("2026-11-09T03:00:00Z");
const at = (min: number) => new Date(created.getTime() + min * 60_000);
const unpaid = { status: "PENDING_PAYMENT", createdAt: created, gatewayExpiresAt: null, bridgeExpiresAt: null };

test("paid but not yet at the supplier always holds", () => {
  assert.equal(isHolding({ ...unpaid, status: "PAID" }, at(600)), true);
  assert.equal(isHolding({ ...unpaid, status: "AWAITING_RETRY" }, at(600)), true);
  assert.equal(isHolding({ ...unpaid, status: "PROCESSING" }, at(1)), false);
  assert.equal(isHolding({ ...unpaid, status: "EXPIRED" }, at(1)), false);
});

test("unpaid holds until its link expires, capped at the payment window", () => {
  assert.equal(isHolding({ ...unpaid, gatewayExpiresAt: at(15) }, at(14)), true);
  assert.equal(isHolding({ ...unpaid, gatewayExpiresAt: at(15) }, at(16)), false);
  // Old 24h bridge link: released after 1h + 5min grace.
  assert.equal(isHolding({ ...unpaid, bridgeExpiresAt: at(1440) }, at(64)), true);
  assert.equal(isHolding({ ...unpaid, bridgeExpiresAt: at(1440) }, at(66)), false);
  // No link yet (bank transfer, or QRIS just being created): the 1h window.
  assert.equal(isHolding(unpaid, at(59)), true);
  assert.equal(isHolding(unpaid, at(61)), false);
});

test("available stock never negative", () => {
  assert.equal(availableStock(1, 1), 0);
  assert.equal(availableStock(1, 3), 0);
  assert.equal(availableStock(5, 2), 3);
});

test("Bayar.gg times without an offset are WIB", () => {
  assert.equal(parseGatewayTime("2026-11-09 10:00:00").toISOString(), "2026-11-09T03:00:00.000Z");
  assert.equal(parseGatewayTime("2026-11-09T10:00:00+07:00").toISOString(), "2026-11-09T03:00:00.000Z");
  assert.equal(parseGatewayTime("2026-11-09T03:00:00Z").toISOString(), "2026-11-09T03:00:00.000Z");
});

test("bank transfer expires after the window", () => {
  assert.equal(isBankTransferExpired(created, at(59)), false);
  assert.equal(isBankTransferExpired(created, at(61)), true);
});
