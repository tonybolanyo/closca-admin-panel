import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Generic CRUD Page Object Model
 * Reusable page object for simple CRUD modules
 * Can be extended or used directly for modules with standard CRUD operations
 */
export class CrudPage extends BasePage {
  // List page elements
  readonly table: Locator;
  readonly newButton: Locator;
  readonly searchInput: Locator;
  readonly tableRows: Locator;
  readonly paginator: Locator;

  // Form elements
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly statusToggle: Locator;
  readonly imageInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  private readonly basePath: string;

  constructor(page: Page, basePath: string) {
    super(page);
    this.basePath = basePath;
    
    // List page locators
    this.table = page.locator('table[mat-table], table');
    this.newButton = page.locator('button:has-text("Nuevo")');
    this.searchInput = page.locator('input[placeholder*="Buscar"], input[type="text"]').first();
    this.tableRows = page.locator('tr[mat-row], tbody tr');
    this.paginator = page.locator('mat-paginator');

    // Form locators
    this.nameInput = page.locator('input[formcontrolname="name"], input[name="name"]');
    this.descriptionInput = page.locator('textarea[formcontrolname="description"], textarea[name="description"], input[formcontrolname="description"]');
    this.statusToggle = page.locator('mat-slide-toggle[formcontrolname="status"], input[formcontrolname="status"], mat-slide-toggle[formcontrolname="active"]');
    this.imageInput = page.locator('input[type="file"]');
    this.saveButton = page.locator('button:has-text("Guardar"), button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("Volver")');
  }

  /**
   * Navigate to list page
   */
  async gotoList() {
    await this.goto(`/admin/panel/${this.basePath}/list`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to create page
   */
  async gotoCreate() {
    await this.goto(`/admin/panel/${this.basePath}/new`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to view page
   */
  async gotoView(id: string) {
    await this.goto(`/admin/panel/${this.basePath}/view/${id}`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to edit page
   */
  async gotoEdit(id: string) {
    await this.goto(`/admin/panel/${this.basePath}/edit/${id}`);
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
   * Search for items
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
   * Fill basic form fields
   */
  async fillBasicForm(data: {
    name?: string;
    description?: string;
    active?: boolean;
  }) {
    if (data.name) {
      await this.nameInput.fill(data.name);
    }
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    if (data.active !== undefined) {
      const isChecked = await this.statusToggle.isChecked();
      if ((data.active && !isChecked) || (!data.active && isChecked)) {
        await this.statusToggle.click();
      }
    }
  }

  /**
   * Upload image
   */
  async uploadImage(filePath: string) {
    await this.imageInput.setInputFiles(filePath);
    await this.page.waitForTimeout(500);
  }

  /**
   * Submit form
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
   * Check if item exists in list by name
   */
  async itemExistsInList(name: string): Promise<boolean> {
    const cell = this.page.locator(`td:has-text("${name}")`);
    return await cell.isVisible();
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

  /**
   * Get item data from row
   */
  async getItemDataFromRow(rowIndex: number): Promise<{ name: string; description?: string }> {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator('td');
    const cellCount = await cells.count();
    
    const name = await cells.nth(0).textContent() || '';
    const description = cellCount > 1 ? await cells.nth(1).textContent() || '' : undefined;
    
    return { name: name.trim(), description: description?.trim() };
  }
}
