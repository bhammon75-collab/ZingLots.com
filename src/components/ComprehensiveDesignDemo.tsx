import Header from './layout/Header'
import { ListingCard, ListingGrid, ListingCardSkeleton } from './listings/ListingCard'
import { VerifiedSeller } from './badges/VerifiedSeller'
import { ProfessionalBidPanel, CompactBidPanel } from './auctions/ProfessionalBidPanel'
import { Empty, SkeletonGrid, PageLoading } from './states/LoadingStates'
import { Search, Package, ArrowRight } from 'lucide-react'
import { useState } from 'react'

/**
 * Comprehensive Demo showcasing the complete professional design system
 * 
 * This demonstrates all the ready-to-paste components from the design document:
 * - Professional Header with region-first navigation
 * - Premium ListingCard with 4:3 images and verified seller badges
 * - Sticky BidPanel for auction interactions
 * - Loading states and empty states
 * - Professional color palette and typography
 */
export function ComprehensiveDesignDemo() {
  const [loading, setLoading] = useState(false)
  const [showEmpty, setShowEmpty] = useState(false)

  // Sample data for demonstrations
  const sampleListings = [
    {
      id: '1',
      title: 'Professional Restaurant Equipment - Complete Kitchen Setup',
      price: '$2,480',
      reserve: 'met' as const,
      timeLeft: '2h 14m',
      city: 'Seattle',
      state: 'WA',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
    },
    {
      id: '2', 
      title: 'Construction Equipment Lot - Surplus from Downtown Project',
      price: '$8,950',
      reserve: 'not_met' as const,
      timeLeft: '1d 6h',
      city: 'Tacoma',
      state: 'WA',
      verified: false,
      imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Office Furniture Clearance - 50+ Desks and Chairs',
      price: '$1,200',
      reserve: 'met' as const,
      timeLeft: '4h 32m',
      city: 'Bellevue',
      state: 'WA',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    }
  ]

  const handlePlaceBid = (amount: number) => {
    if (import.meta.env.DEV) console.log('Bid placed:', amount)
    // Handle bid logic
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Professional Header */}
      <Header />

      <div className="container mx-auto p-6 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            ZingLots Professional Design System
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--text-muted)' }}>
            Hyperlocal surplus auctions for business. <strong>Bid. Win. Save.</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              className="rounded-2xl px-6 py-3 font-medium text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Browse Seattle Auctions
            </button>
            <button 
              className="rounded-2xl border px-6 py-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Become a Seller
            </button>
          </div>
        </div>

        {/* Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-3">
              <VerifiedSeller size="lg" />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Verified Sellers
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              All sellers verified for business legitimacy and pickup readiness
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-3" style={{ color: 'var(--accent)' }}>
              <div className="p-2 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
                <Package className="h-6 w-6" />
              </div>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Secure Payouts
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Escrow protection until pickup confirmation
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="flex justify-center mb-3" style={{ color: 'var(--accent)' }}>
              <div className="p-2 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
                <Search className="h-6 w-6" />
              </div>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Local Pickup
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Pickup only · Seller provides address after payment
            </p>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
            Component Demo Controls
          </h3>
          <div className="flex gap-4">
            <button 
              onClick={() => setLoading(!loading)}
              className="rounded-2xl border px-4 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {loading ? 'Hide Loading' : 'Show Loading'}
            </button>
            <button 
              onClick={() => setShowEmpty(!showEmpty)}
              className="rounded-2xl border px-4 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {showEmpty ? 'Show Results' : 'Show Empty State'}
            </button>
          </div>
        </div>

        {/* Main Content Area with Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Content Area */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text)' }}>
              Featured Auctions
            </h2>
            
            {loading ? (
              <SkeletonGrid count={6} />
            ) : showEmpty ? (
              <Empty 
                title="No auctions found"
                subtitle="Try adjusting your search criteria or check back later"
                action={
                  <button 
                    className="rounded-2xl px-4 py-2 text-sm font-medium text-black"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    Browse All Categories
                  </button>
                }
                icon={<Search className="h-12 w-12" />}
              />
            ) : (
              <ListingGrid>
                {sampleListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
                {/* Add some skeleton cards to show mixed loading */}
                <ListingCardSkeleton />
                <ListingCardSkeleton />
                <ListingCardSkeleton />
              </ListingGrid>
            )}
          </div>

          {/* Sidebar with Bid Panel Demo */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Auction Details
            </h3>
            
            <ProfessionalBidPanel
              currentBid={2480}
              timeLeft="02:14:36"
              reserveMet={true}
              onPlaceBid={handlePlaceBid}
              minNextBid={2500}
            />
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Compact Version
              </h4>
              <CompactBidPanel
                currentBid={1200}
                timeLeft="4h 32m"
                onPlaceBid={handlePlaceBid}
              />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                Ready to implement?
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                All components are production-ready with professional styling
              </p>
            </div>
            <button 
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              View Documentation
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Color Palette Demo */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Design Token Examples
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                <span style={{ color: 'var(--text-muted)' }}>accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--warn)' }}></div>
                <span style={{ color: 'var(--text-muted)' }}>warn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--danger)' }}></div>
                <span style={{ color: 'var(--text-muted)' }}>danger</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}></div>
                <span style={{ color: 'var(--text-muted)' }}>surface</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}