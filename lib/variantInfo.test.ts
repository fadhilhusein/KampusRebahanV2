import { test } from "node:test";
import assert from "node:assert/strict";
import { consentText, variantFlags, variantPoints } from "./variantInfo";

test("PO date range from the variant name", () => {
  const f = variantFlags({ name: "13 - 16 November", type: "Private", warranty: "No Garansi" });
  assert.equal(f.po, true);
  assert.equal(f.poDate, "13–16 November");
  assert.equal(f.noWarranty, true);
});

test("PO without a date, warranty parsed", () => {
  const f = variantFlags({ name: "Pro Garansi (PO)", type: "Sharing", warranty: "30 Hari" });
  assert.deepEqual([f.po, f.poDate, f.warrantyDays, f.sharing], [true, null, 30, true]);
});

test("instant private variant has no risk flags", () => {
  const f = variantFlags({ name: "Premium 1 Bulan", type: "Private 1P1U", warranty: "25 Hari" });
  assert.deepEqual([f.po, f.noWarranty, f.sharing], [false, false, false]);
  const pts = variantPoints({ name: "Premium 1 Bulan", type: "Private 1P1U", warranty: "25 Hari" });
  assert.deepEqual(pts.map((p) => p.key), ["warranty", "delivery", "type", "refund"]);
  assert.equal(pts[0].title, "Garansi 25 hari");
});

test("consent line names every risk", () => {
  const s = consentText("Netflix", { name: "Sharing (PO) 13 - 16 November", type: "Sharing", warranty: "No Garansi" });
  assert.equal(s, "Saya paham Netflix · Sharing (PO) 13 - 16 November ini tanpa garansi, dipakai bersama pengguna lain, dan dikirim PO dengan estimasi 13–16 November. Refund mengikuti S&K bagian 6.");
});
