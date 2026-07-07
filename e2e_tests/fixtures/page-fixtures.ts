import { PsrLandingPage } from '@pages/psr-landing-page';
import { test as base } from '@playwright/test';

type PageFixtures = {
  psrLandingPage: PsrLandingPage;
};

export const pageFixtures = base.extend<PageFixtures>({
  psrLandingPage: async ({ page }, use) => {
    await use(new PsrLandingPage(page));
  },
});
