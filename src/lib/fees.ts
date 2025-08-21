export type FeeInputs = {
  subtotalCents: number;
  shippingCents?: number;
  buyerPremiumBps?: number; // charged to buyer
  sellerFeeBps?: number; // charged to seller
  feeAppliesToShipping?: boolean;
};

export type FeeBreakdown = {
  buyerPremiumCents: number;
  sellerFeeCents: number;
  totalDueCents: number; // buyer due (subtotal + shipping + buyer premium)
  sellerNetCents: number; // what seller should receive before shipping label costs
};

export function computeFees(inputs: FeeInputs): FeeBreakdown {
  const shipping = Math.max(0, inputs.shippingCents || 0);
  const base = Math.max(0, inputs.subtotalCents);
  const buyerBps = inputs.buyerPremiumBps ?? 1000; // 10%
  const sellerBps = inputs.sellerFeeBps ?? 1000; // 10%
  const includeShip = inputs.feeAppliesToShipping !== false;
  const feeBase = base + (includeShip ? shipping : 0);

  const buyerPremiumCents = Math.round((feeBase * buyerBps) / 10000);
  const sellerFeeCents = Math.round((feeBase * sellerBps) / 10000);
  const totalDueCents = base + shipping + buyerPremiumCents;
  const sellerNetCents = Math.max(0, base - sellerFeeCents);

  return { buyerPremiumCents, sellerFeeCents, totalDueCents, sellerNetCents };
}

