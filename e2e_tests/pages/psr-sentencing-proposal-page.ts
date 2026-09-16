import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';

export class PsrSentencingProposalPage {
  constructor(public page: Page) {}

  async completePsrSentencingProposalPage() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Sentencing proposal');
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Enter the proposed sentence',
      'readable',
    );
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Explain your rationale for the proposed sentence',
      'readable',
    );
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Outline alternative sentencing options',
      'readable',
    );
    await commonFunctions.selectRadioButtonByName(
      this.page,
      'A custodial sentence is possible or expected',
    );
    await commonFunctions.fillTextInTextArea(
      this.page,
      20000,
      'Explain the impact of a custodial sentence if relevant',
      'readable',
    );
  }
}
