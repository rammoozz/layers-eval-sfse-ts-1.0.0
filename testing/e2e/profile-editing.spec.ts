import { test, expect } from '@playwright/test';
import { TestHelpers, ROUTES, SELECTORS } from '../utils/test-helpers';

test.describe('Profile Editing Feature', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.setupAuthenticatedSession();
    
    // Navigate to profile using nav link
    await page.click('nav a[href="/profile"]');
    await page.waitForURL('/profile');
  });

  test('displays profile with edit functionality', async ({ page }) => {
    await helpers.assertElementVisible('h1:has-text("Profile")');
    await helpers.assertElementVisible(SELECTORS.EDIT_PROFILE_BUTTON);
    await expect(page.locator('h3:has-text("Demo User")')).toBeVisible();
    await expect(page.locator('.text-sm.text-gray-600:has-text("admin@test.com")')).toBeVisible();
  });

  test('shows and hides edit form', async ({ page }) => {
    await page.click(SELECTORS.EDIT_PROFILE_BUTTON);
    await helpers.assertElementVisible(SELECTORS.PROFILE_FORM);
    
    await page.click(SELECTORS.CANCEL_BUTTON);
    await expect(page.locator(SELECTORS.PROFILE_FORM)).not.toBeVisible();
  });

  test('validates form fields', async ({ page }) => {
    await helpers.startProfileEditing();
    
    // Test empty name
    await page.fill(SELECTORS.NAME_INPUT, '');
    await page.click(SELECTORS.SAVE_BUTTON);
    
    const nameInput = page.locator(SELECTORS.NAME_INPUT);
    const isValid = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('handles form submission with loading states', async ({ page }) => {
    await helpers.startProfileEditing();
    await helpers.fillProfileForm('Updated User', 'updated@test.com');
    
    // Mock successful response
    await page.route('/api/users/profile', route => 
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { name: 'Updated User' } })
      })
    );
    
    await helpers.saveProfile();
    
    // Should show loading state briefly
    await expect(page.locator('button:has-text("Saving...")')).toBeVisible();
  });

  test('resets form on cancel', async ({ page }) => {
    await helpers.startProfileEditing();
    await helpers.fillProfileForm('Changed Name', 'changed@email.com');
    await helpers.cancelProfileEditing();
    
    // Wait a moment for state to update
    await page.waitForTimeout(500);
    
    // Edit again and check values are reset
    await helpers.startProfileEditing();
    await expect(page.locator(SELECTORS.NAME_INPUT)).toHaveValue('Demo User');
    await expect(page.locator(SELECTORS.EMAIL_INPUT)).toHaveValue('admin@test.com');
  });
});