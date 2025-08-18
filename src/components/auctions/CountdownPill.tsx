import { useCountdown } from '@/hooks/useCountdown';

export function CountdownPill({ endsAt }: { endsAt: string }) {
  const timeLeft = useCountdown(endsAt);
  
  if (!timeLeft) return null;
  
  // Parse the label to determine urgency
  const parts = timeLeft.label.split(':');
  const totalSeconds = parts.length === 3 
    ? parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    : parseInt(parts[0]) * 60 + parseInt(parts[1]);
  
  const cls = totalSeconds <= 120 
    ? 'time-pill time-urgent' 
    : totalSeconds <= 600 
    ? 'time-pill time-soon' 
    : 'time-pill time-ok';
  
  return <span aria-live="polite" className={cls}>{timeLeft.label}</span>;
}