type City = { id:string; name:string; count:number; href:string };

export default function Locations({ cities = [] as City[] }){
  if (!cities.length) return null;
  return (
    <section className="py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Auctions by Location</h2>
          <a href="/regions" className="text-slate-900 hover:underline">View all regions</a>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {cities.map((c) => (
            <a key={c.id} href={c.href} className="rounded-lg border p-3 hover:bg-slate-50">
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-slate-600">{c.count} auctions</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}