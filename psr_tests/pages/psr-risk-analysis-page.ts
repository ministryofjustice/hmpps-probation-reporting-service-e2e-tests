import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';
import { generateRandomParagraph } from '@utils/random-paragraph-generator';
import { uiTestData } from '@test-data/ui.test-data';

export const riskPredictorsField = 'Assess the likelihood of reoffending';
export const risksOfHarmField = 'Analyse relevant risks of harm and protective factors';

export class PsrRiskAnalysisPage {
  constructor(
    public page: Page,
    private psrUUID = uiTestData.psrUUID,
  ) { }

  getRiskPredictorsTextarea() {
    return commonFunctions.getTextAreaLocator(this.page, riskPredictorsField);
  }

  getRisksOfHarmTextarea() {
    return commonFunctions.getTextAreaLocator(this.page, risksOfHarmField);
  }

  async openPsrRiskAnalysisPage() {
    await this.page.goto(`${uiTestData.uiBaseUrl}/psr/${this.psrUUID}/risk-analysis`);
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Risk analysis');
  }

  getRiskPredictorsTextarea() {
    return this.page.locator('#risk-predictors');
  }

  getRisksOfHarmTextarea() {
    return this.page.locator('#risk-riskAndHarmFactors');
  }

  async completePsrRiskAnalysisPage() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Risk analysis');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to children', 'Low risk');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to public', 'Medium risk');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to known adults', 'High risk');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to staff', 'Very high risk');
    await commonFunctions.selectDropdownOption(this.page, 'Risk to prisoners', 'Medium risk');
    await commonFunctions.fillTextInTextArea(this.page, 20000, riskPredictorsField, 'readable');
    await commonFunctions.fillTextInTextArea(this.page, 20000, risksOfHarmField, 'readable');
  }

  async continueToSentencingProposalPage() {
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Sentencing proposal');
  }
}
