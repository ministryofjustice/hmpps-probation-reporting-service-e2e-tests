# hmpps-probation-in-court-e2e-tests

This repository contains a structured, scalable end‑to‑end automation framework built using **Playwright (TypeScript)**. It is designed to support three core test types: 
- **API tests** 
- **UI tests** 
- **E2E hybrid tests** (API → UI journeys) 

Each test type is further separated into **happy** and **unhappy** paths for clarity, reporting accuracy, and long‑term maintainability.

playwright official website: https://playwright.dev/docs/intro

## Folder Structure

e2e-tests/ - actual test specs
tests/
api/
happy/
unhappy/
ui/
happy/
unhappy/
e2e/
happy/
unhappy/

fixtures/ - Contains setup hooks and shared context (e.g. login states, mock servers) used across tests.
utils/ - Hosts helper functions, custom assertions, and reusable logic to keep tests clean and DRY.
pages/ - Implements the Page Object Model, encapsulating UI selectors and actions for maintainable test abstraction.
test-data/ - Stores test data inputs, payloads, and reusable datasets for parameterized scenarios. 
config/ - – environment configs, secrets references

### Test Types
| Type      | Description                                             |
|-----------|---------------------------------------------------------|
| **API**   | Backend-only tests using Playwright’s APIRequestContext |
| **UI**    | Browser-based tests validating frontend behaviour       |
| **E2E**   | Full journeys combining API setup + UI validation       |

### Scenario Types
| Scenario      | Description                         |
|-------------- |-------------------------------------|
| **Happy**     | Expected, successful flows          |
| **Unhappy**   | Negative, error, or edge-case flows |

-------------------------------------------------------

## Naming Conventions

| Test Type | File Suffix |
|-----------|-------------|
| API       | `.api.ts`   |
| UI        | `.ui.ts`    |
| E2E       | `.e2e.ts`   |

Example:
get-user.api.ts
login.ui.ts
create-user.e2e.ts


## Running Tests

### Run all tests

npx playwright test

### Run only API tests

npx playwright test --project=api-tests

### Run only UI tests

npx playwright test --project=ui-tests

### Run only E2E tests

npx playwright test --project=e2e-tests


---

## Environment Variables

Environment variables are loaded via `.env` and used for:

- Base URLs
- Authentication tokens
- Credentials
- Environment-specific configuration

Populate your `.env` file using the values and structure provided in `.env.example`.

---

## Reporting

Allure report is enabled by default:

npm run allure:serve

---

## Future Enhancements

- Shared error response validator for unhappy paths  
- Contract testing layer  
- CI pipeline matrix for API/UI/E2E separation  
- Test data builders for dynamic payload generation  

---

## Tech Stack

- **Playwright** (TypeScript)
- **Node.js**
- **dotenv**
- **Page Object Model** (for UI)
- **API client utilities** (for backend tests)

---

## Getting Started:

### Prerequisites:

    Node.js
    npm
    playwright with ts - npm init playwright@latest

### Installation:

    git clone - Clone the repository
                Navigate to the project directory
    cd  hmpps-probation-in-court-e2e-tests

### Install the dependencies:

    npm ci  

### Running the Tests:

  All the below scripts are in package.json

  To run the tests, use the following command:
  This test repo supports multiple browsers for running the tests - in case if you would like to run in 'firefox' or 'webkit' please replcae 'chrome' in the below commands and uncomment firefox and webkit in playwright.config.ts. But recommanded to run in 'chrome'.
  
  npm run build                     - To build the project(tsconfig.json) - This will compile your .ts files
                                      into the dist folder as specified in your tsconfig.json.

  npm run test                      - Runs all tests across every Playwright project in headless mode.
                                                 
  npm run test:headed               - Runs all tests across every Playwright project in headed mode, opening the browser 
                                      for UI/E2E tests while API tests remain headless.

  npm run allure:serve              - To view the allure report

  npm run codegen                   - It launches a browser window and starts recording your actions—clicks,
                                      typing, navigation, etc.—and generates the equivalent Playwright test code in real time.

  npm run lint                      - Before committing to catch issues.

  npm run lint:fix                  - During development to tidy up your codebase - Automatically corrects
                                      fixable issues (e.g., spacing, semicolons, unused imports).  

  npx playwright 
  test tests/eg.spec.ts             - Run a Specific Test File, Replace tests/eg.spec.ts with the path to
                                      your actual test file.

  npm run test:ui                   - UI Mode lets you explore, run, and debug tests with a time 
                                      travel experience complete with a watch mode.

  npm run test:debug                - This command opens a browser window as well as the Playwright Inspector. 
                                      You can use the step over button at the top of the inspector to step through your test.                           

### tags:

Used tags (regression, smoke, e2e, and JIRA ticket reference) -  to organize, filter, and selectively run tests by feature, priority, or environment for scalable automation.