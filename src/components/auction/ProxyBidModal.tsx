import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type ProxyBidModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lotId: string;
  currentPrice: number;
  step: number;
  onSet?: (maxAmount: number) => void;
};

export default function ProxyBidModal({ open, onOpenChange, lotId, currentPrice, step, onSet }: ProxyBidModalProps){
  const [value, setValue] = useState<string>("");
  const min = currentPrice + step;
  const parsed = parseFloat(value || "0");
  const valid = parsed >= min;

  const submit = async () => {
    if (!valid) return;
    try {
      const res = await fetch(`/functions/v1/proxy-bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lotId, maxAmount: parsed })
      });
      if (!res.ok) throw new Error("Request failed");
      onSet?.(parsed);
      onOpenChange(false);
      setValue("");
    } catch {
      // noop (could toast)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Max Bid</DialogTitle>
          <DialogDescription>
            We’ll bid for you in increments up to this amount. Your max stays private.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Maximum bid</label>
          <Input type="number" value={value} onChange={(e)=>setValue(e.target.value)} placeholder={String(min)} aria-label="Max bid amount" />
          <div className="text-xs text-gray-600">Minimum allowed: ${min.toLocaleString()}</div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!valid}>Set Max Bid</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

