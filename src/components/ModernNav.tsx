import { Link, NavLink, useNavigate } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";
import "../styles/modern-design.css";
import Logo from "@/components/brand/Logo";

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
	const navigate = useNavigate();

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
			navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
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
			<header className="nav-modern bg-white border-b-2 border-gray-100">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex h-28 items-center justify-between">
						{/* Logo - Larger for B2B */}
						<a href="/" className="flex items-center gap-3 self-stretch" aria-label="ZingLots Home">
							<Logo variant="monogram" withText={false} size="xl" onDark={false} />
							<span className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-none flex items-center">ZingLots</span>
						</a>

						{/* Search Bar - Enhanced Design */}
						<div className="hidden md:flex flex-col flex-1 max-w-3xl mx-8 self-stretch justify-center">
							<form onSubmit={handleSearch} className="w-full">
								<div className="flex w-full items-center rounded-xl border border-zinc-200 bg-white shadow-sm">
									<input
										type="text"
										placeholder="Search active auctions..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="flex-1 h-12 lg:h-14 px-4 outline-none rounded-l-xl"
									/>
									<button 
										type="submit"
										className="h-12 lg:h-14 px-4 lg:px-6 bg-[#E02020] text-white font-semibold rounded-r-xl hover:brightness-95 transition-all flex items-center gap-2"
									>
										<Search className="h-5 w-5" />
										<span className="hidden lg:inline">Search Auctions</span>
									</button>
								</div>
							</form>
							<div className="flex justify-end mt-2">
								<span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
									{categories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()} Active Auctions
								</span>
							</div>
						</div>

						{/* Right Actions */}
						<div className="flex items-center gap-2 self-stretch">
							<Button variant="ghost" size="icon" asChild aria-label="Cart">
								<Link to="/cart"><ShoppingCart className="h-5 w-5" /></Link>
							</Button>
							{isAuthed ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm">
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
							) : (
								<>
									<Button variant="ghost" size="sm" asChild>
										<Link to="/login">Sign In</Link>
									</Button>
									<Button variant="ghost" size="sm" asChild>
										<Link to="/seller/apply">Apply</Link>
									</Button>
								</>
							)}
							<Button variant="hero" size="sm" className="bg-brand-blue text-brand-blue-foreground" asChild>
								<Link to="/dashboard/seller">Start Selling</Link>
							</Button>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default ModernNav;