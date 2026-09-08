import { Page } from '@playwright/test';
import { commonFunctions } from '@utils/common-helpers';

export class PsrOffenceAnalysisPage {
    constructor(public page: Page) { }

    async completePsrOffenceAnalysisPage() {
        await commonFunctions.verifyPageHeadingsByName(this.page, 'Defendant details');
        await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
        await commonFunctions.verifyPageHeadingsByName(this.page, 'Offence analysis');
        await commonFunctions.fillTextInTextArea(this.page, 20000, 'Analyse offences under consideration', 'readable');
        await commonFunctions.fillTextInTextArea(this.page, 20000, 'Analyse previous offending behaviour and response to supervision', 'readable');
        await commonFunctions.selectCheckBoxByName(this.page, 'The defendant has no previous offences or experience of supervision');
    }
}
