import { test, expect } from '@playwright/test';

test('test different login credentials', async ({ page }) => {
  const credentials = [
    { email: 'admin@test.com', password: 'password123' },
    { email: 'demo@test.com', password: 'password123' },
    { email: 'user@test.com', password: 'password123' },
    { email: 'admin@test.com', password: 'admin123' }
  ];
  
  for (const cred of credentials) {
    console.log(`\nTrying: ${cred.email} / ${cred.password}`);
    
    let apiResponse: any = null;
    await page.route('**/api/auth/login', async (route) => {
      const response = await route.fetch();
      apiResponse = await response.json();
      route.continue();
    });
    
    await page.goto('/login');
    await page.fill('input[type="email"]', cred.email);
    await page.fill('input[type="password"]', cred.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    console.log(`Response:`, apiResponse?.success ? 'SUCCESS' : `FAILED - ${apiResponse?.message}`);
    
    if (apiResponse?.success) {
      console.log('Found working credentials!');
      break;
    }
  }
});