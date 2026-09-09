import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

test.describe(`PSR UI journeys – UI behaviour validation`, () => {
    test('Offence analysis page functionality and accessibility - @smoke @ui @regression @accessibility', async ({
        page,
        psrLandingPage,
        psrOffenceAnalysisPage,
        makeAxeBuilder,
    }) => {
        await psrLandingPage.verifyLandingPageAndOpenDefendantDetailsPage();
        await commonFunctions.clickOnButtonByName(page, 'Save and continue');
        await psrOffenceAnalysisPage.completePsrOffenceAnalysisPage();
        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });
});
