import { commonFunctions } from 'root/psr_tests/utils/common-helpers';
import { defendantBehaviourField } from 'root/psr_tests/pages/psr-defendant-behaviour-and-lifestyle-assessment';
import { generateRandomParagraph } from 'root/psr_tests/utils/random-paragraph-generator';
import { test } from 'root/psr_tests/fixtures/ui-auth-fixture';

const maximumLength = 20000;
const requiredMessage = "Assess the defendant's behaviour and lifestyle";
const maximumLengthMessage = 'Defendant Behaviour must be 20,000 characters or less';

// The generator caps at 20,000 characters, so over-limit text repeats part of it.
const overLimitAssessment = (extraCharacters: number) => {
  const text = generateRandomParagraph(maximumLength, {
    includeSpaces: false,
    includeSpecialCharacters: false,
  });
  return `${text}${text.slice(0, extraCharacters)}`;
};

test.describe('Defendant behaviour and lifestyle assessment page - unhappy paths', () => {
  test.describe.configure({ retries: 0 });

  test.beforeEach(async ({ psrDefendantBehaviourAndLifestyleAssessmentPage }) => {
    await psrDefendantBehaviourAndLifestyleAssessmentPage.openPsrDefendantBehaviourAndLifestyleAssessmentPage();
  });

  test('requires an assessment - @ui @regression @accessibility @defendant-behaviour', async ({
    page,
    makeAxeBuilder,
  }) => {
    await commonFunctions.fillTextInTextArea(page, '', defendantBehaviourField);
    await commonFunctions.clickOnButtonByName(page, 'Save and continue');
    await commonFunctions.verifyValidationError(page, defendantBehaviourField, requiredMessage);
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });

  test('rejects a whitespace-only assessment - @ui @regression @defendant-behaviour', async ({
    page,
  }) => {
    await commonFunctions.fillTextInTextArea(page, '   ', defendantBehaviourField);
    await commonFunctions.clickOnButtonByName(page, 'Save and continue');
    await commonFunctions.verifyValidationError(page, defendantBehaviourField, requiredMessage);
  });

  test('warns when the assessment exceeds 20,000 characters - @ui @regression @accessibility @defendant-behaviour', async ({
    page,
    makeAxeBuilder,
  }) => {
    await commonFunctions.fillTextInTextArea(
      page,
      overLimitAssessment(10),
      defendantBehaviourField,
    );
    await commonFunctions.verifyCharacterCountMessage(
      page,
      defendantBehaviourField,
      'You have 10 characters too many',
    );
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });

  test('rejects an assessment over 20,000 characters on save - @ui @regression @accessibility @defendant-behaviour', async ({
    page,
    makeAxeBuilder,
  }) => {
    const assessment = await commonFunctions.fillTextInTextArea(
      page,
      overLimitAssessment(1),
      defendantBehaviourField,
    );
    await commonFunctions.clickOnButtonByName(page, 'Save and continue');
    await commonFunctions.verifyValidationError(
      page,
      defendantBehaviourField,
      maximumLengthMessage,
      assessment,
    );
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });
});
