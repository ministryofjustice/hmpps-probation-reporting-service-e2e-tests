import { test } from '@fixtures/ui-auth-fixture';

const sourcePrefix = `Automation source ${Date.now()}`;
const maximumLengthSource = `${sourcePrefix}-${'a'.repeat(80 - sourcePrefix.length - 1)}`;
const selectedPredefinedSource = 'Domestic abuse callout information';

test.describe('Sources of information page - happy paths', () => {
  test.beforeEach(async ({ psrSourcesOfInformationPage }) => {
    await psrSourcesOfInformationPage.openPsrSourcesOfInformationPage();
  });

  test('shows predefined source options - @smoke @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    await psrSourcesOfInformationPage.verifyPredefinedSourcesCanBeSelectedIndependently([
      'CPS summary',
      'OASys assessments',
    ]);
  });

  test('saves a source and opens Review your progress - @smoke @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    await psrSourcesOfInformationPage.selectPredefinedSource(selectedPredefinedSource);
    await psrSourcesOfInformationPage.continueToReviewYourProgressPage();
  });

  test('adds a source at the 80-character limit - @smoke @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    const selectionBeforeAdding =
      await psrSourcesOfInformationPage.isPredefinedSourceSelected(selectedPredefinedSource);
    await psrSourcesOfInformationPage.addSource(maximumLengthSource);
    await psrSourcesOfInformationPage.verifyRemoveButtonIsVisible(maximumLengthSource);
    await psrSourcesOfInformationPage.verifyPredefinedSourceSelection(
      selectedPredefinedSource,
      selectionBeforeAdding,
    );
  });

  test('adds multiple sources of information - @smoke @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    const sources = [
      `${sourcePrefix}-multiple-one`,
      `${sourcePrefix}-multiple-two`,
      `${sourcePrefix}-multiple-three`,
    ];
    await psrSourcesOfInformationPage.addSources(sources);
    await psrSourcesOfInformationPage.verifySourcesAppearInOrder(sources);
    for (const source of sources) {
      await psrSourcesOfInformationPage.verifyRemoveButtonIsVisible(source);
    }
  });

  test('persists a source after Save and continue - @smoke @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    const source = `${sourcePrefix}-saved`;
    await psrSourcesOfInformationPage.addSource(source);
    await psrSourcesOfInformationPage.saveAndContinue();
    await psrSourcesOfInformationPage.openPsrSourcesOfInformationPage();
    await psrSourcesOfInformationPage.verifyRemoveButtonIsVisible(source);
  });

  test('removes a selected manually added source - @smoke @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    const sourceToRemove = `${sourcePrefix}-remove`;
    const sourceToKeep = `${sourcePrefix}-keep`;
    const selectionBeforeRemoving =
      await psrSourcesOfInformationPage.isPredefinedSourceSelected(selectedPredefinedSource);

    await psrSourcesOfInformationPage.addSources([sourceToRemove, sourceToKeep]);
    await psrSourcesOfInformationPage.removeSource(sourceToRemove);
    await psrSourcesOfInformationPage.verifyRemoveButtonIsVisible(sourceToKeep);
    await psrSourcesOfInformationPage.verifyPredefinedSourceSelection(
      selectedPredefinedSource,
      selectionBeforeRemoving,
    );
  });
});
