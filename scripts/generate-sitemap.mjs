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

// Include lot pages from demo data if available (best-effort)
try {
  const demoPath = new URL("../src/data/demo.ts", import.meta.url)
  const src = readFileSync(demoPath, "utf8")
  const ids = Array.from(src.matchAll(/id:\s*`([^`]+)`|id:\s*"([^"]+)"/g)).map(m => m[1] || m[2])
  const uniqueIds = Array.from(new Set(ids)).slice(0, 200)
  for (const id of uniqueIds) urls.push(`/product/${id}`)
} catch {}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${now}</lastmod><priority>0.7</priority></url>`).join("\n")}
</urlset>`;

mkdirSync("public", { recursive: true });
writeFileSync("public/sitemap.xml", xml);
console.log("Wrote public/sitemap.xml with", urls.length, "urls");
