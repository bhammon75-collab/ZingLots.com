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
import { 
  Menu, 
  ShoppingCart, 
  Search, 
  Heart, 
  User, 
  Bell,
  ChevronDown,
  MapPin,
  Package,
  TrendingUp,
  Gavel,
  Globe
} from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "@/components/brand/Logo";
import { supabase } from "@/integrations/supabase/client";
import "../styles/modern-design.css";

interface UserMetadata {
  roles?: string[];
  is_admin?: boolean;
  full_name?: string;
  first_name?: string;
  name?: string;
}

const ModernNav = () => {
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      const userMeta = (session?.user?.user_metadata || {}) as UserMetadata;
      const appMeta = (session?.user?.app_metadata || {}) as any;
      
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
      const appMeta = (session?.user?.app_metadata || {}) as any;
      
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/discover?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    { name: "Construction", icon: "🔨", count: 342 },
    { name: "Restaurant", icon: "🍴", count: 189 },
    { name: "Office", icon: "💼", count: 156 },
    { name: "Municipal", icon: "🏛️", count: 98 },
    { name: "Electronics", icon: "📱", count: 267 },
    { name: "Vehicles", icon: "🚗", count: 145 },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <DropdownMenu open={showLocations} onOpenChange={setShowLocations}>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-brand-red transition-colors cursor-pointer">
                <MapPin className="h-3 w-3" />
                <span>{selectedLocation}</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Select Your Region</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setSelectedLocation("All Locations"); setShowLocations(false); }}>
                  <Link to="/" className="flex items-center gap-2 w-full">
                    <Globe className="h-4 w-4" />
                    All Locations (Nationwide)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">West Coast</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Seattle, WA"); setShowLocations(false); }}>
                  <Link to="/r/seattle" className="w-full">Seattle, WA</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Tacoma, WA"); setShowLocations(false); }}>
                  <Link to="/r/tacoma" className="w-full">Tacoma, WA</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Portland, OR"); setShowLocations(false); }}>
                  <Link to="/r/portland" className="w-full">Portland, OR</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Los Angeles, CA"); setShowLocations(false); }}>
                  <Link to="/r/los-angeles" className="w-full">Los Angeles, CA</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedLocation("San Francisco, CA"); setShowLocations(false); }}>
                  <Link to="/r/san-francisco" className="w-full">San Francisco, CA</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Midwest</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Chicago, IL"); setShowLocations(false); }}>
                  <Link to="/r/chicago" className="w-full">Chicago, IL</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Detroit, MI"); setShowLocations(false); }}>
                  <Link to="/r/detroit" className="w-full">Detroit, MI</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">East Coast</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setSelectedLocation("New York, NY"); setShowLocations(false); }}>
                  <Link to="/r/new-york" className="w-full">New York, NY</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Boston, MA"); setShowLocations(false); }}>
                  <Link to="/r/boston" className="w-full">Boston, MA</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">South</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Houston, TX"); setShowLocations(false); }}>
                  <Link to="/r/houston" className="w-full">Houston, TX</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Dallas, TX"); setShowLocations(false); }}>
                  <Link to="/r/dallas" className="w-full">Dallas, TX</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedLocation("Atlanta, GA"); setShowLocations(false); }}>
                  <Link to="/r/atlanta" className="w-full">Atlanta, GA</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-gray-400">|</span>
            <Link to="/help" className="hover:text-brand-red transition-colors">
              Help & Contact
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/seller/apply" className="hover:text-brand-red transition-colors">
              Sell with us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="nav-modern sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo - Consistent and Large */}
            <Link to="/" className="flex items-center group" aria-label="Go to home">
              <Logo size="md" withText onDark={false} />
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-modern hidden md:flex flex-1 max-w-2xl mx-8">
              <input
                type="text"
                placeholder="Search for construction materials, restaurant equipment, office furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <button type="submit" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </form>

            {/* Right Navigation */}
            <div className="flex items-center gap-2">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {isAuthed ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="nav-link flex items-center gap-1"
                      asChild
                    >
                      <Link to="/dashboard/buyer">
                        <Heart className="h-4 w-4" />
                        <span>Watchlist</span>
                      </Link>
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="nav-link flex items-center gap-1"
                      asChild
                    >
                      <Link to="/dashboard/buyer">
                        <Bell className="h-4 w-4" />
                        <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 flex items-center justify-center">
                          3
                        </Badge>
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="nav-link flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{displayName || 'Account'}</span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/buyer" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Buying Activity
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/seller" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Selling Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/auction/active" className="flex items-center gap-2">
                            <Gavel className="h-4 w-4" />
                            My Bids
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link to="/admin" className="text-brand-red">
                                Admin Panel
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative"
                      asChild
                    >
                      <Link to="/cart">
                        <ShoppingCart className="h-5 w-5" />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-brand-red text-white">
                          2
                        </Badge>
                      </Link>
                    </Button>

                    <Button 
                      className="btn-modern btn-primary ml-2"
                      asChild
                    >
                      <Link to="/sell/new">
                        List an Item
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/login?mode=register">Register</Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative"
                      asChild
                    >
                      <Link to="/cart">
                        <ShoppingCart className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button 
                      className="btn-modern btn-primary ml-2"
                      asChild
                    >
                      <Link to="/seller/apply">
                        Start Selling
                      </Link>
                    </Button>
                  </>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border"
                aria-label="Toggle menu"
                onClick={() => setOpen(!open)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Categories Bar */}
          <div className="hidden md:flex items-center gap-6 pb-3 border-t pt-3">
            <button
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
              className="flex items-center gap-1 font-medium hover:text-brand-red transition-colors"
            >
              <Menu className="h-4 w-4" />
              Shop by Category
              <ChevronDown className="h-3 w-3" />
            </button>
            
            <NavLink to="/discover" className="nav-link">
              Discover
            </NavLink>
            <NavLink to="/explore" className="nav-link">
              Trending
            </NavLink>
            <NavLink to="/browse" className="nav-link">
              Browse All
            </NavLink>
            <NavLink to="/pricing" className="nav-link">
              Pricing
            </NavLink>
            
            <div className="ml-auto flex items-center gap-2">
              <Badge className="badge-hot">
                🔥 Hot Deals
              </Badge>
            </div>
          </div>
        </div>

        {/* Categories Dropdown */}
        {showCategories && (
          <div 
            className="absolute top-full left-0 w-full bg-white border-b shadow-lg z-50"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-6 gap-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/category/${cat.name.toLowerCase()}`}
                    className="group"
                  >
                    <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-3xl mb-2">{cat.icon}</span>
                      <span className="font-medium text-gray-900 group-hover:text-brand-red">
                        {cat.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {cat.count} items
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-lg">Menu</span>
              <button onClick={() => setOpen(false)} className="p-2">
                ✕
              </button>
            </div>
            
            <div className="p-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-modern"
                />
              </form>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-3">
                <Link to="/discover" onClick={() => setOpen(false)} className="py-2 font-medium">
                  Discover
                </Link>
                <Link to="/explore" onClick={() => setOpen(false)} className="py-2 font-medium">
                  Trending
                </Link>
                <Link to="/browse" onClick={() => setOpen(false)} className="py-2 font-medium">
                  Browse All
                </Link>
                <Link to="/pricing" onClick={() => setOpen(false)} className="py-2 font-medium">
                  Pricing
                </Link>
                <Link to="/help" onClick={() => setOpen(false)} className="py-2 font-medium">
                  Help & Contact
                </Link>
                
                <div className="border-t pt-3 mt-3">
                  {isAuthed ? (
                    <>
                      <Link to="/dashboard/buyer" onClick={() => setOpen(false)} className="block py-2">
                        My Dashboard
                      </Link>
                      <Link to="/cart" onClick={() => setOpen(false)} className="block py-2">
                        Cart
                      </Link>
                      <button onClick={() => { handleSignOut(); setOpen(false); }} className="block py-2 text-left w-full">
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setOpen(false)} className="block py-2">
                        Sign In
                      </Link>
                      <Link to="/login?mode=register" onClick={() => setOpen(false)} className="block py-2">
                        Register
                      </Link>
                    </>
                  )}
                </div>
                
                <Button 
                  className="btn-modern btn-primary w-full mt-4"
                  asChild
                >
                  <Link to="/sell/new" onClick={() => setOpen(false)}>
                    Start Selling
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernNav;