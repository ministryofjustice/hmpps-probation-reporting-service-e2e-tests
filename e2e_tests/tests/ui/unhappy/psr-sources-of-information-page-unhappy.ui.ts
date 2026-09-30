import { commonFunctions } from '@utils/common-helpers';
import { generateRandomParagraph } from '@utils/random-paragraph-generator';
import { test } from '@fixtures/ui-auth-fixture';

const sourcePrefix = `Automation source ${Date.now()}`;
const overLimitSource = generateRandomParagraph(81, {
  includeSpaces: false,
  includeSpecialCharacters: false,
});
const selectedPredefinedSource = 'Domestic abuse callout information';

test.describe('Sources of information page - unhappy paths', () => {
  test.describe.configure({ retries: 0 });

  test.beforeEach(async ({ psrSourcesOfInformationPage }) => {
    await psrSourcesOfInformationPage.openPsrSourcesOfInformationPage();
    await psrSourcesOfInformationPage.resetToBaseline(selectedPredefinedSource);
  });

  test('rejects an unlisted source on save - @ui @regression @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
  }) => {
    const source = `${sourcePrefix}-not-added`;
    await psrSourcesOfInformationPage.enterSource(source);
    await commonFunctions.clickOnButtonByName(page, 'Save and continue');
    await commonFunctions.verifyValidationError(
      page,
      'source',
      'Add this source to the list',
      source,
    );
  });

  test('requires at least one source - @ui @regression @accessibility @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
    makeAxeBuilder,
  }) => {
    await psrSourcesOfInformationPage.clearPredefinedSourceSelections();
    await commonFunctions.clickOnButtonByName(page, 'Save and continue');
    await commonFunctions.verifyValidationError(
      page,
      'sourcesOfInformation',
      'You must select one or more sources used to inform this report',
    );
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });

  test('warns when input exceeds 80 characters - @ui @regression @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
  }) => {
    await psrSourcesOfInformationPage.enterSource(overLimitSource);
    await commonFunctions.verifyCharacterCountMessage(
      page,
      'source',
      'You have 1 characters too many',
    );
  });

  test('rejects an over-80-character source - @ui @regression @accessibility @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
    makeAxeBuilder,
  }) => {
    await psrSourcesOfInformationPage.enterSource(overLimitSource);
    await commonFunctions.clickOnButtonByName(page, 'Add to list');
    await commonFunctions.verifyValidationError(
      page,
      'source',
      'Source must be 80 characters or less',
      overLimitSource,
    );
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });

  test('requires adding the source before continuing - @ui @regression @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
  }) => {
    await commonFunctions.selectCheckBoxByName(page, selectedPredefinedSource, true);
    const unlistedSource = `${sourcePrefix}-not-added-before-continue`;
    await psrSourcesOfInformationPage.enterSource(unlistedSource);
    await commonFunctions.clickOnButtonByName(page, 'Save and continue');
    await commonFunctions.verifyValidationError(
      page,
      'source',
      'Add this source to the list',
      unlistedSource,
    );
  });

  test('rejects a blank source - @ui @regression @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
  }) => {
    await commonFunctions.clickOnButtonByName(page, 'Add to list');
    await commonFunctions.verifyValidationError(
      page,
      'source',
      'You cannot add a blank source to the list',
    );
  });

  test('rejects a duplicate source - @ui @regression @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
  }) => {
    const source = `${sourcePrefix}-duplicate`;
    await psrSourcesOfInformationPage.addSource(source);
    await psrSourcesOfInformationPage.enterSource(source);
    await commonFunctions.clickOnButtonByName(page, 'Add to list');
    await commonFunctions.verifyValidationError(
      page,
      'source',
      'This source already exists',
      source,
    );
  });

  test('rejects a duplicate source with extra whitespace - @ui @regression @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
  }) => {
    const source = `${sourcePrefix} duplicate`;
    const duplicateSource = `  ${sourcePrefix}    duplicate  `;
    await psrSourcesOfInformationPage.addSource(source);
    await psrSourcesOfInformationPage.enterSource(duplicateSource);
    await commonFunctions.clickOnButtonByName(page, 'Add to list');
    await commonFunctions.verifyValidationError(
      page,
      'source',
      'This source already exists',
      duplicateSource,
    );
  });
});
