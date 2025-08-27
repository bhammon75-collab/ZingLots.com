import { useEffect, useMemo, useState } from "react";

export type Urgency = "base" | "warn" | "crit";

function diffMs(endsAt: string) {
  return new Date(endsAt).getTime() - Date.now();
}

export function getUrgency(endsAt: string): Urgency {
  const hours = diffMs(endsAt) / 36e5;
  if (hours < 1) return "crit";
  if (hours < 24) return "warn";
  return "base";
}

export function formatTimeLeft(endsAt: string): string {
  const ms = Math.max(0, diffMs(endsAt));
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function useTimeLeft(endsAt: string) {
  const [now, setNow] = useState(Date.now());
  const urgency = useMemo(() => getUrgency(endsAt), [endsAt, now]);
  const label = useMemo(() => formatTimeLeft(endsAt), [endsAt, now]);

  useEffect(() => {
    const interval = urgency === "crit" ? 1000 : 60_000;
    const id = window.setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [urgency]);

  return { label, urgency } as const;
}