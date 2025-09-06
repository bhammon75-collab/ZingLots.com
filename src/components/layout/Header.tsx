import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = false }: HeaderProps) {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          ZingLots.com
        </Link>

        {/* Center: Search (optional, home only) */}
        {showSearch && (
          <div className="mx-6 flex-1 max-w-lg">
            <input
              type="search"
              placeholder="Search auctions..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Right: Nav + Auth + CTA */}
        <div className="flex items-center gap-3">
          <Link to="/about" className="text-sm text-gray-700 hover:text-gray-900">About</Link>
          <Link to="/help" className="text-sm text-gray-700 hover:text-gray-900">Help</Link>
          <Link to="/legal/disputes" className="text-sm text-gray-700 hover:text-gray-900">Disputes</Link>
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/seller/apply">
            <Button className="bg-red-600 text-white hover:bg-red-700">Start Selling</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}