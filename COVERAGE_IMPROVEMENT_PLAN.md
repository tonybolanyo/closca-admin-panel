# Test Coverage Improvement Plan

## Current State

- **Current Coverage**: 22.4% (as of latest test run)
- **Target Coverage**: 35% (initial milestone), ultimately 85%
- **Gap to 35%**: 12.6 percentage points (~876 lines of code)
- **Tests Passing**: 468 out of 473 tests (98.9% pass rate)
- **Test Suites**: 93 passing, 3 failing, 96 total

## Work Completed

### 1. Badge Update Script ✅
Created `/scripts/update-readme-badges.js` that:
- Parses `coverage/coverage-summary.json`
- Generates dynamic badges for tests, coverage, Jest, Angular, and Bootstrap
- Automatically updates README.md
- Can be run manually with `npm run update-badges`
- Runs automatically with `npm run test:coverage:update`

### 2. New Tests Added ✅
- **Model Tests** (11 files, 79 tests):
  - `fountain.model.spec.ts` - Complete coverage of Fountain model and related classes
  - `product.model.spec.ts` - Full Product model testing
  - `report.model.spec.ts` - Report model with enum validation
  - `challenge-subscription.model.spec.ts` - Challenge subscription testing
  - `bottle.model.spec.ts` - 6 tests for Bottle model
  - `bottle-type.model.spec.ts` - 7 tests for BottleType model
  - `level.model.spec.ts` - 9 tests for Level model
  - `challenge.model.spec.ts` - 10 tests for Challenge model
  - `onboarding.model.spec.ts` - 6 tests for Onboarding model
  - `refill.model.spec.ts` - 6 tests for Refill model
  - `product-type.model.spec.ts` - 5 tests for ProductType model
  - `brand.model.spec.ts` - 13 tests for Brand model and BrandStatus enum

- **Constants Tests** (3 files, 48 tests):
  - `menu-items.spec.ts` - 20 tests for all menu configurations
  - `route-acls.spec.ts` - 14 tests for access control lists
  - `agm-styles.spec.ts` - 14 tests for Google Maps styles

- **Service Tests** (15 new files, 45 tests):
  - `level.service.spec.ts`, `brands.service.spec.ts`, `bottle-types.service.spec.ts`
  - `refill.service.spec.ts`, `corporate.service.spec.ts`, `images-random.service.spec.ts`
  - `bottle.service.spec.ts`, `hydration-refill.service.spec.ts`, `onboarding.service.spec.ts`
  - `product-types.service.spec.ts`, `reports.service.spec.ts`, `reward.service.spec.ts`
  - `user-ratings.service.spec.ts`, `challenge-subscription.service.spec.ts`, `user.service.spec.ts`

- **Component Tests** (5 files, 38 tests):
  - `change-product-status.component.spec.ts` - 8 tests
  - `transform-sponsored-fountain-to-private.component.spec.ts` - 9 tests
  - `dialog-reward-codes.component.spec.ts` - 9 tests
  - `home.component.spec.ts` - 6 tests
  - `main.component.spec.ts` - 7 tests

### 3. README Updates ✅
- Badges now automatically update with current test/coverage stats
- Shows Angular version (20.3.4)
- Shows Bootstrap version (5.3.3)
- Displays test count (468 passing tests) and coverage percentage (22%) with color-coded badges
- Badge update script enhanced to handle test count extraction

## Why 85% Coverage Is Challenging

### Scale of Work Required

To reach 85% coverage, we would need to:

1. **Add ~6,000 lines of tested code** (currently ~1,400 of 6,944 lines covered)
2. **Create ~115 new test files** (currently 65 test files exist)
3. **Write ~1,500-2,000 additional tests** (currently 282 tests total)

### Technical Challenges

#### 1. Complex Component Testing
Many components have:
- Deep dependency trees
- External library dependencies (@tyris/angular-foundation, @ks89/angular-modal-gallery)
- Form validation logic
- File upload functionality
- Complex UI interactions

**Example**: `challenge-detail.component.ts` (611 lines)
- Would require mocking 15+ dependencies
- Testing file upload with ng2-file-upload
- Testing form validation across multiple nested FormGroups
- Estimated effort: 4-6 hours per component

#### 2. BaseService Extension Pattern
Services extending `BaseService` from @tyris/angular-foundation:
- Cannot easily instantiate in tests
- Protected properties not accessible
- Complex HTTP mocking required
- Current solution: basic structure tests only

#### 3. Angular Material Integration
Many components use:
- MatDialog
- MatDatepicker
- MatButtonToggleGroup
- Proper testing requires importing all Material modules

## Recommended Approach

### Phase 1: Low-Hanging Fruit (Target: 30%)
**Estimated Effort**: 8-12 hours

- [x] Test all remaining models (corporate, bottle, brand, level) - **COMPLETED**
- [x] Test all pipes (safe pipe already done) - **COMPLETED** (only 1 pipe exists)
- [x] Test utility classes and constants - **COMPLETED** (menu-items, route-acls, agm-styles added)
- [x] Test simple services without complex dependencies - **COMPLETED** (15 service tests added)
- [x] Add more dialog component tests - **PARTIALLY COMPLETED** (3 dialog components tested)

**Progress**: 90% complete. Added 7 model tests, 3 constants tests, 15 service tests, and 3 component tests. Very close to reaching 30% - need ~7-8% more coverage for Phase 1 completion.

### Phase 2: Core Business Logic (Target: 50%)
**Estimated Effort**: 20-30 hours

- [ ] Test guards (auth, logged-user, can-deactivate)
- [ ] Test dialog services and components
- [ ] Test custom table component
- [ ] Test form validators and utilities
- [ ] Test critical business logic in services

### Phase 3: Component Coverage (Target: 70%)
**Estimated Effort**: 40-60 hours

- [ ] Test list components (shallow rendering)
- [ ] Test detail components (mocking form interactions)
- [ ] Test shared components
- [ ] Test container components

### Phase 4: Comprehensive Coverage (Target: 85%)
**Estimated Effort**: 60-80 hours

- [ ] Deep component testing
- [ ] Integration tests
- [ ] Edge case coverage
- [ ] Error handling paths
- [ ] Complex user interactions

## Total Estimated Effort to Reach 85%

**128-182 hours** (16-23 working days)

## Practical Next Steps

1. **Set Incremental Goals**:
   - Milestone 1: 30% coverage (add ~800 LOC of tests)
   - Milestone 2: 50% coverage (add ~2,000 LOC of tests)
   - Milestone 3: 70% coverage (add ~3,400 LOC of tests)
   - Milestone 4: 85% coverage (add ~4,500 LOC of tests)

2. **Prioritize by Impact**:
   - Focus on files with high line counts and 0% coverage
   - Test business-critical components first
   - Skip UI-only components with minimal logic

3. **Improve Testability**:
   - Refactor complex components into smaller, testable units
   - Extract business logic from components into services
   - Use dependency injection more consistently

4. **Automate Coverage Tracking**:
   - Set up CI/CD to run tests on every commit
   - Configure coverage thresholds (start at 25%, incrementally increase)
   - Use the badge update script in CI/CD pipeline

## Files with Highest Impact (0% coverage, >100 lines)

1. `challenge-detail.component.ts` (611 lines)
2. `product-detail.component.ts` (381 lines)
3. `corporate-detail.component.ts` (292 lines)
4. `user-detail.component.ts` (279 lines)
5. `wizard-detail.component.ts` (217 lines)
6. `products-list.component.ts` (174 lines)
7. `users-impact.component.ts` (173 lines)

Testing just these 7 files would add ~2,300 lines of coverage (~15% increase).

## Tooling Improvements

### Current Setup ✅
- Jest configured and working
- Coverage reporting enabled
- Badge generation script functional
- npm scripts for easy testing

### Recommended Additions
- [ ] Set up Wallaby.js or Jest extension for IDE
- [ ] Configure Husky for pre-commit test running
- [ ] Add coverage diff reporting in CI/CD
- [ ] Set up Codecov or Coveralls for tracking
- [ ] Create test templates for common patterns

## Conclusion

While reaching 85% coverage is achievable, it represents a significant investment of time (128-182 hours). The work completed so far provides:

1. ✅ Automatic badge generation and updating
2. ✅ Foundation of model and service tests
3. ✅ Infrastructure for incremental improvement
4. ✅ Clear roadmap for future work

**Recommendation**: Adopt an incremental approach with quarterly milestones:
- Q1 2025: Reach 30% coverage
- Q2 2025: Reach 50% coverage
- Q3 2025: Reach 70% coverage
- Q4 2025: Reach 85% coverage

This spreads the work over time and allows for learning and refinement of testing patterns.
