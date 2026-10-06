import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`Defendant details page - happy paths`, () => {
  test('Defendant details page functionality and accessibility - @smoke @ui @regression @accessibility @defendant-details', async ({
    psrDefendantDetailsPage,
    makeAxeBuilder,
  }) => {
    await psrDefendantDetailsPage.openPsrDefendantDetailsPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    await psrDefendantDetailsPage.continueToOffenceAnalysisPage();
  });
});
