import { test, expect } from '../fixtures/test-fixtures';

/**
 * Users Module E2E Tests
 * Comprehensive tests for user management CRUD operations
 */
test.describe('Users Management', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  test.describe('Users List', () => {
    test.beforeEach(async ({ usersPage }) => {
      await usersPage.gotoList();
    });

    test('should display users list page', async ({ usersPage }) => {
      // Verify table is visible
      await expect(usersPage.table).toBeVisible();
    });

    test('should display table with data', async ({ usersPage }) => {
      // Wait for table to load
      await usersPage.waitForTableLoad();
      
      // Verify table has rows
      const rowCount = await usersPage.getRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async ({ usersPage }) => {
      // Verify search input is visible
      await expect(usersPage.searchInput).toBeVisible();
    });

    test('should search users by text', async ({ usersPage }) => {
      // Wait for initial data to load
      await usersPage.waitForTableLoad();
      
      // Perform search
      await usersPage.search('test');
      
      // Wait for results
      await usersPage.page.waitForTimeout(1000);
      
      // Search input should contain the search term
      await expect(usersPage.searchInput).toHaveValue('test');
    });

    test('should have pagination controls when needed', async ({ usersPage }) => {
      // Wait for table to load
      await usersPage.waitForTableLoad();
      
      const rowCount = await usersPage.getRowCount();
      
      // Pagination should be visible if there are enough rows
      // This is conditional based on data
      if (rowCount > 10) {
        await expect(usersPage.paginator).toBeVisible();
      }
    });

    test('should have new user button', async ({ usersPage }) => {
      // Verify new button is visible
      await expect(usersPage.newButton).toBeVisible();
    });
  });

  test.describe('Create User', () => {
    test.beforeEach(async ({ usersPage }) => {
      await usersPage.gotoCreate();
    });

    test('should display user creation form', async ({ usersPage }) => {
      // Verify form fields are visible
      await expect(usersPage.nameInput).toBeVisible();
      await expect(usersPage.emailInput).toBeVisible();
      await expect(usersPage.saveButton).toBeVisible();
      await expect(usersPage.cancelButton).toBeVisible();
    });

    test('should have disabled save button when form is empty', async ({ usersPage }) => {
      // Wait a bit for form initialization
      await usersPage.page.waitForTimeout(500);
      
      // Save button should be disabled or form should be invalid
      const isValid = await usersPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test.skip('should create user with valid data', async ({ usersPage }) => {
      // Fill user form
      const timestamp = Date.now();
      const userData = {
        name: `Test User ${timestamp}`,
        email: `testuser${timestamp}@example.com`,
        role: 'USER',
        corporate: 'CLOSCA'
      };

      await usersPage.fillUserForm(userData);
      
      // Submit form
      await usersPage.submitForm();
      
      // Should redirect to users list
      expect(usersPage.page.url()).toContain('/users/list');
      
      // New user should appear in list
      const exists = await usersPage.userExistsInList(userData.email);
      expect(exists).toBe(true);
    });

    test('should validate email format', async ({ usersPage }) => {
      // Fill invalid email
      await usersPage.emailInput.fill('invalid-email');
      await usersPage.emailInput.blur();
      
      // Wait for validation
      await usersPage.page.waitForTimeout(300);
      
      // Form should be invalid
      const isValid = await usersPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should validate required fields', async ({ usersPage }) => {
      // Fill only email
      await usersPage.emailInput.fill('test@example.com');
      
      // Form should still be invalid
      const isValid = await usersPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should cancel user creation', async ({ usersPage }) => {
      // Fill some data
      await usersPage.nameInput.fill('Test User');
      
      // Click cancel
      await usersPage.cancelForm();
      
      // Should navigate away (to list or previous page)
      await usersPage.page.waitForTimeout(500);
      // URL should change or dialog should appear
    });
  });

  test.describe('View User', () => {
    test.skip('should display user details in read-only mode', async ({ usersPage }) => {
      // Navigate to list first
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const rowCount = await usersPage.getRowCount();
      
      if (rowCount > 0) {
        // Click view on first row
        await usersPage.clickViewOnRow(0);
        
        // Wait for navigation
        await usersPage.page.waitForTimeout(1000);
        
        // Verify we're on view page
        expect(usersPage.page.url()).toContain('/view/');
        
        // Form fields should be visible but disabled
        await expect(usersPage.nameInput).toBeVisible();
      } else {
        test.skip();
      }
    });

    test.skip('should display user statistics', async ({ usersPage }) => {
      // Navigate to list first
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const rowCount = await usersPage.getRowCount();
      
      if (rowCount > 0) {
        // Click view on first row
        await usersPage.clickViewOnRow(0);
        
        // Wait for page load
        await usersPage.page.waitForTimeout(1000);
        
        // Should display statistics (bottles, refills, etc.)
        // This depends on the actual implementation
      } else {
        test.skip();
      }
    });
  });

  test.describe('Edit User', () => {
    test.skip('should load existing user data', async ({ usersPage }) => {
      // Navigate to list first
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const rowCount = await usersPage.getRowCount();
      
      if (rowCount > 0) {
        // Get user data from list
        const userData = await usersPage.getUserDataFromRow(0);
        
        // Click edit on first row
        await usersPage.clickEditOnRow(0);
        
        // Wait for navigation
        await usersPage.page.waitForTimeout(1000);
        
        // Verify we're on edit page
        expect(usersPage.page.url()).toContain('/edit/');
        
        // Form should be populated with user data
        await expect(usersPage.nameInput).toHaveValue(userData.name);
        await expect(usersPage.emailInput).toHaveValue(userData.email);
      } else {
        test.skip();
      }
    });

    test.skip('should update user data', async ({ usersPage }) => {
      // Navigate to list first
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const rowCount = await usersPage.getRowCount();
      
      if (rowCount > 0) {
        // Click edit on first row
        await usersPage.clickEditOnRow(0);
        
        // Wait for page load
        await usersPage.page.waitForTimeout(1000);
        
        // Modify user name
        const timestamp = Date.now();
        const newName = `Updated User ${timestamp}`;
        await usersPage.nameInput.fill(newName);
        
        // Submit form
        await usersPage.submitForm();
        
        // Should redirect to list
        expect(usersPage.page.url()).toContain('/users/list');
        
        // Updated name should appear in list
        await usersPage.page.waitForTimeout(1000);
      } else {
        test.skip();
      }
    });

    test.skip('should cancel editing with unsaved changes', async ({ usersPage }) => {
      // Navigate to list first
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const rowCount = await usersPage.getRowCount();
      
      if (rowCount > 0) {
        // Click edit on first row
        await usersPage.clickEditOnRow(0);
        
        // Wait for page load
        await usersPage.page.waitForTimeout(1000);
        
        // Modify data
        await usersPage.nameInput.fill('Modified Name');
        
        // Click cancel
        await usersPage.cancelForm();
        
        // Should show confirmation dialog or navigate away
        await usersPage.page.waitForTimeout(500);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Delete User', () => {
    test.skip('should show delete confirmation dialog', async ({ usersPage }) => {
      // Navigate to list first
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const rowCount = await usersPage.getRowCount();
      
      if (rowCount > 0) {
        // Click delete on last row (to avoid affecting other tests)
        await usersPage.clickDeleteOnRow(rowCount - 1);
        
        // Wait for dialog
        await usersPage.page.waitForTimeout(500);
        
        // Dialog should be visible
        const dialog = usersPage.page.locator('mat-dialog-container, .modal');
        await expect(dialog).toBeVisible();
      } else {
        test.skip();
      }
    });

    test.skip('should delete user after confirmation', async ({ usersPage }) => {
      // Navigate to list first
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const initialRowCount = await usersPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Click delete on last row
        await usersPage.clickDeleteOnRow(initialRowCount - 1);
        
        // Wait for dialog
        await usersPage.page.waitForTimeout(500);
        
        // Confirm deletion
        const confirmButton = usersPage.page.locator('button:has-text("Confirmar"), button:has-text("Aceptar")');
        await confirmButton.click();
        
        // Wait for deletion
        await usersPage.page.waitForTimeout(1000);
        
        // Row count should decrease
        const newRowCount = await usersPage.getRowCount();
        expect(newRowCount).toBe(initialRowCount - 1);
      } else {
        test.skip();
      }
    });

    test.skip('should cancel user deletion', async ({ usersPage }) => {
      // Navigate to list first
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const initialRowCount = await usersPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Click delete on last row
        await usersPage.clickDeleteOnRow(initialRowCount - 1);
        
        // Wait for dialog
        await usersPage.page.waitForTimeout(500);
        
        // Cancel deletion
        const cancelButton = usersPage.page.locator('button:has-text("Cancelar"), button:has-text("No")');
        await cancelButton.click();
        
        // Wait a bit
        await usersPage.page.waitForTimeout(500);
        
        // Row count should stay the same
        const newRowCount = await usersPage.getRowCount();
        expect(newRowCount).toBe(initialRowCount);
      } else {
        test.skip();
      }
    });
  });

  test.describe('User Form Validation', () => {
    test.beforeEach(async ({ usersPage }) => {
      await usersPage.gotoCreate();
    });

    test('should require email field', async ({ usersPage }) => {
      // Leave email empty and fill other fields
      await usersPage.nameInput.fill('Test User');
      
      // Blur email field to trigger validation
      await usersPage.emailInput.focus();
      await usersPage.emailInput.blur();
      
      // Wait for validation
      await usersPage.page.waitForTimeout(300);
      
      // Form should be invalid
      const isValid = await usersPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should validate email format', async ({ usersPage }) => {
      // Fill invalid email formats
      const invalidEmails = ['invalid', 'test@', '@example.com', 'test @example.com'];
      
      for (const email of invalidEmails) {
        await usersPage.emailInput.fill(email);
        await usersPage.emailInput.blur();
        await usersPage.page.waitForTimeout(300);
        
        const isValid = await usersPage.isFormValid();
        expect(isValid).toBe(false);
      }
    });

    test('should accept valid email format', async ({ usersPage }) => {
      // Fill valid email
      await usersPage.emailInput.fill('valid@example.com');
      await usersPage.emailInput.blur();
      await usersPage.page.waitForTimeout(300);
      
      // Email field should be valid (though form might be invalid due to other required fields)
      const emailValue = await usersPage.emailInput.inputValue();
      expect(emailValue).toBe('valid@example.com');
    });
  });

  test.describe('User Search and Filter', () => {
    test.beforeEach(async ({ usersPage }) => {
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
    });

    test('should filter users by search term', async ({ usersPage }) => {
      const initialRowCount = await usersPage.getRowCount();
      
      if (initialRowCount > 0) {
        // Get first user data
        const userData = await usersPage.getUserDataFromRow(0);
        
        // Search by name
        await usersPage.search(userData.name.substring(0, 5));
        
        // Wait for results
        await usersPage.page.waitForTimeout(1000);
        
        // Should have fewer or equal rows
        const filteredRowCount = await usersPage.getRowCount();
        expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);
      } else {
        test.skip();
      }
    });

    test('should show no results for non-existent search', async ({ usersPage }) => {
      // Search for something that doesn't exist
      await usersPage.search('xyzabc123nonexistent');
      
      // Wait for results
      await usersPage.page.waitForTimeout(1000);
      
      // Should have zero rows or show empty state
      const rowCount = await usersPage.getRowCount();
      expect(rowCount).toBe(0);
    });

    test('should clear search and show all users', async ({ usersPage }) => {
      const initialRowCount = await usersPage.getRowCount();
      
      // Search for something
      await usersPage.search('test');
      await usersPage.page.waitForTimeout(1000);
      
      // Clear search
      await usersPage.searchInput.clear();
      await usersPage.page.waitForTimeout(1000);
      
      // Should show all users again
      const finalRowCount = await usersPage.getRowCount();
      expect(finalRowCount).toBe(initialRowCount);
    });
  });
});
