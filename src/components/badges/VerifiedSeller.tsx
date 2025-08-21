import { ShieldCheck } from 'lucide-react'

/**
 * VerifiedSeller Badge Component
 * 
 * Trust anchor from design system - place near seller name on item and in seller profiles
 * Uses accent color for the icon to build trust
 */

export interface VerifiedSellerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'overlay'
}

export function VerifiedSeller({ 
  className = '', 
  size = 'md',
  variant = 'default' 
}: VerifiedSellerProps) {
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2 py-1', 
    lg: 'text-base px-3 py-1.5'
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }

  const baseClasses = "inline-flex items-center gap-1 rounded-2xl border font-medium"
  const variantClasses = {
    default: "border-current",
    overlay: "bg-black/70 text-white border-transparent"
  }

  return (
    <span 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{ 
        color: variant === 'overlay' ? '#ffffff' : 'var(--text)',
        borderColor: variant === 'default' ? 'var(--border)' : 'transparent'
      }}
    >
      <ShieldCheck 
        className={iconSizes[size]} 
        style={{ color: 'var(--accent)' }} 
      />
      Verified Seller
    </span>
  )
}