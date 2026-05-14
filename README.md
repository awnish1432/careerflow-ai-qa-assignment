# Careerflow.ai – QA Technical Assignment
**Role:** AI-Augmented QA Engineer  
**Candidate:** Awnish Kumar Yadav  
**Submitted:** May 2026

---

## Repository Structure

```
careerflow-qa-assignment/
├── pages/                        # Page Object Models (POM)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   └── e2e-purchase-flow.spec.ts # All test cases
├── utils/
│   └── testData.ts               # Centralised test data & constants
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI pipeline
├── playwright.config.ts
├── package.json
├── TASK2-TEST-SCENARIO-DESIGN.md # Task 2 – AI Mock Interview test plan
└── README.md
```

---

## Task 1 — UI Automation (Playwright + TypeScript)

### Site Under Test
**SauceDemo** — https://www.saucedemo.com  
A publicly accessible demo e-commerce application by Sauce Labs, purpose-built for QA automation practice.

### Why SauceDemo?
SauceDemo was chosen because it replicates a real e-commerce user journey (login → browse → cart → checkout → confirmation) with multiple user types, form validations, and sort/filter functionality — providing a rich surface for meaningful assertions beyond simple navigation checks.

### Flow Automated
**Login → Browse Products → Add to Cart → Checkout → Order Confirmation**

This is the highest-priority user journey on any e-commerce platform. A defect anywhere in this path directly impacts conversion and revenue, making it the most critical flow to cover in automation.

### Test Cases Included

| Test ID | Description | Priority |
|---|---|---|
| TC-001 | Complete E2E purchase flow — login to order confirmed | High |
| TC-002 | Locked-out user sees correct error on login | High |
| TC-003 | Checkout form validation — missing required fields | High |
| TC-004 | Cart badge updates when product added then removed | Medium |
| TC-005 | Products sort correctly by ascending price | Medium |

### Architecture — Page Object Model (POM)

Each page of the application is encapsulated in its own class under `/pages/`. Tests import these classes and interact with the app through their public methods — keeping test logic clean and locators maintainable in one place.

```
LoginPage      → handles login form, error assertions
InventoryPage  → handles product listing, add/remove from cart, sort
CartPage       → handles cart view, item assertions
CheckoutPage   → handles 3-step checkout (info → overview → confirmation)
```

Test data (usernames, passwords, product names, error messages) is centralised in `utils/testData.ts` — no magic strings in tests.

### Tools & Versions

| Tool | Version |
|---|---|
| Node.js | v20.x |
| Playwright | ^1.44.0 |
| TypeScript | via @playwright/test |
| Browser | Chromium (headless in CI) |

### Setup & Run Instructions

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/careerflow-qa-assignment.git
cd careerflow-qa-assignment

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium

# 4. Run all tests (headless)
npm test

# 5. Run tests with browser visible
npm run test:headed

# 6. View HTML report after test run
npm run test:report
```

### Assumptions

- SauceDemo is publicly available and does not require any paid credentials. The test accounts (`standard_user`, `locked_out_user`) are provided by Sauce Labs for testing purposes.
- Tests are designed to run against the live SauceDemo site. No local mock server is required.
- Only Chromium is configured in CI to keep pipeline fast. Additional browsers can be added to `playwright.config.ts`.

### CI/CD — GitHub Actions

The pipeline runs automatically on every push or pull request to `main`/`master`.

**Workflow file:** `.github/workflows/playwright.yml`

Steps:
1. Checkout code
2. Setup Node.js 20
3. `npm ci` — clean dependency install
4. Install Chromium browser
5. Run Playwright tests
6. Upload HTML report as artifact (retained 7 days)
