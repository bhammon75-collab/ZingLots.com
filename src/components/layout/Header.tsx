import Logo from "@/components/brand/Logo";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-screen-2xl h-16 px-4 flex items-center justify-between">
        <Link to="/" aria-label="Go to home" className="inline-flex">
          <Logo size="md" withText onDark={false} />
        </Link>

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