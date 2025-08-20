export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-screen-2xl h-16 px-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          {/* Full wordmark; scales crisply on retina */}
          <img
            src="/brand/zinglots-wordmark.svg"
            alt="ZingLots"
            className="h-8 w-auto"
            height={32}
          />
        </a>

        <nav className="hidden md:flex items-center gap-6 text-[15px]">
          <a href="/discover" className="hover:opacity-80">Discover</a>
          <a href="/pricing" className="hover:opacity-80">Pricing</a>
          <a href="/help" className="hover:opacity-80">Help & Contact</a>
          <a href="/seller/apply" className="ml-2 rounded-full bg-brand-primary px-4 py-2 text-white hover:bg-brand-dark transition">
            Start Selling
          </a>
        </nav>
      </div>
    </header>
  );
}