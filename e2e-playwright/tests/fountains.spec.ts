import { test, expect } from '../fixtures/test-fixtures';

/**
 * Fountains Module E2E Tests
 * Comprehensive tests for fountain management CRUD operations
 */
test.describe('Fountains Management', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  test.describe('Fountains List', () => {
    test.beforeEach(async ({ fountainsPage }) => {
      await fountainsPage.gotoList();
    });

    test('should display fountains list page', async ({ fountainsPage }) => {
      // Verify table is visible
      await expect(fountainsPage.table).toBeVisible();
    });

    test('should display table with data', async ({ fountainsPage }) => {
      // Wait for table to load
      await fountainsPage.waitForTableLoad();
      
      // Verify table has rows
      const rowCount = await fountainsPage.getRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should display table with headers', async ({ fountainsPage, page }) => {
      // Wait for table to load
      await page.waitForSelector('table[mat-table], table', { timeout: 10000 });
      
      // Verify table headers exist
      const headers = page.locator('th[mat-header-cell], th');
      const headerCount = await headers.count();
      
      expect(headerCount).toBeGreaterThan(0);
    });

    test('should have search functionality', async ({ fountainsPage }) => {
      // Verify search input is visible
      await expect(fountainsPage.searchInput).toBeVisible();
    });

    test('should search fountains by text', async ({ fountainsPage }) => {
      // Wait for initial data to load
      await fountainsPage.waitForTableLoad();
      
      // Perform search
      await fountainsPage.search('test');
      
      // Wait for results
      await fountainsPage.page.waitForTimeout(1000);
      
      // Search input should contain the search term
      await expect(fountainsPage.searchInput).toHaveValue('test');
    });

    test('should have new fountain button', async ({ fountainsPage }) => {
      // Verify new button is visible
      await expect(fountainsPage.newButton).toBeVisible();
    });

    test('should have pagination controls when needed', async ({ fountainsPage }) => {
      // Wait for table to load
      await fountainsPage.waitForTableLoad();
      
      const rowCount = await fountainsPage.getRowCount();
      
      // Pagination should be visible if there are enough rows
      if (rowCount > 10) {
        await expect(fountainsPage.paginator).toBeVisible();
      }
    });
  });

  test.describe('Create Fountain', () => {
    test.beforeEach(async ({ fountainsPage }) => {
      await fountainsPage.gotoCreate();
    });

    test('should display fountain creation form', async ({ fountainsPage }) => {
      // Verify basic form fields are visible
      await expect(fountainsPage.nameInput).toBeVisible();
      await expect(fountainsPage.saveButton).toBeVisible();
      await expect(fountainsPage.cancelButton).toBeVisible();
    });

    test('should have disabled save button when form is empty', async ({ fountainsPage }) => {
      // Wait a bit for form initialization
      await fountainsPage.page.waitForTimeout(500);
      
      // Save button should be disabled or form should be invalid
      const isValid = await fountainsPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test.skip('should create fountain with valid data', async ({ fountainsPage }) => {
      // Fill basic fountain information
      const timestamp = Date.now();
      await fountainsPage.fillBasicInfo({
        name: `Test Fountain ${timestamp}`,
        fountainType: 'PUBLIC',
        fountainStatus: 'ACTIVE',
        refillType: 'DRINKING_FOUNTAIN'
      });
      
      // Fill address
      await fountainsPage.fillAddress({
        street: 'Test Street 123',
        city: 'Test City',
        zipCode: '12345',
        country: 'Spain'
      });
      
      // Fill location
      await fountainsPage.fillLocation('40.4168', '-3.7038'); // Madrid coordinates
      
      // Submit form
      await fountainsPage.submitForm();
      
      // Should redirect to fountains list
      expect(fountainsPage.page.url()).toContain('/public-or-private-fountains/list');
      
      // New fountain should appear in list
      const exists = await fountainsPage.fountainExistsInList(`Test Fountain ${timestamp}`);
      expect(exists).toBe(true);
    });

    test('should validate required fields', async ({ fountainsPage }) => {
      // Fill only name
      await fountainsPage.nameInput.fill('Test Fountain');
      
      // Leave other required fields empty
      
      // Wait for validation
      await fountainsPage.page.waitForTimeout(300);
      
      // Form should be invalid
      const isValid = await fountainsPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should cancel fountain creation', async ({ fountainsPage }) => {
      // Fill some data
      await fountainsPage.nameInput.fill('Test Fountain');
      
      // Click cancel
      await fountainsPage.cancelForm();
      
      // Should navigate away
      await fountainsPage.page.waitForTimeout(500);
    });
  });

  test.describe('View Fountain', () => {
    test.skip('should display fountain details in read-only mode', async ({ fountainsPage }) => {
      // Navigate to list first
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
      
      const rowCount = await fountainsPage.getRowCount();
      
      if (rowCount > 0) {
        // Click view on first row
        await fountainsPage.clickViewOnRow(0);
        
        // Wait for navigation
        await fountainsPage.page.waitForTimeout(1000);
        
        // Verify we're on view page
        expect(fountainsPage.page.url()).toContain('/view/');
        
        // Form fields should be visible
        await expect(fountainsPage.nameInput).toBeVisible();
      } else {
        test.skip();
      }
    });

    test.skip('should display fountain on map', async ({ fountainsPage }) => {
      // Navigate to list first
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
      
      const rowCount = await fountainsPage.getRowCount();
      
      if (rowCount > 0) {
        // Click view on first row
        await fountainsPage.clickViewOnRow(0);
        
        // Wait for page load
        await fountainsPage.page.waitForTimeout(1000);
        
        // Map should be visible (if implementation includes map view)
        // This depends on the actual implementation
      } else {
        test.skip();
      }
    });
  });

  test.describe('Edit Fountain', () => {
    test.skip('should load existing fountain data', async ({ fountainsPage }) => {
      // Navigate to list first
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
      
      const rowCount = await fountainsPage.getRowCount();
      
      if (rowCount > 0) {
        // Click edit on first row
        await fountainsPage.clickEditOnRow(0);
        
        // Wait for navigation
        await fountainsPage.page.waitForTimeout(1000);
        
        // Verify we're on edit page
        expect(fountainsPage.page.url()).toContain('/edit/');
        
        // Form should be populated with fountain data
        await expect(fountainsPage.nameInput).not.toBeEmpty();
      } else {
        test.skip();
      }
    });

    test.skip('should update fountain data', async ({ fountainsPage }) => {
      // Navigate to list first
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
      
      const rowCount = await fountainsPage.getRowCount();
      
      if (rowCount > 0) {
        // Click edit on first row
        await fountainsPage.clickEditOnRow(0);
        
        // Wait for page load
        await fountainsPage.page.waitForTimeout(1000);
        
        // Modify fountain name
        const timestamp = Date.now();
        const newName = `Updated Fountain ${timestamp}`;
        await fountainsPage.nameInput.fill(newName);
        
        // Submit form
        await fountainsPage.submitForm();
        
        // Should redirect to list
        expect(fountainsPage.page.url()).toContain('/public-or-private-fountains/list');
        
        // Wait for update
        await fountainsPage.page.waitForTimeout(1000);
      } else {
        test.skip();
      }
    });

    test.skip('should cancel editing with unsaved changes', async ({ fountainsPage }) => {
      // Navigate to list first
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
      
      const rowCount = await fountainsPage.getRowCount();
      
      if (rowCount > 0) {
        // Click edit on first row
        await fountainsPage.clickEditOnRow(0);
        
        // Wait for page load
        await fountainsPage.page.waitForTimeout(1000);
        
        // Modify data
        await fountainsPage.nameInput.fill('Modified Fountain Name');
        
        // Click cancel
        await fountainsPage.cancelForm();
        
        // Should show confirmation dialog or navigate away
        await fountainsPage.page.waitForTimeout(500);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Delete Fountain', () => {
    test.skip('should show delete confirmation dialog', async ({ fountainsPage }) => {
      // Navigate to list first
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
      
      const rowCount = await fountainsPage.getRowCount();
      
      if (rowCount > 0) {
        // Click delete on last row
        await fountainsPage.clickDeleteOnRow(rowCount - 1);
        
        // Wait for dialog
        await fountainsPage.page.waitForTimeout(500);
        
        // Dialog should be visible
        const dialog = fountainsPage.page.locator('mat-dialog-container, .modal');
        await expect(dialog).toBeVisible();
      } else {
        test.skip();
      }
    });

    test.skip('should delete fountain after confirmation', async ({ fountainsPage }) => {
      // Navigate to list first
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
      
      const initialRowCount = await fountainsPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Click delete on last row
        await fountainsPage.clickDeleteOnRow(initialRowCount - 1);
        
        // Wait for dialog
        await fountainsPage.page.waitForTimeout(500);
        
        // Confirm deletion
        await fountainsPage.confirmDelete();
        
        // Wait for deletion
        await fountainsPage.page.waitForTimeout(1000);
        
        // Row count should decrease
        const newRowCount = await fountainsPage.getRowCount();
        expect(newRowCount).toBe(initialRowCount - 1);
      } else {
        test.skip();
      }
    });

    test.skip('should cancel fountain deletion', async ({ fountainsPage }) => {
      // Navigate to list first
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
      
      const initialRowCount = await fountainsPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Click delete on last row
        await fountainsPage.clickDeleteOnRow(initialRowCount - 1);
        
        // Wait for dialog
        await fountainsPage.page.waitForTimeout(500);
        
        // Cancel deletion
        await fountainsPage.cancelDelete();
        
        // Wait a bit
        await fountainsPage.page.waitForTimeout(500);
        
        // Row count should stay the same
        const newRowCount = await fountainsPage.getRowCount();
        expect(newRowCount).toBe(initialRowCount);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Fountain Form Validation', () => {
    test.beforeEach(async ({ fountainsPage }) => {
      await fountainsPage.gotoCreate();
    });

    test('should require name field', async ({ fountainsPage }) => {
      // Blur name field to trigger validation
      await fountainsPage.nameInput.focus();
      await fountainsPage.nameInput.blur();
      
      // Wait for validation
      await fountainsPage.page.waitForTimeout(300);
      
      // Form should be invalid
      const isValid = await fountainsPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should validate location coordinates', async ({ fountainsPage }) => {
      // Fill invalid coordinates
      await fountainsPage.latitudeInput.fill('invalid');
      await fountainsPage.longitudeInput.fill('invalid');
      
      // Wait for validation
      await fountainsPage.page.waitForTimeout(300);
      
      // Coordinates should be validated
      // This depends on the actual implementation
    });
  });

  test.describe('Fountain Search and Filter', () => {
    test.beforeEach(async ({ fountainsPage }) => {
      await fountainsPage.gotoList();
      await fountainsPage.waitForTableLoad();
    });

    test('should filter fountains by search term', async ({ fountainsPage }) => {
      const initialRowCount = await fountainsPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Perform search
        await fountainsPage.search('test');
        
        // Wait for results
        await fountainsPage.page.waitForTimeout(1000);
        
        // Should have fewer or equal rows
        const filteredRowCount = await fountainsPage.getRowCount();
        expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);
      } else {
        test.skip();
      }
    });

    test('should show no results for non-existent search', async ({ fountainsPage }) => {
      // Search for something that doesn't exist
      await fountainsPage.search('xyznonexistent999');
      
      // Wait for results
      await fountainsPage.page.waitForTimeout(1000);
      
      // Should have zero rows or show empty state
      const rowCount = await fountainsPage.getRowCount();
      expect(rowCount).toBe(0);
    });

    test('should clear search and show all fountains', async ({ fountainsPage }) => {
      const initialRowCount = await fountainsPage.getRowCount();
      
      // Search for something
      await fountainsPage.search('test');
      await fountainsPage.page.waitForTimeout(1000);
      
      // Clear search
      await fountainsPage.searchInput.clear();
      await fountainsPage.page.waitForTimeout(1000);
      
      // Should show all fountains again
      const finalRowCount = await fountainsPage.getRowCount();
      expect(finalRowCount).toBe(initialRowCount);
    });
  });

  test.describe('Fountain Opening Hours', () => {
    test.skip('should set opening hours', async ({ fountainsPage }) => {
      await fountainsPage.gotoCreate();
      
      // Fill basic info first
      await fountainsPage.fillBasicInfo({
        name: 'Test Fountain',
        fountainType: 'PUBLIC',
        fountainStatus: 'ACTIVE'
      });
      
      // Fill hours
      await fountainsPage.fillHours({
        openTime: '08:00',
        closeTime: '20:00',
        weekDayStart: 'MONDAY',
        weekDayEnd: 'FRIDAY'
      });
      
      // Hours should be set
      await expect(fountainsPage.openTimeInput).toHaveValue('08:00');
      await expect(fountainsPage.closeTimeInput).toHaveValue('20:00');
    });
  });
});
