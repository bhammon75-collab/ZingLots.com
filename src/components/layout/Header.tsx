import { Link } from 'react-router-dom'
import { MapPin, Search, Bell, User, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface UserMetadata {
  roles?: string[];
  is_admin?: boolean;
  full_name?: string;
  first_name?: string;
  name?: string;
}

interface AppMetadata {
  roles?: string[];
  is_admin?: boolean;
}

/**
 * Professional Header Component - Region-First Design
 * 
 * Key features from design system:
 * - Region selector as primary navigation
 * - Clean, trustworthy appearance  
 * - Prominent search functionality
 * - Professional styling with new design tokens
 * - Reduced visual noise
 */
export default function Header() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [currentRegion] = useState("Seattle, WA"); // TODO: Connect to user's selected region

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      const userMeta = (session?.user?.user_metadata || {}) as UserMetadata;
      
      const name = userMeta.full_name || 
                   userMeta.first_name || 
                   userMeta.name || 
                   session?.user?.email?.split("@")[0] || 
                   null;
      setDisplayName(name);
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
      const userMeta = (session?.user?.user_metadata || {}) as UserMetadata;
      
      const name = userMeta.full_name || 
                   userMeta.first_name || 
                   userMeta.name || 
                   session?.user?.email?.split("@")[0] || 
                   null;
      setDisplayName(name);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header 
      className="sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-opacity-80"
      style={{ 
        backgroundColor: 'var(--surface)', 
        borderColor: 'var(--border)' 
      }}
    >
      <div className="container flex h-14 items-center gap-3">
        {/* Logo */}
        <Link to="/" className="font-semibold tracking-tight text-xl" style={{ color: 'var(--text)' }}>
          ZingLots
        </Link>

        {/* Region selector - STAR OF THE SHOW */}
        <Link 
          to="/regions" 
          className="ml-2 inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <MapPin className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <span>{currentRegion}</span>
        </Link>

        {/* Search - Prominent on desktop */}
        <div 
          className="ml-4 hidden md:flex flex-1 items-center rounded-2xl border px-3 max-w-md"
          style={{ borderColor: 'var(--border)' }}
        >
          <Search className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <input
            className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-current"
            placeholder="Search local surplus…"
            style={{ color: 'var(--text)', '--tw-placeholder-color': 'var(--text-muted)' } as any}
          />
        </div>

        {/* Actions - Clean and minimal */}
        <nav className="ml-auto flex items-center gap-2">
          {/* Primary CTA */}
          <Link 
            to="/sell" 
            className="rounded-2xl px-3 py-2 text-sm font-medium text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Sell
          </Link>

          {/* Secondary actions */}
          {isAuthed ? (
            <>
              <Link 
                to="/watchlist" 
                className="hidden sm:inline-flex rounded-2xl border px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Watchlist
              </Link>

              {/* Notifications */}
              <button 
                aria-label="Notifications" 
                className="rounded-2xl border p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)' }}
              >
                <Bell className="h-4 w-4" style={{ color: 'var(--text)' }} />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="rounded-2xl border p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)' }}
              >
                <ShoppingCart className="h-4 w-4" style={{ color: 'var(--text)' }} />
              </Link>

              {/* User menu */}
              <Link 
                to="/account" 
                className="rounded-2xl border px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                {displayName ? `Hi, ${displayName}` : 'Account'}
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/watchlist" 
                className="hidden sm:inline-flex rounded-2xl border px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Watchlist
              </Link>

              {/* Cart for non-auth users */}
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="rounded-2xl border p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)' }}
              >
                <ShoppingCart className="h-4 w-4" style={{ color: 'var(--text)' }} />
              </Link>

              {/* Sign in */}
              <Link 
                to="/login" 
                className="rounded-2xl border px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile search - appears below header on small screens */}
      <div className="md:hidden border-t px-4 py-2" style={{ borderColor: 'var(--border)' }}>
        <div 
          className="flex items-center rounded-2xl border px-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <Search className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <input
            className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-current"
            placeholder="Search local surplus…"
            style={{ color: 'var(--text)', '--tw-placeholder-color': 'var(--text-muted)' } as any}
          />
        </div>
      </div>
    </header>
  )
}