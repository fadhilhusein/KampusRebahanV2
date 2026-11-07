// Commission is a percent of what the buyer paid, capped at the store margin so a
// high percent can never make an order lose money.
export function calcCommission(sellPrice: number, costPrice: number, percent: number): number {
  const raw = Math.floor((sellPrice * percent) / 100);
  return Math.max(0, Math.min(raw, sellPrice - costPrice));
}
