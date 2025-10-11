# Adding Data Test IDs - Guidelines

This document provides guidelines for adding `data-testid` attributes to components for E2E testing.

## Purpose

Data test IDs provide:
- Stable selectors for E2E tests
- Clear identification of testable elements
- Independence from CSS classes and structure
- Better test maintainability

## Naming Convention

Use kebab-case with descriptive names:

```
{module}-{component}-{element}-{type}
```

Examples:
- `login-email-input`
- `login-submit-button`
- `landing-welcome-title`
- `fountains-new-button`
- `fountains-table`
- `user-edit-button-0` (for items in a list)

## When to Add Test IDs

Add `data-testid` to:

### Critical User Actions
- Form inputs
- Submit buttons
- Navigation links
- Action buttons (create, edit, delete)
- Menu items

### Important Display Elements
- Page titles
- Status messages
- Error messages
- Data tables
- Cards and panels

### Interactive Components
- Dropdowns
- Checkboxes
- Radio buttons
- Toggle switches
- Modals/dialogs

## Examples by Component Type

### Forms

```html
<!-- Login Form -->
<form data-testid="login-form">
  <input 
    type="email" 
    formControlName="email"
    data-testid="login-email-input">
  
  <input 
    type="password" 
    formControlName="password"
    data-testid="login-password-input">
  
  <button 
    type="submit"
    data-testid="login-submit-button">
    Submit
  </button>
</form>
```

### Lists/Tables

```html
<!-- Fountains List -->
<div data-testid="fountains-list-container">
  <button data-testid="fountains-new-button">New Fountain</button>
  
  <input 
    type="text" 
    placeholder="Search"
    data-testid="fountains-search-input">
  
  <table data-testid="fountains-table">
    <tr *ngFor="let fountain of fountains; let i = index">
      <td>{{ fountain.name }}</td>
      <td>
        <button 
          [attr.data-testid]="'fountain-view-button-' + i">
          View
        </button>
        <button 
          [attr.data-testid]="'fountain-edit-button-' + i">
          Edit
        </button>
        <button 
          [attr.data-testid]="'fountain-delete-button-' + i">
          Delete
        </button>
      </td>
    </tr>
  </table>
</div>
```

### Navigation

```html
<!-- Main Navigation -->
<nav data-testid="main-navigation">
  <a routerLink="/admin/fountains" data-testid="nav-fountains-link">
    Fountains
  </a>
  <a routerLink="/admin/users" data-testid="nav-users-link">
    Users
  </a>
  <a routerLink="/admin/corporates" data-testid="nav-corporates-link">
    Corporates
  </a>
</nav>
```

### Modals/Dialogs

```html
<!-- Confirmation Dialog -->
<div data-testid="confirmation-dialog">
  <h2 data-testid="dialog-title">{{ title }}</h2>
  <p data-testid="dialog-message">{{ message }}</p>
  
  <button 
    data-testid="dialog-cancel-button"
    (click)="onCancel()">
    Cancel
  </button>
  <button 
    data-testid="dialog-confirm-button"
    (click)="onConfirm()">
    Confirm
  </button>
</div>
```

### Cards/Panels

```html
<!-- Info Card -->
<mat-card data-testid="fountain-info-card">
  <mat-card-title data-testid="fountain-name">
    {{ fountain.name }}
  </mat-card-title>
  <mat-card-content data-testid="fountain-details">
    <p data-testid="fountain-address">{{ fountain.address }}</p>
    <p data-testid="fountain-status">{{ fountain.status }}</p>
  </mat-card-content>
</mat-card>
```

## Dynamic Test IDs

For lists and repeated elements, use attribute binding:

```html
<!-- Static -->
<button data-testid="submit-button">Submit</button>

<!-- Dynamic -->
<button [attr.data-testid]="'user-edit-' + user.id">Edit</button>

<!-- Loop index -->
<div *ngFor="let item of items; let i = index">
  <button [attr.data-testid]="'item-' + i + '-edit'">Edit</button>
</div>

<!-- Conditional -->
<div [attr.data-testid]="isActive ? 'active-status' : 'inactive-status'">
  {{ status }}
</div>
```

## Using Test IDs in Tests

### Page Object Model

```typescript
export class FountainsPage extends BasePage {
  readonly newButton: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.newButton = this.getByTestId('fountains-new-button');
    this.searchInput = this.getByTestId('fountains-search-input');
    this.table = this.getByTestId('fountains-table');
  }

  async clickNew() {
    await this.newButton.click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }
}
```

### Test File

```typescript
test('should create new fountain', async ({ page }) => {
  // Navigate to page
  await page.goto('/admin/fountains');
  
  // Click new button using test ID
  await page.getByTestId('fountains-new-button').click();
  
  // Fill form
  await page.getByTestId('fountain-name-input').fill('Test Fountain');
  await page.getByTestId('fountain-address-input').fill('Test Address');
  
  // Submit
  await page.getByTestId('fountain-submit-button').click();
  
  // Verify
  await expect(page.getByTestId('success-message')).toBeVisible();
});
```

## Best Practices

### DO:
- Use descriptive, meaningful names
- Keep names consistent across similar components
- Use kebab-case for multi-word names
- Add test IDs to all critical interactive elements
- Document complex test ID patterns in comments

### DON'T:
- Don't use generic names like `button1`, `input2`
- Don't change test IDs without updating tests
- Don't use test IDs for styling or business logic
- Don't add test IDs to every single element (only critical ones)
- Don't use spaces or special characters

## Checklist for Adding Test IDs

When adding test IDs to a new component:

- [ ] Identify critical user interactions
- [ ] Add test IDs to form inputs and buttons
- [ ] Add test IDs to navigation elements
- [ ] Add test IDs to data display elements
- [ ] Use dynamic test IDs for lists/repeated elements
- [ ] Test the selectors work in your E2E tests
- [ ] Document any complex patterns

## Component-Specific Examples

### Login Component
```html
<div data-testid="login-container">
  <img data-testid="login-logo" [src]="logo" />
  <form data-testid="login-form">
    <input data-testid="login-email-input" formControlName="email" />
    <input data-testid="login-password-input" formControlName="password" />
    <button data-testid="login-submit-button" type="submit">Login</button>
  </form>
  <a data-testid="login-forgot-password-link" routerLink="/forgot-password">
    Forgot Password?
  </a>
</div>
```

### CRUD List Component
```html
<div data-testid="crud-list-container">
  <div data-testid="crud-list-header">
    <h1 data-testid="crud-list-title">{{ title }}</h1>
    <button data-testid="crud-list-new-button">New</button>
  </div>
  
  <input data-testid="crud-list-search" placeholder="Search..." />
  
  <table data-testid="crud-list-table">
    <thead>
      <tr>
        <th data-testid="crud-list-header-name">Name</th>
        <th data-testid="crud-list-header-actions">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items; let i = index" 
          [attr.data-testid]="'crud-list-row-' + i">
        <td [attr.data-testid]="'crud-list-cell-name-' + i">{{ item.name }}</td>
        <td>
          <button [attr.data-testid]="'crud-list-view-' + i">View</button>
          <button [attr.data-testid]="'crud-list-edit-' + i">Edit</button>
          <button [attr.data-testid]="'crud-list-delete-' + i">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
  
  <mat-paginator data-testid="crud-list-paginator"></mat-paginator>
</div>
```

### Detail/Edit Form Component
```html
<div data-testid="fountain-detail-container">
  <h1 data-testid="fountain-detail-title">Fountain Details</h1>
  
  <form [formGroup]="fountainForm" data-testid="fountain-detail-form">
    <mat-form-field>
      <input 
        matInput 
        formControlName="name"
        data-testid="fountain-detail-name-input">
    </mat-form-field>
    
    <mat-form-field>
      <input 
        matInput 
        formControlName="address"
        data-testid="fountain-detail-address-input">
    </mat-form-field>
    
    <mat-select 
      formControlName="status"
      data-testid="fountain-detail-status-select">
      <mat-option value="active" data-testid="fountain-detail-status-active">
        Active
      </mat-option>
      <mat-option value="inactive" data-testid="fountain-detail-status-inactive">
        Inactive
      </mat-option>
    </mat-select>
    
    <div data-testid="fountain-detail-actions">
      <button 
        type="button"
        data-testid="fountain-detail-cancel-button">
        Cancel
      </button>
      <button 
        type="submit"
        data-testid="fountain-detail-save-button">
        Save
      </button>
    </div>
  </form>
</div>
```

## Migration Strategy

To add test IDs to existing components:

1. **Identify Priority Components**
   - Start with authentication flows
   - Then critical CRUD operations
   - Finally, secondary features

2. **Update Templates**
   - Add test IDs to templates
   - Use consistent naming
   - Document changes

3. **Create/Update Page Objects**
   - Create page object models
   - Use test IDs in selectors
   - Add interaction methods

4. **Write Tests**
   - Write E2E tests using page objects
   - Verify tests pass
   - Add to CI pipeline

5. **Document**
   - Update component documentation
   - Add comments for complex patterns
   - Update test documentation

## Tools and Resources

### Playwright DevTools
```bash
# Generate test IDs automatically
npx playwright codegen http://localhost:4200
```

### Browser Extensions
- Playwright Inspector
- Chrome DevTools

### Validation
```typescript
// Check if test ID exists
await page.locator('[data-testid]').count();

// List all test IDs on page
const testIds = await page.locator('[data-testid]').evaluateAll(
  elements => elements.map(el => el.getAttribute('data-testid'))
);
console.log('Test IDs on page:', testIds);
```

## Related Documentation

- [E2E_TESTING.md](E2E_TESTING.md) - Complete E2E testing guide
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
