import { useState } from "react";
import { getStockImage } from "@/lib/stockImages";

export default function ImageWithFallback(
  { src, alt = "", fallback, onError, "data-category": categoryHint, "data-seed": seed, ...rest }:
  React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string; "data-category"?: string; "data-seed"?: string | number }
) {
  const [err, setErr] = useState(false);
  const derivedFallback = fallback || getStockImage(categoryHint || alt, seed);
  const final = !err && src ? src : derivedFallback;
  return <img src={final} alt={alt} onError={(e)=>{ setErr(true); onError?.(e); }} {...rest} />;
}