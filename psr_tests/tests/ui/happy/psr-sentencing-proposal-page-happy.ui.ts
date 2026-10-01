import { commonFunctions } from 'root/psr_tests/utils/common-helpers';
import { test } from 'root/psr_tests/fixtures/ui-auth-fixture';

test.describe(`Sentencing proposal page - happy paths`, () => {
  test('Sentencing proposal page and custodial option functionality and accessibility - @smoke @ui @regression @accessibility @sentencing-proposal', async ({
    psrSentencingProposalPage,
    makeAxeBuilder,
  }) => {
    await psrSentencingProposalPage.openPsrSentencingProposalPage();
    await psrSentencingProposalPage.completePsrSentencingProposalPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    await psrSentencingProposalPage.continueToSourcesOfInformationPage();
  });
});
