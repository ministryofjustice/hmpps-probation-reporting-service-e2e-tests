import { test } from '@fixtures/ui-auth-fixture';

const sourcePrefix = `Automation source ${Date.now()}`;
const overLimitSource = 'a'.repeat(81);
const selectedPredefinedSource = 'Domestic abuse callout information';

test.describe('Sources of information page - unhappy paths', () => {
  test.beforeEach(async ({ psrSourcesOfInformationPage }) => {
    await psrSourcesOfInformationPage.openPsrSourcesOfInformationPage();
  });

  test('rejects an unlisted source on save - @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    const source = `${sourcePrefix}-not-added`;
    await psrSourcesOfInformationPage.enterSource(source);
    await psrSourcesOfInformationPage.saveAndContinue();
    await psrSourcesOfInformationPage.verifyValidationError('Add this source to the list', source);
  });

  test('requires at least one source - @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    await psrSourcesOfInformationPage.clearPredefinedSourceSelections();
    await psrSourcesOfInformationPage.saveAndContinue();
    await psrSourcesOfInformationPage.verifyValidationError(
      'You must select one or more sources used to inform this report',
      undefined,
      '#sourcesOfInformation-error',
    );
  });

  test('warns when input exceeds 80 characters - @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    await psrSourcesOfInformationPage.enterSource(overLimitSource);
    await psrSourcesOfInformationPage.verifyCharacterLimitWarning(
      'You have 1 characters too many',
      overLimitSource,
    );
  });

  test('rejects an over-80-character source - @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    await psrSourcesOfInformationPage.enterSource(overLimitSource);
    await psrSourcesOfInformationPage.addEnteredSource();
    await psrSourcesOfInformationPage.verifyValidationError(
      'Source must be 80 characters or less',
      overLimitSource,
    );
  });

  test('requires adding the source before continuing - @ui @regression @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
  }) => {
    await page.getByRole('checkbox', { name: selectedPredefinedSource, exact: true }).check();
    await psrSourcesOfInformationPage.enterSource(overLimitSource);
    await psrSourcesOfInformationPage.saveAndContinue();
    await psrSourcesOfInformationPage.verifyValidationError(
      'Add this source to the list',
      overLimitSource,
    );
  });

  test('rejects a blank source - @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    await psrSourcesOfInformationPage.addEnteredSource();
    await psrSourcesOfInformationPage.verifyValidationError(
      'You cannot add a blank source to the list',
    );
  });

  test('rejects a duplicate source - @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    const source = `${sourcePrefix}-duplicate`;
    await psrSourcesOfInformationPage.addSource(source);
    await psrSourcesOfInformationPage.enterSource(source);
    await psrSourcesOfInformationPage.addEnteredSource();
    await psrSourcesOfInformationPage.verifyValidationError('This source already exists', source);
  });

  test('rejects a duplicate source with extra whitespace - @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    const source = `${sourcePrefix} duplicate`;
    const duplicateSource = `  ${sourcePrefix}    duplicate  `;
    await psrSourcesOfInformationPage.addSource(source);
    await psrSourcesOfInformationPage.enterSource(duplicateSource);
    await psrSourcesOfInformationPage.addEnteredSource();
    await psrSourcesOfInformationPage.verifyValidationError(
      'This source already exists',
      duplicateSource,
    );
  });
});
