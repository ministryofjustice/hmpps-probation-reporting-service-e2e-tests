import { test as base, expect } from '@playwright/test';

import AxeBuilder from '@axe-core/playwright';
import { commonFunctions } from '@utils/common-helpers';
import { pageFixtures } from '@fixtures/page-fixtures';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
};

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
  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const maxRetries = 1;
    let attempt = 0;
    let loginSuccess = false;
    let lastErrorMessage = '';

    while (attempt < maxRetries && !loginSuccess) {
      attempt++;

      await page.goto(process.env.DEV_PSR_UI_LOGIN_URL!);
      await page.fill('#username', process.env.DEV_PSR_UI_USERNAME!);
      await page.fill('#password', process.env.DEV_PSR_UI_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in' }).click();

      const errorSummary = page.locator('#error-summary');
      const signOut = page.locator('[data-qa="signOut"]');

      await Promise.race([
        page
          .waitForURL(url => !url.pathname.includes('/auth/sign-in'), { timeout: 10000 })
          .catch(() => { }),
        errorSummary.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { }),
      ]);

      let hasLoginError = await errorSummary.isVisible().catch(() => false);
      let stillOnSignInPage = page.url().includes('/auth/sign-in');
      let hasSignOut = await signOut.isVisible().catch(() => false);

      if (!hasLoginError && !stillOnSignInPage && !hasSignOut) {
        await Promise.race([
          signOut.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { }),
          errorSummary.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { }),
        ]);

        hasLoginError = await errorSummary.isVisible().catch(() => false);
        stillOnSignInPage = page.url().includes('/auth/sign-in');
        hasSignOut = await signOut.isVisible().catch(() => false);
      }

      if (hasLoginError || stillOnSignInPage || !hasSignOut) {
        lastErrorMessage = hasLoginError
          ? (await errorSummary.innerText()).trim()
          : '';
        if (!lastErrorMessage) {
          lastErrorMessage = `Login did not reach authenticated page. Current URL: ${page.url()}`;
        }
        console.warn(`Login attempt ${attempt} failed: ${lastErrorMessage}`);

        if (attempt < maxRetries) continue;
      } else {
        loginSuccess = true;
      }
    }

    if (!loginSuccess) {
      expect(false, `UI Login failed after ${maxRetries} attempts\n${lastErrorMessage}`).toBe(true);
    }

    // --- RUN THE TEST ---
    await use(page);

    // --- LOGOUT + CLEANUP ---
    try {
      const signOut = page.locator('[data-qa="signOut"]');
      if (await signOut.isVisible()) {
        await signOut.click();
        if (!page.url().includes('/auth/sign-in')) {
          console.warn('Logout clicked but no sign-in redirect detected; continuing cleanup');
        }
      } else {
        console.warn('Logout skipped: sign out control not visible on current page');
      }
    } catch (err) {
      console.warn('Logout skipped:', err);
    }

    await page.close();
    await context.close();
  }
});

export { expect };
