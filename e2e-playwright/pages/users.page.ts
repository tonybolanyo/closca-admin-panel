import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Users Page Object Model
 * Handles user management operations
 */
export class UsersPage extends BasePage {
  // List page elements
  readonly table: Locator;
  readonly newButton: Locator;
  readonly searchInput: Locator;
  readonly tableRows: Locator;
  readonly paginator: Locator;

  // Form elements
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly corporateSelect: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // List page locators
    this.table = page.locator('table[mat-table], table');
    this.newButton = page.locator('button:has-text("Nuevo")');
    this.searchInput = page.locator('input[placeholder*="Buscar"], input[type="text"]').first();
    this.tableRows = page.locator('tr[mat-row], tbody tr');
    this.paginator = page.locator('mat-paginator');

    // Form locators (using common patterns)
    this.nameInput = page.locator('input[formcontrolname="userName"], input[name="userName"]');
    this.emailInput = page.locator('input[formcontrolname="email"], input[name="email"], input[type="email"]');
    this.roleSelect = page.locator('mat-select[formcontrolname="role"], select[formcontrolname="role"]');
    this.corporateSelect = page.locator('mat-select[formcontrolname="corporateInfo"], ng-select[formcontrolname="corporateInfo"]');
    this.saveButton = page.locator('button:has-text("Guardar"), button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("Volver")');
  }

  /**
   * Navigate to users list page
   */
  async gotoList() {
    await this.goto('/admin/panel/users/list');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to create user page
   */
  async gotoCreate() {
    await this.goto('/admin/panel/users/new');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to view user page
   */
  async gotoView(userId: string) {
    await this.goto(`/admin/panel/users/view/${userId}`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to edit user page
   */
  async gotoEdit(userId: string) {
    await this.goto(`/admin/panel/users/edit/${userId}`);
    await this.waitForPageLoad();
  }

  /**
   * Click new/create button
   */
  async clickNew() {
    await this.newButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search for users
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Wait for debounce
  }

  /**
   * Get number of table rows
   */
  async getRowCount(): Promise<number> {
    await this.table.waitFor({ state: 'visible' });
    return await this.tableRows.count();
  }

  /**
   * Click view button on specific row
   */
  async clickViewOnRow(rowIndex: number) {
    const viewButton = this.tableRows.nth(rowIndex).locator('button[mattooltip*="Ver"], mat-icon:has-text("visibility")');
    await viewButton.click();
  }

  /**
   * Click edit button on specific row
   */
  async clickEditOnRow(rowIndex: number) {
    const editButton = this.tableRows.nth(rowIndex).locator('button[mattooltip*="Editar"], mat-icon:has-text("edit")');
    await editButton.click();
  }

  /**
   * Click delete/deactivate button on specific row
   */
  async clickDeleteOnRow(rowIndex: number) {
    const deleteButton = this.tableRows.nth(rowIndex).locator('button[mattooltip*="Eliminar"], button[mattooltip*="Desactivar"], mat-icon:has-text("delete")');
    await deleteButton.click();
  }

  /**
   * Fill user form
   */
  async fillUserForm(userData: {
    name?: string;
    email?: string;
    role?: string;
    corporate?: string;
  }) {
    if (userData.name) {
      await this.nameInput.fill(userData.name);
    }
    if (userData.email) {
      await this.emailInput.fill(userData.email);
    }
    if (userData.role) {
      await this.roleSelect.click();
      await this.page.locator(`mat-option:has-text("${userData.role}"), option:has-text("${userData.role}")`).click();
    }
    if (userData.corporate) {
      await this.corporateSelect.click();
      await this.page.waitForTimeout(300); // Wait for dropdown
      await this.page.locator(`mat-option:has-text("${userData.corporate}"), .ng-option:has-text("${userData.corporate}")`).click();
    }
  }

  /**
   * Submit user form
   */
  async submitForm() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Cancel form editing
   */
  async cancelForm() {
    await this.cancelButton.click();
  }

  /**
   * Check if user exists in list by email
   */
  async userExistsInList(email: string): Promise<boolean> {
    const userCell = this.page.locator(`td:has-text("${email}")`);
    return await userCell.isVisible();
  }

  /**
   * Get user data from row
   */
  async getUserDataFromRow(rowIndex: number): Promise<{ name: string; email: string }> {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator('td');
    const cellCount = await cells.count();
    
    // Assuming name is in first column and email in second (adjust based on actual table structure)
    const name = await cells.nth(0).textContent() || '';
    const email = cellCount > 1 ? await cells.nth(1).textContent() || '' : '';
    
    return { name: name.trim(), email: email.trim() };
  }

  /**
   * Wait for table to load
   */
  async waitForTableLoad() {
    await this.table.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if form is valid (save button enabled)
   */
  async isFormValid(): Promise<boolean> {
    return await this.saveButton.isEnabled();
  }

  /**
   * Get validation error message
   */
  async getValidationError(): Promise<string> {
    const errorElement = this.page.locator('mat-error, .error-message, .invalid-feedback').first();
    if (await errorElement.isVisible()) {
      return await errorElement.textContent() || '';
    }
    return '';
  }
}
