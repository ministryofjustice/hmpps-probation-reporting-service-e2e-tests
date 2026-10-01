import { Page, expect } from '@playwright/test';

import { commonFunctions } from '@utils/common-helpers';
import { uiTestData } from '@test-data/ui.test-data';

export class PsrSourcesOfInformationPage {
  constructor(
    public page: Page,
    private psrUUID = uiTestData.psrUUID,
  ) {}

  private sourceLabel(source: string) {
    return this.sourceRow(source).locator('span').first();
  }

  private sourceRow(source: string) {
    return this.page.locator('#added-sources .added-source').filter({ hasText: source }).first();
  }

  async openPsrSourcesOfInformationPage() {
    const sourcesUrl = `${uiTestData.uiBaseUrl}/psr/${this.psrUUID}/sources-of-information`;
    await this.page.goto(sourcesUrl);
    await this.verifyPageControls();
  }

  async completePsrSourcesOfInformationPage(source = 'Domestic abuse callout information') {
    await commonFunctions.clickOnLinkByName(this.page, 'Sources of information');
    await this.verifyPageControls();
    await commonFunctions.selectCheckBoxByName(this.page, source, true);
    await this.continueToReviewYourProgressPage();
  }

  async addSource(source: string) {
    await this.enterSource(source);
    await commonFunctions.clickOnButtonByName(this.page, 'Add to list');
    await expect(this.sourceLabel(source)).toBeVisible();
    await expect(this.page.locator('#source')).toHaveValue('');
  }

  async addSources(sources: string[]) {
    for (const source of sources) {
      await this.addSource(source);
    }
  }

  async removeSource(source: string) {
    await this.sourceRow(source).locator('button[name="removeSource"]').click();
    await expect(this.sourceRow(source)).not.toBeVisible();
  }

  async clearManuallyAddedSources() {
    const removeButtons = this.page.locator(
      '#added-sources .added-source button[name="removeSource"]',
    );

    while ((await removeButtons.count()) > 0) {
      await removeButtons.first().click();
    }
  }

  async resetToBaseline(selectedSource: string) {
    await this.clearManuallyAddedSources();
    await this.clearPredefinedSourceSelections();
    await commonFunctions.selectCheckBoxByName(this.page, selectedSource, true);
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
    await this.openPsrSourcesOfInformationPage();
    await expect(this.page.locator('#added-sources .added-source')).toHaveCount(0);
    await expect(this.page.locator('input[type="checkbox"]:checked')).toHaveCount(1);
    await this.verifyPredefinedSourceSelection(selectedSource, true);
  }

  async verifyPageControls() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Sources of information');
    await expect(this.page.getByRole('checkbox').first()).toBeVisible();
    await expect(this.page.locator('#source')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add to list' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save and continue' })).toBeVisible();
  }

  async verifyPredefinedSourcesCanBeSelectedIndependently(sources: string[]) {
    for (const source of sources) {
      await commonFunctions.selectCheckBoxByName(this.page, source, true);
    }

    for (const source of sources) {
      const checkbox = this.page.getByRole('checkbox', { name: source, exact: true });
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }
  }

  async clearPredefinedSourceSelections() {
    const selectedCheckboxes = this.page.locator('input[type="checkbox"]:checked');

    while (await selectedCheckboxes.count()) {
      await selectedCheckboxes.first().uncheck();
    }
  }

  async verifyPredefinedSourceSelection(source: string, expectedSelection: boolean) {
    await expect(this.page.getByRole('checkbox', { name: source, exact: true })).toBeChecked({
      checked: expectedSelection,
    });
  }

  async verifySourcesAppearInOrder(sources: string[]) {
    const addedSources = await this.page
      .locator('#added-sources .added-source > span:first-child')
      .allTextContents();
    const sourceIndexes = sources.map((source) => addedSources.indexOf(source));

    expect(sourceIndexes.every((index) => index >= 0)).toBeTruthy();
    expect(sourceIndexes).toEqual([...sourceIndexes].sort((first, second) => first - second));
  }

  async verifyRemoveButtonIsVisible(source: string) {
    await expect(this.sourceRow(source).locator('button[name="removeSource"]')).toBeVisible();
  }

  async continueToReviewYourProgressPage() {
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Review your progress');
  }

  async enterSource(source: string) {
    await this.page.locator('#source').fill(source);
  }
}
