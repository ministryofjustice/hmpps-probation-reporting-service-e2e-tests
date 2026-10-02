import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';
import { uiTestData } from '@test-data/ui.test-data';

export class PsrStartPage {
  constructor(
    public page: Page,
    private psrUUID = uiTestData.psrUUID,
  ) {}

  async openDefendantDetailsPage() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Pre-sentence Service');
    const defendantDetailsUrl = `${uiTestData.uiBaseUrl}/psr/${this.psrUUID}/defendant-details`;
    await this.page.goto(defendantDetailsUrl);
  }
}
