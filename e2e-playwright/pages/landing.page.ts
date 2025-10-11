import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Landing Page Object Model
 * Handles interactions with the landing/welcome page
 */
export class LandingPage extends BasePage {
  readonly logo: Locator;
  readonly welcomeTitle: Locator;
  readonly enterButton: Locator;
  readonly landingCard: Locator;

  constructor(page: Page) {
    super(page);
    // Using data-testid attributes for reliable element selection
    this.logo = this.getByTestId('landing-logo');
    this.welcomeTitle = this.getByTestId('landing-welcome-title');
    this.enterButton = this.getByTestId('landing-enter-button');
    this.landingCard = this.getByTestId('landing-card');
  }

  /**
   * Navigate to landing page
   */
  async goto() {
    await this.page.goto('/admin');
  }

  /**
   * Click enter button to proceed to admin panel
   */
  async clickEnter() {
    await this.enterButton.click();
  }

  /**
   * Check if landing page is displayed
   */
  async isLandingPageVisible(): Promise<boolean> {
    return await this.welcomeTitle.isVisible();
  }
}
