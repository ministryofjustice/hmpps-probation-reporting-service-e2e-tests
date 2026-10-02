import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`Risk analysis page - happy paths`, () => {
  test('Risk analysis page functionality and accessibility - @smoke @ui @regression @accessibility @risk-analysis', async ({
    psrRiskAnalysisPage,
    makeAxeBuilder,
  }) => {
    await psrRiskAnalysisPage.openPsrRiskAnalysisPage();
    await psrRiskAnalysisPage.completePsrRiskAnalysisPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    await psrRiskAnalysisPage.continueToSentencingProposalPage();
  });
});
