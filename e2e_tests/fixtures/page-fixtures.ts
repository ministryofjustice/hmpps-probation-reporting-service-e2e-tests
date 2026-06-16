import { MyCourtsPage } from '@pages/my-courts-page';
import { test as base } from '@playwright/test';

type PageFixtures = {
  myCourtsPage: MyCourtsPage;
};

export const pageFixtures = base.extend<PageFixtures>({
  myCourtsPage: async ({ page }, use) => {
    await use(new MyCourtsPage(page));
  },
});
