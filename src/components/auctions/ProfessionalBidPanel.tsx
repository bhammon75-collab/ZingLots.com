import { Clock } from 'lucide-react'
import { useState } from 'react'

/**
 * Professional Sticky BidPanel Component for Auction Details
 * 
 * Features from design system:
 * - Keeps auction action visible (higher conversion, less scrolling)
 * - Professional styling with new design tokens
 * - Clear hierarchy: time left, current bid, bid input, CTA
 * - Proxy bidding explanation for transparency
 * - Anti-snipe messaging for trust
 */

export interface ProfessionalBidPanelProps {
  currentBid: number
  timeLeft: string
  reserveMet: boolean
  onPlaceBid: (amount: number) => void
  isLoading?: boolean
  minNextBid?: number
}

export function ProfessionalBidPanel({
  currentBid,
  timeLeft,
  reserveMet,
  onPlaceBid,
  isLoading = false,
  minNextBid
}: ProfessionalBidPanelProps) {
  const [bidAmount, setBidAmount] = useState<string>('')

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount)
    if (amount && amount >= (minNextBid || currentBid + 1)) {
      onPlaceBid(amount)
      setBidAmount('')
    }
  }

  const isValidBid = () => {
    const amount = parseFloat(bidAmount)
    return amount >= (minNextBid || currentBid + 1)
  }

  return (
    <aside className="sticky top-20 card p-4">
      {/* Time Left Header */}
      <div className="mb-3 flex items-center justify-between">
        <div 
          className="text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Time left
        </div>
        <div 
          className="inline-flex items-center gap-2 rounded-2xl border px-2 py-1 text-sm"
          style={{ borderColor: 'var(--border)' }}
        >
          <Clock className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text)' }}>{timeLeft}</span>
        </div>
      </div>

      {/* Current Bid */}
      <div className="mb-2 text-3xl font-semibold" style={{ color: 'var(--text)' }}>
        ${currentBid.toLocaleString()}
      </div>

      {/* Bid Status */}
      <div 
        className="mb-4 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        Current bid · {' '}
        <span style={{ color: reserveMet ? 'var(--accent)' : 'var(--text-muted)' }}>
          {reserveMet ? 'Reserve met' : 'Reserve not met'}
        </span>
      </div>

      {/* Bid Input and Button */}
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="Your max bid" 
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="flex-1 rounded-2xl border px-3 py-2 bg-transparent outline-none text-sm"
          style={{ 
            borderColor: 'var(--border)', 
            color: 'var(--text)',
            '--tw-placeholder-color': 'var(--text-muted)'
          } as any}
          min={minNextBid || currentBid + 1}
          step="0.01"
        />
        <button 
          className="rounded-2xl px-4 py-2 font-medium text-black text-sm transition-colors hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)' }}
          onClick={handlePlaceBid}
          disabled={isLoading || !isValidBid()}
        >
          {isLoading ? 'Placing...' : 'Place bid'}
        </button>
      </div>

      {/* Minimum bid helper */}
      {minNextBid && (
        <div 
          className="mt-2 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          Minimum bid: ${minNextBid.toLocaleString()}
        </div>
      )}

      {/* Proxy Bidding Explanation */}
      <p 
        className="mt-3 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        Proxy bidding enabled. Anti‑snipe adds +2m up to 5×.
      </p>
    </aside>
  )
}

/**
 * Simplified BidPanel for mobile or compact layouts
 */
export function CompactBidPanel({
  currentBid,
  timeLeft,
  onPlaceBid,
  isLoading = false
}: Omit<ProfessionalBidPanelProps, 'reserveMet' | 'minNextBid'>) {
  const [bidAmount, setBidAmount] = useState<string>('')

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount)
    if (amount && amount > currentBid) {
      onPlaceBid(amount)
      setBidAmount('')
    }
  }

  return (
    <div className="card p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          ${currentBid.toLocaleString()}
        </div>
        <div 
          className="text-xs flex items-center gap-1"
          style={{ color: 'var(--text-muted)' }}
        >
          <Clock className="h-3 w-3" />
          {timeLeft}
        </div>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="number" 
          placeholder="Bid amount" 
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="flex-1 rounded-xl border px-2 py-1 bg-transparent outline-none text-sm"
          style={{ 
            borderColor: 'var(--border)', 
            color: 'var(--text)'
          }}
        />
        <button 
          className="rounded-xl px-3 py-1 font-medium text-black text-sm"
          style={{ backgroundColor: 'var(--accent)' }}
          onClick={handlePlaceBid}
          disabled={isLoading}
        >
          Bid
        </button>
      </div>
    </div>
  )
}