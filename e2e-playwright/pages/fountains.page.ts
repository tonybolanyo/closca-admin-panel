import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Fountains Page Object Model
 * Handles fountain management operations
 */
export class FountainsPage extends BasePage {
  // List page elements
  readonly table: Locator;
  readonly newButton: Locator;
  readonly searchInput: Locator;
  readonly tableRows: Locator;
  readonly paginator: Locator;

  // Form elements - Basic Info
  readonly nameInput: Locator;
  readonly fountainTypeSelect: Locator;
  readonly fountainStatusSelect: Locator;
  readonly refillTypeSelect: Locator;

  // Form elements - Address
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly zipCodeInput: Locator;
  readonly countryInput: Locator;

  // Form elements - Location
  readonly latitudeInput: Locator;
  readonly longitudeInput: Locator;

  // Form elements - Hours
  readonly openTimeInput: Locator;
  readonly closeTimeInput: Locator;
  readonly weekDayStartSelect: Locator;
  readonly weekDayEndSelect: Locator;

  // Form elements - Corporate
  readonly corporateSelect: Locator;

  // Form elements - Images
  readonly imageInput: Locator;
  readonly mapPinImageInput: Locator;
  readonly brandImageInput: Locator;

  // Form buttons
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

    // Basic Info locators
    this.nameInput = page.locator('input[formcontrolname="name"], input[name="name"]');
    this.fountainTypeSelect = page.locator('mat-select[formcontrolname="fountainType"], select[formcontrolname="fountainType"]');
    this.fountainStatusSelect = page.locator('mat-select[formcontrolname="fountainStatus"], select[formcontrolname="fountainStatus"]');
    this.refillTypeSelect = page.locator('mat-select[formcontrolname="refillType"], select[formcontrolname="refillType"]');

    // Address locators
    this.streetInput = page.locator('input[formcontrolname="street"], input[name="street"]');
    this.cityInput = page.locator('input[formcontrolname="city"], input[name="city"]');
    this.zipCodeInput = page.locator('input[formcontrolname="zipCode"], input[name="zipCode"]');
    this.countryInput = page.locator('input[formcontrolname="country"], input[name="country"]');

    // Location locators
    this.latitudeInput = page.locator('input[formcontrolname="latitude"], input[name="latitude"]');
    this.longitudeInput = page.locator('input[formcontrolname="longitude"], input[name="longitude"]');

    // Hours locators
    this.openTimeInput = page.locator('input[formcontrolname="openTime"], input[name="openTime"]');
    this.closeTimeInput = page.locator('input[formcontrolname="closeTime"], input[name="closeTime"]');
    this.weekDayStartSelect = page.locator('mat-select[formcontrolname="weekDayStart"], select[formcontrolname="weekDayStart"]');
    this.weekDayEndSelect = page.locator('mat-select[formcontrolname="weekDayEnd"], select[formcontrolname="weekDayEnd"]');

    // Corporate locator
    this.corporateSelect = page.locator('mat-select[formcontrolname="corporateInfo"], ng-select[formcontrolname="corporateInfo"]');

    // Image locators
    this.imageInput = page.locator('input[type="file"]').first();
    this.mapPinImageInput = page.locator('input[type="file"]').nth(1);
    this.brandImageInput = page.locator('input[type="file"]').nth(2);

    // Button locators
    this.saveButton = page.locator('button:has-text("Guardar"), button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("Volver")');
  }

  /**
   * Navigate to fountains list page
   */
  async gotoList() {
    await this.goto('/admin/panel/public-or-private-fountains/list');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to create fountain page
   */
  async gotoCreate() {
    await this.goto('/admin/panel/public-or-private-fountains/new');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to view fountain page
   */
  async gotoView(fountainId: string) {
    await this.goto(`/admin/panel/public-or-private-fountains/view/${fountainId}`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to edit fountain page
   */
  async gotoEdit(fountainId: string) {
    await this.goto(`/admin/panel/public-or-private-fountains/edit/${fountainId}`);
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
   * Search for fountains
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
   * Fill basic fountain information
   */
  async fillBasicInfo(data: {
    name?: string;
    fountainType?: string;
    fountainStatus?: string;
    refillType?: string;
  }) {
    if (data.name) {
      await this.nameInput.fill(data.name);
    }
    if (data.fountainType) {
      await this.fountainTypeSelect.click();
      await this.page.locator(`mat-option:has-text("${data.fountainType}"), option:has-text("${data.fountainType}")`).click();
    }
    if (data.fountainStatus) {
      await this.fountainStatusSelect.click();
      await this.page.locator(`mat-option:has-text("${data.fountainStatus}"), option:has-text("${data.fountainStatus}")`).click();
    }
    if (data.refillType) {
      await this.refillTypeSelect.click();
      await this.page.locator(`mat-option:has-text("${data.refillType}"), option:has-text("${data.refillType}")`).click();
    }
  }

  /**
   * Fill address information
   */
  async fillAddress(data: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  }) {
    if (data.street) {
      await this.streetInput.fill(data.street);
    }
    if (data.city) {
      await this.cityInput.fill(data.city);
    }
    if (data.zipCode) {
      await this.zipCodeInput.fill(data.zipCode);
    }
    if (data.country) {
      await this.countryInput.fill(data.country);
    }
  }

  /**
   * Fill location coordinates
   */
  async fillLocation(latitude: string, longitude: string) {
    await this.latitudeInput.fill(latitude);
    await this.longitudeInput.fill(longitude);
  }

  /**
   * Fill opening hours
   */
  async fillHours(data: {
    openTime?: string;
    closeTime?: string;
    weekDayStart?: string;
    weekDayEnd?: string;
  }) {
    if (data.openTime) {
      await this.openTimeInput.fill(data.openTime);
    }
    if (data.closeTime) {
      await this.closeTimeInput.fill(data.closeTime);
    }
    if (data.weekDayStart) {
      await this.weekDayStartSelect.click();
      await this.page.locator(`mat-option:has-text("${data.weekDayStart}"), option:has-text("${data.weekDayStart}")`).click();
    }
    if (data.weekDayEnd) {
      await this.weekDayEndSelect.click();
      await this.page.locator(`mat-option:has-text("${data.weekDayEnd}"), option:has-text("${data.weekDayEnd}")`).click();
    }
  }

  /**
   * Select corporate
   */
  async selectCorporate(corporateName: string) {
    await this.corporateSelect.click();
    await this.page.waitForTimeout(300);
    await this.page.locator(`mat-option:has-text("${corporateName}"), .ng-option:has-text("${corporateName}")`).click();
  }

  /**
   * Upload fountain image
   */
  async uploadImage(filePath: string) {
    await this.imageInput.setInputFiles(filePath);
    await this.page.waitForTimeout(500);
  }

  /**
   * Upload map pin image
   */
  async uploadMapPinImage(filePath: string) {
    await this.mapPinImageInput.setInputFiles(filePath);
    await this.page.waitForTimeout(500);
  }

  /**
   * Upload brand image
   */
  async uploadBrandImage(filePath: string) {
    await this.brandImageInput.setInputFiles(filePath);
    await this.page.waitForTimeout(500);
  }

  /**
   * Submit fountain form
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
   * Check if fountain exists in list by name
   */
  async fountainExistsInList(name: string): Promise<boolean> {
    const fountainCell = this.page.locator(`td:has-text("${name}")`);
    return await fountainCell.isVisible();
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
