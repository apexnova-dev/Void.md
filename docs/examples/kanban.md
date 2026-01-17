# Kanban - E-commerce Project

## ⚙️ Configuration

**Columns**: 📝 Backlog | 📋 To Do | 🚀 In Progress | 👀 In Review | ✅ Done
**Categories**: Frontend, Backend, Database, DevOps, Design, Tests, Documentation, Security
**Users**: @alice, @bob, @charlie, @diana
**Tags**: #bug, #feature, #urgent, #refactor, #performance, #security, #api, #ui, #database

## 📝 Backlog

### TASK-015 | Add product recommendations system

**Priority**: Low | **Category**: Backend | **Assigned**: @alice
**Created**: 2025-11-02
**Tags**: #feature #ai #recommendations

Implement a recommendation engine based on purchase history and viewed products.

**Subtasks**:
- [ ] Analyze recommendation algorithms (collaborative filtering, content-based)
- [ ] Choose technical solution (external service or internal algo)
- [ ] Implement user data collection
- [ ] Create recommendations API
- [ ] Integrate into product interface
- [ ] A/B tests to measure impact

**Notes**:
Possibility to use a third-party service like AWS Personalize or implement a simple algo with cosine similarities.

---

### TASK-016 | Complete dark mode

**Priority**: Medium | **Category**: Frontend | **Assigned**: @diana
**Created**: 2025-11-03
**Tags**: #feature #ui #design

Add a dark theme for the entire application with user preference toggle.

**Subtasks**:
- [ ] Define dark mode color palette
- [ ] Create CSS variables for both themes
- [ ] Implement toggle switch
- [ ] Save user preference
- [ ] Test on all pages
- [ ] Respect system preference (prefers-color-scheme)

---

### TASK-017 | Analytics reports PDF export

**Priority**: Low | **Category**: Backend | **Assigned**: @bob
**Created**: 2025-11-04
**Tags**: #feature #reporting #pdf

Allow admins to export sales statistics as PDF.

**Subtasks**:
- [ ] Choose PDF library (jsPDF, PDFKit, etc.)
- [ ] Design PDF template
- [ ] Implement server-side generation
- [ ] Add charts and tables
- [ ] Export button in dashboard
- [ ] Tests with large data volumes

---

## 📋 To Do

### TASK-012 | Fix tax calculation bug

**Priority**: Critical | **Category**: Backend | **Assigned**: @bob
**Created**: 2025-11-05 | **Due**: 2025-11-08
**Tags**: #bug #urgent #taxes #payment

Taxes are not calculated correctly for international shipments. Canadian customers charged with French VAT.

**Subtasks**:
- [ ] Reproduce bug with test orders
- [ ] Identify current tax calculation logic
- [ ] Create country → tax rate mapping table
- [ ] Implement the fix
- [ ] Unit tests for each country
- [ ] End-to-end tests on checkout

**Notes**:
Bug reported by 12 customers. Potential financial impact. Fix with absolute priority.

---

### TASK-013 | Optimize product page load time

**Priority**: High | **Category**: Performance | **Assigned**: @alice
**Created**: 2025-11-06 | **Due**: 2025-11-12
**Tags**: #performance #optimization #frontend

Product page loads in 2.8s, target < 1s. Images too heavy, multiple unoptimized API requests.

**Subtasks**:
- [ ] Profile with Lighthouse and DevTools
- [ ] Optimize images (WebP, lazy loading, responsive)
- [ ] Group API requests (GraphQL or batch endpoint)
- [ ] Implement client-side cache
- [ ] Code splitting to reduce JS bundle
- [ ] Performance tests before/after

**Notes**:

**Current metrics** :
- LCP: 2.8s (target: < 1s)
- FID: 120ms (target: < 100ms)
- CLS: 0.18 (target: < 0.1)

---

### TASK-014 | Add advanced catalog filters

**Priority**: High | **Category**: Frontend | **Assigned**: @diana
**Created**: 2025-11-07
**Tags**: #feature #ui #catalog

Allow filtering products by price, brand, color, size, rating, availability with multiple combinations.

**Subtasks**:
- [ ] Design filter interface (sidebar or top bar)
- [ ] Implement filter components (checkboxes, range slider, etc.)
- [ ] Add client-side filtering logic
- [ ] Pagination with active filters
- [ ] URL query params to share filters
- [ ] Test with different combinations

---

## 🚀 In Progress

### TASK-009 | Implement Stripe payment

**Priority**: Critical | **Category**: Backend | **Assigned**: @bob, @charlie
**Created**: 2025-10-28 | **Started**: 2025-11-01 | **Due**: 2025-11-10
**Tags**: #feature #payment #stripe #api

Integrate Stripe to manage card payments, Apple Pay, Google Pay.

**Subtasks**:
- [x] Create Stripe account and get API keys
- [x] Setup Stripe SDK server-side
- [x] Create payment intent and confirmation endpoints
- [x] Implement webhook for Stripe events
- [ ] Integrate Stripe Elements frontend
- [ ] Handle payment errors (card declined, etc.)
- [ ] Tests with Stripe test cards
- [ ] Go live to production

**Notes**:

**API endpoints created** :
- POST /api/payment/create-intent
- POST /api/payment/confirm
- POST /api/webhooks/stripe

**In progress** : Frontend integration with Stripe Elements (subtask 5/8).

---

### TASK-010 | PostgreSQL database migration

**Priority**: High | **Category**: Database | **Assigned**: @alice
**Created**: 2025-10-30 | **Started**: 2025-11-04
**Tags**: #database #migration #postgresql

Migrate from SQLite to PostgreSQL to support scaling.

**Subtasks**:
- [x] Setup PostgreSQL on staging server
- [x] Create migration schema
- [x] SQLite export script
- [x] PostgreSQL import script
- [ ] Production data migration (planned for tomorrow)
- [ ] Data validation tests
- [ ] Production switchover
- [ ] Post-migration monitoring

**Notes**:

**Current blocker** :
Staging migration OK (15,000 products, 8,000 users, 12,000 orders).
Ready for prod migration tomorrow morning 6am (low traffic).

**Backup** : Complete snapshot before migration.

---

### TASK-011 | Admin analytics dashboard

**Priority**: Medium | **Category**: Frontend | **Assigned**: @diana, @charlie
**Created**: 2025-11-01 | **Started**: 2025-11-05
**Tags**: #feature #dashboard #admin #analytics

Create an admin dashboard with sales statistics, charts, KPIs.

**Subtasks**:
- [x] Design dashboard mockup
- [x] Create chart components (Chart.js)
- [x] API endpoint for statistics
- [ ] Integrate charts into interface
- [ ] Add date filters
- [ ] CSV export of data
- [ ] Tests with real data

**Notes**:

**KPIs to display** :
- Total revenue and trends
- Number of orders
- Average cart value
- Top selling products
- Top customers
- Conversion rate

Progress: 60% (4/7 subtasks completed).

---

## 👀 In Review

### TASK-007 | Wishlist system

**Priority**: Medium | **Category**: Frontend | **Assigned**: @diana
**Created**: 2025-10-25 | **Started**: 2025-10-28 | **Finished**: 2025-11-03
**Tags**: #feature #wishlist #ui

Allow users to save favorite products to a wishlist.

**Subtasks**:
- [x] Create Wishlist model in DB
- [x] CRUD API for wishlist
- [x] "Add to favorites" button on product page
- [x] Dedicated "My favorites" page
- [x] Share wishlist by link
- [x] Unit and e2e tests

**Notes**:

**Result** :
✅ Complete functionality and tested. Awaiting review from @bob.

**Modified files** :
- src/api/wishlist.js (new)
- src/components/WishlistButton.jsx (new)
- src/pages/Wishlist.jsx (new)
- src/models/Wishlist.js (new)

**Tests performed** :
- ✅ Add/remove products
- ✅ List display
- ✅ Share by unique link
- ✅ Multi-device synchronization

---

### TASK-008 | Product reviews system

**Priority**: High | **Category**: Backend | **Assigned**: @bob, @alice
**Created**: 2025-10-26 | **Started**: 2025-10-30 | **Finished**: 2025-11-04
**Tags**: #feature #reviews #moderation

Allow customers to leave reviews and ratings on products.

**Subtasks**:
- [x] Create Review model in DB
- [x] CRUD API for reviews
- [x] Moderation system (admin validation)
- [x] Display reviews on product page
- [x] Calculate average rating
- [x] Upload photos in reviews
- [x] Sort reviews (most helpful, recent, etc.)
- [x] Complete tests

**Notes**:

**Result** :
✅ Complete system with moderation, photos, and sorting. In final review.

**Modified files** :
- src/api/reviews.js (new)
- src/models/Review.js (new)
- src/components/ReviewList.jsx (new)
- src/components/ReviewForm.jsx (new)
- src/admin/ModerationPanel.jsx (new)

**Technical decisions** :
- Automatic + manual moderation (keyword filtering then admin validation)
- Photo uploads via Cloudinary
- Real-time average rating calculation with DB trigger

**Tests performed** :
- ✅ Complete CRUD reviews
- ✅ Auto/manual moderation
- ✅ Max 5 photos per review
- ✅ Performance with 10,000 reviews

---

## ✅ Done

### TASK-001 | Project setup and architecture

**Priority**: Critical | **Category**: DevOps | **Assigned**: @alice, @bob
**Created**: 2025-10-15 | **Started**: 2025-10-15 | **Finished**: 2025-10-18
**Tags**: #setup #architecture #devops

Initialize project with tech stack, CI/CD, and dev/staging/prod environments.

**Subtasks**:
- [x] Initialize Git repo
- [x] Setup Node.js + Express backend
- [x] Setup React frontend
- [x] Docker + docker-compose configuration
- [x] Setup GitHub Actions CI/CD
- [x] Dev/staging/prod environments
- [x] Architecture documentation

**Notes**:

**Result** :
✅ Project completely setup and deployable.

**Tech stack** :
- Backend: Node.js 20 + Express + TypeScript
- Frontend: React 18 + Vite + TailwindCSS
- Database: PostgreSQL 15
- Cache: Redis 7
- Hosting: AWS (EC2 + RDS + S3)

**Modified files** :
- package.json, Dockerfile, docker-compose.yml
- .github/workflows/ci.yml
- docs/ARCHITECTURE.md

---

### TASK-002 | JWT authentication

**Priority**: Critical | **Category**: Backend | **Assigned**: @bob
**Created**: 2025-10-18 | **Started**: 2025-10-19 | **Finished**: 2025-10-22
**Tags**: #security #auth #jwt

Implement authentication system with JWT, refresh tokens, and enhanced security.

**Subtasks**:
- [x] Create User model
- [x] Hash passwords with bcrypt
- [x] Generate JWT access + refresh tokens
- [x] Authentication middleware
- [x] Login/logout/refresh endpoints
- [x] Anti-brute force rate limiting
- [x] Security tests

**Notes**:

**Result** :
✅ Secure and tested auth system.

**Technical decisions** :
- Access token: 15 min (JWT)
- Refresh token: 7 days (stored in DB)
- Rate limiting: 5 attempts / 15 min per IP
- HTTPS mandatory in production

**Tests performed** :
- ✅ Login/logout/refresh
- ✅ Token expiration
- ✅ Rate limiting
- ✅ Basic penetration tests

---

### TASK-003 | Product catalog with search

**Priority**: High | **Category**: Backend | **Assigned**: @alice
**Created**: 2025-10-20 | **Started**: 2025-10-23 | **Finished**: 2025-10-27
**Tags**: #feature #catalogue #search

Create product catalog with full-text search and basic filters.

**Subtasks**:
- [x] Product model in DB
- [x] CRUD API for products
- [x] Full-text index for search
- [x] Pagination and sorting
- [x] Product image uploads (S3)
- [x] Redis cache for frequent queries
- [x] Performance tests

**Notes**:

**Result** :
✅ 500 products added, search < 50ms.

**Modified files** :
- src/models/Product.js
- src/api/products.js
- src/services/s3.js

**Performance** :
- Full-text search: 35ms average
- Listing with pagination: 20ms
- Cache hit rate: 85%

---

### TASK-004 | Shopping cart

**Priority**: High | **Category**: Frontend | **Assigned**: @diana
**Created**: 2025-10-22 | **Started**: 2025-10-25 | **Finished**: 2025-10-29
**Tags**: #feature #cart #ui

Implement shopping cart with add/remove, quantities, total calculation.

**Subtasks**:
- [x] Cart model in DB
- [x] Cart management API
- [x] CartIcon component with badge
- [x] Detailed cart page
- [x] Automatic totals calculation (subtotal, VAT, total)
- [x] Cart persistence (localStorage + DB if logged in)
- [x] E2e tests

**Notes**:

**Result** :
✅ Functional cart with multi-device sync.

**Modified files** :
- src/components/Cart.jsx
- src/api/cart.js
- src/hooks/useCart.js

**Tests performed** :
- ✅ Add/remove products
- ✅ Quantity changes
- ✅ Total calculation with taxes
- ✅ Sync between devices for logged-in users

---

### TASK-005 | Responsive user interface

**Priority**: High | **Category**: Design | **Assigned**: @diana
**Created**: 2025-10-24 | **Started**: 2025-10-27 | **Finished**: 2025-11-01
**Tags**: #design #responsive #ui #mobile

Create modern, responsive (mobile-first) interface with TailwindCSS.

**Subtasks**:
- [x] Define design system (colors, fonts, spacing)
- [x] Header/footer/navigation components
- [x] Homepage
- [x] Product detail page
- [x] Catalog page with responsive grid
- [x] Tests on mobile, tablet, desktop
- [x] Accessibility (WCAG AA)

**Notes**:

**Result** :
✅ Complete, responsive, accessible interface.

**Design system** :
- Colors: Blue palette (primary: #3b82f6)
- Font: Inter
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

**Tests performed** :
- ✅ iPhone 13 Pro, iPad Air, Desktop 1920px
- ✅ Lighthouse Accessibility score: 98/100

---

### TASK-006 | Unit and e2e tests

**Priority**: High | **Category**: Tests | **Assigned**: @charlie
**Created**: 2025-10-26 | **Started**: 2025-10-30 | **Finished**: 2025-11-02
**Tags**: #tests #quality #ci

Set up complete test suite: unit (Jest), e2e (Playwright).

**Subtasks**:
- [x] Setup Jest for backend
- [x] Setup Vitest + Testing Library for frontend
- [x] API unit tests (80%+ coverage)
- [x] Setup Playwright
- [x] E2E user journey tests
- [x] Integration in CI/CD
- [x] Coverage reporting

**Notes**:

**Result** :
✅ 240 tests, 87% coverage, CI green.

**Metrics** :
- Unit tests: 182 (backend: 95, frontend: 87)
- E2E tests: 58 scenarios
- Coverage: Backend 92%, Frontend 81%
- CI duration: 4min 30s

**Modified files** :
- tests/ (new folder, 240 test files)
- jest.config.js, vitest.config.js, playwright.config.js

---

<!-- LAST_TASK_ID:017 -->
