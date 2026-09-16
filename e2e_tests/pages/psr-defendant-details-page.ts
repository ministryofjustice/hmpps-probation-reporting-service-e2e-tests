import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';

export class PsrDefendantDetailsPage {
  constructor(public page: Page) {}

  async verifyDefendantDetailsPage() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Defendant details');
    await commonFunctions.verifyPageByText(this.page, 'Rebecca PSR Test');
  }

  async continueToOffenceAnalysisPage() {
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Offence analysis');
  }
}
