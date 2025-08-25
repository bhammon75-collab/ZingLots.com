import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Simple route crawler for local preview. Expects 200s; follows redirects.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const BASE_URL = process.env.CRAWL_BASE_URL || 'http://localhost:4173';

function read(file) {
  try {
    return readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function extractRoutesFromApp() {
  const appTsx = read(path.join(repoRoot, 'src', 'App.tsx'));
  const routes = new Set();
  const routeRe = /<Route\s+[^>]*path=\{?\s*["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = routeRe.exec(appTsx))) {
    const p = m[1];
    if (p) routes.add(p);
  }
  // A few extra marketing routes that may be linked elsewhere
  return Array.from(routes).filter((r) => r && r !== '*');
}

function extractCategorySlugs() {
  const src = read(path.join(repoRoot, 'src', 'data', 'categories.ts'));
  const slugs = new Set();
  const slugRe = /slug:\s*["'`]([a-z0-9\-]+)["'`]/g;
  let m;
  while ((m = slugRe.exec(src))) slugs.add(m[1]);
  return Array.from(slugs);
}

function extractDemoLotIds(limit = 20) {
  const src = read(path.join(repoRoot, 'src', 'data', 'demo.ts'));
  const ids = Array.from(src.matchAll(/id:\s*`([^`]+)`|id:\s*"([^"]+)"/g)).map(
    (m) => m[1] || m[2]
  );
  return Array.from(new Set(ids)).slice(0, limit);
}

function extractRegionSlugs() {
  // Parse from ModernNav hardcoded links
  const nav = read(path.join(repoRoot, 'src', 'components', 'ModernNav.tsx'));
  const regions = new Set();
  const hrefRe = /to=\"\/r\/([^\"']+)\"/g;
  let m;
  while ((m = hrefRe.exec(nav))) regions.add(m[1]);
  // Fallback common regions
  const fallback = [
    'seattle', 'tacoma', 'portland', 'los-angeles', 'san-francisco',
    'chicago', 'detroit', 'new-york', 'boston', 'houston', 'dallas', 'atlanta',
  ];
  for (const f of fallback) regions.add(f);
  return Array.from(regions);
}

function expandTemplates(templates) {
  const categories = extractCategorySlugs();
  const lotIds = extractDemoLotIds();
  const regions = extractRegionSlugs();

  const out = new Set();
  for (const t of templates) {
    if (!t.includes(':')) {
      out.add(t);
      continue;
    }
    // Region
    if (t.includes(':region')) {
      for (const r of regions) out.add(t.replace(':region', r));
      continue;
    }
    // Category slug
    if (t.includes(':slug')) {
      const source = categories.length ? categories : ['construction-materials'];
      for (const s of source) out.add(t.replace(':slug', s));
      continue;
    }
    // Lot/product id
    if (/:id(\b|\/)/.test(t)) {
      const source = lotIds.length ? lotIds : ['lot-1', 'lot-2'];
      for (const id of source) out.add(t.replace(':id', id));
      continue;
    }
    if (t.includes(':lotId')) {
      out.add(t.replace(':lotId', lotIds[0] || 'lot-1'));
      continue;
    }
    // Generic fallback
    out.add(t.replace(/:[^/]+/g, 'test'));
  }
  return Array.from(out);
}

async function crawl(paths) {
  const results = [];
  const headers = { 'User-Agent': 'route-crawler/1.0 (+local)' };
  for (const p of paths) {
    const url = `${BASE_URL}${p}`;
    try {
      const res = await fetch(url, { redirect: 'follow', headers });
      results.push({ path: p, status: res.status, ok: res.ok });
    } catch (err) {
      results.push({ path: p, status: 0, ok: false, err: String(err) });
    }
  }
  return results;
}

async function main() {
  const templates = extractRoutesFromApp();
  const paths = expandTemplates(templates);
  // Include a few additional marketing/legacy paths if present
  const extras = ['/', '/discover', '/pricing', '/help', '/categories'];
  for (const e of extras) if (!paths.includes(e)) paths.push(e);

  console.log('Crawling', paths.length, 'routes against', BASE_URL);
  const results = await crawl(paths);
  const bad = results.filter((r) => !r.ok);
  for (const r of results) {
    const mark = r.ok ? 'OK ' : 'BAD';
    console.log(mark.padEnd(4), r.status.toString().padEnd(3), r.path);
  }
  if (bad.length) {
    console.error(`\nFailed ${bad.length} routes`);
    process.exitCode = 1;
  } else {
    console.log('\nAll routes returned 200-range responses');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

