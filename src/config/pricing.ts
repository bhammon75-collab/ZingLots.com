export type PricingMode = "buyer_premium" | "standard";

export const PRICING_MODE: PricingMode =
  (import.meta.env.VITE_PRICING_MODE as PricingMode) || "buyer_premium";

const num = (v: string | undefined, d: number) => {
  const n = Number(v); 
  return Number.isFinite(n) ? n : d;
};

export const CONFIG = {
  mode: PRICING_MODE,
  bpPromo: num(import.meta.env.VITE_BP_RATE_PROMO, 0.09),   // 9%
  bpStd:   num(import.meta.env.VITE_BP_RATE_STD,   0.12),   // 12%
  bpMin:   num(import.meta.env.VITE_BP_MIN_USD,    2),
  cardPct: num(import.meta.env.VITE_CARD_FEE_PCT,  0.03),   // 3%
  sellerPromo: num(import.meta.env.VITE_SELLER_FEE_PROMO, 0),
  sellerStd:   num(import.meta.env.VITE_SELLER_FEE_STD,   0.03),
} as const;