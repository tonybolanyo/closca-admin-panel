import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object Model
 * Provides common functionality for all page objects
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string) {
    await this.page.goto(url);
  }

  /**
   * Wait for the page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  /**
   * Fill input field by test ID
   */
  async fillByTestId(testId: string, value: string) {
    await this.getByTestId(testId).fill(value);
  }

  /**
   * Click element by test ID
   */
  async clickByTestId(testId: string) {
    await this.getByTestId(testId).click();
  }

  /**
   * Check if element is visible
   */
  async isVisibleByTestId(testId: string): Promise<boolean> {
    return await this.getByTestId(testId).isVisible();
  }

  /**
   * Wait for navigation after action
   */
  async waitForNavigation(action: () => Promise<void>) {
    await Promise.all([
      this.page.waitForURL('**'),
      action()
    ]);
  }

  /**
   * Take a screenshot
   */
  async screenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
