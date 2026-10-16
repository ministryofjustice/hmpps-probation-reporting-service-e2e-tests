import { commonFunctions } from '@utils/common-helpers';
import { generateRandomParagraph } from '@utils/random-paragraph-generator';
import { test } from '@fixtures/ui-auth-fixture';

const offencesField = 'offencesUnderConsideration';
const previousOffendingField = 'offencesPattern';
const maximumLength = 20000;
const exactLengthOptions = { includeSpaces: false, includeSpecialCharacters: false };

test.describe(`Offence analysis page - happy paths`, () => {
  test('completes offence analysis, checks accessibility, and continues - @smoke @ui @regression @accessibility @offence-analysis', async ({
    page,
    psrOffenceAnalysisPage,
    makeAxeBuilder,
  }) => {
    await psrOffenceAnalysisPage.openPsrOffenceAnalysisPage();
    await psrOffenceAnalysisPage.completePsrOffenceAnalysisPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    await psrOffenceAnalysisPage.continueToDefendantBehaviourPage();
  });

  test('shows the remaining character count for both analyses - @ui @regression @offence-analysis', async ({
    page,
    psrOffenceAnalysisPage,
  }) => {
    await psrOffenceAnalysisPage.openPsrOffenceAnalysisPage();
    const textAreas = page.locator('textarea:visible');
    await commonFunctions.fillTextInTextArea(
      page,
      generateRandomParagraph(maximumLength - 12, exactLengthOptions),
      offencesField,
    );
    await commonFunctions.verifyCharacterCountMessage(
      page,
      textAreas.nth(0),
      'You have 12 characters remaining',
    );

    await commonFunctions.fillTextInTextArea(
      page,
      generateRandomParagraph(maximumLength - 12, exactLengthOptions),
      previousOffendingField,
    );
    await commonFunctions.verifyCharacterCountMessage(
      page,
      textAreas.nth(1),
      'You have 12 characters remaining',
    );
  });
});
