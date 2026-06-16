import * as dotenv from 'dotenv';

import { defineConfig, devices } from '@playwright/test';

dotenv.config();

export default defineConfig({
  testDir: './e2e_tests/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    //['html', { open: 'never' }],
    //['list', { open: 'never' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false,
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //headless: isHeadless,
    baseURL: process.env.DEV_API_AUTH_URL,
    viewport: { width: 1920, height: 1080 }, // Chromium only
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-tests',
      use: {
        headless: true, // force headless so --headed doesn't break API tests
      },
      testMatch: [/.*\.api\.ts$/],
      outputDir: 'allure-results/api',
    },
    {
      name: 'ui-tests',
      testMatch: [/.*\.ui\.ts$/],
      use: { browserName: 'chromium' },
      outputDir: 'allure-results/ui',
    },
    {
      name: 'e2e-tests',
      testMatch: [/.*\.e2e\.ts$/],
      use: { browserName: 'chromium' },
      outputDir: 'allure-results/e2e',
    },
  ],

  // projects: [
  //   {
  //     name: 'chromium',
  //     use: {
  //       headless: isHeadless,
  //       ...devices['Desktop Chrome'],
  //     },
  //   },

  // {
  //   name: 'firefox',
  //   use: { ...devices['Desktop Firefox'] },
  // },

  // {
  //   name: 'webkit',
  //   use: { ...devices['Desktop Safari'] },
  // },

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
