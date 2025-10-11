import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const authFile = 'e2e-playwright/.auth/user.json';

/**
 * Authentication setup
 * This runs once before all tests and saves the authenticated state
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Navigate to login page
  await loginPage.goto();
  
  // Perform login
  const email = process.env.TEST_USER_EMAIL || 'test@example.com';
  const password = process.env.TEST_USER_PASSWORD || 'testpassword';
  
  await loginPage.login(email, password);
  
  // Wait for successful login and redirect
  try {
    await page.waitForURL('**/admin/**', { timeout: 10000 });
    
    // Save authenticated state
    await page.context().storageState({ path: authFile });
    
    console.log('✅ Authentication successful - state saved to', authFile);
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    throw error;
  }
});
