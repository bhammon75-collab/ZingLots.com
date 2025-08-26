export default function TrustBelt(){
  const items = [
    { title: "Verified Auctioneers", desc: "vetted business sellers" },
    { title: "Secure Payments", desc: "escrow-ready, buyer protection" },
    { title: "Buyer Protection", desc: "clear dispute process" },
    { title: "Tax-ready Receipts", desc: "clean records for accounting" },
  ];
  return (
    <section className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-slate-900" aria-hidden />
            <div>
              <div className="text-sm font-semibold text-slate-900">{it.title}</div>
              <div className="text-sm text-slate-600">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}