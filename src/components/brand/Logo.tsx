import * as React from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  withText?: boolean;
  className?: string;
};

// Map sizes to bolt pixel height. Wordmark scales with it.
const BOLT_PX: Record<NonNullable<LogoProps["size"]>, number> = {
  sm: 18,
  md: 22,
  lg: 28,
};

export function Logo({
  size = "md",
  onDark = false,
  withText = true,
  className,
}: LogoProps) {
  const boltH = BOLT_PX[size];

  // Wordmark slightly larger than bolt cap height to fix prior imbalance.
  const textClass =
    size === "sm"
      ? "text-[16px]"
      : size === "md"
      ? "text-[19px]"
      : "text-[23px]";

  return (
    <div className={cn("flex items-center gap-2 select-none", className)} aria-label="ZingLots">
      <svg
        width={boltH}
        height={boltH}
        viewBox="0 0 128 160"
        aria-hidden="true"
        className="shrink-0 text-red-600"
        fill="currentColor"
        role="img"
      >
        {/* Exact path data from footer’s bolt */}
        <path d="M 0,0 L 88,0 L 56,80 L 128,80 L 40,160 L 72,88 L 0,88 Z" />
      </svg>

      {withText && (
        <span
          className={cn(
            "font-semibold tracking-tight leading-none",
            textClass,
            onDark ? "text-white" : "text-neutral-900"
          )}
        >
          ZingLots
        </span>
      )}
    </div>
  );
}

export default Logo;

