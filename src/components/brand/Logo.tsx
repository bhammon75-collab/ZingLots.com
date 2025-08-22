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
      // Maintain aspect ratio of 760:160 for new logo
      return Math.round((height / 160) * 760);
    }
    // Square for monogram
    return height;
  };

  const width = getWidth();

  // Wordmark with red circle Z and text
  if (variant === "wordmark" && withText) {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 760 160" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-label="Zing Lots"
        className={cn("select-none", className)}
      >
        <style>
          {`.red{fill:#DC2626}
            .type{fill:${onDark ? '#FFFFFF' : '#000000'};font:800 72px/1.1 'Inter','Manrope',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial}
            .tight{letter-spacing:-0.5px}
            .z{fill:#FFFFFF;font:800 86px/1 'Inter','Manrope',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial}`}
        </style>
        {/* Red circle */}
        <circle className="red" cx="76" cy="80" r="44"/>
        {/* Centered Z */}
        <text className="z"
              x="76" y="80" dy="6"
              textAnchor="middle"
              dominantBaseline="middle">Z</text>
        {/* Word kept close to the circle */}
        <text className="type tight" x="126" y="105">ingLots</text>
      </svg>
    );
  }

  // Z Monogram in red circle (no text)
  if (variant === "monogram" || (variant === "wordmark" && !withText)) {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-label="Zing Lots"
        className={cn("select-none", className)}
      >
        <style>
          {`.red{fill:#DC2626}
            .z{fill:#FFFFFF;font:800 86px/1 'Inter','Manrope',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial}`}
        </style>
        {/* Red circle */}
        <circle className="red" cx="50" cy="50" r="44"/>
        {/* Centered Z */}
        <text className="z"
              x="50" y="50" dy="6"
              textAnchor="middle"
              dominantBaseline="middle">Z</text>
      </svg>
    );
  }

  // Auction Tag Badge with Z
  if (variant === "tag") {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 256 256" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-label="Zing Lots Auction"
        className={cn("select-none", className)}
      >
        <style>
          {`.tag{fill:${onDark ? '#FFFFFF' : '#0F1115'}}
            .red{fill:#DC2626}
            .z{fill:#FFFFFF;font:800 72px/1 'Inter','Manrope',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial}
            .hole{fill:${onDark ? '#0F1115' : '#F7F5F2'}}`}
        </style>
        {/* Tag shape */}
        <path className="tag" d="M32 80v96c0 13.3 10.7 24 24 24h96l72-72-72-72H56c-13.3 0-24 10.7-24 24z"/>
        <circle className="hole" cx="84" cy="108" r="10"/>
        {/* Red circle with Z, positioned to avoid tag hole */}
        <g transform="translate(140,128)">
          <circle className="red" r="30"/>
          <text className="z"
                x="0" y="0" dy="4"
                textAnchor="middle"
                dominantBaseline="middle">Z</text>
        </g>
      </svg>
    );
  }

  // Default fallback (shouldn't reach here)
  return null;
}

export default Logo;