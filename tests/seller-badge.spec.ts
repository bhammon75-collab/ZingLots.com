import { test, expect } from "@playwright/test";

test.skip("badge tooltip appears and link works", async ({ page }) => {
  await page.goto("/");
  const badge = page.getByTestId("seller-badge").first();
  await badge.focus();
  const link = page.getByRole("link", { name: /how we verify sellers/i });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/verify-sellers/);
});

