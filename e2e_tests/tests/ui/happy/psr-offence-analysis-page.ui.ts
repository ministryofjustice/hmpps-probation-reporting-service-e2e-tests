import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`PSR UI journeys – UI behaviour validation`, () => {
    test('Offence analysis page functionality and accessibility - @smoke @ui @regression @accessibility', async ({
        psrLandingPage,
        psrOffenceAnalysisPage,
        makeAxeBuilder,
    }) => {
        await psrLandingPage.verifyLandingPageAndOpenDefendantDetails();
        await psrOffenceAnalysisPage.completePsrOffenceAnalysisPage();
        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });
});
