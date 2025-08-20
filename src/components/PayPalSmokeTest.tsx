import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

// Properly typed interfaces for PayPal responses
interface PayPalCreateOrderResponse {
  id: string;
  approveUrl?: string;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
}

// Proper error type instead of any
interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

const PayPalSmokeTest = () => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [approveUrl, setApproveUrl] = useState<string | null>(null);

  const createOrder = async () => {
    try {
      setLoading(true);
      const sb = getSupabase();
      if (!sb) return toast({ description: "Supabase not configured" });
      
      const { data, error } = await sb.functions.invoke("paypal-create-order", {
        body: { amount: 1.55, currency: "USD", description: "Dev test order" },
      });
      
      if (error) throw error;
      
      // Properly type the response instead of using any
      const response = data as PayPalCreateOrderResponse;
      const { id, approveUrl: returnedApproveUrl } = response;
      
      if (!id) throw new Error("No order id returned");
      
      setOrderId(id);
      setApproveUrl(returnedApproveUrl || null);
      toast({ description: `Order created: ${id}` });
    } catch (error: unknown) {
      // Proper error handling without any
      const errorWithMessage = toErrorWithMessage(error);
      toast({ description: errorWithMessage.message || "Create order failed" });
    } finally {
      setLoading(false);
    }
  };

  const captureOrder = async () => {
    try {
      if (!orderId) return toast({ description: "No order to capture" });
      setLoading(true);
      
      const sb = getSupabase();
      if (!sb) return toast({ description: "Supabase not configured" });
      
      const { data, error } = await sb.functions.invoke("paypal-capture-order", {
        body: { orderId },
      });
      
      if (error) throw error;
      
      // Type the capture response
      const captureResult = data as PayPalCaptureResponse;
      toast({ description: "Capture success" });
      console.log("PayPal capture result", captureResult);
    } catch (error: unknown) {
      // Proper error handling without any
      const errorWithMessage = toErrorWithMessage(error);
      toast({ description: errorWithMessage.message || "Capture failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-lg border bg-card/90 p-3 shadow-[var(--shadow-elevate)] backdrop-blur">
      <div className="mb-2 text-xs text-muted-foreground">PayPal Smoke Test</div>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={createOrder} disabled={loading} aria-disabled={loading}>
          {loading ? "Working…" : "Create $1.55 Order"}
        </Button>
        <Button size="sm" variant="default" onClick={captureOrder} disabled={loading || !orderId} aria-disabled={loading || !orderId}>
          Capture
        </Button>
      </div>
      {orderId && (
        <div className="mt-2 text-xs text-muted-foreground">
          id: <span className="font-mono">{orderId}</span>
        </div>
      )}
      {approveUrl && (
        <div className="mt-2">
          <a className="text-sm underline" href={approveUrl} target="_blank" rel="noreferrer">
            Approve in PayPal →
          </a>
        </div>
      )}
    </div>
  );
};

export default PayPalSmokeTest;