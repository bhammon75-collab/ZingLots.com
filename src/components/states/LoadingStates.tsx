/**
 * Empty & Loading State Components
 * 
 * Features from design system:
 * - No dead-ends in user experience
 * - Professional loading skeletons
 * - Helpful empty states with clear next actions
 * - Consistent styling with design tokens
 */

export interface EmptyProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

/**
 * Empty state component - use when no results found
 */
export function Empty({ title, subtitle, action, icon }: EmptyProps) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 p-8 text-center">
      {icon && (
        <div className="mb-2" style={{ color: 'var(--text-muted)' }}>
          {icon}
        </div>
      )}
      <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>
        {title}
      </div>
      {subtitle && (
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </div>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}

/**
 * Skeleton card component - use while content is loading
 */
export function SkeletonCard() {
  return (
    <div className="card h-64 animate-pulse bg-black/5 dark:bg-white/5" />
  )
}

/**
 * Skeleton listing card - matches ListingCard structure
 */
export function SkeletonListingCard() {
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
 * Skeleton grid - shows multiple loading cards
 */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonListingCard key={i} />
      ))}
    </div>
  )
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-transparent border-t-current`} 
         style={{ borderTopColor: 'var(--accent)' }} />
  )
}

/**
 * Page loading state with spinner
 */
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <LoadingSpinner size="lg" />
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {message}
      </div>
    </div>
  )
}

/**
 * Inline loading state for buttons
 */
export function ButtonLoading() {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span>Loading...</span>
    </div>
  )
}