import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  BadgeCheck,
  FileText,
} from "lucide-react";

type BeltItem = {
  label: string;
  sub?: string;
  href?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

interface TrustBeltProps {
  items?: BeltItem[];
  compact?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: BeltItem[] = [
  { label: "Verified Sellers", sub: "KYB-checked businesses", href: "/verify-sellers", icon: BadgeCheck },
  { label: "Secure Payments", sub: "Handled by Stripe", icon: CreditCard },
  { label: "Buyer Protection", sub: "Clear dispute process", href: "/legal/disputes", icon: ShieldCheck },
  { label: "Tax-ready Receipts", sub: "Invoices for bookkeeping", icon: FileText },
];

export function TrustBelt({ items = DEFAULT_ITEMS, compact, className }: TrustBeltProps) {
  return (
    <section
      aria-label="Trust and safety highlights"
      className={cn(
        "rounded-2xl border bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        compact ? "p-3" : "p-4 md:p-5",
        className
      )}
    >
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" role="list">
        {items.map(({ label, sub, href, icon: Icon }, i) => {
          const content = (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border">
                {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : <ShieldCheck className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{label}</div>
                {sub && <div className="truncate text-xs text-slate-600">{sub}</div>}
              </div>
            </div>
          );

          return (
            <li key={`${label}-${i}`} className="min-w-0">
              {href ? (
                <Link
                  to={href}
                  className="block rounded-xl p-2 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  {content}
                </Link>
              ) : (
                <div className="rounded-xl p-2">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

