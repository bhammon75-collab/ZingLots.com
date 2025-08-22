import { useMemo, useState } from "react";
import { calcFees } from "@/lib/fees";
import { CONFIG } from "@/config/pricing";

export default function PricingCalculator() {
  const [item, setItem] = useState(100);
  const [ship, setShip] = useState(0);
  const [inclShip, setInclShip] = useState(true);
  const [passCard, setPassCard] = useState(true);

  const fees = useMemo(
    () => calcFees({ 
      itemPrice: item, 
      shippingChargedToBuyer: ship, 
      includeShippingInBP: inclShip, 
      passThroughCardFee: passCard 
    }),
    [item, ship, inclShip, passCard]
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="text-sm bg-neutral-50 border rounded p-3">
          <strong className="mr-1">Promo pricing active.</strong>
          Buyer's Premium {Math.round(CONFIG.bpPromo * 100)}% (min ${CONFIG.bpMin.toFixed(0)}), 
          Card fee {Math.round(CONFIG.cardPct * 100)}%, 
          Seller fee {Math.round(CONFIG.sellerPromo * 100)}%.
        </div>

        <label className="block">
          <div className="mb-1 font-medium">Item price ($)</div>
          <input 
            type="number" 
            min={0} 
            value={item} 
            onChange={e => setItem(Number(e.target.value))} 
            className="w-full border rounded px-3 py-2" 
          />
        </label>

        <label className="block">
          <div className="mb-1 font-medium">Shipping charged to buyer ($)</div>
          <input 
            type="number" 
            min={0} 
            value={ship} 
            onChange={e => setShip(Number(e.target.value))} 
            className="w-full border rounded px-3 py-2" 
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={inclShip} 
            onChange={e => setInclShip(e.target.checked)} 
          />
          Include shipping in Buyer's Premium calculation
        </label>

        <label className="inline-flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={passCard} 
            onChange={e => setPassCard(e.target.checked)} 
          />
          Pass card processing fee to buyer
        </label>
      </div>

      <div className="space-y-3 border rounded p-4">
        <div className="text-lg font-semibold">Estimate</div>
        <Row label="Subtotal (winning bid + shipping)" value={fees.subtotalBeforeFees} />
        <Row
          label={`Buyer's Premium (${Math.round(fees.buyerPremiumRate * 100)}%${fees.buyerPremiumMinApplied ? ", min applied" : ""})`}
          value={fees.buyerPremium}
        />
        {fees.processingFee > 0 && <Row label="Payment processing" value={fees.processingFee} />}
        <hr />
        <Row label="Total to buyer" value={fees.totalToBuyer} big />
        <div className="text-xs text-neutral-500">
          Estimates only; taxes and third-party shipping may vary. 
          During the promo period the seller fee is 0%.
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, big = false }: { label: string; value: number; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className={big ? "font-semibold" : ""}>{label}</div>
      <div className={big ? "text-xl font-bold" : "font-medium"}>${value.toFixed(2)}</div>
    </div>
  );
}