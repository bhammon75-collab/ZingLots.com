#!/usr/bin/env node
// Fetch representative images from Pexels for each top-level category
// Saves to public/categories/<slug>.jpg

import fs from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error("Missing PEXELS_API_KEY. Add it to your environment or .env file.");
  process.exit(1);
}

const OUTPUT_DIR = path.resolve("public", "categories");

// Final top-level categories with Pexels search queries
const CATEGORY_QUERIES = [
  { slug: "construction-trades", query: "construction site materials tools industrial" },
  { slug: "restaurant-food-service", query: "commercial kitchen equipment stainless" },
  { slug: "office-admin", query: "office furniture desks chairs workspace" },
  { slug: "it-networking", query: "server rack networking equipment data center" },
  { slug: "warehousing-material-handling", query: "warehouse pallet racking forklift pallet jack" },
  { slug: "packaging-fulfillment", query: "packaging equipment conveyor boxes fulfillment center" },
  { slug: "printing-signage-promo", query: "large format printer signage printing press" },
  { slug: "event-av-creative", query: "audio visual equipment stage lighting event" },
  { slug: "manufacturing-industrial", query: "industrial machinery manufacturing factory equipment" },
  { slug: "metalworking-fabrication", query: "metalworking welding fabrication workshop" },
  { slug: "woodworking", query: "woodworking workshop tools sawdust" },
  { slug: "auto-service", query: "auto repair shop tools car lift" },
  { slug: "landscaping-grounds", query: "landscaping equipment groundskeeping lawn mower" },
  { slug: "cleaning-janitorial", query: "commercial cleaning janitorial equipment floor scrubber" },
  { slug: "security-cash-handling", query: "security cameras cash handling safe cash register" },
  { slug: "hospitality-lodging-ffe", query: "hotel furniture hospitality room" },
  { slug: "retail-pos", query: "retail store pos system checkout counter" },
  { slug: "vending-kiosks", query: "vending machine kiosk" },
];

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pexels API error ${res.status}: ${text}`);
  }
  return res.json();
}

async function downloadToFile(url, filePath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buf);
}

async function selectPhotoSrc(photo) {
  if (!photo || !photo.src) return null;
  // Prefer landscape -> large -> original
  return (
    photo.src.landscape ||
    photo.src.large2x ||
    photo.src.large ||
    photo.src.original ||
    null
  );
}

async function run() {
  await ensureDir(OUTPUT_DIR);
  let success = 0;
  let failures = 0;

  for (const { slug, query } of CATEGORY_QUERIES) {
    const searchUrl = new URL("https://api.pexels.com/v1/search");
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("per_page", "5");
    searchUrl.searchParams.set("orientation", "landscape");

    try {
      const data = await fetchJson(searchUrl.toString());
      const first = (data.photos || [])[0];
      const imageUrl = await selectPhotoSrc(first);
      if (!imageUrl) throw new Error("No suitable image src returned");

      const outPath = path.join(OUTPUT_DIR, `${slug}.jpg`);
      await downloadToFile(imageUrl, outPath);
      console.log(`Saved: ${slug}.jpg from "${query}"`);
      success++;
    } catch (err) {
      console.error(`Failed: ${slug} (${query}) -> ${err?.message || err}`);
      failures++;
    }
  }

  console.log(`\nCompleted. ${success} saved, ${failures} failed.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

