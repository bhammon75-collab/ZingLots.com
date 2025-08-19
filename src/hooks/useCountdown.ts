import { useEffect, useState } from "react";

export function useCountdown(iso?: string) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!iso) return;                     // prevents NaN when missing
    const end = new Date(iso).getTime();
    if (!Number.isFinite(end)) return;    // prevents NaN when invalid
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [iso]);

  if (left === null) return null;
  if (left <= 0) return { label: "Ended" };

  const s = Math.floor(left / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const hh = h > 0 ? `${h}:` : "";
  const mm = (h > 0 ? String(m).padStart(2,"0") : String(m));
  const ss = String(sec).padStart(2,"0");
  return { label: `${hh}${mm}:${ss}` };
}