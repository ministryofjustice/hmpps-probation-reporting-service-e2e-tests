import { PsrLandingPage } from '@pages/psr-landing-page';
import { commonFunctions } from '@utils/common-helpers';
import { expect } from '@playwright/test';
import { pageFixtures } from '@fixtures/page-fixtures';

export const test = pageFixtures.extend({
  page: async ({ browser }, use) => {
    const page = await browser.newPage();

    const maxRetries = 2;
    let attempt = 0;
    let loginSuccess = false;
    let lastErrorMessage = '';

    while (attempt < maxRetries && !loginSuccess) {
      attempt++;

      await page.goto(process.env.DEV_PSR_UI_LOGIN_URL!);
      await page.fill('#username', process.env.DEV_PSR_UI_USERNAME!);
      await page.fill('#password', process.env.DEV_PSR_UI_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await Promise.race([
        page.locator('#error-summary')
          .waitFor({ state: 'visible', timeout: 8000 })
          .catch(() => { })
      ]);

      const errorSummary = page.locator('#error-summary');

      if (await errorSummary.isVisible()) {
        lastErrorMessage = (await errorSummary.innerText()).trim();
        console.warn(`Login attempt ${attempt} failed: ${lastErrorMessage}`);

        if (attempt < maxRetries) continue;
      } else {
        loginSuccess = true;
      }
    }

    if (!loginSuccess) {
      expect(false, `UI Login failed after ${maxRetries} attempts\n${lastErrorMessage}`).toBe(true);
    }

    // Post-login setup
    const psrLandingPage = new PsrLandingPage(page);
    await psrLandingPage.completepsrLandingPage(page);

    // --- RUN THE TEST ---
    await use(page);

    // --- LOGOUT + CLEANUP ---
    try {
      const signOut = page.locator('[data-qa="signOut"]');
      if (await signOut.isVisible()) await signOut.click();
      await commonFunctions.verifyPageHeadingsByName(page, 'Sign in');
    } catch (err) {
      console.warn('Logout skipped:', err);
    }

    await page.close();
    await browser.close();
  },
});

export { expect };
