import { test, expect } from '@playwright/test';
import { TestHelpers, ROUTES, SELECTORS } from '../utils/test-helpers';

test.describe('New Features Integration', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.setupAuthenticatedSession();
    await page.goto(ROUTES.PROFILE);
  });

  test('all new features are available', async ({ page }) => {
    // Profile editing
    await helpers.assertElementVisible(SELECTORS.EDIT_PROFILE_BUTTON);
    
    // Data export
    await helpers.assertElementVisible(SELECTORS.EXPORT_BUTTON);
    await helpers.assertElementVisible(SELECTORS.EXPORT_FORMAT_SELECT);
    
    // Notifications
    await helpers.assertElementVisible(SELECTORS.NOTIFICATION_BELL);
  });

  test('features work together', async ({ page }) => {
    // Start profile editing
    await helpers.startProfileEditing();
    
    // Check notifications still work
    await helpers.openNotificationDropdown();
    await expect(page.locator(SELECTORS.NOTIFICATION_DROPDOWN)).toBeVisible();
    
    // Close notifications and continue editing
    await helpers.closeNotificationDropdown();
    await expect(page.locator(SELECTORS.PROFILE_FORM)).toBeVisible();
    
    // Cancel editing
    await helpers.cancelProfileEditing();
    
    // Export should still work
    await helpers.mockExportResponse('json', true);
    await helpers.startDataExport();
    await helpers.waitForLoadingToComplete();
    
    // Everything should be functional
    await helpers.assertElementVisible(SELECTORS.EDIT_PROFILE_BUTTON);
    await helpers.assertElementVisible(SELECTORS.EXPORT_BUTTON);
  });

  test('maintains session across features', async ({ page }) => {
    const checkSession = async () => {
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
    };
    
    await checkSession();
    
    // Use profile editing
    await helpers.startProfileEditing();
    await helpers.cancelProfileEditing();
    await checkSession();
    
    // Use notifications
    await helpers.openNotificationDropdown();
    await helpers.closeNotificationDropdown();
    await checkSession();
    
    // Use export
    await helpers.mockExportResponse('json', true);
    await helpers.startDataExport();
    await helpers.waitForLoadingToComplete();
    await checkSession();
  });

  test('responsive design works', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await helpers.assertElementVisible(SELECTORS.EDIT_PROFILE_BUTTON);
    await helpers.assertElementVisible(SELECTORS.NOTIFICATION_BELL);
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await helpers.assertElementVisible(SELECTORS.NOTIFICATION_BELL);
    
    // Notifications should still work on mobile
    await helpers.openNotificationDropdown();
    await expect(page.locator(SELECTORS.NOTIFICATION_DROPDOWN)).toBeVisible();
  });
});