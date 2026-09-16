import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';

export class PsrDefendantBehaviourAndLifestyleAssessmentPage {
  constructor(public page: Page) {}

  async completePsrDefendantBehaviourAndLifestyleAssessmentPage() {
    await commonFunctions.verifyPageHeadingsByName(
      this.page,
      'Defendant behaviour and lifestyle assessment',
    );
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Editor editing area: main',
      'readable',
    );
  }

  async continueToRiskAnalysisPage() {
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Risk analysis');
  }
}
