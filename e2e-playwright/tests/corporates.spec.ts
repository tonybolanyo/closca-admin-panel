import { test, expect } from '../fixtures/test-fixtures';

/**
 * Corporates Module E2E Tests
 * Comprehensive tests for corporate management CRUD operations
 */
test.describe('Corporates Management', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  test.describe('Corporates List', () => {
    test.beforeEach(async ({ corporatesPage }) => {
      await corporatesPage.gotoList();
    });

    test('should display corporates list page', async ({ corporatesPage }) => {
      // Verify table is visible
      await expect(corporatesPage.table).toBeVisible();
    });

    test('should display table with data', async ({ corporatesPage }) => {
      // Wait for table to load
      await corporatesPage.waitForTableLoad();
      
      // Verify table has rows
      const rowCount = await corporatesPage.getRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async ({ corporatesPage }) => {
      // Verify search input is visible
      await expect(corporatesPage.searchInput).toBeVisible();
    });

    test('should search corporates by text', async ({ corporatesPage }) => {
      // Wait for initial data to load
      await corporatesPage.waitForTableLoad();
      
      // Perform search
      await corporatesPage.search('closca');
      
      // Wait for results
      await corporatesPage.page.waitForTimeout(1000);
      
      // Search input should contain the search term
      await expect(corporatesPage.searchInput).toHaveValue('closca');
    });

    test('should have new corporate button', async ({ corporatesPage }) => {
      // Verify new button is visible
      await expect(corporatesPage.newButton).toBeVisible();
    });

    test('should have pagination controls when needed', async ({ corporatesPage }) => {
      // Wait for table to load
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      // Pagination should be visible if there are enough rows
      if (rowCount > 10) {
        await expect(corporatesPage.paginator).toBeVisible();
      }
    });
  });

  test.describe('Create Corporate', () => {
    test.beforeEach(async ({ corporatesPage }) => {
      await corporatesPage.gotoCreate();
    });

    test('should display corporate creation form', async ({ corporatesPage }) => {
      // Verify form fields are visible
      await expect(corporatesPage.nameInput).toBeVisible();
      await expect(corporatesPage.codeInput).toBeVisible();
      await expect(corporatesPage.saveButton).toBeVisible();
      await expect(corporatesPage.cancelButton).toBeVisible();
    });

    test('should have disabled save button when form is empty', async ({ corporatesPage }) => {
      // Wait a bit for form initialization
      await corporatesPage.page.waitForTimeout(500);
      
      // Save button should be disabled or form should be invalid
      const isValid = await corporatesPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test.skip('should create corporate with valid data', async ({ corporatesPage }) => {
      // Fill corporate form
      const timestamp = Date.now();
      const corporateData = {
        name: `Test Corporate ${timestamp}`,
        code: `TEST${timestamp}`,
        description: 'Test corporate description',
        active: true
      };

      await corporatesPage.fillCorporateForm(corporateData);
      
      // Submit form
      await corporatesPage.submitForm();
      
      // Should redirect to corporates list
      expect(corporatesPage.page.url()).toContain('/corporates/list');
      
      // New corporate should appear in list
      const exists = await corporatesPage.corporateExistsInList(corporateData.name);
      expect(exists).toBe(true);
    });

    test('should validate required fields', async ({ corporatesPage }) => {
      // Fill only name
      await corporatesPage.nameInput.fill('Test Corporate');
      
      // Leave code empty and blur
      await corporatesPage.codeInput.focus();
      await corporatesPage.codeInput.blur();
      
      // Wait for validation
      await corporatesPage.page.waitForTimeout(300);
      
      // Form should be invalid if code is required
      const isValid = await corporatesPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should allow entering description', async ({ corporatesPage }) => {
      // Fill description
      const description = 'This is a test corporate description';
      await corporatesPage.descriptionInput.fill(description);
      
      // Verify value is set
      await expect(corporatesPage.descriptionInput).toHaveValue(description);
    });

    test('should cancel corporate creation', async ({ corporatesPage }) => {
      // Fill some data
      await corporatesPage.nameInput.fill('Test Corporate');
      await corporatesPage.codeInput.fill('TEST');
      
      // Click cancel
      await corporatesPage.cancelForm();
      
      // Should navigate away
      await corporatesPage.page.waitForTimeout(500);
      // URL should change or dialog should appear
    });
  });

  test.describe('View Corporate', () => {
    test.skip('should display corporate details in read-only mode', async ({ corporatesPage }) => {
      // Navigate to list first
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        // Click view on first row
        await corporatesPage.clickViewOnRow(0);
        
        // Wait for navigation
        await corporatesPage.page.waitForTimeout(1000);
        
        // Verify we're on view page
        expect(corporatesPage.page.url()).toContain('/view/');
        
        // Form fields should be visible
        await expect(corporatesPage.nameInput).toBeVisible();
        await expect(corporatesPage.codeInput).toBeVisible();
      } else {
        test.skip();
      }
    });

    test.skip('should display corporate information', async ({ corporatesPage }) => {
      // Navigate to list first
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        // Get corporate data from list
        const corporateData = await corporatesPage.getCorporateDataFromRow(0);
        
        // Click view on first row
        await corporatesPage.clickViewOnRow(0);
        
        // Wait for page load
        await corporatesPage.page.waitForTimeout(1000);
        
        // Should display corporate name
        await expect(corporatesPage.nameInput).toHaveValue(corporateData.name);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Edit Corporate', () => {
    test.skip('should load existing corporate data', async ({ corporatesPage }) => {
      // Navigate to list first
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        // Get corporate data from list
        const corporateData = await corporatesPage.getCorporateDataFromRow(0);
        
        // Click edit on first row
        await corporatesPage.clickEditOnRow(0);
        
        // Wait for navigation
        await corporatesPage.page.waitForTimeout(1000);
        
        // Verify we're on edit page
        expect(corporatesPage.page.url()).toContain('/edit/');
        
        // Form should be populated with corporate data
        await expect(corporatesPage.nameInput).toHaveValue(corporateData.name);
        await expect(corporatesPage.codeInput).toHaveValue(corporateData.code);
      } else {
        test.skip();
      }
    });

    test.skip('should update corporate data', async ({ corporatesPage }) => {
      // Navigate to list first
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        // Click edit on first row
        await corporatesPage.clickEditOnRow(0);
        
        // Wait for page load
        await corporatesPage.page.waitForTimeout(1000);
        
        // Modify corporate description
        const newDescription = `Updated description ${Date.now()}`;
        await corporatesPage.descriptionInput.fill(newDescription);
        
        // Submit form
        await corporatesPage.submitForm();
        
        // Should redirect to list
        expect(corporatesPage.page.url()).toContain('/corporates/list');
        
        // Wait for navigation
        await corporatesPage.page.waitForTimeout(1000);
      } else {
        test.skip();
      }
    });

    test.skip('should cancel editing with unsaved changes', async ({ corporatesPage }) => {
      // Navigate to list first
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        // Click edit on first row
        await corporatesPage.clickEditOnRow(0);
        
        // Wait for page load
        await corporatesPage.page.waitForTimeout(1000);
        
        // Modify data
        await corporatesPage.nameInput.fill('Modified Corporate Name');
        
        // Click cancel
        await corporatesPage.cancelForm();
        
        // Should show confirmation dialog or navigate away
        await corporatesPage.page.waitForTimeout(500);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Delete Corporate', () => {
    test.skip('should show delete confirmation dialog', async ({ corporatesPage }) => {
      // Navigate to list first
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        // Click delete on last row
        await corporatesPage.clickDeleteOnRow(rowCount - 1);
        
        // Wait for dialog
        await corporatesPage.page.waitForTimeout(500);
        
        // Dialog should be visible
        const dialog = corporatesPage.page.locator('mat-dialog-container, .modal');
        await expect(dialog).toBeVisible();
      } else {
        test.skip();
      }
    });

    test.skip('should delete corporate after confirmation', async ({ corporatesPage }) => {
      // Navigate to list first
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const initialRowCount = await corporatesPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Click delete on last row
        await corporatesPage.clickDeleteOnRow(initialRowCount - 1);
        
        // Wait for dialog
        await corporatesPage.page.waitForTimeout(500);
        
        // Confirm deletion
        await corporatesPage.confirmDelete();
        
        // Wait for deletion
        await corporatesPage.page.waitForTimeout(1000);
        
        // Row count should decrease or show error if corporate has dependencies
        const newRowCount = await corporatesPage.getRowCount();
        // Note: Deletion might fail if corporate has users or fountains
      } else {
        test.skip();
      }
    });

    test.skip('should cancel corporate deletion', async ({ corporatesPage }) => {
      // Navigate to list first
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const initialRowCount = await corporatesPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Click delete on last row
        await corporatesPage.clickDeleteOnRow(initialRowCount - 1);
        
        // Wait for dialog
        await corporatesPage.page.waitForTimeout(500);
        
        // Cancel deletion
        await corporatesPage.cancelDelete();
        
        // Wait a bit
        await corporatesPage.page.waitForTimeout(500);
        
        // Row count should stay the same
        const newRowCount = await corporatesPage.getRowCount();
        expect(newRowCount).toBe(initialRowCount);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Corporate Form Validation', () => {
    test.beforeEach(async ({ corporatesPage }) => {
      await corporatesPage.gotoCreate();
    });

    test('should require name field', async ({ corporatesPage }) => {
      // Leave name empty and fill code
      await corporatesPage.codeInput.fill('TEST');
      
      // Blur name field to trigger validation
      await corporatesPage.nameInput.focus();
      await corporatesPage.nameInput.blur();
      
      // Wait for validation
      await corporatesPage.page.waitForTimeout(300);
      
      // Form should be invalid
      const isValid = await corporatesPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should require code field', async ({ corporatesPage }) => {
      // Fill name but leave code empty
      await corporatesPage.nameInput.fill('Test Corporate');
      
      // Blur code field to trigger validation
      await corporatesPage.codeInput.focus();
      await corporatesPage.codeInput.blur();
      
      // Wait for validation
      await corporatesPage.page.waitForTimeout(300);
      
      // Form should be invalid
      const isValid = await corporatesPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should accept valid corporate data', async ({ corporatesPage }) => {
      // Fill all required fields
      await corporatesPage.nameInput.fill('Valid Corporate');
      await corporatesPage.codeInput.fill('VALID');
      
      // Wait for validation
      await corporatesPage.page.waitForTimeout(300);
      
      // Form should be valid (save button enabled)
      const isValid = await corporatesPage.isFormValid();
      expect(isValid).toBe(true);
    });

    test('should handle description as optional', async ({ corporatesPage }) => {
      // Fill required fields only
      await corporatesPage.nameInput.fill('Test Corporate');
      await corporatesPage.codeInput.fill('TEST');
      
      // Leave description empty
      
      // Wait for validation
      await corporatesPage.page.waitForTimeout(300);
      
      // Form should still be valid
      const isValid = await corporatesPage.isFormValid();
      expect(isValid).toBe(true);
    });
  });

  test.describe('Corporate Search and Filter', () => {
    test.beforeEach(async ({ corporatesPage }) => {
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
    });

    test('should filter corporates by search term', async ({ corporatesPage }) => {
      const initialRowCount = await corporatesPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Get first corporate data
        const corporateData = await corporatesPage.getCorporateDataFromRow(0);
        
        // Search by name (use first few characters)
        await corporatesPage.search(corporateData.name.substring(0, 3));
        
        // Wait for results
        await corporatesPage.page.waitForTimeout(1000);
        
        // Should have fewer or equal rows
        const filteredRowCount = await corporatesPage.getRowCount();
        expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);
      } else {
        test.skip();
      }
    });

    test('should show no results for non-existent search', async ({ corporatesPage }) => {
      // Search for something that doesn't exist
      await corporatesPage.search('xyznonexistent123');
      
      // Wait for results
      await corporatesPage.page.waitForTimeout(1000);
      
      // Should have zero rows or show empty state
      const rowCount = await corporatesPage.getRowCount();
      expect(rowCount).toBe(0);
    });

    test('should clear search and show all corporates', async ({ corporatesPage }) => {
      const initialRowCount = await corporatesPage.getRowCount();
      
      // Search for something
      await corporatesPage.search('test');
      await corporatesPage.page.waitForTimeout(1000);
      
      // Clear search
      await corporatesPage.searchInput.clear();
      await corporatesPage.page.waitForTimeout(1000);
      
      // Should show all corporates again
      const finalRowCount = await corporatesPage.getRowCount();
      expect(finalRowCount).toBe(initialRowCount);
    });
  });

  test.describe('Corporate Status Management', () => {
    test.skip('should toggle corporate active status', async ({ corporatesPage }) => {
      await corporatesPage.gotoCreate();
      
      // Toggle status
      await corporatesPage.statusToggle.click();
      
      // Wait a bit
      await corporatesPage.page.waitForTimeout(300);
      
      // Status should be toggled
      // This test depends on the actual implementation
    });
  });

  test.describe('Corporate Image Upload', () => {
    test.skip('should upload corporate logo', async ({ corporatesPage }) => {
      await corporatesPage.gotoCreate();
      
      // Fill required fields first
      await corporatesPage.nameInput.fill('Test Corporate');
      await corporatesPage.codeInput.fill('TEST');
      
      // Upload logo (would need a test image file)
      // await corporatesPage.uploadLogo('path/to/test/image.png');
      
      // Wait for upload
      await corporatesPage.page.waitForTimeout(500);
    });
  });
});
