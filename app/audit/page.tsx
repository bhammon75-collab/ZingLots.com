import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "Audit — Temporary",
  robots: { index: false, follow: false },
};

const routes: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/makers", label: "Directory" },
  { href: "/regions", label: "Regions" },
  { href: "/about", label: "About" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
];

export default async function Audit() {
  return (
    <main className="prose mx-auto max-w-3xl p-8">
      <h1>ZingLots / Makers of Japan — Audit Jump Page</h1>
      <p>Server-rendered page for external review (temporary).</p>

      <h2>Key pages</h2>
      <ul>
        {routes.map((r) => (
          <li key={r.href}>
            <Link href={r.href} prefetch={false}>
              {r.label} <span className="text-sm opacity-70">({r.href})</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2>Meta</h2>
      <ul>
        <li><Link href="/robots.txt" prefetch={false}>robots.txt</Link></li>
        <li><Link href="/sitemap.xml" prefetch={false}>sitemap.xml</Link></li>
      </ul>

      <p className="text-sm opacity-70 mt-8">Remove this page after the audit.</p>
    </main>
  );
}
