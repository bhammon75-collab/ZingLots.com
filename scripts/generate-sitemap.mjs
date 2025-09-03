import { writeFileSync, mkdirSync } from "node:fs";
import { readFileSync } from "node:fs";

const SITE = process.env.VITE_SITE_URL || "https://www.zinglots.com";
const now = new Date().toISOString();

const urls = [
  "/",
  "/pricing",
  "/help",
  "/sellers",
  "/regions",
  "/categories",
];

// Include region pages (static list for now)
const regions = ["seattle", "tacoma", "los-angeles", "chicago"]
for (const r of regions) urls.push(`/r/${r}`)

// Fetch lot URLs from edge function (source of truth)
try {
  const fnUrl = process.env.VITE_SITE_URL ? `${process.env.VITE_SITE_URL}/functions/v1/sitemap-data` : 'http://localhost:54321/functions/v1/sitemap-data';
  const res = await fetch(fnUrl);
  if (res.ok) {
    const body = await res.json();
    const paths = Array.isArray(body?.paths) ? body.paths : [];
    for (const p of paths) urls.push(p.path);
  }
} catch {}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${now}</lastmod><priority>0.7</priority></url>`).join("\n")}
</urlset>`;

mkdirSync("public", { recursive: true });
writeFileSync("public/sitemap.xml", xml);
console.log("Wrote public/sitemap.xml with", urls.length, "urls");
