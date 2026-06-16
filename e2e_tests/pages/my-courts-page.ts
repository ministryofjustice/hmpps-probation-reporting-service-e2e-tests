import { Page, expect } from '@playwright/test';

import { commonFunctions } from '@utils/common-helpers';

export class MyCourtsPage {
  constructor(public page: Page) {}

  async completeAddMyCourtsPage(page: Page = this.page) {
    await commonFunctions.verifyLinkIsVisibleByName(this.page, 'Edit my courts');
    await commonFunctions.clickOnLinkByName(this.page, 'Edit my courts');
    await commonFunctions.selectFromComboBox(this.page, [`City of London Magistrates' Court`]);
    await commonFunctions.clickOnButtonByName(this.page, 'Add');
    await commonFunctions.clickOnButtonByName(this.page, 'Save list and continue');
    await commonFunctions.clickOnLinkByName(this.page, `City of London Magistrates' Court`);
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Search');
  }
}
