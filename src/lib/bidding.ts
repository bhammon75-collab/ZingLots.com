export const INCREMENTS = [
  { upTo: 100, step: 5 },
  { upTo: 500, step: 10 },
  { upTo: 1000, step: 25 },
  { upTo: 5000, step: 50 },
  { upTo: 10000, step: 100 },
  { upTo: Infinity, step: 250 },
] as const;

export function stepFor(price: number) {
  return INCREMENTS.find((b) => price < b.upTo)!.step;
}

export function nextMinimum(current_price: number | null | undefined, starting_bid: number) {
  if (current_price == null) return starting_bid;
  return current_price + stepFor(current_price);
}

// Types and helpers for proxy bidding simulations and client RPC
export type ProxyBid = { bidderId: string; max: number; createdAt: number };
export type ProxyOutcome = { leaderId: string | null; displayPrice: number };

/**
 * Given starting price and a set of proxy max bids, compute the current leader and display price.
 * Tie-breaking: higher max wins; if equal max, earlier createdAt wins.
 */
export function computeProxyOutcome(startPrice: number, proxies: ProxyBid[], prevPrice: number | null = null): ProxyOutcome {
  if (!proxies.length) return { leaderId: null, displayPrice: prevPrice ?? startPrice };
  const sorted = [...proxies].sort((a, b) => (b.max - a.max) || (a.createdAt - b.createdAt));
  const top = sorted[0];
  const second = sorted[1];
  if (!second) {
    const base = Math.max(prevPrice ?? startPrice, startPrice);
    return { leaderId: top.bidderId, displayPrice: base };
  }
  const inc = stepFor(second.max);
  const candidate = Math.max((prevPrice ?? startPrice), second.max + inc);
  const display = Math.min(top.max, candidate);
  return { leaderId: top.bidderId, displayPrice: display };
}

/** True if anti-snipe extension should occur, given seconds remaining and current used count. */
export function shouldExtend(secondsRemaining: number, usedCount: number, windowSecs = 120, cap = 5): boolean {
  return secondsRemaining > 0 && secondsRemaining <= windowSecs && usedCount < cap;
}

// Client RPC helper
import { getSupabase } from '@/lib/supabaseClient';

export type PlaceBidArgs = { lot_id: string; offered: number; max?: number | null };
export type PlaceBidResult = { ok: boolean; current_amount: number; winner_id: string; new_ends_at: string | null; reserve_met: boolean };

export async function placeBidRPC(args: PlaceBidArgs): Promise<PlaceBidResult> {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');
  const { data, error } = await sb.rpc('place_bid', { lot_id: args.lot_id, offered: args.offered, max: args.max ?? null });
  if (error) throw error;
  return data as unknown as PlaceBidResult;
}
