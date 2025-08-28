import { test, expect } from '@playwright/test';

test('debug profile page', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  
  // Login first
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for navigation
  await page.waitForURL('/');
  
  // Go to profile
  await page.goto('/profile');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'debug-profile-page.png' });
  
  // Check if profile page loaded
  const h1Elements = await page.locator('h1').all();
  console.log(`Found ${h1Elements.length} h1 elements`);
  for (let i = 0; i < h1Elements.length; i++) {
    const text = await h1Elements[i].textContent();
    console.log(`H1 ${i}: "${text}"`);
  }
  
  // Get all buttons on the page
  const allButtons = await page.locator('button').all();
  console.log(`Found ${allButtons.length} buttons on profile page`);
  
  for (let i = 0; i < allButtons.length; i++) {
    const button = allButtons[i];
    const text = await button.textContent();
    console.log(`Button ${i}: "${text}"`);
  }
  
  // Check for export-related text
  const exportTexts = await page.locator('text*="Export"').all();
  console.log(`Found ${exportTexts.length} export-related elements`);
  for (let i = 0; i < exportTexts.length; i++) {
    const text = await exportTexts[i].textContent();
    console.log(`Export text ${i}: "${text}"`);
  }
});