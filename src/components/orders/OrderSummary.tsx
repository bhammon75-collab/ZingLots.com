import { calcFees } from "@/lib/fees";

export function OrderSummary({
  itemPrice,
  shipping = 0,
  includeShipInBP = true,
  passCard = true,
  bpOverridePct,
  cardOverridePct,
  sellerFeeOverridePct
}: {
  itemPrice: number;
  shipping?: number;
  includeShipInBP?: boolean;
  passCard?: boolean;
  bpOverridePct?: number | null;
  cardOverridePct?: number | null;
  sellerFeeOverridePct?: number | null;
}) {
  const f = calcFees({ 
    itemPrice, 
    shippingChargedToBuyer: shipping, 
    includeShippingInBP: includeShipInBP, 
    passThroughCardFee: passCard, 
    bpOverridePct, 
    cardOverridePct, 
    sellerFeeOverridePct 
  });
  
  return (
    <div className="space-y-2">
      <Line label="Winning bid" value={itemPrice} />
      {shipping > 0 && <Line label="Shipping" value={shipping} />}
      <Line 
        label={`Buyer's Premium`} 
        value={f.buyerPremium} 
        hint={f.buyerPremiumMinApplied ? "min applied" : undefined} 
      />
      {f.processingFee > 0 && <Line label="Payment processing" value={f.processingFee} />}
      <hr className="my-2" />
      <Line label="Total to buyer" value={f.totalToBuyer} big />
    </div>
  );
}

function Line({ label, value, hint, big }: { 
  label: string; 
  value: number; 
  hint?: string; 
  big?: boolean 
}) {
  return (
    <div className="flex items-center justify-between">
      <div className={big ? "font-semibold" : ""}>
        {label} {hint ? <span className="text-xs text-neutral-500">({hint})</span> : null}
      </div>
      <div className={big ? "text-xl font-bold" : "font-medium"}>
        ${value.toFixed(2)}
      </div>
    </div>
  );
}