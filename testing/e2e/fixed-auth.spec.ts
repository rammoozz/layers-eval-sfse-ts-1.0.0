import { test, expect } from '@playwright/test';

test('profile page with manual token', async ({ page }) => {
  // Go to login page first
  await page.goto('/login');
  
  // Login normally
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for login to complete and token to be set
  await page.waitForTimeout(3000);
  
  // Now check if we can access profile
  await page.goto('/profile');
  await page.waitForTimeout(3000);
  
  // Take a screenshot to see what's happening
  await page.screenshot({ path: 'profile-debug.png', fullPage: true });
  
  // Check current URL
  const url = page.url();
  console.log(`Current URL: ${url}`);
  
  // Check if profile page loaded
  const h1Exists = await page.locator('h1:has-text("Profile")').isVisible().catch(() => false);
  console.log(`Profile h1 visible: ${h1Exists}`);
  
  if (h1Exists) {
    // Test profile functionality
    const editButton = await page.locator('button:has-text("Edit Profile")').isVisible().catch(() => false);
    console.log(`Edit button visible: ${editButton}`);
    
    // Test export controls
    const exportLabel = await page.locator('label:has-text("Export Data")').isVisible().catch(() => false);
    console.log(`Export label visible: ${exportLabel}`);
    
    const selectElement = await page.locator('select').isVisible().catch(() => false);
    console.log(`Select element visible: ${selectElement}`);
    
    const exportButton = await page.locator('button:has-text("Export Data")').isVisible().catch(() => false);
    console.log(`Export button visible: ${exportButton}`);
  } else {
    // Check what's actually on the page
    const allH1s = await page.locator('h1').all();
    console.log(`Found ${allH1s.length} h1 elements`);
    for (let i = 0; i < allH1s.length; i++) {
      const text = await allH1s[i].textContent();
      console.log(`H1 ${i}: "${text}"`);
    }
  }
});