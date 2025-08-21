import * as React from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  onDark?: boolean;
  withText?: boolean;
  variant?: "wordmark" | "monogram" | "tag";
  className?: string;
};

// Map sizes to logo heights
const LOGO_HEIGHT: Record<NonNullable<LogoProps["size"]>, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
};

export function Logo({
  size = "md",
  onDark = false,
  withText = true,
  variant = "wordmark",
  className,
}: LogoProps) {
  const height = LOGO_HEIGHT[size];
  
  // Calculate width based on variant and size
  const getWidth = () => {
    if (variant === "wordmark" && withText) {
      // Maintain aspect ratio of 690:160
      return Math.round((height / 160) * 690);
    }
    // Square for monogram and tag
    return height;
  };

  const width = getWidth();

  // Wordmark with integrated bolt and text
  if (variant === "wordmark" && withText) {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 690 160" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-label="ZingLots"
        className={cn("select-none", className)}
      >
        <style>
          {`.bolt{fill:#E02020}
            .type{fill:${onDark ? '#FFFFFF' : '#0F1115'};font:700 72px/1.1 'Inter','Manrope',ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}
            .zing{letter-spacing:-0.6px}
            .lots{letter-spacing:-0.3px}`}
        </style>
        {/* Updated bolt path: bottom tip is now a single vertex (pointed) */}
        <path className="bolt" d="M140 8 L76 96 H120 L100 152 L184 64 H140 Z"/>
        <text className="type zing" x="180" y="105">Zing</text>
        {/* very tight spacing (moved left) */}
        <text className="type lots" x="342" y="105">Lots</text>
      </svg>
    );
  }

  // Z-Bolt Monogram (no text)
  if (variant === "monogram" || (variant === "wordmark" && !withText)) {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 256 256" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-label="ZingLots"
        className={cn("select-none", className)}
      >
        <style>{`.bolt{fill:#E02020}`}</style>
        {/* Scale & center the original bolt */}
        <g transform="translate(51.2,25.6) scale(1.4222222) translate(-76,-8)">
          <path className="bolt" d="M140 8 L76 96 H120 L100 152 L184 64 H140 Z"/>
        </g>
      </svg>
    );
  }

  // Auction Tag Badge
  if (variant === "tag") {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 256 256" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-label="ZingLots Auction"
        className={cn("select-none", className)}
      >
        <style>
          {`.tag{fill:${onDark ? '#FFFFFF' : '#0F1115'}}
            .bolt{fill:#E02020}
            .hole{fill:${onDark ? '#0F1115' : '#F7F5F2'}}`}
        </style>
        {/* Tag shape */}
        <path className="tag" d="M32 80v96c0 13.3 10.7 24 24 24h96l72-72-72-72H56c-13.3 0-24 10.7-24 24z"/>
        <circle className="hole" cx="84" cy="108" r="10"/>
        {/* Same bolt path, nudged slightly right to avoid the tag's hole */}
        <g transform="translate(67.2,25.6) scale(1.4222222) translate(-76,-8)">
          <path className="bolt" d="M140 8 L76 96 H120 L100 152 L184 64 H140 Z"/>
        </g>
      </svg>
    );
  }

  // Default fallback (shouldn't reach here)
  return null;
}

export default Logo;