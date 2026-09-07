import { PsrLandingPage } from '@pages/psr-landing-page';
import { PsrOffenceAnalysisPage } from '@pages/psr-offence-analysis-page';
import { test as base } from '@playwright/test';

type PageFixtures = {
  psrLandingPage: PsrLandingPage;
  psrOffenceAnalysisPage: PsrOffenceAnalysisPage;
};

export const pageFixtures = base.extend<PageFixtures>({
  psrLandingPage: async ({ page }, use) => {
    await use(new PsrLandingPage(page));
  },
  psrOffenceAnalysisPage: async ({ page }, use) => {
    await use(new PsrOffenceAnalysisPage(page));
  },
});
