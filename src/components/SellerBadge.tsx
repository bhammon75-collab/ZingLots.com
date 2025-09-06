import * as React from "react";
import { CheckCircle2, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

type SellerLevel = "verified" | "pro";

type SellerMetrics = {
  onTimePickupPct?: number;
  disputeRatePct?: number;
  responseTime?: string;
};

interface SellerBadgeProps {
  level: SellerLevel;
  sellerName?: string;
  cityState?: string;
  metrics?: SellerMetrics;
  className?: string;
}

export function SellerBadge({
  level,
  sellerName,
  cityState,
  metrics,
  className,
}: SellerBadgeProps) {
  const isPro = level === "pro";
  const id = React.useId();

  const Icon = isPro ? ShieldCheck : CheckCircle2;
  const label = isPro ? "Pro Seller" : "Verified SME";
  const blurb = isPro
    ? "Pro Sellers maintain high volumes with excellent reliability."
    : "Verified SMEs are KYB-checked businesses approved to sell on ZingLots.";

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span
          className="inline-flex items-center gap-1"
          onTouchStart={(e) => (e.currentTarget as HTMLElement).focus()}
        >
          <Badge
            variant="secondary"
            className={cn(
              "badge--seller rounded-2xl px-2 py-0.5 text-[11px] font-medium",
              isPro ? "border-emerald-600/50" : "border-slate-300",
              className
            )}
            aria-describedby={`${id}-seller-badge-info`}
            data-testid="seller-badge"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </Badge>
          <Info className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
        </span>
      </HoverCardTrigger>

      <HoverCardContent
        id={`${id}-seller-badge-info`}
        align="start"
        sideOffset={6}
        className="w-80 text-sm leading-relaxed"
      >
        <div className="mb-2">
          <div className="font-semibold">{label}</div>
          <p className="text-slate-600">{blurb}</p>
        </div>

        {(sellerName || cityState || metrics) && (
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            {sellerName && (
              <>
                <dt className="text-slate-500">Seller</dt>
                <dd className="text-slate-900">{sellerName}</dd>
              </>
            )}
            {cityState && (
              <>
                <dt className="text-slate-500">Location</dt>
                <dd className="text-slate-900">{cityState}</dd>
              </>
            )}
            {metrics?.onTimePickupPct != null && (
              <>
                <dt className="text-slate-500">On-time pickup</dt>
                <dd className="text-slate-900">{metrics.onTimePickupPct}%</dd>
              </>
            )}
            {metrics?.disputeRatePct != null && (
              <>
                <dt className="text-slate-500">Dispute rate</dt>
                <dd className="text-slate-900">{metrics.disputeRatePct}%</dd>
              </>
            )}
            {metrics?.responseTime && (
              <>
                <dt className="text-slate-500">Response time</dt>
                <dd className="text-slate-900">{metrics.responseTime}</dd>
              </>
            )}
          </dl>
        )}

        <a
          href="/verify-sellers"
          className="mt-3 inline-flex text-xs font-medium text-slate-900 underline underline-offset-4"
        >
          How we verify sellers →
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}

