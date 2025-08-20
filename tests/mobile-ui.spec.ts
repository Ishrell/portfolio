import { test, expect } from '@playwright/test';

// Simple mobile UI checks
// - Dock hidden on mobile
// - Hero actions stacked and full-width

test.beforeAll(async ({}, testInfo) => {
  // no-op
});

test.describe('Mobile UI', () => {
  test('dock hidden and hero actions stacked', async ({ page }) => {
    await page.goto('/');
    // Hero actions should be stacked (buttons width ~ viewport width)
    const explore = page.getByRole('link', { name: /explore projects/i });
    await expect(explore).toBeVisible();

    // Assume our CSS makes them block/100% width on mobile
    const width = await explore.evaluate((el) => el instanceof HTMLElement ? el.offsetWidth : 0);
    const vw = await page.evaluate(() => Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));
    expect(width).toBeGreaterThanOrEqual(vw * 0.85);

  // Dock should be hidden on mobile: check the Dock's Glass element inside the .dock wrapper
  // Dock was removed in favor of hamburger menu; assert it's absent
  await expect(page.locator('.dock')).toHaveCount(0);
  });
});
