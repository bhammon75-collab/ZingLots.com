export type Urgency = 'base' | 'warn' | 'crit';

export function getUrgency(endsAt: string): Urgency {
  const ms = new Date(endsAt).getTime() - Date.now();
  const hours = ms / 36e5;
  if (hours < 1) return 'crit';
  if (hours < 24) return 'warn';
  return 'base';
}

export function formatTimeLeft(endsAt: string): string {
  const ms = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}