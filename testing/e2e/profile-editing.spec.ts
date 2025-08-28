import { test, expect } from '@playwright/test';
import { TestHelpers, TEST_CREDENTIALS, ROUTES } from '../utils/test-helpers';

test.describe('Profile Editing Feature', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Clear any existing session and login
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        // Ignore localStorage errors
      }
    });
    await helpers.login();
    await helpers.waitForNavigation('/');
    
    // Navigate to profile page
    await page.goto(ROUTES.PROFILE);
  });

  test('should display profile page with user information', async ({ page }) => {
    // Check that profile information is displayed
    await helpers.assertElementVisible('h1:has-text("Profile")');
    
    // Check that profile sidebar is present
    await helpers.assertElementVisible('.profile-sidebar');
    
    // Check that user info is displayed
    await expect(page.locator('text=Demo User')).toBeVisible();
    await expect(page.locator('text=admin@test.com')).toBeVisible();
    
    // Check that Edit Profile button is present
    await helpers.assertElementVisible('button:has-text("Edit Profile")');
  });

  test('should show edit form when clicking Edit Profile button', async ({ page }) => {
    // Click Edit Profile button
    await page.click('button:has-text("Edit Profile")');
    
    // Should show edit form
    await helpers.assertElementVisible('form');
    await helpers.assertElementVisible('input[placeholder="Your name"]');
    await helpers.assertElementVisible('input[placeholder="Your email"]');
    
    // Should show Save and Cancel buttons
    await helpers.assertElementVisible('button:has-text("Save Changes")');
    await helpers.assertElementVisible('button:has-text("Cancel")');
    
    // Edit Profile button should change to Cancel
    await expect(page.locator('button:has-text("Cancel")')).toHaveCount(2); // One in header, one in form
  });

  test('should populate form fields with current user data', async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    
    // Check that form fields are populated with current data
    const nameInput = page.locator('input[placeholder="Your name"]');
    const emailInput = page.locator('input[placeholder="Your email"]');
    
    await expect(nameInput).toHaveValue('Demo User');
    await expect(emailInput).toHaveValue('admin@test.com');
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    
    // Clear the name field
    await page.fill('input[placeholder="Your name"]', '');
    
    // Try to submit
    await page.click('button:has-text("Save Changes")');
    
    // Should show validation error or prevent submission
    const nameInput = page.locator('input[placeholder="Your name"]');
    const isValid = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('should validate email format', async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    
    // Enter invalid email
    await page.fill('input[placeholder="Your email"]', 'invalid-email');
    
    // Try to submit
    await page.click('button:has-text("Save Changes")');
    
    // Should show validation error
    const emailInput = page.locator('input[placeholder="Your email"]');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('should cancel editing when clicking Cancel button', async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    
    // Modify form data
    await page.fill('input[placeholder="Your name"]', 'Modified Name');
    await page.fill('input[placeholder="Your email"]', 'modified@test.com');
    
    // Click Cancel
    await page.click('button:has-text("Cancel")');
    
    // Should return to read-only view
    await expect(page.locator('form')).not.toBeVisible();
    await helpers.assertElementVisible('button:has-text("Edit Profile")');
    
    // Should show original data (not modified)
    await expect(page.locator('text=Demo User')).toBeVisible();
    await expect(page.locator('text=admin@test.com')).toBeVisible();
  });

  test('should show loading state during save', async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    
    // Modify name
    await page.fill('input[placeholder="Your name"]', 'Updated Demo User');
    
    // Click Save Changes
    await page.click('button:has-text("Save Changes")');
    
    // Should show loading state
    await expect(page.locator('button:has-text("Saving...")')).toBeVisible();
    
    // Form fields should be disabled during loading
    const nameInput = page.locator('input[placeholder="Your name"]');
    await expect(nameInput).toBeDisabled();
  });

  test('should disable form during loading', async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    
    // Modify data
    await page.fill('input[placeholder="Your name"]', 'Test User');
    
    // Click Save
    await page.click('button:has-text("Save Changes")');
    
    // All form elements should be disabled during loading
    await expect(page.locator('input[placeholder="Your name"]')).toBeDisabled();
    await expect(page.locator('input[placeholder="Your email"]')).toBeDisabled();
    await expect(page.locator('button:has-text("Cancel")')).toBeDisabled();
  });

  test('should reset form data when cancelling after modifications', async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    
    // Modify both fields
    await page.fill('input[placeholder="Your name"]', 'Completely Different Name');
    await page.fill('input[placeholder="Your email"]', 'different@email.com');
    
    // Cancel editing
    await page.click('button:has-text("Cancel")');
    
    // Edit again to check if form is reset
    await page.click('button:has-text("Edit Profile")');
    
    // Should show original values, not the modified ones
    await expect(page.locator('input[placeholder="Your name"]')).toHaveValue('Demo User');
    await expect(page.locator('input[placeholder="Your email"]')).toHaveValue('admin@test.com');
  });

  test('should maintain form state when validation fails', async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    
    // Enter valid name but invalid email
    await page.fill('input[placeholder="Your name"]', 'Valid Name');
    await page.fill('input[placeholder="Your email"]', 'invalid');
    
    // Try to submit
    await page.click('button:has-text("Save Changes")');
    
    // Form should still be in edit mode with the entered values
    await expect(page.locator('input[placeholder="Your name"]')).toHaveValue('Valid Name');
    await expect(page.locator('input[placeholder="Your email"]')).toHaveValue('invalid');
    await expect(page.locator('form')).toBeVisible();
  });
});