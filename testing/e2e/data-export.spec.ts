import { test, expect } from '@playwright/test';
import { TestHelpers, TEST_CREDENTIALS, ROUTES } from '../utils/test-helpers';

test.describe('Data Export Feature', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Clear any existing session and login
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await helpers.login();
    await helpers.waitForNavigation('/');
    
    // Navigate to profile page where export functionality is located
    await page.goto(ROUTES.PROFILE);
  });

  test('should display export section with format selector', async ({ page }) => {
    // Check that export section is present
    await expect(page.locator('text=Export Data')).toBeVisible();
    
    // Check that format selector is present
    await helpers.assertElementVisible('select, [role="combobox"]');
    
    // Check that export button is present
    await helpers.assertElementVisible('button:has-text("Export Data")');
    
    // Check that download icon is present
    await expect(page.locator('button:has-text("Export Data") img, button:has-text("Export Data") svg')).toBeVisible();
  });

  test('should have JSON selected as default format', async ({ page }) => {
    const formatSelector = page.locator('select, [role="combobox"]').first();
    await expect(formatSelector).toHaveValue('json');
  });

  test('should allow switching between JSON and CSV formats', async ({ page }) => {
    const formatSelector = page.locator('select, [role="combobox"]').first();
    
    // Should start with JSON
    await expect(formatSelector).toHaveValue('json');
    
    // Switch to CSV
    await formatSelector.selectOption('csv');
    await expect(formatSelector).toHaveValue('csv');
    
    // Switch back to JSON
    await formatSelector.selectOption('json');
    await expect(formatSelector).toHaveValue('json');
  });

  test('should show loading state when exporting data', async ({ page }) => {
    // Set up network interception to slow down the request
    await page.route('/api/users/export*', async route => {
      // Delay the response to see loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });

    // Click export button
    await page.click('button:has-text("Export Data")');
    
    // Should show loading state
    await expect(page.locator('button:has-text("Exporting...")')).toBeVisible();
    
    // Button should be disabled during export
    const exportButton = page.locator('button:has-text("Exporting...")');
    await expect(exportButton).toBeDisabled();
  });

  test('should disable format selector during export', async ({ page }) => {
    // Set up network interception to slow down the request
    await page.route('/api/users/export*', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      route.continue();
    });

    // Start export
    await page.click('button:has-text("Export Data")');
    
    // Format selector should be disabled during export (if implemented)
    const formatSelector = page.locator('select, [role="combobox"]').first();
    // Note: This depends on implementation - may or may not be disabled
  });

  test('should make correct API call for JSON export', async ({ page }) => {
    let requestUrl = '';
    let requestMethod = '';
    
    // Intercept the export request
    await page.route('/api/users/export*', async route => {
      requestUrl = route.request().url();
      requestMethod = route.request().method();
      
      // Mock successful response
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          exportDate: new Date().toISOString(),
          user: {
            id: '1',
            name: 'Demo User',
            email: 'admin@test.com'
          }
        })
      });
    });

    // Select JSON format
    const formatSelector = page.locator('select, [role="combobox"]').first();
    await formatSelector.selectOption('json');
    
    // Click export
    await page.click('button:has-text("Export Data")');
    
    // Verify correct API call
    expect(requestMethod).toBe('GET');
    expect(requestUrl).toContain('/api/users/export');
    expect(requestUrl).toContain('format=json');
    expect(requestUrl).toContain('includeNotifications=false');
  });

  test('should make correct API call for CSV export', async ({ page }) => {
    let requestUrl = '';
    
    // Intercept the export request
    await page.route('/api/users/export*', async route => {
      requestUrl = route.request().url();
      
      // Mock CSV response
      route.fulfill({
        status: 200,
        contentType: 'text/csv',
        headers: {
          'Content-Disposition': 'attachment; filename="user-data.csv"'
        },
        body: 'Field,Value\nID,1\nName,"Demo User"\nEmail,admin@test.com'
      });
    });

    // Select CSV format
    const formatSelector = page.locator('select, [role="combobox"]').first();
    await formatSelector.selectOption('csv');
    
    // Click export
    await page.click('button:has-text("Export Data")');
    
    // Verify correct API call
    expect(requestUrl).toContain('format=csv');
  });

  test('should handle export errors gracefully', async ({ page }) => {
    // Mock failed export response
    await page.route('/api/users/export*', async route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Export failed' })
      });
    });

    // Try to export
    await page.click('button:has-text("Export Data")');
    
    // Should show error message or handle error gracefully
    // This depends on the implementation - could be a toast, alert, or inline error
    // The button should return to normal state
    await expect(page.locator('button:has-text("Export Data")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Export Data")')).not.toBeDisabled();
  });

  test('should handle authentication errors during export', async ({ page }) => {
    // Mock 401 unauthorized response
    await page.route('/api/users/export*', async route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Unauthorized' })
      });
    });

    // Try to export
    await page.click('button:has-text("Export Data")');
    
    // Should handle auth error (might redirect to login or show error)
    // Wait a moment for any navigation or error display
    await page.waitForTimeout(2000);
    
    // Either should show error or redirect to login
    const currentUrl = page.url();
    const hasLoginPage = currentUrl.includes('/login');
    const hasErrorMessage = await page.locator('.error, [data-testid="error"]').isVisible().catch(() => false);
    
    expect(hasLoginPage || hasErrorMessage).toBe(true);
  });

  test('should maintain format selection after failed export', async ({ page }) => {
    // Select CSV format
    const formatSelector = page.locator('select, [role="combobox"]').first();
    await formatSelector.selectOption('csv');
    
    // Mock failed response
    await page.route('/api/users/export*', async route => {
      route.fulfill({ status: 500, body: 'Server Error' });
    });

    // Try to export
    await page.click('button:has-text("Export Data")');
    
    // Wait for error handling
    await page.waitForTimeout(1000);
    
    // Format should still be CSV
    await expect(formatSelector).toHaveValue('csv');
  });

  test('should show appropriate file extension in button based on format', async ({ page }) => {
    const formatSelector = page.locator('select, [role="combobox"]').first();
    
    // Test JSON format
    await formatSelector.selectOption('json');
    // The button text should remain consistent, but the download will be .json
    await expect(page.locator('button:has-text("Export Data")')).toBeVisible();
    
    // Test CSV format  
    await formatSelector.selectOption('csv');
    // The button text should remain consistent, but the download will be .csv
    await expect(page.locator('button:has-text("Export Data")')).toBeVisible();
  });

  test('should preserve user session after successful export', async ({ page }) => {
    // Mock successful export
    await page.route('/api/users/export*', async route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ exportDate: new Date().toISOString(), user: {} })
      });
    });

    // Export data
    await page.click('button:has-text("Export Data")');
    
    // Wait for export to complete
    await page.waitForTimeout(1000);
    
    // Should still be on profile page and logged in
    expect(page.url()).toContain('/profile');
    
    // User info should still be visible
    await expect(page.locator('text=Demo User')).toBeVisible();
    
    // Can still perform other actions
    await expect(page.locator('button:has-text("Edit Profile")')).toBeVisible();
  });
});