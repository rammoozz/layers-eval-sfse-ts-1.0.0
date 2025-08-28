import { test, expect } from '@playwright/test';
import { TestHelpers, TEST_CREDENTIALS, ROUTES } from '../utils/test-helpers';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
    // Navigate to page first, then clear localStorage
    await page.goto('/');
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        // Ignore localStorage errors in case it's not available
      }
    });
  });

  test('should display login page correctly', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto(ROUTES.LOGIN);
    
    // Check that login form elements are present
    await helpers.assertElementVisible('input[type="email"]');
    await helpers.assertElementVisible('input[type="password"]');
    await helpers.assertElementVisible('button[type="submit"]');
    
    // Check page title or heading
    await expect(page.locator('h3')).toContainText('Login');
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Navigate to login page
    await page.goto(ROUTES.LOGIN);
    
    // Fill in login form
    await page.fill('input[type="email"]', TEST_CREDENTIALS.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.password);
    
    // Wait for the login API response
    const responsePromise = helpers.waitForApiResponse('/api/auth/login');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for API response
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    
    // Should redirect to dashboard
    await helpers.waitForNavigation('/');
    helpers.assertCurrentUrl('/');
    
    // Check that user is logged in (token should be in localStorage)
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
    
    // Check that dashboard content is loaded
    await helpers.assertElementVisible('h1:has-text("Dashboard")');
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto(ROUTES.LOGIN);
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('p:has-text("Invalid credentials")')).toBeVisible();
    
    // Should remain on login page
    helpers.assertCurrentUrl('/login');
    
    // Token should not be set
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeFalsy();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    // Try to submit with empty fields
    await page.click('button[type="submit"]');
    
    // Should show validation errors or prevent submission
    const emailField = page.locator('input[type="email"]');
    const passwordField = page.locator('input[type="password"]');
    
    // Check HTML5 validation or custom validation messages
    const emailValidity = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    const passwordValidity = await passwordField.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    expect(emailValidity || passwordValidity).toBe(false);
  });

  test('should redirect to dashboard if already logged in', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // First login
    await helpers.login();
    await helpers.waitForNavigation('/');
    
    // Try to access login page again
    await page.goto(ROUTES.LOGIN);
    
    // Should be redirected back to dashboard
    await page.waitForTimeout(1000); // Give time for redirect
    helpers.assertCurrentUrl('/');
  });

  test('should logout successfully', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Login first
    await helpers.login();
    await helpers.waitForNavigation('/');
    
    // Logout
    await helpers.logout();
    
    // Should redirect to login page
    await helpers.waitForNavigation('/login');
    helpers.assertCurrentUrl('/login');
    
    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeFalsy();
  });

  // Authentication Security Tests - Verify fix for authentication bypass vulnerability
  test('should reject API requests without authentication token', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Clear any existing session
    await helpers.setupCleanSession();
    
    // Try to access protected endpoint without token (directly to backend)
    const response = await page.request.get('http://localhost:3001/api/users/profile');
    
    // Should be rejected with 401
    expect(response.status()).toBe(401);
    
    const responseBody = await response.json();
    expect(responseBody.message).toContain('Access token required');
  });

  test('should reject API requests with invalid authentication token', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Clear any existing session
    await helpers.setupCleanSession();
    
    // Try to access protected endpoint with invalid token (directly to backend)
    const response = await page.request.get('http://localhost:3001/api/users/profile', {
      headers: {
        'Authorization': 'Bearer invalid-token-here'
      }
    });
    
    // Should be rejected with 403
    expect(response.status()).toBe(403);
    
    const responseBody = await response.json();
    expect(responseBody.message).toContain('Invalid or expired token');
  });

  test('should accept API requests with valid authentication token and include completion header', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Login to get valid token (via backend directly)
    const loginResponse = await page.request.post('http://localhost:3001/api/auth/login', {
      data: {
        email: TEST_CREDENTIALS.email,
        password: TEST_CREDENTIALS.password
      }
    });
    
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    expect(token).toBeTruthy();
    
    // Try to access protected endpoint with valid token (directly to backend)
    const response = await page.request.get('http://localhost:3001/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Should be accepted with 200
    expect(response.status()).toBe(200);
    
    // Should include X-Test-Completion header (verifies authentication fix)
    const headers = response.headers();
    expect(headers['x-test-completion']).toBe('true');
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
  });

  test('should protect all user endpoints from unauthenticated access', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Clear any existing session
    await helpers.setupCleanSession();
    
    // Test multiple protected endpoints (directly to backend)
    const protectedEndpoints = [
      'http://localhost:3001/api/users/profile',
      'http://localhost:3001/api/users/export',
      'http://localhost:3001/api/notifications'
    ];
    
    for (const endpoint of protectedEndpoints) {
      const response = await page.request.get(endpoint);
      expect(response.status()).toBe(401);
      
      const responseBody = await response.json();
      expect(responseBody.message).toContain('Access token required');
    }
  });

  test('should protect POST endpoints from unauthenticated access', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Clear any existing session
    await helpers.setupCleanSession();
    
    // Try to update profile without authentication (directly to backend)
    const response = await page.request.put('http://localhost:3001/api/users/profile', {
      data: {
        name: 'Test User',
        email: 'test@example.com'
      }
    });
    
    expect(response.status()).toBe(401);
    
    const responseBody = await response.json();
    expect(responseBody.message).toContain('Access token required');
  });
});