import { Page, expect } from '@playwright/test';

import { commonFunctions } from '@utils/common-helpers';

export class PsrLandingPage {
  constructor(public page: Page) {}

  async completepsrLandingPage(page: Page = this.page) {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Pre-sentence Service');
  }
}
