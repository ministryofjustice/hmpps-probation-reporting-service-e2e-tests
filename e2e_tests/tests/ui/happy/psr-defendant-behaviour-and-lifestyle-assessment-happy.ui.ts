import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`Defendant behaviour and lifestyle assessment page - happy paths`, () => {
  test('Defendant behaviour and lifestyle assessment page functionality and accessibility - @smoke @ui @regression @accessibility @defendant-behaviour', async ({
    psrDefendantBehaviourAndLifestyleAssessmentPage,
    makeAxeBuilder,
  }) => {
    await psrDefendantBehaviourAndLifestyleAssessmentPage.openPsrDefendantBehaviourAndLifestyleAssessmentPage();
    await psrDefendantBehaviourAndLifestyleAssessmentPage.completePsrDefendantBehaviourAndLifestyleAssessmentPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    await psrDefendantBehaviourAndLifestyleAssessmentPage.continueToRiskAnalysisPage();
  });
});
