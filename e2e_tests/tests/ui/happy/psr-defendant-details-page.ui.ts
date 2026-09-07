import { expect, test } from '@fixtures/ui-auth-fixture';

import { commonFunctions } from '@utils/common-helpers';

test.describe(`PSR UI journeys – UI behaviour validation`, () => {
  test('Defendant details page functionality and accessibility - @smoke @ui @regression @accessibility', async ({
    page,
    psrLandingPage,
    makeAxeBuilder,
  }) => {
    await psrLandingPage.verifyLandingPageAndOpenDefendantDetails();

    await commonFunctions.verifyPageHeadingsByName(page, 'Defendant details');
    await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
  });
});
