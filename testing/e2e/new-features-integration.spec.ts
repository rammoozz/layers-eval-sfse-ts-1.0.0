import { test, expect } from '@playwright/test';
import { TestHelpers, TEST_CREDENTIALS, ROUTES } from '../utils/test-helpers';

test.describe('New Features Integration Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Clear any existing session and login
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await helpers.login();
    await helpers.waitForNavigation('/');
  });

  test('should have all new features available after login', async ({ page }) => {
    // Check that all new features are accessible
    await page.goto(ROUTES.PROFILE);
    
    // Profile editing should be available
    await helpers.assertElementVisible('button:has-text("Edit Profile")');
    
    // Data export should be available
    await helpers.assertElementVisible('button:has-text("Export Data")');
    await helpers.assertElementVisible('select, [role="combobox"]');
    
    // Notification bell should be in header
    await helpers.assertElementVisible('header button:has([data-lucide="bell"])');
  });

  test('should allow user to edit profile and then export data', async ({ page }) => {
    await page.goto(ROUTES.PROFILE);
    
    // Step 1: Edit profile
    await helpers.startProfileEditing();
    await helpers.fillProfileForm('Updated User', 'updated@test.com');
    
    // Mock successful profile update
    await page.route('/api/users/profile', async route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: '1', name: 'Updated User', email: 'updated@test.com' }
        })
      });
    });
    
    await helpers.saveProfile();
    await helpers.waitForLoadingToComplete();
    
    // Step 2: Export the updated data
    await helpers.mockExportResponse('json', true);
    await helpers.selectExportFormat('json');
    await helpers.startDataExport();
    
    // Should complete successfully
    await helpers.waitForLoadingToComplete();
  });

  test('should show notifications while using other features', async ({ page }) => {
    await page.goto(ROUTES.PROFILE);
    
    // Start profile editing
    await helpers.startProfileEditing();
    
    // Open notifications while form is open
    await helpers.openNotificationDropdown();
    
    // Should show notifications dropdown without interfering with form
    await expect(page.locator('text=Notifications')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    
    // Close notifications
    await helpers.closeNotificationDropdown();
    
    // Form should still be active
    await expect(page.locator('form')).toBeVisible();
    
    // Cancel editing
    await helpers.cancelProfileEditing();
  });

  test('should maintain notification state during data export', async ({ page }) => {
    await page.goto(ROUTES.PROFILE);
    
    // Open notifications first
    await helpers.openNotificationDropdown();
    await expect(page.locator('text=Notifications')).toBeVisible();
    
    // Close dropdown
    await helpers.closeNotificationDropdown();
    
    // Start data export
    await helpers.mockExportResponse('csv', true);
    await helpers.selectExportFormat('csv');
    await helpers.startDataExport();
    
    await helpers.waitForLoadingToComplete();
    
    // Notification bell should still work after export
    await helpers.openNotificationDropdown();
    await expect(page.locator('text=Notifications')).toBeVisible();
  });

  test('should handle errors gracefully across all features', async ({ page }) => {
    await page.goto(ROUTES.PROFILE);
    
    // Test profile edit error
    await helpers.startProfileEditing();
    await helpers.fillProfileForm('Test User', 'test@test.com');
    
    // Mock profile update error
    await page.route('/api/users/profile', async route => {
      route.fulfill({ status: 500, body: 'Server Error' });
    });
    
    await helpers.saveProfile();
    await helpers.waitForLoadingToComplete();
    
    // Should handle error gracefully
    await expect(page.locator('button:has-text("Edit Profile"), button:has-text("Save Changes")')).toBeVisible();
    
    // Cancel editing
    await helpers.cancelProfileEditing();
    
    // Test export error
    await helpers.mockExportResponse('json', false);
    await helpers.startDataExport();
    await helpers.waitForLoadingToComplete();
    
    // Should handle export error gracefully
    await expect(page.locator('button:has-text("Export Data")')).toBeVisible();
    await expect(page.locator('button:has-text("Export Data")')).not.toBeDisabled();
    
    // Notifications should still work after errors
    await helpers.openNotificationDropdown();
    await expect(page.locator('text=Notifications')).toBeVisible();
  });

  test('should work correctly on different screen sizes', async ({ page }) => {
    // Test on desktop size
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(ROUTES.PROFILE);
    
    // All features should be visible
    await helpers.assertElementVisible('button:has-text("Edit Profile")');
    await helpers.assertElementVisible('button:has-text("Export Data")');
    await helpers.assertElementVisible('header button:has([data-lucide="bell"])');
    
    // Test on tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Features should still be accessible
    await helpers.assertElementVisible('button:has-text("Edit Profile")');
    await helpers.assertElementVisible('button:has-text("Export Data")');
    await helpers.assertElementVisible('header button:has([data-lucide="bell"])');
    
    // Test notification dropdown on smaller screen
    await helpers.openNotificationDropdown();
    await expect(page.locator('text=Notifications')).toBeVisible();
    
    // Test on mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Core functionality should still work
    await helpers.assertElementVisible('header button:has([data-lucide="bell"])');
    
    // Navigation should work
    const bellButton = page.locator('header button').first();
    await bellButton.click();
    await expect(page.locator('text=Notifications')).toBeVisible();
  });

  test('should preserve user session across all features', async ({ page }) => {
    // Verify initial login state
    const initialToken = await page.evaluate(() => localStorage.getItem('token'));
    expect(initialToken).toBeTruthy();
    
    await page.goto(ROUTES.PROFILE);
    
    // Use profile editing
    await helpers.startProfileEditing();
    await helpers.cancelProfileEditing();
    
    // Check session is maintained
    let token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // Use data export
    await helpers.mockExportResponse('json', true);
    await helpers.startDataExport();
    await helpers.waitForLoadingToComplete();
    
    // Check session is maintained
    token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // Use notifications
    await helpers.openNotificationDropdown();
    await helpers.closeNotificationDropdown();
    
    // Check session is maintained
    token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // Navigate to other pages
    await page.goto('/');
    await page.goto(ROUTES.SETTINGS);
    await page.goto(ROUTES.PROFILE);
    
    // Session should still be valid
    token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // User should still be logged in
    await expect(page.locator('text=Demo User, text=Updated User')).toBeVisible();
  });

  test('should handle concurrent operations', async ({ page }) => {
    await page.goto(ROUTES.PROFILE);
    
    // Start profile editing
    await helpers.startProfileEditing();
    
    // While form is open, try to open notifications
    await helpers.openNotificationDropdown();
    await expect(page.locator('text=Notifications')).toBeVisible();
    
    // Try to interact with export while form is open and notifications are visible
    const exportButton = page.locator('button:has-text("Export Data")');
    await expect(exportButton).toBeVisible();
    
    // Close notifications
    await helpers.closeNotificationDropdown();
    
    // Complete profile editing
    await helpers.fillProfileForm('Concurrent Test User', 'concurrent@test.com');
    
    // Mock successful update
    await page.route('/api/users/profile', async route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: '1', name: 'Concurrent Test User', email: 'concurrent@test.com' }
        })
      });
    });
    
    await helpers.saveProfile();
    await helpers.waitForLoadingToComplete();
    
    // Now try export
    await helpers.mockExportResponse('json', true);
    await helpers.startDataExport();
    await helpers.waitForLoadingToComplete();
    
    // Everything should work without conflicts
    await expect(page.locator('button:has-text("Edit Profile")')).toBeVisible();
    await expect(page.locator('button:has-text("Export Data")')).toBeVisible();
  });

  test('should maintain accessibility standards', async ({ page }) => {
    await page.goto(ROUTES.PROFILE);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate to interactive elements
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'SELECT', 'A'].includes(focusedElement || '')).toBe(true);
    
    // Test that buttons have appropriate labels or text
    const editButton = page.locator('button:has-text("Edit Profile")');
    await expect(editButton).toBeVisible();
    
    const exportButton = page.locator('button:has-text("Export Data")');
    await expect(exportButton).toBeVisible();
    
    const notificationBell = page.locator('header button').first();
    await expect(notificationBell).toBeVisible();
    
    // Test form accessibility
    await helpers.startProfileEditing();
    
    const nameInput = page.locator('input[placeholder="Your name"]');
    const emailInput = page.locator('input[placeholder="Your email"]');
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    
    // Inputs should have proper labeling
    await expect(page.locator('text=Name')).toBeVisible();
    await expect(page.locator('text=Email')).toBeVisible();
  });
});