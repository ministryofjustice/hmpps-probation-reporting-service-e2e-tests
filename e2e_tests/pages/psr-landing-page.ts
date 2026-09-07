import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';
import { uiTestData } from '@test-data/ui.test-data';

export class PsrLandingPage {
  constructor(public page: Page) { }

  async verifyLandingPageAndOpenDefendantDetails() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Pre-sentence Service');
    const defendantDetailsUrl = `${uiTestData.uiBaseUrl}/psr/${uiTestData.psrUUID}/defendant-details`;
    await this.page.goto(defendantDetailsUrl);
    await commonFunctions.verifyPageByText(this.page, 'Rebecca PSR Test');
  }
}
