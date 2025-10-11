import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object Model
 * Handles interactions with the login page
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logo: Locator;
  readonly loginCard: Locator;

  constructor(page: Page) {
    super(page);
    // Using data-testid attributes for reliable element selection
    this.emailInput = this.getByTestId('login-email-input');
    this.passwordInput = this.getByTestId('login-password-input');
    this.loginButton = this.getByTestId('login-submit-button');
    this.logo = this.getByTestId('login-logo');
    this.loginCard = this.getByTestId('login-card');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login');
  }

  /**
   * Perform login action
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.emailInput.isVisible() && await this.passwordInput.isVisible();
  }

  /**
   * Get login button state
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Wait for login to complete
   */
  async waitForLoginSuccess() {
    // Wait for redirect to admin panel
    await this.page.waitForURL('**/admin/**', { timeout: 10000 });
  }
}
