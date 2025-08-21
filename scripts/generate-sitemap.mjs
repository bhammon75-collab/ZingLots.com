import { writeFileSync, mkdirSync } from "node:fs";

const SITE = process.env.VITE_SITE_URL || "https://www.zinglots.com";
const now = new Date().toISOString();

const urls = [
  "/",
  "/auctions",
  "/discover",
  "/pricing",
  "/help",
  "/sellers",
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${now}</lastmod><priority>0.7</priority></url>`).join("\n")}
</urlset>`;

mkdirSync("public", { recursive: true });
writeFileSync("public/sitemap.xml", xml);
console.log("Wrote public/sitemap.xml with", urls.length, "urls");
