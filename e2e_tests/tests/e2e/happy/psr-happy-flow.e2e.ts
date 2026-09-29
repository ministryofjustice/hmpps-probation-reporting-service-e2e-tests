import { test } from '@fixtures/e2e-fixture';

test.describe('PSR end-to-end journey', () => {
  test.describe.configure({ retries: 0 });

  test('completes the PSR happy journey - @smoke @e2e @regression', async ({
    psrStartPage,
    psrDefendantDetailsPage,
    psrOffenceAnalysisPage,
    psrDefendantBehaviourAndLifestyleAssessmentPage,
    psrRiskAnalysisPage,
    psrSentencingProposalPage,
    psrSourcesOfInformationPage,
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
    await psrSentencingProposalPage.continueToSourcesOfInformationPage();
    await psrSourcesOfInformationPage.completePsrSourcesOfInformationPage();
  });
});
