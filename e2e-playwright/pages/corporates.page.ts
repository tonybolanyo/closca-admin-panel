import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Corporates Page Object Model
 * Handles corporate management operations
 */
export class CorporatesPage extends BasePage {
  // List page elements
  readonly table: Locator;
  readonly newButton: Locator;
  readonly searchInput: Locator;
  readonly tableRows: Locator;
  readonly paginator: Locator;

  // Form elements
  readonly nameInput: Locator;
  readonly codeInput: Locator;
  readonly descriptionInput: Locator;
  readonly statusToggle: Locator;
  readonly logoInput: Locator;
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

    // Form locators
    this.nameInput = page.locator('input[formcontrolname="name"], input[name="name"]');
    this.codeInput = page.locator('input[formcontrolname="code"], input[name="code"]');
    this.descriptionInput = page.locator('textarea[formcontrolname="description"], textarea[name="description"]');
    this.statusToggle = page.locator('mat-slide-toggle[formcontrolname="status"], input[formcontrolname="status"]');
    this.logoInput = page.locator('input[type="file"]');
    this.saveButton = page.locator('button:has-text("Guardar"), button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("Volver")');
  }

  /**
   * Navigate to corporates list page
   */
  async gotoList() {
    await this.goto('/admin/panel/corporates/list');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to create corporate page
   */
  async gotoCreate() {
    await this.goto('/admin/panel/corporates/new');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to view corporate page
   */
  async gotoView(corporateId: string) {
    await this.goto(`/admin/panel/corporates/view/${corporateId}`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to edit corporate page
   */
  async gotoEdit(corporateId: string) {
    await this.goto(`/admin/panel/corporates/edit/${corporateId}`);
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
   * Search for corporates
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
   * Click delete button on specific row
   */
  async clickDeleteOnRow(rowIndex: number) {
    const deleteButton = this.tableRows.nth(rowIndex).locator('button[mattooltip*="Eliminar"], mat-icon:has-text("delete")');
    await deleteButton.click();
  }

  /**
   * Fill corporate form
   */
  async fillCorporateForm(corporateData: {
    name?: string;
    code?: string;
    description?: string;
    active?: boolean;
  }) {
    if (corporateData.name) {
      await this.nameInput.fill(corporateData.name);
    }
    if (corporateData.code) {
      await this.codeInput.fill(corporateData.code);
    }
    if (corporateData.description) {
      await this.descriptionInput.fill(corporateData.description);
    }
    if (corporateData.active !== undefined) {
      const isChecked = await this.statusToggle.isChecked();
      if ((corporateData.active && !isChecked) || (!corporateData.active && isChecked)) {
        await this.statusToggle.click();
      }
    }
  }

  /**
   * Upload logo/image
   */
  async uploadLogo(filePath: string) {
    await this.logoInput.setInputFiles(filePath);
    await this.page.waitForTimeout(500); // Wait for upload
  }

  /**
   * Submit corporate form
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
   * Check if corporate exists in list by name
   */
  async corporateExistsInList(name: string): Promise<boolean> {
    const corporateCell = this.page.locator(`td:has-text("${name}")`);
    return await corporateCell.isVisible();
  }

  /**
   * Get corporate data from row
   */
  async getCorporateDataFromRow(rowIndex: number): Promise<{ name: string; code: string }> {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator('td');
    const cellCount = await cells.count();
    
    // Assuming name is in first column and code in second (adjust based on actual table structure)
    const name = await cells.nth(0).textContent() || '';
    const code = cellCount > 1 ? await cells.nth(1).textContent() || '' : '';
    
    return { name: name.trim(), code: code.trim() };
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

  /**
   * Confirm delete dialog
   */
  async confirmDelete() {
    const confirmButton = this.page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
    await confirmButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Cancel delete dialog
   */
  async cancelDelete() {
    const cancelButton = this.page.locator('button:has-text("Cancelar"), button:has-text("No")');
    await cancelButton.click();
  }
}
