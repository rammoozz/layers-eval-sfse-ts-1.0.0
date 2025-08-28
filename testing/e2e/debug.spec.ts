import { test, expect } from '@playwright/test';

test('debug page structure', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  
  // Login first
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for navigation
  await page.waitForURL('/');
  
  // Take screenshot
  await page.screenshot({ path: 'debug-after-login.png' });
  
  // Get all header buttons
  const headerButtons = await page.locator('header button').all();
  console.log(`Found ${headerButtons.length} buttons in header`);
  
  for (let i = 0; i < headerButtons.length; i++) {
    const button = headerButtons[i];
    const text = await button.textContent();
    const innerHTML = await button.innerHTML();
    console.log(`Button ${i}: text="${text}", innerHTML="${innerHTML}"`);
  }
  
  // Look for bell icons specifically
  const bellIcons = await page.locator('[data-lucide="bell"]').all();
  console.log(`Found ${bellIcons.length} bell icons`);
  
  const svgBells = await page.locator('svg[data-lucide="bell"]').all();
  console.log(`Found ${svgBells.length} svg bell icons`);
});