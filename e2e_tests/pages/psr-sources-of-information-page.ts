import { Page, expect } from '@playwright/test';

import { commonFunctions } from '@utils/common-helpers';
import { uiTestData } from '@test-data/ui.test-data';

export class PsrSourcesOfInformationPage {
  constructor(public page: Page) { }

  private sourceLabel(source: string) {
    return this.sourceRow(source).locator('span').first();
  }

  private sourceRow(source: string) {
    return this.page.locator('#added-sources .added-source').filter({ hasText: source }).first();
  }

  async openPsrSourcesOfInformationPage() {
    const sourcesUrl = `${uiTestData.uiBaseUrl}/psr/${uiTestData.psrUUID}/sources-of-information`;
    await this.page.goto(sourcesUrl);
    await this.verifyPageControls();
  }

  async completePsrSourcesOfInformationPage() {
    await commonFunctions.clickOnLinkByName(this.page, 'Sources of information');
    await this.verifyPageControls();
  }

  async addSource(source: string) {
    await this.page.locator('#source').fill(source);
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

  async verifyPageControls() {
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Sources of information');
    await expect(this.page.getByRole('checkbox').first()).toBeVisible();
    await expect(this.page.locator('#source')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Add to list' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save and continue' })).toBeVisible();
  }

  async verifyPredefinedSourcesCanBeSelectedIndependently(sources: string[]) {
    for (const source of sources) {
      const checkbox = this.page.getByRole('checkbox', { name: source, exact: true });
      await expect(checkbox).toBeVisible();
      await expect(checkbox).toBeEnabled();
    }
  }

  async selectPredefinedSource(source: string) {
    const checkbox = this.page.getByRole('checkbox', { name: source, exact: true });
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  }

  async clearPredefinedSourceSelections() {
    const selectedCheckboxes = this.page.locator('input[type="checkbox"]:checked');

    while (await selectedCheckboxes.count()) {
      await selectedCheckboxes.first().uncheck();
    }
  }

  async isPredefinedSourceSelected(source: string) {
    return this.page.getByRole('checkbox', { name: source, exact: true }).isChecked();
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

  async saveAndContinue() {
    await commonFunctions.clickOnButtonByName(this.page, 'Save and continue');
  }

  async continueToReviewYourProgressPage() {
    await this.saveAndContinue();
    await commonFunctions.verifyPageHeadingsByName(this.page, 'Review your progress');
  }

  async enterSource(source: string) {
    await this.page.locator('#source').fill(source);
  }

  async addEnteredSource() {
    await commonFunctions.clickOnButtonByName(this.page, 'Add to list');
  }

  async verifyCharacterLimitWarning(message: string, value: string) {
    await expect(this.page.locator('#source-info')).toContainText(message);
    await expect(this.page.locator('.govuk-error-summary')).not.toBeVisible();
    await expect(this.page.locator('#source')).toHaveValue(value);
  }

  async verifyValidationError(
    message: string,
    value?: string,
    inlineErrorSelector = '#source-error',
  ) {
    const errorSummary = this.page.locator('.govuk-error-summary');
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary).toContainText(message);
    await expect(this.page.locator(inlineErrorSelector)).toContainText(message);

    if (value !== undefined) {
      await expect(this.page.locator('#source')).toHaveValue(value);
    }
  }
}
