import { commonFunctions } from '@utils/common-helpers';
import { defendantBehaviourField } from '@pages/psr-defendant-behaviour-and-lifestyle-assessment';
import { generateRandomParagraph } from '@utils/random-paragraph-generator';
import { test } from '@fixtures/ui-auth-fixture';

const pageName = 'Defendant behaviour and lifestyle assessment';
const maximumLength = 20000;
// Readable mode's double spaces skew the counter, so boundaries use alphanumeric text.
const exactLengthOptions = { includeSpaces: false, includeSpecialCharacters: false };

test.describe(`Defendant behaviour and lifestyle assessment page - happy paths`, () => {
  test.describe.configure({ retries: 0 });

  test.beforeEach(async ({ psrDefendantBehaviourAndLifestyleAssessmentPage }) => {
    await psrDefendantBehaviourAndLifestyleAssessmentPage.openPsrDefendantBehaviourAndLifestyleAssessmentPage();
  });

  test('Defendant behaviour and lifestyle assessment page functionality and accessibility - @smoke @ui @regression @accessibility @defendant-behaviour', async ({
    psrDefendantBehaviourAndLifestyleAssessmentPage,
    makeAxeBuilder,
  }) => {
    await psrDefendantBehaviourAndLifestyleAssessmentPage.completePsrDefendantBehaviourAndLifestyleAssessmentPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    await psrDefendantBehaviourAndLifestyleAssessmentPage.continueToRiskAnalysisPage();
  });

  test('shows characters remaining below the limit - @ui @regression @defendant-behaviour', async ({
    page,
  }) => {
    await commonFunctions.fillTextInTextArea(
      page,
      generateRandomParagraph(maximumLength - 12, exactLengthOptions),
      defendantBehaviourField,
    );
    await commonFunctions.verifyCharacterCountMessage(
      page,
      defendantBehaviourField,
      'You have 12 characters remaining',
    );
  });

  test('accepts an assessment at the 20,000-character limit - @ui @regression @defendant-behaviour', async ({
    page,
    psrDefendantBehaviourAndLifestyleAssessmentPage,
  }) => {
    await commonFunctions.fillTextInTextArea(
      page,
      generateRandomParagraph(maximumLength, exactLengthOptions),
      defendantBehaviourField,
    );
    await commonFunctions.verifyCharacterCountMessage(
      page,
      defendantBehaviourField,
      'You have 0 characters remaining',
    );
    await psrDefendantBehaviourAndLifestyleAssessmentPage.continueToRiskAnalysisPage();
  });

  test('persists the assessment after Save and continue - @ui @regression @defendant-behaviour', async ({
    page,
    psrDefendantBehaviourAndLifestyleAssessmentPage,
  }) => {
    const assessment = await commonFunctions.fillTextInTextArea(
      page,
      `Automation behaviour assessment ${Date.now()}`,
      defendantBehaviourField,
    );
    await psrDefendantBehaviourAndLifestyleAssessmentPage.continueToRiskAnalysisPage();
    await psrDefendantBehaviourAndLifestyleAssessmentPage.openPsrDefendantBehaviourAndLifestyleAssessmentPage();
    await commonFunctions.verifyTextIsPersisted(
      page,
      pageName,
      defendantBehaviourField,
      assessment,
    );
  });
});
