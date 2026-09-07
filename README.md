# hmpps-probation-in-court-e2e-tests

This repository contains Playwright (TypeScript) automation for:

- API tests
- UI tests
- E2E journeys

Test coverage is organized into happy and unhappy paths for maintainability and reporting clarity.

Playwright docs: https://playwright.dev/docs/intro

## Project Structure

```text
e2e_tests/
    fixtures/     shared test fixtures (auth, page objects, setup)
    pages/        page object models
    test-data/    reusable test data
    tests/        api/ui/e2e specs
    utils/        common helpers and generators
```

## Installation and Setup

### Prerequisites

- Node.js (LTS recommended)
- npm
- Microsoft Edge (used by current UI and E2E Playwright project configuration)

### Setup steps

1. Clone the repository.
2. Move into the project folder.
3. Install dependencies:

    npm ci

4. Install Playwright browser dependencies:

    npx playwright install

5. Create local environment file from template:

    cp .env.example .env

6. Update .env with valid environment values (URLs, usernames, passwords).

### Quick verification

Run these commands to verify setup:

- List UI tests:

  npx playwright test --project=ui-tests --list

- Run one UI test:

  npm run test:ui:file -- e2e_tests/tests/ui/happy/psr-defendant-details-page.ui.ts

## Test Types

| Type | Suffix | Description |
|---|---|---|
| API | .api.ts | Backend/API-only checks |
| UI | .ui.ts | Browser UI validation |
| E2E | .e2e.ts | End-to-end user journeys |

## Current UI Architecture

- [e2e_tests/fixtures/ui-auth-fixture.ts](e2e_tests/fixtures/ui-auth-fixture.ts) handles login and cleanup only.
- Page-specific navigation belongs to each UI spec (or its page object methods).
- This avoids hidden fixture side effects across multiple UI test files.

## Run Commands

### Core commands

```bash
npx playwright test
npx playwright test --project=api-tests
npx playwright test --project=ui-tests
npx playwright test --project=e2e-tests
```

### Useful UI commands

```bash
npx playwright test --project=ui-tests --list
npx playwright test e2e_tests/tests/ui/happy/psr-offence-analysis-page.ui.ts --project=ui-tests --headed
```

### NPM scripts

```bash
npm run test
npm run test:headed
npm run test:ui
npm run test:ui:headed
npm run test:accessibility
npm run test:api
npm run test:e2e
```

### Run one specific file

```bash
npm run test:file -- e2e_tests/tests/ui/happy/psr-offence-analysis-page.ui.ts
npm run test:ui:file -- e2e_tests/tests/ui/happy/psr-offence-analysis-page.ui.ts
npm run test:ui:file:headed -- e2e_tests/tests/ui/happy/psr-offence-analysis-page.ui.ts
```

## UI Textarea Helper

Shared helper: [e2e_tests/utils/common-helpers.ts](e2e_tests/utils/common-helpers.ts)

```ts
fillTextInTextArea(page, textOrLength, textAreaKey?, randomMode?)
```

- `textOrLength`: direct text (`string`) or character count (`number`)
- `textAreaKey` (optional): textarea `name/id` or heading text above textarea
- `randomMode` (optional): `readable` (default) or `complex`

### Examples

```ts
await commonFunctions.fillTextInTextArea(page, 10000, 'Analyse offences under consideration');
await commonFunctions.fillTextInTextArea(page, 8000, 'Analyse previous offending behaviour and response to supervision');
await commonFunctions.fillTextInTextArea(page, 'Manual text from test', 'Analyse offences under consideration');
await commonFunctions.fillTextInTextArea(page, 5000, 'Analyse offences under consideration', 'complex');
```

### Notes

- Numeric input defaults to `readable` mode.
- Use `complex` mode when special characters are required.
- Max generated length is `20000`.
- If multiple textareas exist and no key is provided, helper throws a clear error.

## Random Text Generators

Source: [e2e_tests/utils/random-paragraph-generator.ts](e2e_tests/utils/random-paragraph-generator.ts)

- `generateReadableRandomParagraph(length)` for happy-path readable text
- `generateRandomParagraph(length, { mode: 'complex' })` for stress/edge data

## Other Common Helpers

Source: [e2e_tests/utils/common-helpers.ts](e2e_tests/utils/common-helpers.ts)

- `verifyNoAccessibilityViolations(makeAxeBuilder)`
- `verifyPageHeadingsByName(page, headingText)`
- `verifyPageByText(page, text)`
- `clickOnButtonByName(page, buttonName)`
- `selectCheckBoxByName(page, checkBoxName)`

## Environment Variables

Environment variables are loaded from `.env`.

Use [/.env.example](.env.example) as the template for required keys.

## Reporting

```bash
npm run allure:serve
```

Accessibility checks also attach the following artifacts to the Playwright/Allure report:

- `accessibility-summary`: readable plain-text summary of each violation
- `accessibility-violations`: raw Axe JSON for developer investigation

## Accessibility Standards Used

Accessibility checks in this project use Axe tags for these WCAG levels:

### wcag2a

- WCAG 2.0 Level A (minimum requirements)
- Typical examples: missing alt text, missing form labels, heading structure issues, keyboard access issues

### wcag2aa

- WCAG 2.0 Level AA (enhanced requirements)
- Typical examples: color contrast, resize text behavior, visible focus, meaningful link text

### wcag21a

- WCAG 2.1 Level A (modern interaction coverage)
- Typical examples: pointer/gesture behavior, orientation handling, reflow/mobile usability

### wcag21aa

- WCAG 2.1 Level AA (advanced requirements)
- Typical examples: status messages, stronger contrast expectations, input purpose

## AxeBuilder Configuration

Source: [e2e_tests/fixtures/ui-auth-fixture.ts](e2e_tests/fixtures/ui-auth-fixture.ts)

The shared accessibility fixture creates `makeAxeBuilder()` and applies the default tags:

- `wcag2a`
- `wcag2aa`
- `wcag21a`
- `wcag21aa`

Current shared exclusion:

- `#commonly-reused-element-with-known-issue`

This means every test can call the same builder and run consistent accessibility checks.

### Typical usage in a test

```ts
await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
```

### Run accessibility-only tests

```bash
npm run test:accessibility
```

### When to add exclusions

- Add exclusions only for known, accepted issues with a clear ticket reference.
- Keep exclusions as narrow as possible (target the exact selector).
- Remove exclusions as soon as the underlying issue is fixed.

## Troubleshooting

- If login fails, verify UI credentials and login URL in `.env`.
- If heading assertions fail, confirm expected heading text/casing.
- If textarea helper fails with ambiguity, pass `textAreaKey` explicitly.

## Tech Stack

- Playwright (TypeScript)
- Node.js
- dotenv
- Page Object Model

## Tags

Tags such as `@smoke`, `@regression`, and ticket references are used for selective test execution and reporting.