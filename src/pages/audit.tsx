import Head from "next/head";
import Link from "next/link";

export async function getServerSideProps() {
  return { props: {} }; // force SSR (no client JS required)
}

export default function Audit() {
  const routes = [
    { href: "/", label: "Home" },
    { href: "/makers", label: "Directory" },
    { href: "/regions", label: "Regions" },
    { href: "/about", label: "About" },
    { href: "/legal/disclaimer", label: "Disclaimer" },
    { href: "/legal/terms", label: "Terms" },
    { href: "/legal/privacy", label: "Privacy" },
    { href: "/robots.txt", label: "robots.txt" },
    { href: "/sitemap.xml", label: "sitemap.xml" },
  ];
  return (
    <>
      <Head>
        <title>Audit — Temporary</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main style={{ maxWidth: 820, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1>ZingLots / Makers of Japan — Audit Jump Page</h1>
        <p>Server-rendered page for external review (temporary).</p>

        <h2>Key pages</h2>
        <ul>
          {routes.map((r) => (
            <li key={r.href}>
              <Link href={r.href}>{r.label} <span style={{ opacity: 0.7 }}>({r.href})</span></Link>
            </li>
          ))}
        </ul>

        <p style={{ opacity: 0.7, marginTop: 32 }}>Remove this page after the audit.</p>
      </main>
    </>
  );
}
