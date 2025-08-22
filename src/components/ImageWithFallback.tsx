import { useState } from "react";
export default function ImageWithFallback(
  { src, alt="", fallback="/placeholder.svg", onError, ...rest }:
  React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }
){
  const [err,setErr] = useState(false);
  const final = !err && src ? src : fallback;
  return <img src={final} alt={alt} onError={(e)=>{ setErr(true); onError?.(e); }} {...rest} />;
}