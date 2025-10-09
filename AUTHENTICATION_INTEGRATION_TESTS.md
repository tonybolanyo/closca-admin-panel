# Authentication Flow Integration Tests

This document describes integration tests for the critical authentication flow paths in the Closca Admin Panel.

## Test Scenarios

### 1. User Registration Flow
**Path**: Landing Page → Register → Login → Home

**Steps**:
1. User navigates to landing page
2. User clicks on register link
3. User fills in registration form with valid data
4. User submits the form
5. System shows success message
6. User is redirected to login page
7. User enters credentials
8. User is redirected to home page

**Expected Results**:
- Registration form validates all required fields
- Email format is validated
- Success message appears after registration
- User can login with registered credentials
- User is redirected to appropriate home page based on role

### 2. Password Recovery Flow
**Path**: Login → Password Recovery → Email Sent → Reset Password → Login

**Steps**:
1. User navigates to login page
2. User clicks "Forgot Password" link
3. User enters registered email
4. User submits the form
5. System sends recovery email
6. User clicks link in email (with hash)
7. User enters new password twice
8. User submits password reset
9. User is redirected to login
10. User logs in with new password

**Expected Results**:
- Email format is validated
- Success message appears after requesting recovery
- Reset password form requires matching passwords
- Error shown if passwords don't match
- Success message after successful reset
- User can login with new password

### 3. Admin Login Flow
**Path**: Login → Home (Admin Panel)

**Steps**:
1. User navigates to login page
2. User enters admin credentials
3. User submits login form
4. System validates credentials
5. System checks user role is ADMIN or MANAGER
6. User is redirected to admin home page
7. Admin menu items are loaded

**Expected Results**:
- Email and password are required
- Email format is validated
- Error message shown for invalid credentials
- Error message shown if user role is not ADMIN/MANAGER
- Success: User redirected to home page with admin menu
- User session is stored

### 4. Logout Flow
**Path**: Any Admin Page → Logout → Login

**Steps**:
1. User is logged in and on any admin page
2. User clicks logout button in header
3. User session is cleared
4. User is redirected to login page

**Expected Results**:
- User session data is cleared
- User is redirected to login page
- Attempting to access admin pages without login redirects to login

## Unit Test Coverage

### Authentication Components Tested

#### PasswordRecoverComponent
- ✅ Form building with email validation
- ✅ Email format validation
- ✅ Password recovery request handling
- ✅ Success message and navigation
- ✅ Error handling (404 - email not found)
- ✅ Error handling (generic errors)

#### ResetPasswordComponent  
- ✅ Form building with password fields
- ✅ Required field validation
- ✅ Hash extraction from route params
- ✅ Password matching validation
- ✅ Password reset request handling
- ✅ Success message and navigation
- ✅ Error message for mismatched passwords

#### RegisterComponent
- ✅ Form building with all required fields
- ✅ Email format validation
- ✅ Required field validation
- ✅ Role assignment (USER)
- ✅ Registration request handling
- ✅ Success message and navigation
- ✅ Error handling

#### LandingPageComponent (existing)
- ✅ Company logo selection based on parameter
- ✅ Navigation to login page

### Guards Tested

#### AuthGuard (pending - dependency issues)
- Route protection based on authentication
- Role-based access control
- Redirect to login when not authenticated

#### LoggedUserGuard (existing)
- Prevents authenticated users from accessing login
- Redirects to home based on role

## Manual Testing Recommendations

Since some integration tests cannot be automated due to external dependencies and email verification requirements, the following should be tested manually:

1. **Email Verification**: Confirm that password recovery emails are sent and contain valid reset links
2. **Session Persistence**: Verify that user sessions persist across page refreshes
3. **Role-Based Redirects**: Test that different user roles are redirected to appropriate pages
4. **Form Validation**: Test all edge cases for form validation (special characters, SQL injection attempts, etc.)
5. **Cross-Browser Testing**: Test authentication flows in different browsers

## Known Limitations

1. **External Dependencies**: Some components depend on `@tyris/angular-foundation-libs` which is not available in the test environment
2. **API Mocking**: Full integration tests require API mocking or test environment setup
3. **Email Sending**: Cannot fully test email delivery in unit tests
4. **Session Management**: Browser session/cookie testing requires E2E framework

## Future Enhancements

1. Set up E2E testing with Protractor or Cypress for full integration flows
2. Create test user accounts in staging environment for manual testing
3. Add API contract tests to verify service integration
4. Implement visual regression testing for authentication pages
5. Add performance testing for login/registration under load
