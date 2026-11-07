import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyPopup, isPopupLive, parsePopup, todayWib } from "./popup";

test("rejects unsafe or invalid input", () => {
  assert.equal(parsePopup({ enabled: true, title: "" }).ok, false);
  assert.equal(parsePopup({ title: "a", ctaLabel: "x", ctaHref: "javascript:alert(1)" }).ok, false);
  assert.equal(parsePopup({ title: "a", ctaLabel: "x", ctaHref: "//evil.com" }).ok, false);
  assert.equal(parsePopup({ title: "a", image: "data:image/svg+xml;base64,PHN2Zz4=" }).ok, false);
  assert.equal(parsePopup({ title: "a", startDate: "2026-11-10", endDate: "2026-11-01" }).ok, false);
  assert.equal(parsePopup({ title: "a", body: "x".repeat(241) }).ok, false);
});

test("accepts valid input and normalizes it", () => {
  const r = parsePopup({ enabled: true, type: "bogus", title: "  Promo ", ctaHref: "/products", frequency: "x" });
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.equal(r.value.type, "info");
  assert.equal(r.value.title, "Promo");
  assert.equal(r.value.ctaLabel, "Lihat");
  assert.equal(r.value.frequency, "once");
  assert.ok(parsePopup({ title: "a", ctaLabel: "Buka", ctaHref: "https://wa.me/62812" }).ok);
});

test("live only when enabled and inside the date range", () => {
  const p = { ...emptyPopup, enabled: true, title: "Hai", startDate: "2026-11-07", endDate: "2026-11-14" };
  assert.equal(isPopupLive(p, "2026-11-06"), false);
  assert.equal(isPopupLive(p, "2026-11-07"), true);
  assert.equal(isPopupLive(p, "2026-11-14"), true);
  assert.equal(isPopupLive(p, "2026-11-15"), false);
  assert.equal(isPopupLive({ ...p, enabled: false }, "2026-11-10"), false);
  // 18:00 UTC is already the next day in WIB
  assert.equal(todayWib(new Date("2026-11-07T18:00:00Z")), "2026-11-08");
});
