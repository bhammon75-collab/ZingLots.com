import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

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

const ZingNav = () => {
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      const userMeta = (session?.user?.user_metadata || {}) as UserMetadata;
      const appMeta = (session?.user?.app_metadata || {}) as AppMetadata;
      
      const roles = userMeta.roles || appMeta.roles;
      setIsAdmin(!!(userMeta.is_admin || appMeta.is_admin || roles?.includes?.("admin")));
      
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
      const appMeta = (session?.user?.app_metadata || {}) as AppMetadata;
      
      const roles = userMeta.roles || appMeta.roles;
      setIsAdmin(!!(userMeta.is_admin || appMeta.is_admin || roles?.includes?.("admin")));
      
      const name = userMeta.full_name || 
                   userMeta.first_name || 
                   userMeta.name || 
                   session?.user?.email?.split("@")[0] || 
                   null;
      setDisplayName(name);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95 pointer-events-auto">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex h-40 items-start justify-between pt-4">
          {/* Left Nav */}
          <nav className="flex items-center gap-6 mt-2">
            <NavLink to="/discover" className="text-sm text-gray-600 hover:text-gray-900">
              Discover
            </NavLink>
            <NavLink to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </NavLink>
            <NavLink to="/help" className="text-sm text-gray-600 hover:text-gray-900">
              Help & Contact
            </NavLink>
            {(() => {
              const showDrops = typeof window !== 'undefined' && (isAdmin || new URLSearchParams(window.location.search).get('dev') === '1');
              return showDrops ? (
                <NavLink to="/live" className="inline-flex items-center text-sm">
                  <Badge variant="secondary">Drops</Badge>
                </NavLink>
              ) : null;
            })()}
          </nav>

          {/* Centered Logo */}
          <div className="flex-1 flex justify-center items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/icons/bolt.svg" 
                alt="ZingLots Bolt Logo" 
                className="h-16 w-16"
              />
              <span className="text-3xl font-bold text-gray-900">ZingLots</span>
            </Link>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2 mt-2">
            {isAuthed ? (
              <>
                <Button variant="ghost" size="icon" asChild aria-label="Cart">
                  <Link to="/cart"><ShoppingCart className="h-5 w-5" /></Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      Hi, {displayName || 'there'}!
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                      <Link to="/dashboard/buyer">Buyer Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                      <Link to="/dashboard/seller">Seller Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="hero" size="sm" className="bg-none bg-brand-blue text-brand-blue-foreground" asChild>
                  <Link to="/dashboard/seller">Sell now</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/seller/apply">Apply</Link>
                </Button>

                <Button variant="ghost" size="icon" asChild aria-label="Cart">
                  <Link to="/cart"><ShoppingCart className="h-5 w-5" /></Link>
                </Button>

                <Button variant="hero" size="sm" className="bg-none bg-brand-blue text-brand-blue-foreground" asChild>
                  <Link to="/dashboard/seller">Start Selling</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex h-32 items-start justify-between pt-4">
          <div className="flex-1 flex justify-center items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/icons/bolt.svg" 
                alt="ZingLots Bolt Logo" 
                className="h-12 w-12"
              />
              <span className="text-2xl font-bold text-gray-900">ZingLots</span>
            </Link>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border mt-2"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Menu className="text-gray-900" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
            <NavLink to="/discover" onClick={() => setOpen(false)} className="text-sm text-gray-600">Discover</NavLink>
            <NavLink to="/pricing" onClick={() => setOpen(false)} className="text-sm text-gray-600">Pricing</NavLink>
            <NavLink to="/help" onClick={() => setOpen(false)} className="text-sm text-gray-600">Help & Contact</NavLink>
            {(() => {
              const showDrops = typeof window !== 'undefined' && (isAdmin || new URLSearchParams(window.location.search).get('dev') === '1');
              return showDrops ? (
                <NavLink to="/live" onClick={() => setOpen(false)} className="text-sm">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs">Drops</span>
                </NavLink>
              ) : null;
            })()}
            <div className="flex gap-2 pt-2 flex-wrap">
              {isAuthed ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard/buyer" onClick={() => setOpen(false)}>Dashboard</Link>
                  </Button>
                  <Button variant="secondary" onClick={() => { handleSignOut(); setOpen(false); }}>
                    Sign out
                  </Button>
                  <Button variant="hero" size="sm" className="bg-none bg-brand-blue text-brand-blue-foreground" asChild>
                    <Link to="/dashboard/seller" onClick={() => setOpen(false)}>Sell now</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/seller/apply" onClick={() => setOpen(false)}>Apply</Link>
                  </Button>
                  <Button variant="hero" size="sm" className="bg-none bg-brand-blue text-brand-blue-foreground" asChild>
                    <Link to="/dashboard/seller" onClick={() => setOpen(false)}>Start Selling</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ZingNav;