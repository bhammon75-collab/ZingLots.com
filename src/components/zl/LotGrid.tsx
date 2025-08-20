export default function LotGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-[var(--s-300)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}