import { MapPin, Clock, ShieldCheck } from 'lucide-react'

/**
 * Demo component showcasing the new professional design system tokens
 * This demonstrates the usage patterns from the design document
 */
export function DesignSystemDemo() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="container mx-auto p-6 space-y-8">
        
        {/* Header demonstrating new design */}
        <header className="flex items-center justify-between p-4 rounded-2xl" 
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
              ZingLots Design System
            </h1>
            <div className="flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/5">
              <MapPin className="h-4 w-4" /> 
              <span style={{ color: 'var(--text)' }}>Seattle, WA</span>
            </div>
          </div>
          <button className="rounded-2xl px-4 py-2 text-sm font-medium text-black"
                  style={{ backgroundColor: 'var(--accent)' }}>
            Sell
          </button>
        </header>

        {/* Card Grid demonstrating new styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Premium listing card */}
          <div className="card overflow-hidden transition hover:shadow-card">
            <div className="relative aspect-[4/3] bg-black/5 dark:bg-white/5">
              <div className="w-full h-full bg-gradient-to-br from-ink-100 to-ink-200 flex items-center justify-center">
                <span className="text-ink-500 text-sm">4:3 Image Ratio</span>
              </div>
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-2xl bg-black/70 px-2 py-1 text-xs text-white">
                <ShieldCheck className="h-3 w-3"/> Verified Seller
              </span>
            </div>
            <div className="space-y-2 p-4">
              <h3 className="line-clamp-2 text-sm font-medium leading-tight" style={{ color: 'var(--text)' }}>
                Professional Restaurant Equipment Lot
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold" style={{ color: 'var(--text)' }}>$2,480</div>
                  <div className="text-xs" style={{ color: 'var(--accent)' }}>
                    Reserve met
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 rounded-2xl border px-2 py-1 text-xs">
                    <Clock className="h-3 w-3"/>
                    <span style={{ color: 'var(--text)' }}>2h 14m</span>
                  </div>
                  <div className="mt-1 text-xs inline-flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="h-3 w-3"/> Seattle, WA
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bid panel demonstration */}
          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Time left</div>
              <div className="inline-flex items-center gap-2 rounded-2xl border px-2 py-1 text-sm">
                <Clock className="h-4 w-4"/>
                <span style={{ color: 'var(--text)' }}>02:14:36</span>
              </div>
            </div>
            <div className="mb-2 text-3xl font-semibold" style={{ color: 'var(--text)' }}>$1,480</div>
            <div className="mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              Current bid · Reserve met
            </div>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Your max bid" 
                className="flex-1 rounded-2xl border px-3 py-2 bg-transparent outline-none focus-visible:outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              />
              <button className="rounded-2xl px-4 py-2 font-medium text-black"
                      style={{ backgroundColor: 'var(--accent)' }}>
                Place bid
              </button>
            </div>
            <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              Proxy bidding enabled. Anti‑snipe adds +2m up to 5×.
            </p>
          </div>

          {/* Color palette demonstration */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Design Tokens
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                <span className="text-sm" style={{ color: 'var(--text)' }}>Accent (Emerald)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--warn)' }}></div>
                <span className="text-sm" style={{ color: 'var(--text)' }}>Warning (Amber)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--danger)' }}></div>
                <span className="text-sm" style={{ color: 'var(--text)' }}>Danger (Red)</span>
              </div>
              <div className="hr my-3"></div>
              <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                <div>Border Radius: 14-16px</div>
                <div>Focus Ring: 2px accent</div>
                <div>Typography: Inter font</div>
              </div>
            </div>
          </div>
        </div>

        {/* Focus ring demonstration */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
            Interactive Elements (try tabbing through)
          </h3>
          <div className="flex gap-4">
            <button className="rounded-2xl border px-4 py-2 text-sm" style={{ color: 'var(--text)' }}>
              Primary Button
            </button>
            <button className="rounded-2xl px-4 py-2 text-sm font-medium text-black"
                    style={{ backgroundColor: 'var(--accent)' }}>
              Accent Button
            </button>
            <input 
              type="text" 
              placeholder="Focus me with Tab" 
              className="rounded-2xl border px-3 py-2 text-sm bg-transparent outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}