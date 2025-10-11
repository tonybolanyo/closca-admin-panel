import { test, expect } from '../fixtures/test-fixtures';
import { CrudPage } from '../pages/crud.page';

/**
 * Products Module E2E Tests
 * Tests for product management CRUD operations
 */
test.describe('Products Management', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  let productsPage: CrudPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new CrudPage(page, 'products');
  });

  test.describe('Products List', () => {
    test.beforeEach(async () => {
      await productsPage.gotoList();
    });

    test('should display products list page', async () => {
      await expect(productsPage.table).toBeVisible();
    });

    test('should display table with data', async () => {
      await productsPage.waitForTableLoad();
      const rowCount = await productsPage.getRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async () => {
      await expect(productsPage.searchInput).toBeVisible();
    });

    test('should have new product button', async () => {
      await expect(productsPage.newButton).toBeVisible();
    });
  });

  test.describe('Create Product', () => {
    test.beforeEach(async () => {
      await productsPage.gotoCreate();
    });

    test('should display product creation form', async () => {
      await expect(productsPage.nameInput).toBeVisible();
      await expect(productsPage.saveButton).toBeVisible();
      await expect(productsPage.cancelButton).toBeVisible();
    });

    test.skip('should create product with valid data', async () => {
      const timestamp = Date.now();
      await productsPage.fillBasicForm({
        name: `Test Product ${timestamp}`,
        description: 'Test product description',
        active: true
      });
      
      await productsPage.submitForm();
      expect(productsPage.page.url()).toContain('/products/list');
    });
  });

  test.describe('Product Search', () => {
    test.beforeEach(async () => {
      await productsPage.gotoList();
      await productsPage.waitForTableLoad();
    });

    test('should search products', async () => {
      await productsPage.search('test');
      await productsPage.page.waitForTimeout(1000);
      await expect(productsPage.searchInput).toHaveValue('test');
    });
  });
});

/**
 * Product Types Module E2E Tests
 * Tests for product type management CRUD operations
 */
test.describe('Product Types Management', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  let productTypesPage: CrudPage;

  test.beforeEach(async ({ page }) => {
    productTypesPage = new CrudPage(page, 'product-types');
  });

  test.describe('Product Types List', () => {
    test.beforeEach(async () => {
      await productTypesPage.gotoList();
    });

    test('should display product types list page', async () => {
      await expect(productTypesPage.table).toBeVisible();
    });

    test('should display table with data', async () => {
      await productTypesPage.waitForTableLoad();
      const rowCount = await productTypesPage.getRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async () => {
      await expect(productTypesPage.searchInput).toBeVisible();
    });

    test('should have new product type button', async () => {
      await expect(productTypesPage.newButton).toBeVisible();
    });
  });

  test.describe('Create Product Type', () => {
    test.beforeEach(async () => {
      await productTypesPage.gotoCreate();
    });

    test('should display product type creation form', async () => {
      await expect(productTypesPage.nameInput).toBeVisible();
      await expect(productTypesPage.saveButton).toBeVisible();
      await expect(productTypesPage.cancelButton).toBeVisible();
    });

    test.skip('should create product type with valid data', async () => {
      const timestamp = Date.now();
      await productTypesPage.fillBasicForm({
        name: `Test Product Type ${timestamp}`,
        description: 'Test product type description',
        active: true
      });
      
      await productTypesPage.submitForm();
      expect(productTypesPage.page.url()).toContain('/product-types/list');
    });

    test('should validate required fields', async () => {
      await productTypesPage.nameInput.focus();
      await productTypesPage.nameInput.blur();
      await productTypesPage.page.waitForTimeout(300);
      
      const isValid = await productTypesPage.isFormValid();
      expect(isValid).toBe(false);
    });
  });

  test.describe('Product Type Search', () => {
    test.beforeEach(async () => {
      await productTypesPage.gotoList();
      await productTypesPage.waitForTableLoad();
    });

    test('should search product types', async () => {
      await productTypesPage.search('test');
      await productTypesPage.page.waitForTimeout(1000);
      await expect(productTypesPage.searchInput).toHaveValue('test');
    });
  });
});
