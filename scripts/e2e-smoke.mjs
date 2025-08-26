// Minimal E2E smoke using Playwright (if available) or puppeteer-like fallback via playwright-core
// Flow: open home -> navigate to a category -> open first product -> go back

import { chromium } from 'playwright';

const BASE_URL = process.env.CRAWL_BASE_URL || 'http://localhost:4173';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  // Click Categories link or go directly to categories page if not visible
  const categoriesUrl = `${BASE_URL}/categories`;
  try {
    await page.getByRole('link', { name: /categories/i }).first().click();
  } catch {
    await page.goto(categoriesUrl, { waitUntil: 'networkidle' });
  }
  // Click first category card -> route is /category/:slug
  const firstCategoryLink = page.locator('a[href^="/category/"]').first();
  const hasCat = await firstCategoryLink.count();
  if (hasCat === 0) throw new Error('No category links found');
  await firstCategoryLink.click();
  await page.waitForLoadState('networkidle');

  // Click first product (links to /product/:id)
  const firstProduct = page.locator('a[href^="/product/"]').first();
  const hasProduct = await firstProduct.count();
  if (hasProduct === 0) throw new Error('No product links found');
  await firstProduct.click();
  await page.waitForLoadState('networkidle');

  // Navigate back
  await page.goBack({ waitUntil: 'networkidle' });

  await browser.close();
  console.log('E2E smoke flow passed');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

