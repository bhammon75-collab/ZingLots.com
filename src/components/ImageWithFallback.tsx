import { useState } from "react";

export default function ImageWithFallback(
  { src, alt = "", fallback = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format", onError, ...rest }:
  React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }
) {
  const [err, setErr] = useState(false);
  const final = !err && src ? src : fallback;
  return <img src={final} alt={alt} onError={(e)=>{ setErr(true); onError?.(e); }} {...rest} />;
}