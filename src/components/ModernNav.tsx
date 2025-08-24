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
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import "../styles/modern-design.css";
import Brand from "./Brand";
import { CATEGORIES } from "@/data/categories";

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
	const [searchCategory, setSearchCategory] = useState<string>("");
	const [showCategories, setShowCategories] = useState(false);
	const [showLocations, setShowLocations] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState("All Locations");
	const navigate = useNavigate();

	// Refs for aligning brand with the top bar separator
	const topSeparatorRef = useRef<HTMLSpanElement | null>(null);
	const brandBlockRef = useRef<HTMLDivElement | null>(null);
	const [brandTranslateX, setBrandTranslateX] = useState(0);

	useEffect(() => {
		const alignBrandToSeparator = () => {
			const sep = topSeparatorRef.current;
			const brand = brandBlockRef.current;
			if (!sep || !brand) return;

			const sepRect = sep.getBoundingClientRect();
			const brandRect = brand.getBoundingClientRect();

			// Move the brand so its horizontal center matches the separator's x position
			const separatorX = sepRect.left + sepRect.width / 2;
			const brandCenterX = brandRect.left + brandRect.width / 2;
			const deltaX = Math.round(separatorX - brandCenterX);
			setBrandTranslateX(deltaX);
		};

		// Initial alignment and on resize
		alignBrandToSeparator();
		window.addEventListener("resize", alignBrandToSeparator);
		return () => window.removeEventListener("resize", alignBrandToSeparator);
	}, [selectedLocation]);

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
		const params = new URLSearchParams();
		if (searchQuery.trim()) params.set("q", searchQuery.trim());
		if (searchCategory) params.set("category", searchCategory);
		navigate(`/discover?${params.toString()}`);
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
							<DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#2563eb] transition-colors cursor-pointer">
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
						<span ref={topSeparatorRef} className="text-gray-400">|</span>
						<Link to="/help" className="hover:text-[#2563eb] transition-colors">
							Help & Contact
						</Link>
					</div>
					<div className="flex items-center gap-4">
						<Link to="/seller/apply" className="hover:text-[#2563eb] transition-colors">
							Sell with us
						</Link>
					</div>
				</div>
			</div>

			{/* Main Navigation */}
			<header className="nav-modern bg-white border-b-2 border-gray-100">
				<div className="max-w-7xl mx-auto px-4">
					<div className="grid grid-cols-[1fr_auto_auto] h-28 items-center gap-8">
						{/* Brand - Use SVG logo */}
						<div ref={brandBlockRef} style={{ transform: `translateX(${brandTranslateX}px)` }} className="flex flex-col justify-center min-w-fit self-center md:justify-self-start md:self-center md:mt-0 md:pl-2">
							<Brand
								variant="header"
								className="justify-start"
								size={52}
								textClassName="text-3xl md:text-4xl lg:text-5xl"
							/>
						</div>

						{/* Search Bar - Enhanced Design */}
						<div className="hidden md:flex flex-1 max-w-5xl mx-0 self-center items-center gap-2 md:col-start-2 md:justify-self-start">
							<form onSubmit={handleSearch} className="flex-1">
								<div className="flex w-full items-center rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
									<select
										value={searchCategory}
										onChange={(e) => setSearchCategory(e.target.value)}
										className="h-12 lg:h-14 px-2 text-sm text-zinc-700 bg-transparent outline-none w-36 lg:w-40 border-r border-zinc-200"
										aria-label="Category"
									>
										<option value="">All</option>
										{CATEGORIES.map((c) => (
											<option key={c.slug} value={c.name}>{c.name}</option>
										))}
									</select>
									<input
										type="text"
										placeholder="Search active auctions..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="flex-1 h-12 lg:h-14 px-4 outline-none"
									/>
								</div>
							</form>
							<button 
								type="button"
								onClick={(e)=> handleSearch(e as unknown as React.FormEvent)}
								className="h-12 lg:h-14 px-4 lg:px-6 bg-[#E02020] text-white font-semibold rounded-xl hover:brightness-95 transition-all flex items-center gap-2"
							>
								<Search className="h-5 w-5" />
								<span className="hidden lg:inline">Search</span>
							</button>
						</div>

						{/* Right Actions */}
						<div className="flex items-center gap-2 self-center md:col-start-3 md:justify-self-end">
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