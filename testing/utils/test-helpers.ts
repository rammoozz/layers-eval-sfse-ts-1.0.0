import { Page, expect } from '@playwright/test';

export const TEST_CREDENTIALS = {
  email: 'admin@test.com',
  password: 'password123',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const SELECTORS = {
  // Notification components
  NOTIFICATION_BELL: 'header button svg.lucide-bell',
  NOTIFICATION_DROPDOWN: 'h3:has-text("Notifications")',
  NOTIFICATION_BADGE: '.absolute.-top-1.-right-1',
  
  // Profile editing
  EDIT_PROFILE_BUTTON: 'button:has-text("Edit Profile")',
  PROFILE_FORM: 'form',
  NAME_INPUT: 'input[placeholder="Your name"]',
  EMAIL_INPUT: 'input[placeholder="Your email"]',
  SAVE_BUTTON: 'button:has-text("Save Changes")',
  CANCEL_BUTTON: 'button:has-text("Cancel")',
  
  // Data export
  EXPORT_FORMAT_SELECT: 'select',
  EXPORT_BUTTON: 'button:has-text("Export Data")',
  EXPORT_LOADING: 'button:has-text("Exporting...")',
};

export class TestHelpers {
  constructor(private page: Page) {}

  // Setup helpers
  async setupCleanSession() {
    await this.page.context().clearCookies();
    await this.page.goto('/');
    await this.page.evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        // Ignore localStorage errors
      }
    });
  }

  async setupAuthenticatedSession() {
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', 'admin@test.com');
    await this.page.fill('input[type="password"]', 'password123');
    await this.page.click('button:has-text("Sign In")');
    
    // Wait for navigation to dashboard
    await this.page.waitForURL('/', { timeout: 10000 });
    await this.page.waitForSelector('text=Dashboard', { timeout: 5000 });
    
    // Verify we're logged in
    await this.page.waitForSelector('header:has-text("Demo User")', { timeout: 5000 });
  }

  async login(email = TEST_CREDENTIALS.email, password = TEST_CREDENTIALS.password) {
    await this.page.goto(ROUTES.LOGIN);
    await this.page.waitForLoadState('networkidle');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
    // Wait for login to complete
    await this.page.waitForTimeout(2000);
  }

  async waitForNavigation(expectedUrl: string) {
    await this.page.waitForURL(expectedUrl, { timeout: 30000 });
  }

  async assertElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async assertElementText(selector: string, expectedText: string) {
    await expect(this.page.locator(selector)).toHaveText(expectedText);
  }

  async assertCurrentUrl(expectedUrl: string) {
    expect(this.page.url()).toContain(expectedUrl);
  }

  async logout() {
    // Look for logout button in header or dropdown
    const logoutButton = this.page.locator('button:has-text("Logout")').or(
      this.page.locator('[data-testid="logout-button"]')
    );
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }
  }

  async waitForApiResponse(url: string) {
    return this.page.waitForResponse(response => 
      response.url().includes(url) && response.status() === 200
    );
  }

  // Notification testing helpers
  async openNotificationDropdown() {
    const bellButton = this.page.locator('header button').filter({ has: this.page.locator('svg.lucide-bell') });
    await bellButton.click();
    await this.page.waitForSelector(SELECTORS.NOTIFICATION_DROPDOWN);
  }

  async closeNotificationDropdown() {
    await this.page.click('main'); // Click outside dropdown
    await this.page.waitForSelector(SELECTORS.NOTIFICATION_DROPDOWN, { state: 'hidden' });
  }

  async waitForNotificationBadge() {
    await this.assertElementVisible(SELECTORS.NOTIFICATION_BADGE);
  }

  // Profile editing helpers
  async startProfileEditing() {
    await this.page.click(SELECTORS.EDIT_PROFILE_BUTTON);
    await this.assertElementVisible(SELECTORS.PROFILE_FORM);
  }

  async fillProfileForm(name: string, email: string) {
    await this.page.fill(SELECTORS.NAME_INPUT, name);
    await this.page.fill(SELECTORS.EMAIL_INPUT, email);
  }

  async saveProfile() {
    await this.page.click(SELECTORS.SAVE_BUTTON);
  }

  async cancelProfileEditing() {
    await this.page.click(SELECTORS.CANCEL_BUTTON);
  }

  async waitForProfileSaveLoading() {
    await this.page.waitForSelector('button:has-text("Saving...")', { timeout: 5000 });
  }

  // Data export helpers
  async selectExportFormat(format: 'json' | 'csv') {
    await this.page.selectOption(SELECTORS.EXPORT_FORMAT_SELECT, format);
  }

  async startDataExport() {
    await this.page.click(SELECTORS.EXPORT_BUTTON);
  }

  async waitForExportLoading() {
    await this.page.waitForSelector(SELECTORS.EXPORT_LOADING, { timeout: 5000 });
  }

  async mockExportResponse(format: 'json' | 'csv', success: boolean = true) {
    if (success) {
      await this.page.route('/api/users/export*', async route => {
        const contentType = format === 'json' ? 'application/json' : 'text/csv';
        const body = format === 'json' 
          ? JSON.stringify({ exportDate: new Date().toISOString(), user: { id: '1', name: 'Demo User' } })
          : 'Field,Value\nID,1\nName,"Demo User"';

        route.fulfill({
          status: 200,
          contentType,
          body
        });
      });
    } else {
      await this.page.route('/api/users/export*', async route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Export failed' })
        });
      });
    }
  }

  // WebSocket testing helpers
  async waitForWebSocketConnection() {
    // Wait for WebSocket connection establishment
    await this.page.waitForTimeout(2000);
    
    // Check for WebSocket connection in console logs
    const logs = await this.page.evaluate(() => {
      return (window as any).testWSLogs || [];
    });
    
    return logs.some((log: string) => log.includes('WebSocket') || log.includes('connected'));
  }

  async simulateNotification(notification: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }) {
    await this.page.evaluate((notif) => {
      const event = new CustomEvent('testNotification', { detail: notif });
      window.dispatchEvent(event);
    }, notification);
  }

  // General helpers
  async waitForLoadingToComplete() {
    // Wait for any loading states to complete
    await this.page.waitForSelector('button:has-text("Loading..."), button:has-text("Saving..."), button:has-text("Exporting...")', 
      { state: 'hidden', timeout: 10000 }
    ).catch(() => {
      // If no loading states found, continue
    });
  }

  async assertNoConsoleErrors() {
    const errors: string[] = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await this.page.waitForTimeout(1000);
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  }

  async takeScreenshotOnFailure(testName: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${testName}-failure-${Date.now()}.png`,
      fullPage: true
    });
  }
}