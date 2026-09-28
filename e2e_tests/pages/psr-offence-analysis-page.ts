import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';
import { uiTestData } from '@test-data/ui.test-data';

export class PsrOffenceAnalysisPage {
  constructor(public page: Page) {}

  async openPsrOffenceAnalysisPage() {
    await this.page.goto(`${uiTestData.uiBaseUrl}/psr/${uiTestData.psrUUID}/offence-analysis`);
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Offence analysis');
  }

  async completePsrOffenceAnalysisPage() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Offence analysis');
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Analyse offences under consideration',
      'readable',
    );
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Analyse previous offending behaviour and response to supervision',
      'readable',
    );
    await commonFunctions.selectCheckBoxByName(
      this.page,
      'The defendant has no previous offences or experience of supervision',
    );
  }

  async continueToDefendantBehaviourPage() {
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
    await commonFunctions.verifyPageHeadingsByName(
      this.page,
      'Defendant behaviour and lifestyle assessment',
    );
  }
}
