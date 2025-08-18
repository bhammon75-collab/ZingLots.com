import { Clock, MapPin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Professional ListingCard Component
 * 
 * Features from design system:
 * - Standardized 4:3 image aspect ratio
 * - Premium visual hierarchy  
 * - Verified seller badges
 * - Clean metadata display (time left, location, reserve status)
 * - Professional styling with new design tokens
 */

export interface ListingCardProps {
  id: string
  title: string
  price: string
  reserve?: 'met' | 'not_met'
  timeLeft: string
  city: string
  state: string
  verified?: boolean
  imageUrl: string
  href?: string
}

export function ListingCard(props: ListingCardProps) {
  const {
    id,
    title,
    price,
    reserve,
    timeLeft,
    city,
    state,
    verified = false,
    imageUrl,
    href = `/product/${id}`
  } = props

  return (
    <Link to={href} className="card block overflow-hidden transition hover:shadow-card">
      {/* 4:3 Image Container */}
      <div className="relative aspect-[4/3] bg-black/5 dark:bg-white/5">
        <img 
          src={imageUrl} 
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-[1.01]" 
        />
        
        {/* Verified Seller Badge */}
        {verified && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-2xl bg-black/70 px-2 py-1 text-xs text-white">
            <ShieldCheck className="h-3 w-3" /> 
            Verified Seller
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        {/* Title */}
        <h3 
          className="line-clamp-2 text-sm font-medium leading-tight"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </h3>

        {/* Price and Time Info Row */}
        <div className="flex items-center justify-between">
          {/* Price Column */}
          <div>
            <div 
              className="text-xl font-semibold"
              style={{ color: 'var(--text)' }}
            >
              {price}
            </div>
            {reserve && (
              <div 
                className={`text-xs ${
                  reserve === 'met' 
                    ? 'text-[var(--accent)]' 
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {reserve === 'met' ? 'Reserve met' : 'Reserve not met'}
              </div>
            )}
          </div>

          {/* Time and Location Column */}
          <div className="text-right">
            {/* Time Left Pill */}
            <div 
              className="inline-flex items-center gap-1 rounded-2xl border px-2 py-1 text-xs"
              style={{ borderColor: 'var(--border)' }}
            >
              <Clock className="h-3 w-3" style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text)' }}>{timeLeft}</span>
            </div>
            
            {/* Location */}
            <div 
              className="mt-1 text-xs inline-flex items-center gap-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <MapPin className="h-3 w-3" />
              <span>{city}, {state}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/**
 * Skeleton loading state for ListingCard
 */
export function ListingCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/3] bg-black/5 dark:bg-white/5 animate-pulse" />
      <div className="space-y-2 p-4">
        <div className="h-4 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
        <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-3/4 animate-pulse" />
        <div className="flex justify-between">
          <div className="h-6 bg-black/5 dark:bg-white/5 rounded w-16 animate-pulse" />
          <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/**
 * Grid container for listing cards with responsive layout
 */
export function ListingGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  )
}