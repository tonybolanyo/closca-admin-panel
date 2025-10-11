import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Generic List Page Object Model
 * Handles common list/table operations for CRUD modules
 */
export class ListPage extends BasePage {
  readonly table: Locator;
  readonly newButton: Locator;
  readonly searchInput: Locator;
  readonly tableRows: Locator;
  readonly paginator: Locator;

  constructor(page: Page) {
    super(page);
    this.table = page.locator('table[mat-table]');
    this.newButton = page.locator('button:has-text("Nuevo")');
    this.searchInput = page.locator('input[placeholder*="Buscar"], input[type="text"]').first();
    this.tableRows = page.locator('tr[mat-row]');
    this.paginator = page.locator('mat-paginator');
  }

  /**
   * Click new/create button
   */
  async clickNew() {
    await this.newButton.click();
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
    return await this.tableRows.count();
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
   * Click view button on specific row
   */
  async clickViewOnRow(rowIndex: number) {
    const viewButton = this.tableRows.nth(rowIndex).locator('button[mattooltip*="Ver"], mat-icon:has-text("visibility")');
    await viewButton.click();
  }

  /**
   * Check if table is visible
   */
  async isTableVisible(): Promise<boolean> {
    return await this.table.isVisible();
  }

  /**
   * Wait for table to load
   */
  async waitForTableLoad() {
    await this.table.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }
}
