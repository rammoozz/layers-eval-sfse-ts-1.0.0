import { test, expect } from '@playwright/test';

test.describe('Working Auth Flow', () => {
  test('login and navigate to profile', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Click sign in
    await page.click('button:has-text("Sign In")');
    
    // Wait for dashboard to load
    await page.waitForURL('/');
    await page.waitForSelector('text=Dashboard');
    
    // Verify we're logged in by checking for user name
    await expect(page.locator('header:has-text("Demo User")')).toBeVisible();
    
    // Now navigate to profile using the link
    await page.click('nav a[href="/profile"]');
    
    // Wait for profile page to load
    await page.waitForURL('/profile');
    
    // Now test all the profile elements
    await expect(page.locator('h1:has-text("Profile")')).toBeVisible();
    await expect(page.locator('button:has-text("Edit Profile")')).toBeVisible();
    await expect(page.locator('text=Export Data').first()).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('button:has-text("Export Data")')).toBeVisible();
  });

  test('profile editing works', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('/');
    
    // Go to profile
    await page.click('nav a[href="/profile"]');
    await page.waitForURL('/profile');
    
    // Click Edit Profile
    await page.click('button:has-text("Edit Profile")');
    
    // Check form appears
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Your email"]')).toBeVisible();
    
    // Fill form
    await page.fill('input[placeholder="Your name"]', 'Test User');
    await page.fill('input[placeholder="Your email"]', 'test@example.com');
    
    // Cancel should reset
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('form')).not.toBeVisible();
    
    // Edit again
    await page.click('button:has-text("Edit Profile")');
    await expect(page.locator('input[placeholder="Your name"]')).toHaveValue('Demo User');
  });

  test('export functionality', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('/');
    
    // Go to profile
    await page.click('nav a[href="/profile"]');
    await page.waitForURL('/profile');
    
    // Test export controls
    const select = page.locator('select');
    await expect(select).toHaveValue('json');
    
    // Change format
    await select.selectOption('csv');
    await expect(select).toHaveValue('csv');
    
    // Export button should be clickable
    await expect(page.locator('button:has-text("Export Data")')).toBeEnabled();
  });

  test('notifications work', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('/');
    
    // Find notification bell (it's a button with Bell icon)
    const bellButton = page.locator('header button').filter({ has: page.locator('svg') }).first();
    await expect(bellButton).toBeVisible();
    
    // Click to open dropdown
    await bellButton.click();
    
    // Check dropdown appears
    await expect(page.locator('h3:has-text("Notifications")')).toBeVisible();
    await expect(page.locator('text=No notifications')).toBeVisible();
    
    // Click outside to close
    await page.click('main');
    await expect(page.locator('h3:has-text("Notifications")')).not.toBeVisible();
  });
});