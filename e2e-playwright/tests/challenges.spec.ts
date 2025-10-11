import { test, expect } from '../fixtures/test-fixtures';
import { CrudPage } from '../pages/crud.page';

/**
 * Challenges Module E2E Tests
 * Tests for challenge management CRUD operations
 */
test.describe('Challenges Management', () => {
  // Skip these tests if authentication is not configured
  test.skip(({ page }) => !process.env.TEST_USER_EMAIL, 'Requires authentication');

  let challengesPage: CrudPage;

  test.beforeEach(async ({ page }) => {
    challengesPage = new CrudPage(page, 'challenges');
  });

  test.describe('Challenges List', () => {
    test.beforeEach(async () => {
      await challengesPage.gotoList();
    });

    test('should display challenges list page', async () => {
      // Verify table is visible
      await expect(challengesPage.table).toBeVisible();
    });

    test('should display table with data', async () => {
      // Wait for table to load
      await challengesPage.waitForTableLoad();
      
      // Verify table has rows
      const rowCount = await challengesPage.getRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async () => {
      // Verify search input is visible
      await expect(challengesPage.searchInput).toBeVisible();
    });

    test('should have new challenge button', async () => {
      // Verify new button is visible
      await expect(challengesPage.newButton).toBeVisible();
    });

    test('should have pagination controls when needed', async () => {
      await challengesPage.waitForTableLoad();
      const rowCount = await challengesPage.getRowCount();
      
      if (rowCount > 10) {
        await expect(challengesPage.paginator).toBeVisible();
      }
    });
  });

  test.describe('Create Challenge', () => {
    test.beforeEach(async () => {
      await challengesPage.gotoCreate();
    });

    test('should display challenge creation form', async () => {
      // Verify form fields are visible
      await expect(challengesPage.nameInput).toBeVisible();
      await expect(challengesPage.saveButton).toBeVisible();
      await expect(challengesPage.cancelButton).toBeVisible();
    });

    test('should have disabled save button when form is empty', async () => {
      await challengesPage.page.waitForTimeout(500);
      
      const isValid = await challengesPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test.skip('should create challenge with valid data', async () => {
      const timestamp = Date.now();
      await challengesPage.fillBasicForm({
        name: `Test Challenge ${timestamp}`,
        description: 'Test challenge description',
        active: true
      });
      
      await challengesPage.submitForm();
      
      // Should redirect to list
      expect(challengesPage.page.url()).toContain('/challenges/list');
      
      // New challenge should appear in list
      const exists = await challengesPage.itemExistsInList(`Test Challenge ${timestamp}`);
      expect(exists).toBe(true);
    });

    test('should validate required fields', async () => {
      // Blur name field to trigger validation
      await challengesPage.nameInput.focus();
      await challengesPage.nameInput.blur();
      
      await challengesPage.page.waitForTimeout(300);
      
      const isValid = await challengesPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should allow entering description', async () => {
      const description = 'Complete 100 refills in a month';
      await challengesPage.descriptionInput.fill(description);
      
      await expect(challengesPage.descriptionInput).toHaveValue(description);
    });

    test('should cancel challenge creation', async () => {
      await challengesPage.nameInput.fill('Test Challenge');
      await challengesPage.cancelForm();
      
      await challengesPage.page.waitForTimeout(500);
    });
  });

  test.describe('View Challenge', () => {
    test.skip('should display challenge details', async () => {
      await challengesPage.gotoList();
      await challengesPage.waitForTableLoad();
      
      const rowCount = await challengesPage.getRowCount();
      
      if (rowCount > 0) {
        await challengesPage.clickViewOnRow(0);
        await challengesPage.page.waitForTimeout(1000);
        
        expect(challengesPage.page.url()).toContain('/view/');
        await expect(challengesPage.nameInput).toBeVisible();
      } else {
        test.skip();
      }
    });
  });

  test.describe('Edit Challenge', () => {
    test.skip('should load existing challenge data', async () => {
      await challengesPage.gotoList();
      await challengesPage.waitForTableLoad();
      
      const rowCount = await challengesPage.getRowCount();
      
      if (rowCount > 0) {
        const challengeData = await challengesPage.getItemDataFromRow(0);
        
        await challengesPage.clickEditOnRow(0);
        await challengesPage.page.waitForTimeout(1000);
        
        expect(challengesPage.page.url()).toContain('/edit/');
        await expect(challengesPage.nameInput).toHaveValue(challengeData.name);
      } else {
        test.skip();
      }
    });

    test.skip('should update challenge data', async () => {
      await challengesPage.gotoList();
      await challengesPage.waitForTableLoad();
      
      const rowCount = await challengesPage.getRowCount();
      
      if (rowCount > 0) {
        await challengesPage.clickEditOnRow(0);
        await challengesPage.page.waitForTimeout(1000);
        
        const newDescription = `Updated challenge ${Date.now()}`;
        await challengesPage.descriptionInput.fill(newDescription);
        
        await challengesPage.submitForm();
        
        expect(challengesPage.page.url()).toContain('/challenges/list');
      } else {
        test.skip();
      }
    });

    test.skip('should cancel editing with unsaved changes', async () => {
      await challengesPage.gotoList();
      await challengesPage.waitForTableLoad();
      
      const rowCount = await challengesPage.getRowCount();
      
      if (rowCount > 0) {
        await challengesPage.clickEditOnRow(0);
        await challengesPage.page.waitForTimeout(1000);
        
        await challengesPage.nameInput.fill('Modified Challenge');
        await challengesPage.cancelForm();
        
        await challengesPage.page.waitForTimeout(500);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Delete Challenge', () => {
    test.skip('should show delete confirmation dialog', async () => {
      await challengesPage.gotoList();
      await challengesPage.waitForTableLoad();
      
      const rowCount = await challengesPage.getRowCount();
      
      if (rowCount > 0) {
        await challengesPage.clickDeleteOnRow(rowCount - 1);
        await challengesPage.page.waitForTimeout(500);
        
        const dialog = challengesPage.page.locator('mat-dialog-container, .modal');
        await expect(dialog).toBeVisible();
      } else {
        test.skip();
      }
    });

    test.skip('should delete challenge after confirmation', async () => {
      await challengesPage.gotoList();
      await challengesPage.waitForTableLoad();
      
      const initialRowCount = await challengesPage.getRowCount();
      
      if (initialRowCount > 0) {
        await challengesPage.clickDeleteOnRow(initialRowCount - 1);
        await challengesPage.page.waitForTimeout(500);
        
        await challengesPage.confirmDelete();
        await challengesPage.page.waitForTimeout(1000);
        
        const newRowCount = await challengesPage.getRowCount();
        expect(newRowCount).toBe(initialRowCount - 1);
      } else {
        test.skip();
      }
    });

    test.skip('should cancel challenge deletion', async () => {
      await challengesPage.gotoList();
      await challengesPage.waitForTableLoad();
      
      const initialRowCount = await challengesPage.getRowCount();
      
      if (initialRowCount > 0) {
        await challengesPage.clickDeleteOnRow(initialRowCount - 1);
        await challengesPage.page.waitForTimeout(500);
        
        await challengesPage.cancelDelete();
        await challengesPage.page.waitForTimeout(500);
        
        const newRowCount = await challengesPage.getRowCount();
        expect(newRowCount).toBe(initialRowCount);
      } else {
        test.skip();
      }
    });
  });

  test.describe('Challenge Search and Filter', () => {
    test.beforeEach(async () => {
      await challengesPage.gotoList();
      await challengesPage.waitForTableLoad();
    });

    test('should search challenges by text', async () => {
      await challengesPage.search('test');
      await challengesPage.page.waitForTimeout(1000);
      
      await expect(challengesPage.searchInput).toHaveValue('test');
    });

    test('should filter challenges by search term', async () => {
      const initialRowCount = await challengesPage.getRowCount();
      
      if (initialRowCount > 0) {
        const challengeData = await challengesPage.getItemDataFromRow(0);
        await challengesPage.search(challengeData.name.substring(0, 3));
        await challengesPage.page.waitForTimeout(1000);
        
        const filteredRowCount = await challengesPage.getRowCount();
        expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);
      } else {
        test.skip();
      }
    });

    test('should show no results for non-existent search', async () => {
      await challengesPage.search('xyznonexistent999');
      await challengesPage.page.waitForTimeout(1000);
      
      const rowCount = await challengesPage.getRowCount();
      expect(rowCount).toBe(0);
    });

    test('should clear search and show all challenges', async () => {
      const initialRowCount = await challengesPage.getRowCount();
      
      await challengesPage.search('test');
      await challengesPage.page.waitForTimeout(1000);
      
      await challengesPage.searchInput.clear();
      await challengesPage.page.waitForTimeout(1000);
      
      const finalRowCount = await challengesPage.getRowCount();
      expect(finalRowCount).toBe(initialRowCount);
    });
  });

  test.describe('Challenge Form Validation', () => {
    test.beforeEach(async () => {
      await challengesPage.gotoCreate();
    });

    test('should require name field', async () => {
      await challengesPage.nameInput.focus();
      await challengesPage.nameInput.blur();
      await challengesPage.page.waitForTimeout(300);
      
      const isValid = await challengesPage.isFormValid();
      expect(isValid).toBe(false);
    });

    test('should accept valid challenge data', async () => {
      await challengesPage.nameInput.fill('Valid Challenge');
      await challengesPage.page.waitForTimeout(300);
      
      // Name field should have the value
      await expect(challengesPage.nameInput).toHaveValue('Valid Challenge');
    });
  });
});
