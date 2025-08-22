import clsx from "clsx";
export default function Section({
  children, className = "", id,
}: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={clsx("py-12 md:py-16", className)}>
      <div className="container mx-auto max-w-7xl px-4">{children}</div>
    </section>
  );
}