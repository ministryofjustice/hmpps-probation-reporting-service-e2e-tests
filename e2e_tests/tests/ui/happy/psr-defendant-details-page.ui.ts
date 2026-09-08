import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`PSR UI journeys – UI behaviour validation`, () => {
  test('Defendant details page functionality and accessibility - @smoke @ui @regression @accessibility', async ({
    page,
    psrLandingPage,
    makeAxeBuilder,
  }) => {
    await psrLandingPage.verifyLandingPageAndOpenDefendantDetails(); 
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });
});
