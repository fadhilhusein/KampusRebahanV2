// Pure loyalty rules (no DB), so they can be unit tested.

/** Waiting period after delivery before purchases unlock the reward (complaint/refund window). */
export const LOYALTY_HOLD_MS = 48 * 60 * 60 * 1000;

/**
 * Total of completed purchases and when the reward unlocks: the delivery time of the order that
 * pushes the running total past the threshold, plus the hold. Null while the total is short.
 */
export function loyaltyProgress(
  orders: { sellPrice: number; completedAt: Date | null }[],
  threshold: number,
  holdMs = LOYALTY_HOLD_MS
): { total: number; unlockAt: Date | null } {
  const sorted = [...orders].sort((a, b) => (a.completedAt?.getTime() ?? 0) - (b.completedAt?.getTime() ?? 0));
  let total = 0;
  let unlockAt: Date | null = null;
  for (const o of sorted) {
    total += o.sellPrice;
    if (!unlockAt && total >= threshold) unlockAt = new Date((o.completedAt?.getTime() ?? 0) + holdMs);
  }
  return { total, unlockAt };
}

/**
 * How much of a refund to withhold when it drops the customer below the threshold after they
 * already redeemed the reward: the reward's cost, at most the refund, and only once.
 */
export function rewardDeduction(args: {
  remainingTotal: number;
  threshold: number;
  couponRedeemed: boolean;
  alreadyClawedBack: boolean;
  rewardCost: number;
  refundAmount: number;
}): number {
  const { remainingTotal, threshold, couponRedeemed, alreadyClawedBack, rewardCost, refundAmount } = args;
  if (!couponRedeemed || alreadyClawedBack || remainingTotal >= threshold) return 0;
  return Math.max(0, Math.min(rewardCost, refundAmount));
}
