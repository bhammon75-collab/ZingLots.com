import { ShieldCheck } from 'lucide-react'

export function VerifiedSMEBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${className}`}>
      <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Verified SME
    </span>
  )
}

