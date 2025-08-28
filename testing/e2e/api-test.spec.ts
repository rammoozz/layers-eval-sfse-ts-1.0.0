import { test, expect } from '@playwright/test';

test('test login API directly', async ({ page }) => {
  // Intercept API calls to see what's happening
  let loginResponse: any = null;
  
  await page.route('**/api/auth/login', async (route) => {
    const response = await route.fetch();
    loginResponse = await response.json();
    console.log('Login API Response:', JSON.stringify(loginResponse, null, 2));
    route.continue();
  });
  
  // Go to login page
  await page.goto('/login');
  
  // Fill and submit login form
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for API call
  await page.waitForTimeout(2000);
  
  console.log('Login successful?', loginResponse?.success);
  
  // Check localStorage for token
  const token = await page.evaluate(() => localStorage.getItem('token'));
  console.log('Token in localStorage:', token ? 'YES' : 'NO');
  
  // Try to access profile directly
  await page.goto('/profile');
  await page.waitForTimeout(2000);
  
  console.log('Final URL:', page.url());
});