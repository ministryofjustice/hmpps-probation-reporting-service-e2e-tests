import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`PSR UI journeys – UI behaviour validation`, () => {
  test('Defendant behaviour and lifestyle assessment page functionality and accessibility - @smoke @ui @regression @accessibility', async ({
    psrStartPage,
    psrDefendantDetailsPage,
    psrOffenceAnalysisPage,
    psrDefendantBehaviourAndLifestyleAssessmentPage,
    makeAxeBuilder,
  }) => {
    await psrStartPage.openDefendantDetailsPage();
    await psrDefendantDetailsPage.verifyDefendantDetailsPage();
    await psrDefendantDetailsPage.continueToOffenceAnalysisPage();
    await psrOffenceAnalysisPage.completePsrOffenceAnalysisPage();
    await psrOffenceAnalysisPage.continueToDefendantBehaviourPage();
    await psrDefendantBehaviourAndLifestyleAssessmentPage.completePsrDefendantBehaviourAndLifestyleAssessmentPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });
});
