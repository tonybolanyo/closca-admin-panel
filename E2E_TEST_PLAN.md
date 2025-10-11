# E2E Test Plan - Comprehensive Coverage

This document outlines a comprehensive end-to-end testing plan for the Closca Admin Panel, covering all CRUD operations and secondary features for maximum path coverage.

## Overview

The goal is to achieve comprehensive E2E test coverage across all major modules of the admin panel, ensuring critical user journeys, CRUD operations, form validations, error handling, and edge cases are thoroughly tested.

## Testing Strategy

### 1. Test Levels
- **Critical Path Tests**: Authentication, navigation, core CRUD operations
- **Happy Path Tests**: Standard user flows with valid data
- **Error Path Tests**: Invalid inputs, network errors, permission errors
- **Edge Case Tests**: Boundary conditions, empty states, concurrent operations

### 2. Test Categories
- **CRUD Operations**: Create, Read, Update, Delete for all entities
- **Form Validation**: Client-side and server-side validation
- **Search & Filtering**: Data retrieval and filtering mechanisms
- **Pagination**: List navigation and data loading
- **Authentication**: Login, logout, session management
- **Authorization**: Role-based access control
- **Error Handling**: Network failures, validation errors, server errors
- **UI Interactions**: Modals, dialogs, confirmations, tooltips
- **Data Integrity**: Relationships between entities, cascading operations

## Module-by-Module Test Coverage

### 1. Authentication & Authorization ✅ (Partial)

**Existing Tests:**
- Login page display ✅
- Form validation ✅
- Invalid email validation ✅
- Button state management ✅

**Additional Tests Needed:**
- [ ] Successful login with valid credentials
- [ ] Failed login with invalid credentials
- [ ] Login error message display
- [ ] Session timeout handling
- [ ] Logout functionality
- [ ] Remember me functionality (if exists)
- [ ] Password reset flow
- [ ] Token refresh handling

### 2. Landing Page ✅ (Complete)

**Existing Tests:**
- Page display ✅
- Welcome message ✅
- Navigation buttons ✅
- Logo display ✅

### 3. Navigation & Routing ✅ (Partial)

**Existing Tests:**
- Home page loading ✅
- URL redirects ✅
- Invalid routes ✅

**Additional Tests Needed:**
- [ ] Main menu navigation to all modules
- [ ] Breadcrumb navigation
- [ ] Back button functionality
- [ ] Deep linking to specific entities
- [ ] Protected route access (auth guard)
- [ ] Role-based menu visibility

### 4. Users Module (Priority: HIGH)

#### 4.1 Users List
- [ ] Display users list table
- [ ] Verify table columns (name, email, role, corporate, status)
- [ ] Sort by different columns
- [ ] Search users by name/email
- [ ] Filter by role
- [ ] Filter by corporate
- [ ] Filter by status (active/inactive)
- [ ] Pagination controls
- [ ] Navigate to next/previous page
- [ ] Change items per page
- [ ] Empty state when no users
- [ ] Loading state while fetching data

#### 4.2 Create User
- [ ] Navigate to create user page
- [ ] Display empty form
- [ ] Fill all required fields
- [ ] Validate email format
- [ ] Validate required fields
- [ ] Select corporate from dropdown
- [ ] Select role
- [ ] Submit form with valid data
- [ ] Verify user created successfully
- [ ] Verify redirect to users list
- [ ] Verify new user appears in list
- [ ] Cancel creation and confirm navigation

#### 4.3 View User
- [ ] Navigate to user detail (view mode)
- [ ] Display user information (read-only)
- [ ] Display associated corporate
- [ ] Display user statistics (bottles, refills, fountains)
- [ ] Display user role
- [ ] Navigate back to list

#### 4.4 Edit User
- [ ] Navigate to edit user page
- [ ] Load existing user data
- [ ] Modify user fields
- [ ] Change corporate assignment
- [ ] Change user role
- [ ] Save changes
- [ ] Verify changes persisted
- [ ] Cancel editing with unsaved changes
- [ ] Confirm discard changes dialog

#### 4.5 Delete/Deactivate User
- [ ] Click delete/deactivate button
- [ ] Confirm deletion in dialog
- [ ] Verify user removed/deactivated
- [ ] Cancel deletion
- [ ] Verify user still exists

#### 4.6 User Form Validation
- [ ] Required field validation
- [ ] Email format validation
- [ ] Duplicate email validation
- [ ] Corporate selection required
- [ ] Role selection required
- [ ] Form submission disabled when invalid

### 5. Corporates Module (Priority: HIGH)

#### 5.1 Corporates List
- [ ] Display corporates list table
- [ ] Verify table columns (name, code, description, status)
- [ ] Sort by different columns
- [ ] Search corporates by name/code
- [ ] Filter by status
- [ ] Pagination controls
- [ ] Empty state when no corporates
- [ ] Loading state

#### 5.2 Create Corporate
- [ ] Navigate to create corporate page
- [ ] Display empty form
- [ ] Fill required fields (name, code)
- [ ] Add description
- [ ] Upload logo/image
- [ ] Set active/inactive status
- [ ] Submit form with valid data
- [ ] Verify corporate created
- [ ] Verify redirect to list
- [ ] Verify new corporate in list

#### 5.3 View Corporate
- [ ] Navigate to corporate detail (view mode)
- [ ] Display corporate information
- [ ] Display corporate logo/image
- [ ] Display associated users count
- [ ] Display associated fountains count

#### 5.4 Edit Corporate
- [ ] Navigate to edit corporate page
- [ ] Load existing corporate data
- [ ] Modify corporate fields
- [ ] Change logo/image
- [ ] Update status
- [ ] Save changes
- [ ] Verify changes persisted
- [ ] Cancel editing

#### 5.5 Delete Corporate
- [ ] Click delete button
- [ ] Confirm deletion (or show error if has users)
- [ ] Verify corporate removed
- [ ] Cancel deletion

#### 5.6 Corporate Form Validation
- [ ] Required field validation (name, code)
- [ ] Unique code validation
- [ ] Image upload validation
- [ ] Form submission disabled when invalid

### 6. Fountains Module (Priority: HIGH)

#### 6.1 Fountains List
- [ ] Display fountains list table
- [ ] Verify table columns (name, type, status, address, corporate)
- [ ] Sort by different columns
- [ ] Search fountains by name/address
- [ ] Filter by fountain type
- [ ] Filter by status
- [ ] Filter by corporate
- [ ] Filter by refill type
- [ ] Pagination controls
- [ ] View fountain on map
- [ ] Empty state
- [ ] Loading state

#### 6.2 Create Fountain
- [ ] Navigate to create fountain page
- [ ] Display empty form with tabs/sections
- [ ] Fill basic information (name, type, status)
- [ ] Fill address information
- [ ] Set location on map (lat/long)
- [ ] Select refill type
- [ ] Select corporate (if applicable)
- [ ] Add opening hours
- [ ] Set week days (start/end)
- [ ] Select features/amenities
- [ ] Upload fountain image
- [ ] Upload map pin image
- [ ] Submit form with valid data
- [ ] Verify fountain created
- [ ] Verify redirect to list

#### 6.3 View Fountain
- [ ] Navigate to fountain detail (view mode)
- [ ] Display all fountain information
- [ ] Display location on map
- [ ] Display images
- [ ] Display features
- [ ] Display associated corporate

#### 6.4 Edit Fountain
- [ ] Navigate to edit fountain page
- [ ] Load existing fountain data
- [ ] Modify fountain fields
- [ ] Update location on map
- [ ] Change images
- [ ] Update features
- [ ] Save changes
- [ ] Verify changes persisted
- [ ] Cancel editing

#### 6.5 Delete Fountain
- [ ] Click delete button
- [ ] Confirm deletion
- [ ] Verify fountain removed
- [ ] Cancel deletion

#### 6.6 Fountain Form Validation
- [ ] Required field validation (name, type, status, address)
- [ ] Location coordinates validation
- [ ] Opening hours validation
- [ ] Image upload validation
- [ ] Form submission disabled when invalid

### 7. Bottles Module (Priority: MEDIUM)

#### 7.1 Bottles List
- [ ] Display bottles list
- [ ] Search bottles
- [ ] Filter by bottle type
- [ ] Filter by user
- [ ] View bottle details
- [ ] Pagination

#### 7.2 Create Bottle
- [ ] Navigate to create bottle
- [ ] Fill bottle information
- [ ] Select bottle type
- [ ] Assign to user
- [ ] Upload images
- [ ] Submit form
- [ ] Verify creation

#### 7.3 Edit Bottle
- [ ] Navigate to edit
- [ ] Modify bottle data
- [ ] Save changes
- [ ] Verify updates

#### 7.4 Delete Bottle
- [ ] Delete bottle
- [ ] Confirm deletion
- [ ] Verify removal

### 8. Bottle Types Module (Priority: MEDIUM)

#### 8.1 Bottle Types CRUD
- [ ] List bottle types
- [ ] Create new bottle type
- [ ] Edit bottle type
- [ ] Delete bottle type
- [ ] Search and filter
- [ ] Pagination

### 9. Brands Module (Priority: MEDIUM)

#### 9.1 Brands CRUD
- [ ] List brands
- [ ] Create new brand
- [ ] Edit brand
- [ ] Delete brand
- [ ] Upload brand logo
- [ ] Search and filter

### 10. Challenges Module (Priority: MEDIUM)

#### 10.1 Challenges CRUD
- [ ] List challenges
- [ ] Create new challenge
- [ ] Edit challenge
- [ ] Delete challenge
- [ ] Set challenge parameters
- [ ] Search and filter

### 11. Products & Product Types (Priority: LOW)

#### 11.1 Products
- [ ] List products
- [ ] Create product
- [ ] Edit product
- [ ] Delete product
- [ ] Assign product type
- [ ] Upload product images

#### 11.2 Product Types
- [ ] List product types
- [ ] Create product type
- [ ] Edit product type
- [ ] Delete product type

### 12. Levels Module (Priority: LOW)

#### 12.1 Levels CRUD
- [ ] List levels
- [ ] Create level
- [ ] Edit level
- [ ] Delete level
- [ ] Set level requirements

### 13. Reports Module (Priority: MEDIUM)

#### 13.1 Reports Display
- [ ] View different report types
- [ ] Filter reports by date range
- [ ] Filter by corporate
- [ ] Export reports (if applicable)
- [ ] Verify chart/graph displays

### 14. Wizards & Special Features (Priority: LOW)

#### 14.1 Wizard Flows
- [ ] Complete wizard steps
- [ ] Navigate between steps
- [ ] Validate each step
- [ ] Submit wizard
- [ ] Cancel wizard

## Cross-Cutting Concerns

### Form Validation Tests (All Modules)
- [ ] Required field validation messages
- [ ] Format validation (email, phone, URL)
- [ ] Range validation (numbers, dates)
- [ ] Custom validation rules
- [ ] Real-time validation feedback
- [ ] Submit button state based on form validity
- [ ] Error message clarity and positioning

### Search & Filtering Tests (All List Views)
- [ ] Search by text (name, description, code)
- [ ] Filter by status (active/inactive)
- [ ] Filter by category/type
- [ ] Filter by related entity
- [ ] Combine multiple filters
- [ ] Clear filters
- [ ] Persist filters on navigation
- [ ] Search with no results

### Pagination Tests (All List Views)
- [ ] Navigate to next page
- [ ] Navigate to previous page
- [ ] Jump to specific page
- [ ] Change items per page (10, 25, 50, 100)
- [ ] Display total count
- [ ] First page state (previous disabled)
- [ ] Last page state (next disabled)
- [ ] Single page state (no pagination controls)

### Error Handling Tests
- [ ] Network error handling
- [ ] Server error (500) handling
- [ ] Not found (404) handling
- [ ] Unauthorized (401) handling
- [ ] Forbidden (403) handling
- [ ] Validation error display
- [ ] Error toast/notification display
- [ ] Retry mechanism
- [ ] Graceful degradation

### Dialog & Modal Tests
- [ ] Confirmation dialogs (delete, cancel)
- [ ] Form dialogs (quick create/edit)
- [ ] Info dialogs
- [ ] Dialog close on backdrop click
- [ ] Dialog close on ESC key
- [ ] Dialog action buttons
- [ ] Dialog form validation

### Image Upload Tests
- [ ] Select image file
- [ ] Preview image before upload
- [ ] Upload valid image
- [ ] Validate image format (jpg, png)
- [ ] Validate image size
- [ ] Remove uploaded image
- [ ] Replace existing image
- [ ] Error on invalid file

### Data Relationship Tests
- [ ] User-Corporate relationship
- [ ] Fountain-Corporate relationship
- [ ] Bottle-User relationship
- [ ] Bottle-BottleType relationship
- [ ] Product-ProductType relationship
- [ ] Cascade delete prevention
- [ ] Related entity display

## Performance Tests

- [ ] List loading performance (large datasets)
- [ ] Search responsiveness
- [ ] Form submission speed
- [ ] Image upload performance
- [ ] Concurrent user operations

## Accessibility Tests

- [ ] Keyboard navigation
- [ ] Focus management
- [ ] ARIA labels
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Form field labels

## Responsive Design Tests

- [ ] Desktop layout (1920x1080)
- [ ] Tablet layout (768x1024)
- [ ] Mobile layout (375x667)
- [ ] Menu responsiveness
- [ ] Table responsiveness
- [ ] Form layout on mobile

## Test Execution Strategy

### Phase 1: Critical Paths (Week 1)
1. Authentication flows
2. Users CRUD operations
3. Corporates CRUD operations
4. Fountains CRUD operations

### Phase 2: Secondary Features (Week 2)
1. Bottles and Bottle Types
2. Brands
3. Challenges
4. Products and Product Types

### Phase 3: Cross-Cutting Concerns (Week 3)
1. Form validation across all modules
2. Search and filtering
3. Pagination
4. Error handling
5. Dialogs and modals

### Phase 4: Advanced Features (Week 4)
1. Reports
2. Wizards
3. Performance tests
4. Accessibility tests
5. Responsive design tests

## Success Metrics

- **Coverage Target**: 80% of user-facing features
- **Test Count Goal**: 200+ test scenarios
- **Critical Path Coverage**: 100%
- **Regression Prevention**: All major bugs caught by E2E tests
- **CI/CD Integration**: All tests passing on every PR

## Test Data Strategy

- Use consistent test data across tests
- Create test data fixtures
- Clean up test data after tests
- Use unique identifiers to avoid conflicts
- Mock external dependencies where appropriate

## Reporting & Monitoring

- HTML test reports
- Screenshot capture on failure
- Video recording for critical tests
- Test execution time tracking
- Flaky test identification
- Coverage reports

## Maintenance Plan

- Regular test review and updates
- Remove obsolete tests
- Update selectors when UI changes
- Keep page objects in sync with components
- Document test failures and resolutions
