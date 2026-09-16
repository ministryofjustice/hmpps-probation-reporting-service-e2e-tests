import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';

export class PsrRiskAnalysisPage {
  constructor(public page: Page) {}

  async completePsrRiskAnalysisPage() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Risk analysis');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to children', 'Low risk');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to public', 'Medium risk');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to known adults', 'High risk');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to staff', 'Very high risk');
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Steps 2 and 3: Confirm risk predictors and assess the likelihood of reoffending',
      'readable',
    );
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Step 4: Analyse relevant risks of harm and protective factors',
      'readable',
    );
  }

  async continueToSentencingProposalPage() {
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Sentencing proposal');
  }
}
