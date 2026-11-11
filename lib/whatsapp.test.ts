import { test } from "node:test";
import assert from "node:assert/strict";
import { completedOrderText, paidOrderText, sendOwnerWhatsApp, toChatId } from "./whatsapp";

test("phone numbers become OpenWA chat ids", () => {
  assert.equal(toChatId("085180642043"), "6285180642043@c.us");
  assert.equal(toChatId("+62 851-8064-2043"), "6285180642043@c.us");
  assert.equal(toChatId("6285180642043"), "6285180642043@c.us");
  assert.equal(toChatId("6285180642043@c.us"), "6285180642043@c.us");
  assert.equal(toChatId("123"), null);
});

const order = { id: "ord1", productName: "Gemini", variantName: "Pro", quantity: 1, sellPrice: 26000, costPrice: 20000, paymentMethod: "QRIS_BRIDGE", buyer: "Budi (b@x.id)" };

test("messages carry the order details", () => {
  const paid = paidOrderText(order, "Diteruskan ke supplier");
  assert.match(paid, /Pesanan baru dibayar/);
  assert.match(paid, /Rp26\.000 via QRIS Instan/);
  assert.match(paid, /Profit: Rp6\.000/);
  assert.match(completedOrderText(order), /Pesanan selesai diproses[\s\S]*ID: ord1/);
});

test("sends one request per number with the API key, and never throws", async () => {
  Object.assign(process.env, { OPENWA_URL: "http://wa.test/", OPENWA_API_KEY: "k", OPENWA_SESSION_ID: "main", OPENWA_NOTIFY_TO: "0851111111,0852222222" });
  const calls: { url: string; init: RequestInit }[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    if (calls.length === 2) throw new Error("down");
    return new Response("{}", { status: 201 });
  }) as typeof fetch;
  try {
    await sendOwnerWhatsApp("hi", "paid:ord1");
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "http://wa.test/api/sessions/main/messages/send-text");
  assert.equal((calls[0].init.headers as Record<string, string>)["X-API-Key"], "k");
  assert.deepEqual(JSON.parse(calls[0].init.body as string), { chatId: "62851111111@c.us", text: "hi" });
});
