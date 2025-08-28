import { test, expect } from '@playwright/test';
import { TestHelpers, ROUTES, SELECTORS } from '../utils/test-helpers';

test.describe('Data Export Feature', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.setupAuthenticatedSession();
    
    // Navigate to profile using nav link
    await page.click('nav a[href="/profile"]');
    await page.waitForURL('/profile');
  });

  test('displays export controls', async ({ page }) => {
    await expect(page.locator('label:has-text("Export Data")')).toBeVisible();
    await helpers.assertElementVisible(SELECTORS.EXPORT_FORMAT_SELECT);
    await helpers.assertElementVisible(SELECTORS.EXPORT_BUTTON);
  });

  test('switches between formats', async ({ page }) => {
    const formatSelector = page.locator(SELECTORS.EXPORT_FORMAT_SELECT);
    
    await expect(formatSelector).toHaveValue('json');
    await helpers.selectExportFormat('csv');
    await expect(formatSelector).toHaveValue('csv');
  });

  test('exports data with loading state', async ({ page }) => {
    await helpers.mockExportResponse('json', true);
    await helpers.startDataExport();
    
    // Should show loading state
    await expect(page.locator(SELECTORS.EXPORT_LOADING)).toBeVisible();
    await helpers.waitForLoadingToComplete();
    
    // Should return to normal state
    await expect(page.locator(SELECTORS.EXPORT_BUTTON)).toBeVisible();
  });

  test('handles export errors gracefully', async ({ page }) => {
    await helpers.mockExportResponse('json', false);
    await helpers.startDataExport();
    await helpers.waitForLoadingToComplete();
    
    // Should show button again (not stuck in loading)
    await expect(page.locator(SELECTORS.EXPORT_BUTTON)).toBeVisible();
    await expect(page.locator(SELECTORS.EXPORT_BUTTON)).not.toBeDisabled();
  });

  test('makes correct API calls', async ({ page }) => {
    let requestUrl = '';
    let apiCallMade = false;
    
    await page.route('**/api/users/export**', route => {
      requestUrl = route.request().url();
      apiCallMade = true;
      route.fulfill({ status: 200, body: '{}' });
    });
    
    await helpers.selectExportFormat('csv');
    await helpers.startDataExport();
    
    // Wait for API call to be made
    await page.waitForTimeout(2000);
    
    expect(apiCallMade).toBe(true);
    expect(requestUrl).toContain('format=csv');
    expect(requestUrl).toContain('includeNotifications=false');
  });
});