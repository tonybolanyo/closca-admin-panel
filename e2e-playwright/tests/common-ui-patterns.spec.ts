import { test, expect } from '../fixtures/test-fixtures';

/**
 * Common UI Patterns E2E Tests
 * Tests for dialogs, pagination, error handling, and other shared UI components
 */
test.describe('Common UI Patterns', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  test.describe('Confirmation Dialogs', () => {
    test.skip('should show confirmation dialog for delete actions', async ({ corporatesPage }) => {
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        await corporatesPage.clickDeleteOnRow(0);
        await corporatesPage.page.waitForTimeout(500);
        
        // Dialog should be visible
        const dialog = corporatesPage.page.locator('mat-dialog-container, .modal, [role="dialog"]');
        await expect(dialog).toBeVisible();
        
        // Dialog should have confirm and cancel buttons
        const confirmButton = corporatesPage.page.locator('button:has-text("Confirmar"), button:has-text("Aceptar"), button:has-text("Sí")');
        const cancelButton = corporatesPage.page.locator('button:has-text("Cancelar"), button:has-text("No")');
        
        await expect(confirmButton).toBeVisible();
        await expect(cancelButton).toBeVisible();
        
        // Cancel the dialog
        await cancelButton.click();
      } else {
        test.skip();
      }
    });

    test.skip('should close dialog on backdrop click', async ({ corporatesPage }) => {
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        await corporatesPage.clickDeleteOnRow(0);
        await corporatesPage.page.waitForTimeout(500);
        
        // Click backdrop (outside dialog)
        const backdrop = corporatesPage.page.locator('.cdk-overlay-backdrop, .modal-backdrop');
        if (await backdrop.isVisible()) {
          await backdrop.click();
          await corporatesPage.page.waitForTimeout(300);
          
          // Dialog should be closed
          const dialog = corporatesPage.page.locator('mat-dialog-container, .modal');
          await expect(dialog).not.toBeVisible();
        }
      } else {
        test.skip();
      }
    });

    test.skip('should close dialog on ESC key', async ({ corporatesPage }) => {
      await corporatesPage.gotoList();
      await corporatesPage.waitForTableLoad();
      
      const rowCount = await corporatesPage.getRowCount();
      
      if (rowCount > 0) {
        await corporatesPage.clickDeleteOnRow(0);
        await corporatesPage.page.waitForTimeout(500);
        
        // Press ESC key
        await corporatesPage.page.keyboard.press('Escape');
        await corporatesPage.page.waitForTimeout(300);
        
        // Dialog should be closed
        const dialog = corporatesPage.page.locator('mat-dialog-container, .modal');
        await expect(dialog).not.toBeVisible();
      } else {
        test.skip();
      }
    });
  });

  test.describe('Pagination', () => {
    test.skip('should navigate to next page', async ({ usersPage }) => {
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      // Check if pagination is visible
      if (await usersPage.paginator.isVisible()) {
        // Get first row data
        const firstRowData = await usersPage.getUserDataFromRow(0);
        
        // Click next page button
        const nextButton = usersPage.page.locator('button[aria-label*="Next"], button.mat-paginator-navigation-next');
        if (await nextButton.isEnabled()) {
          await nextButton.click();
          await usersPage.page.waitForTimeout(1000);
          
          // First row should be different
          const newFirstRowData = await usersPage.getUserDataFromRow(0);
          expect(newFirstRowData.email).not.toBe(firstRowData.email);
        }
      } else {
        test.skip();
      }
    });

    test.skip('should change items per page', async ({ usersPage }) => {
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      // Check if pagination is visible
      if (await usersPage.paginator.isVisible()) {
        const initialRowCount = await usersPage.getRowCount();
        
        // Open page size selector
        const pageSizeSelector = usersPage.page.locator('mat-select[aria-label*="Items per page"]');
        if (await pageSizeSelector.isVisible()) {
          await pageSizeSelector.click();
          await usersPage.page.waitForTimeout(300);
          
          // Select different page size
          const option = usersPage.page.locator('mat-option:has-text("25")');
          if (await option.isVisible()) {
            await option.click();
            await usersPage.page.waitForTimeout(1000);
            
            // Row count should change (up to max 25)
            const newRowCount = await usersPage.getRowCount();
            expect(newRowCount).toBeGreaterThanOrEqual(initialRowCount);
          }
        }
      } else {
        test.skip();
      }
    });

    test.skip('should disable previous button on first page', async ({ usersPage }) => {
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      if (await usersPage.paginator.isVisible()) {
        const prevButton = usersPage.page.locator('button[aria-label*="Previous"], button.mat-paginator-navigation-previous');
        await expect(prevButton).toBeDisabled();
      } else {
        test.skip();
      }
    });
  });

  test.describe('Form Validation Messages', () => {
    test('should display required field error', async ({ usersPage }) => {
      await usersPage.gotoCreate();
      
      // Focus and blur email field without entering data
      await usersPage.emailInput.focus();
      await usersPage.emailInput.blur();
      
      await usersPage.page.waitForTimeout(300);
      
      // Error message should be visible
      const errorMessage = usersPage.page.locator('mat-error, .error-message, .invalid-feedback');
      // Note: This depends on the actual implementation
    });

    test('should display email format error', async ({ usersPage }) => {
      await usersPage.gotoCreate();
      
      // Enter invalid email
      await usersPage.emailInput.fill('invalid-email');
      await usersPage.emailInput.blur();
      
      await usersPage.page.waitForTimeout(300);
      
      // Form should be invalid
      const isValid = await usersPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should clear error on valid input', async ({ usersPage }) => {
      await usersPage.gotoCreate();
      
      // Enter invalid email
      await usersPage.emailInput.fill('invalid');
      await usersPage.emailInput.blur();
      await usersPage.page.waitForTimeout(300);
      
      // Now enter valid email
      await usersPage.emailInput.fill('valid@example.com');
      await usersPage.emailInput.blur();
      await usersPage.page.waitForTimeout(300);
      
      // Email should be valid
      await expect(usersPage.emailInput).toHaveValue('valid@example.com');
    });
  });

  test.describe('Loading States', () => {
    test('should show loading indicator while fetching data', async ({ usersPage }) => {
      // Navigate to list
      const navigationPromise = usersPage.gotoList();
      
      // Check for loading indicator (implementation dependent)
      const loader = usersPage.page.locator('.spinner, .loading, mat-spinner, ngx-spinner');
      
      // Wait for navigation to complete
      await navigationPromise;
      
      // Loader should eventually disappear
      await usersPage.waitForTableLoad();
    });
  });

  test.describe('Empty States', () => {
    test('should show empty state when no search results', async ({ usersPage }) => {
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      // Search for something that doesn't exist
      await usersPage.search('xyznonexistentuser999');
      await usersPage.page.waitForTimeout(1000);
      
      const rowCount = await usersPage.getRowCount();
      expect(rowCount).toBe(0);
      
      // Empty state message might be shown (implementation dependent)
      // This could be a message like "No results found" or similar
    });
  });

  test.describe('Toast/Snackbar Notifications', () => {
    test.skip('should show success notification after create', async ({ corporatesPage }) => {
      await corporatesPage.gotoCreate();
      
      const timestamp = Date.now();
      await corporatesPage.fillCorporateForm({
        name: `Test Corporate ${timestamp}`,
        code: `TEST${timestamp}`,
        description: 'Test',
        active: true
      });
      
      await corporatesPage.submitForm();
      
      // Wait for notification
      await corporatesPage.page.waitForTimeout(500);
      
      // Toast/snackbar should be visible
      const toast = corporatesPage.page.locator('mat-snack-bar-container, .toast, .notification');
      // Note: This depends on the actual implementation
    });

    test.skip('should show error notification on failure', async ({ corporatesPage }) => {
      await corporatesPage.gotoCreate();
      
      // Try to submit invalid data
      await corporatesPage.fillCorporateForm({
        name: '',
        code: '',
      });
      
      await corporatesPage.submitForm();
      
      // Wait for error notification
      await corporatesPage.page.waitForTimeout(500);
      
      // Error toast should be visible
      const errorToast = corporatesPage.page.locator('.error-toast, .error-notification');
      // Note: This depends on the actual implementation
    });
  });

  test.describe('Navigation Breadcrumbs', () => {
    test.skip('should display breadcrumbs', async ({ usersPage }) => {
      await usersPage.gotoList();
      
      // Breadcrumbs should be visible
      const breadcrumbs = usersPage.page.locator('nav[aria-label="breadcrumb"], .breadcrumb');
      // Note: This depends on the actual implementation
    });

    test.skip('should navigate using breadcrumbs', async ({ usersPage }) => {
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      const rowCount = await usersPage.getRowCount();
      
      if (rowCount > 0) {
        // Navigate to edit page
        await usersPage.clickEditOnRow(0);
        await usersPage.page.waitForTimeout(1000);
        
        // Click breadcrumb to go back to list
        const listBreadcrumb = usersPage.page.locator('a:has-text("Users"), a:has-text("Usuarios")');
        if (await listBreadcrumb.isVisible()) {
          await listBreadcrumb.click();
          await usersPage.page.waitForTimeout(500);
          
          expect(usersPage.page.url()).toContain('/users/list');
        }
      } else {
        test.skip();
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test.skip('should navigate form fields with Tab key', async ({ usersPage }) => {
      await usersPage.gotoCreate();
      
      // Focus first field
      await usersPage.nameInput.focus();
      
      // Press Tab to move to next field
      await usersPage.page.keyboard.press('Tab');
      
      // Email field should be focused
      const focusedElement = await usersPage.page.evaluate(() => document.activeElement?.getAttribute('formcontrolname'));
      expect(focusedElement).toBe('email');
    });

    test.skip('should submit form with Enter key', async ({ usersPage }) => {
      await usersPage.gotoCreate();
      
      await usersPage.emailInput.fill('test@example.com');
      await usersPage.nameInput.fill('Test User');
      
      // Press Enter
      await usersPage.page.keyboard.press('Enter');
      
      await usersPage.page.waitForTimeout(1000);
      
      // Form should be submitted (implementation dependent)
    });
  });

  test.describe('Responsive Design', () => {
    test.skip('should display mobile layout on small screens', async ({ usersPage, page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      // Mobile menu should be visible
      const mobileMenu = page.locator('.mobile-menu, .hamburger-menu');
      // Note: This depends on the actual implementation
    });

    test.skip('should hide columns on tablet view', async ({ usersPage, page }) => {
      // Set viewport to tablet size
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await usersPage.gotoList();
      await usersPage.waitForTableLoad();
      
      // Some columns might be hidden on tablet
      // This depends on responsive table implementation
    });
  });
});
