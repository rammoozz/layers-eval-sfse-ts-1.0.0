import { test, expect } from '@playwright/test';
import { TestHelpers, ROUTES, SELECTORS } from '../utils/test-helpers';

test.describe('Real-time Notifications', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.setupAuthenticatedSession();
  });

  test('displays notification bell', async ({ page }) => {
    const bellButton = page.locator('header button').filter({ has: page.locator('svg.lucide-bell') });
    await expect(bellButton).toBeVisible();
    await expect(bellButton).toBeEnabled();
  });

  test('opens and closes notification dropdown', async ({ page }) => {
    await helpers.openNotificationDropdown();
    await expect(page.locator(SELECTORS.NOTIFICATION_DROPDOWN)).toBeVisible();
    
    await helpers.closeNotificationDropdown();
    await expect(page.locator(SELECTORS.NOTIFICATION_DROPDOWN)).not.toBeVisible();
  });

  test('shows empty state', async ({ page }) => {
    await helpers.openNotificationDropdown();
    await expect(page.locator('text=No notifications')).toBeVisible();
  });

  test('works across different pages', async ({ page }) => {
    const bellSelector = 'header button svg.lucide-bell';
    
    // Test on dashboard
    await page.click('nav a[href="/"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(bellSelector)).toBeVisible();
    
    // Test on profile
    await page.click('nav a[href="/profile"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(bellSelector)).toBeVisible();
    
    // Test on settings
    await page.click('nav a[href="/settings"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(bellSelector)).toBeVisible();
  });

  test('handles network issues gracefully', async ({ page, context }) => {
    await context.setOffline(true);
    
    // Should still be clickable
    await helpers.openNotificationDropdown();
    await expect(page.locator(SELECTORS.NOTIFICATION_DROPDOWN)).toBeVisible();
    
    await context.setOffline(false);
    
    // Should still work after reconnection
    await helpers.closeNotificationDropdown();
    await helpers.openNotificationDropdown();
    await expect(page.locator(SELECTORS.NOTIFICATION_DROPDOWN)).toBeVisible();
  });
});