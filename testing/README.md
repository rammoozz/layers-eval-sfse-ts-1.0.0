# Layers Testing Suite

This directory contains comprehensive end-to-end tests for the Layers Full Stack Application using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install browsers:
```bash
npm run install-browsers
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run with UI mode
npm run test:ui

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

## Test Structure

- `e2e/` - End-to-end test files
- `utils/` - Test utilities and helpers
- `playwright.config.ts` - Playwright configuration

## Prerequisites

Before running tests, ensure:

1. The backend server is running on `http://localhost:3001`
2. The frontend development server is running on `http://localhost:5173`

Or simply run `npm run dev` from the project root to start both servers.

## Test Files

### Core Features
- `login.spec.ts` - Authentication and session management tests

### New Features (Priority 3) ✨
- `profile-editing.spec.ts` - User profile editing functionality tests
- `data-export.spec.ts` - Data export feature tests (CSV/JSON formats)
- `notifications.spec.ts` - Real-time notifications and WebSocket tests
- `new-features-integration.spec.ts` - Integration tests for all new features

## Test Coverage

### 🔐 **Login Flow (`e2e/login.spec.ts`)**
- ✅ Display login page correctly
- ✅ Successful login with valid credentials
- ✅ Error handling for invalid credentials
- ✅ Validation for empty fields
- ✅ Redirect to dashboard if already logged in
- ✅ Logout functionality

### 👤 **Profile Editing (`e2e/profile-editing.spec.ts`)**
- ✅ Display profile page with user information
- ✅ Show/hide edit form functionality
- ✅ Form field population and validation
- ✅ Save/Cancel operations with loading states
- ✅ Error handling and form state management
- ✅ Form reset and data persistence

### 📊 **Data Export (`e2e/data-export.spec.ts`)**
- ✅ Export UI components (dropdown, button)
- ✅ Format selection (JSON/CSV)
- ✅ Loading states during export
- ✅ API request validation
- ✅ Error handling (server errors, auth errors)
- ✅ Session preservation after export

### 🔔 **Notifications (`e2e/notifications.spec.ts`)**
- ✅ Notification bell display and interaction
- ✅ Dropdown open/close functionality
- ✅ Empty state display ("No notifications")
- ✅ WebSocket connection testing
- ✅ Real-time notification simulation
- ✅ Cross-page functionality
- ✅ Network disconnection handling

### 🔗 **Integration Tests (`e2e/new-features-integration.spec.ts`)**
- ✅ All features available after login
- ✅ Feature interaction workflows
- ✅ Error handling across features
- ✅ Responsive design testing
- ✅ Session management
- ✅ Concurrent operations
- ✅ Accessibility compliance

## Test Helpers

The `TestHelpers` class provides utility methods for testing:

### Authentication
- `login()` - Log in with test credentials
- `logout()` - Log out user
- `waitForNavigation()` - Wait for page navigation

### Notifications
- `openNotificationDropdown()` - Open notification dropdown
- `closeNotificationDropdown()` - Close notification dropdown
- `simulateNotification()` - Simulate real-time notification

### Profile Editing
- `startProfileEditing()` - Enter profile edit mode
- `fillProfileForm()` - Fill profile form fields
- `saveProfile()` - Save profile changes
- `cancelProfileEditing()` - Cancel profile editing

### Data Export
- `selectExportFormat()` - Select JSON or CSV format
- `startDataExport()` - Initiate data export
- `mockExportResponse()` - Mock API responses for testing

### General Utilities
- `waitForLoadingToComplete()` - Wait for all loading states
- `assertNoConsoleErrors()` - Check for console errors
- `takeScreenshotOnFailure()` - Capture failure screenshots

## Test Credentials

- Email: `admin@test.com`
- Password: `password123`

## Running Specific Tests

```bash
# Run only profile editing tests
npx playwright test profile-editing

# Run only notification tests
npx playwright test notifications

# Run only data export tests
npx playwright test data-export

# Run integration tests
npx playwright test new-features-integration

# Run original login tests
npx playwright test login
```

## Test Configuration

Tests are configured to:
- Run against `http://localhost:5173` (frontend)
- Automatically start backend and frontend servers
- Run on Chrome, Firefox, and Safari
- Capture screenshots on failure
- Generate HTML reports

## Debugging Tests

1. Use `npm run test:debug` to run tests in debug mode
2. Add `await page.pause()` in test code to pause execution
3. Use `page.screenshot()` to capture visual state
4. Check browser console and network tabs for issues

## Adding New Tests

1. Create test files in the `e2e/` folder with `.spec.ts` extension
2. Use the `TestHelpers` class from `utils/test-helpers.ts` for common operations
3. Follow the existing patterns for consistent test structure
4. Add new selectors to `SELECTORS` constant for reusability
5. Add specialized helper methods to `TestHelpers` class as needed

## CI/CD Integration

Tests can be run in CI environments:
- Set `CI=true` environment variable
- Tests will run in headless mode
- Retries are enabled for flaky tests
- HTML reports are generated for analysis