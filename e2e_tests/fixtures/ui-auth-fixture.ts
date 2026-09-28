import { Page, expect } from '@playwright/test';

import AxeBuilder from '@axe-core/playwright';
import { pageFixtures } from '@fixtures/page-fixtures';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
};

export async function signIn(page: Page) {
  const maxRetries = 1;
  let attempt = 0;
  let lastErrorMessage = '';

  while (attempt < maxRetries) {
    attempt++;

    await page.goto(process.env.DEV_PSR_UI_LOGIN_URL!);
    await page.fill('#username', process.env.DEV_PSR_UI_USERNAME!);
    await page.fill('#password', process.env.DEV_PSR_UI_PASSWORD!);
    await page.getByRole('button', { name: 'Sign in' }).click();

    const errorSummary = page.locator('#error-summary');
    const signOut = page.locator('[data-qa="signOut"]');

    await Promise.race([
      page
        .waitForURL((url) => !url.pathname.includes('/auth/sign-in'), { timeout: 10000 })
        .catch(() => { }),
      errorSummary.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { }),
    ]);

    const hasLoginError = await errorSummary.isVisible().catch(() => false);
    const stillOnSignInPage = page.url().includes('/auth/sign-in');
    const hasSignOut = await signOut
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    if (!hasLoginError && !stillOnSignInPage && hasSignOut) {
      return;
    }

    lastErrorMessage = hasLoginError ? (await errorSummary.innerText()).trim() : '';
    if (!lastErrorMessage) {
      lastErrorMessage = `Login did not reach authenticated page. Current URL: ${page.url()}`;
    }
    console.warn(`Login attempt ${attempt} failed: ${lastErrorMessage}`);
  }

  throw new Error(`UI Login failed after ${maxRetries} attempts\n${lastErrorMessage}`);
}

export async function signOut(page: Page) {
  const signOutControl = page.locator('[data-qa="signOut"]');
  await signOutControl.click({ noWaitAfter: true });
  await page
    .waitForURL((url) => url.pathname.includes('/auth/sign-in'), {
      timeout: 5_000,
      waitUntil: 'domcontentloaded',
    })
    .catch(() => { });
}

// Merge pageFixtures + Axe accessibility fixture
export const test = pageFixtures.extend<AxeFixture>({
  // ---------------------------
  // Accessibility Fixture
  // ---------------------------
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#commonly-reused-element-with-known-issue');

    await use(makeAxeBuilder);
  },

  // ---------------------------
  // UI Login + Logout Fixture
  // ---------------------------
  page: async ({ context }, use) => {
    const page = await context.newPage();
    let loginSuccess = false;

    try {
      await signIn(page);
      loginSuccess = true;

      // --- RUN THE TEST ---
      await use(page);
    } finally {
      // --- LOGOUT + CLEANUP ---
      try {
        if (loginSuccess) {
          const signOutControl = page.locator('[data-qa="signOut"]');
          if (await signOutControl.isVisible()) {
            await signOut(page);
          } else {
            console.warn('Logout skipped: sign out control not visible on current page');
          }
        }
      } catch (err) {
        console.warn('Logout skipped:', err);
      }

      await page.close().catch((err) => console.warn('Page close skipped:', err));
    }
  },
});

export { expect };
