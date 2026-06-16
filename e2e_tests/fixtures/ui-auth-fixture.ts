import { MyCourtsPage } from '@pages/my-courts-page';
import { expect } from '@playwright/test';
import { pageFixtures } from '@fixtures/page-fixtures';

export const test = pageFixtures.extend({
  page: async ({ browser }, use) => {
    const page = await browser.newPage();

    // Retry login up to 2 times
    const maxRetries = 2;
    let attempt = 0;
    let loginSuccess = false;
    let lastErrorMessage = '';

    while (attempt < maxRetries && !loginSuccess) {
      attempt++;

      // --- LOGIN FLOW ---
      await page.goto(process.env.DEV_PACFS_UI_LOGIN_URL!);
      await page.fill('#username', process.env.DEV_PACFS_UI_USERNAME!);
      await page.fill('#password', process.env.DEV_PACFS_UI_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in' }).click();

      await Promise.race([
        page.waitForURL('**/my-courts', { timeout: 8000 }),
        page
          .locator('#error-summary')
          .waitFor({ state: 'visible', timeout: 8000 })
          .catch(() => {}),
      ]);

      // Check for login error
      const errorSummary = page.locator('#error-summary');

      if (await errorSummary.isVisible()) {
        lastErrorMessage = (await errorSummary.innerText()).trim();
        console.warn(`Login attempt ${attempt} failed: ${lastErrorMessage}`);

        // Retry if attempts remain
        if (attempt < maxRetries) {
          continue;
        }
      } else {
        loginSuccess = true;
      }
    }

    // If still not logged in after retries → fail
    if (!loginSuccess) {
      expect(false, `UI Login failed after ${maxRetries} attempts\n${lastErrorMessage}`).toBe(true);
    }

    // Post-login setup
    const myCourtsPage = new MyCourtsPage(page);
    await myCourtsPage.completeAddMyCourtsPage(page);

    await use(page);
  },
});

export { expect };
