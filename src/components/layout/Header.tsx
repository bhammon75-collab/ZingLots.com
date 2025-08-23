import Brand from "../Brand";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Header() {
	const location = useLocation();
	if (location.pathname === "/") return null;
	return (
		<header className="relative bg-white">
			<div className="mx-auto max-w-screen-2xl h-16 px-4 flex items-center justify-between">
				<Brand variant="header" className="shrink-0" />

				<nav className="hidden md:flex items-center gap-6 text-[15px]">
					<NavLink to="/discover" className="hover:opacity-80">Discover</NavLink>
					<NavLink to="/pricing" className="hover:opacity-80">Pricing</NavLink>
					<NavLink to="/help" className="hover:opacity-80">Help & Contact</NavLink>
					<NavLink to="/seller/apply" className="ml-2 rounded-full bg-brand-primary px-4 py-2 text-white hover:bg-brand-dark transition">
						Start Selling
					</NavLink>
				</nav>
			</div>
		</header>
	);
}