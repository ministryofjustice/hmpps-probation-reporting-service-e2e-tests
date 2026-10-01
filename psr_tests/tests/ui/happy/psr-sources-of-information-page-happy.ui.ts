import { commonFunctions } from '@utils/common-helpers';
import { generateRandomParagraph } from '@utils/random-paragraph-generator';
import { test } from '@fixtures/ui-auth-fixture';

const sourcePrefix = `Automation source ${Date.now()}`;
const maximumLengthSource = generateRandomParagraph(80, {
  includeSpaces: false,
  includeSpecialCharacters: false,
});
const selectedPredefinedSource = 'Domestic abuse callout information';

test.describe('Sources of information page - happy paths', () => {
  test.describe.configure({ retries: 0 });

  test.beforeEach(async ({ psrSourcesOfInformationPage }) => {
    await psrSourcesOfInformationPage.openPsrSourcesOfInformationPage();
    await psrSourcesOfInformationPage.resetToBaseline(selectedPredefinedSource);
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
    page,
    psrSourcesOfInformationPage,
  }) => {
    await commonFunctions.selectCheckBoxByName(page, selectedPredefinedSource, true);
    await psrSourcesOfInformationPage.continueToReviewYourProgressPage();
  });

  test('adds a source at the 80-character limit - @smoke @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    await psrSourcesOfInformationPage.addSource(maximumLengthSource);
    await psrSourcesOfInformationPage.verifyRemoveButtonIsVisible(maximumLengthSource);
    await psrSourcesOfInformationPage.verifyPredefinedSourceSelection(
      selectedPredefinedSource,
      true,
    );
  });

  test('adds multiple sources of information - @smoke @ui @regression @accessibility @sources-information', async ({
    psrSourcesOfInformationPage,
    makeAxeBuilder,
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
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });

  test('persists a source after Save and continue - @smoke @ui @regression @sources-information', async ({
    page,
    psrSourcesOfInformationPage,
  }) => {
    const source = `${sourcePrefix}-saved`;
    await psrSourcesOfInformationPage.addSource(source);
    await commonFunctions.clickOnButtonByName(page, 'Save and continue');
    await psrSourcesOfInformationPage.openPsrSourcesOfInformationPage();
    await psrSourcesOfInformationPage.verifyRemoveButtonIsVisible(source);
  });

  test('removes a selected manually added source - @smoke @ui @regression @sources-information', async ({
    psrSourcesOfInformationPage,
  }) => {
    const sourceToRemove = `${sourcePrefix}-remove`;
    const sourceToKeep = `${sourcePrefix}-keep`;

    await psrSourcesOfInformationPage.addSources([sourceToRemove, sourceToKeep]);
    await psrSourcesOfInformationPage.removeSource(sourceToRemove);
    await psrSourcesOfInformationPage.verifyRemoveButtonIsVisible(sourceToKeep);
    await psrSourcesOfInformationPage.verifyPredefinedSourceSelection(
      selectedPredefinedSource,
      true,
    );
  });

  test('adds sources with spaces and special characters - @ui @regression @sources-information @spaces-special-characters', async ({
    psrSourcesOfInformationPage,
  }) => {
    const sources = ['Court, referral', 'Court report, with detail!'];
    await psrSourcesOfInformationPage.addSources(sources);
    await psrSourcesOfInformationPage.verifySourcesAppearInOrder(sources);
  });
});
