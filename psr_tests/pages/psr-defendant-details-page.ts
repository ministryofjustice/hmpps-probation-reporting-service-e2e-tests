import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';
import { uiTestData } from '@test-data/ui.test-data';

export class PsrDefendantDetailsPage {
  constructor(
    public page: Page,
    private psrUUID = uiTestData.psrUUID,
  ) {}

  async openPsrDefendantDetailsPage() {
    await this.page.goto(`${uiTestData.uiBaseUrl}/psr/${this.psrUUID}/defendant-details`);
    await this.verifyDefendantDetailsPage();
  }

  async verifyDefendantDetailsPage() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Defendant details');
  }

  async continueToOffenceAnalysisPage() {
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Offence analysis');
  }
}
