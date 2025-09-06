import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 text-sm text-gray-600">
        <nav className="flex flex-wrap items-center gap-4 justify-center">
          <Link to="/pricing" className="hover:text-gray-900">Pricing</Link>
          <span className="text-gray-300">|</span>
          <Link to="/help" className="hover:text-gray-900">Help & Contact</Link>
          <span className="text-gray-300">|</span>
          <Link to="/legal/disputes" className="hover:text-gray-900">Disputes</Link>
          <span className="text-gray-300">|</span>
          <Link to="/legal/terms" className="hover:text-gray-900">Terms</Link>
          <span className="text-gray-300">|</span>
          <Link to="/legal/privacy" className="hover:text-gray-900">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}

