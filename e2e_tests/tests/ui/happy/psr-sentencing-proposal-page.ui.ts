import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`PSR UI journeys – UI behaviour validation`, () => {
  test('Sentencing proposal page and custodial option functionality and accessibility - @smoke @ui @regression @accessibility', async ({
    psrStartPage,
    psrDefendantDetailsPage,
    psrOffenceAnalysisPage,
    psrDefendantBehaviourAndLifestyleAssessmentPage,
    psrRiskAnalysisPage,
    psrSentencingProposalPage,
    makeAxeBuilder,
  }) => {
    await psrStartPage.openDefendantDetailsPage();
    await psrDefendantDetailsPage.verifyDefendantDetailsPage();
    await psrDefendantDetailsPage.continueToOffenceAnalysisPage();
    await psrOffenceAnalysisPage.completePsrOffenceAnalysisPage();
    await psrOffenceAnalysisPage.continueToDefendantBehaviourPage();
    await psrDefendantBehaviourAndLifestyleAssessmentPage.completePsrDefendantBehaviourAndLifestyleAssessmentPage();
    await psrDefendantBehaviourAndLifestyleAssessmentPage.continueToRiskAnalysisPage();
    await psrRiskAnalysisPage.completePsrRiskAnalysisPage();
    await psrRiskAnalysisPage.continueToSentencingProposalPage();
    await psrSentencingProposalPage.completePsrSentencingProposalPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });
});
