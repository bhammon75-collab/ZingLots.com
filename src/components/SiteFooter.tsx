export default function SiteFooter(){
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="text-sm text-slate-700">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            <li><a className="hover:underline" href="/help#buyer-protection">Buyer Protection</a></li>
            <li>·</li>
            <li><a className="hover:underline" href="/help#payments-escrow">Secure Payments / Escrow</a></li>
            <li>·</li>
            <li><a className="hover:underline" href="/help#logistics-guidance">Logistics & Handoff Guidance</a></li>
            <li>·</li>
            <li><a className="hover:underline" href="/help#inspection-condition">Inspection & Condition</a></li>
            <li>·</li>
            <li><a className="hover:underline" href="/help#disputes">Disputes & Support</a></li>
          </ul>
        </nav>
        <div className="mt-4 text-xs text-slate-500">© {new Date().getFullYear()} ZingLots</div>
      </div>
    </footer>
  );
}