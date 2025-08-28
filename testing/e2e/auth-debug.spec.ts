import { test, expect } from '@playwright/test';

test('debug auth flow', async ({ page }) => {
  console.log('Going to login page...');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('networkidle');
  
  console.log('Filling login form...');
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'password123');
  
  console.log('Clicking submit...');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for navigation...');
  await page.waitForTimeout(5000);
  
  const currentUrl = page.url();
  console.log(`Current URL after login: ${currentUrl}`);
  
  // Check if we're authenticated
  const userNameElement = page.locator('header span:has-text("Demo User")');
  const isUserVisible = await userNameElement.isVisible().catch(() => false);
  console.log(`User name visible in header: ${isUserVisible}`);
  
  if (!isUserVisible) {
    console.log('Authentication failed, checking for error messages...');
    const errorElements = await page.locator('.error, [role="alert"], .text-red-500, .text-red-600').all();
    for (let i = 0; i < errorElements.length; i++) {
      const text = await errorElements[i].textContent();
      console.log(`Error ${i}: "${text}"`);
    }
    
    // Check if still on login page
    const loginButton = await page.locator('button[type="submit"]').isVisible();
    console.log(`Still on login page: ${loginButton}`);
  }
  
  console.log('Now trying to go to profile...');
  await page.goto('/profile');
  await page.waitForTimeout(3000);
  
  const profileUrl = page.url();
  console.log(`Profile URL: ${profileUrl}`);
  
  const h1Elements = await page.locator('h1').all();
  console.log(`H1 elements on profile page: ${h1Elements.length}`);
  
  for (let i = 0; i < h1Elements.length; i++) {
    const text = await h1Elements[i].textContent();
    console.log(`H1 ${i}: "${text}"`);
  }
  
  await page.screenshot({ path: 'auth-debug.png', fullPage: true });
});