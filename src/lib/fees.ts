import { CONFIG } from "@/config/pricing";

export type FeeInput = {
  itemPrice: number;           // winning bid (USD)
  shippingChargedToBuyer?: number; // USD
  includeShippingInBP?: boolean;   // default true
  passThroughCardFee?: boolean;    // default true
  // optional per-auction overrides
  bpOverridePct?: number | null;   // 0.00–0.30
  cardOverridePct?: number | null; // 0.00–0.05
  sellerFeeOverridePct?: number | null;
};

export type FeeOut = {
  buyerPremium: number;
  buyerPremiumRate: number;
  buyerPremiumMinApplied: boolean;
  processingFee: number;
  sellerFee: number;
  subtotalBeforeFees: number;
  totalToBuyer: number;
};

export function calcFees(inp: FeeInput): FeeOut {
  const item = Math.max(0, inp.itemPrice || 0);
  const ship = Math.max(0, inp.shippingChargedToBuyer || 0);
  const includeShip = inp.includeShippingInBP ?? true;
  const passCard = inp.passThroughCardFee ?? true;

  const mode = CONFIG.mode;
  const bpRateBase = mode === "buyer_premium" ? CONFIG.bpPromo : CONFIG.bpStd;
  const sellerRateBase = mode === "buyer_premium" ? CONFIG.sellerPromo : CONFIG.sellerStd;

  const bpRate = (inp.bpOverridePct ?? bpRateBase);
  const cardPct = (inp.cardOverridePct ?? CONFIG.cardPct);
  const sellerRate = (inp.sellerFeeOverridePct ?? sellerRateBase);

  const bpBase = includeShip ? (item + ship) : item;
  let buyerPremium = bpBase * bpRate;
  let minApplied = false;
  if (buyerPremium < CONFIG.bpMin) { 
    buyerPremium = CONFIG.bpMin; 
    minApplied = true; 
  }

  const processingFee = passCard ? (item + ship + buyerPremium) * cardPct : 0;
  const sellerFee = item * sellerRate;

  const subtotalBeforeFees = item + ship;
  const totalToBuyer = subtotalBeforeFees + buyerPremium + processingFee;

  return {
    buyerPremium: round2(buyerPremium),
    buyerPremiumRate: bpRate,
    buyerPremiumMinApplied: minApplied,
    processingFee: round2(processingFee),
    sellerFee: round2(sellerFee),
    subtotalBeforeFees: round2(subtotalBeforeFees),
    totalToBuyer: round2(totalToBuyer),
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

