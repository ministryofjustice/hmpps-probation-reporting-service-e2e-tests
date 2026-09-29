import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`Offence analysis page - happy paths`, () => {
  test('Offence analysis page functionality and accessibility - @smoke @ui @regression @accessibility @offence-analysis', async ({
    psrOffenceAnalysisPage,
    makeAxeBuilder,
  }) => {
    await psrOffenceAnalysisPage.openPsrOffenceAnalysisPage();
    await psrOffenceAnalysisPage.completePsrOffenceAnalysisPage();
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    await psrOffenceAnalysisPage.continueToDefendantBehaviourPage();
  });
});
