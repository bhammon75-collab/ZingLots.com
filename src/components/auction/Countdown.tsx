import { useEffect, useMemo, useRef, useState } from "react";

export type LotTiming = {
  endAt: string;
  serverNow: string;
  antiSnipeWindowSec: number;
  maxExtensions: number;
  extensionsUsed?: number;
};

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function Countdown({ timing, onSync }:{ timing: LotTiming; onSync?: ()=>void }){
  const [now, setNow] = useState<Date>(() => new Date());
  const driftRef = useRef<number>(0);

  // compute initial drift once
  useEffect(()=>{
    const serverNow = new Date(timing.serverNow).getTime();
    const localNow = Date.now();
    driftRef.current = serverNow - localNow; // if positive, server ahead
  },[timing.serverNow]);

  // tick every second, re-sync every 15s
  useEffect(()=>{
    let tick = setInterval(()=>setNow(new Date()), 1000);
    let resync = setInterval(()=>{
      onSync?.();
    }, 15000);
    return ()=>{ clearInterval(tick); clearInterval(resync); };
  },[onSync]);

  const remainingMs = useMemo(()=>{
    const end = new Date(timing.endAt).getTime();
    const adjustedNow = Date.now() + driftRef.current;
    return end - adjustedNow;
  },[timing.endAt, now]);

  const endAtLocal = useMemo(()=>{
    const end = new Date(timing.endAt);
    return end.toLocaleString();
  },[timing.endAt]);

  return (
    <div aria-live="polite">
      <div className="text-xs text-gray-600">Ends at {endAtLocal}</div>
      <div className="text-2xl font-semibold tabular-nums">{formatRemaining(remainingMs)}</div>
    </div>
  );
}

export default Countdown;

