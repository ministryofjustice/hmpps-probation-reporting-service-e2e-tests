import { riskPredictorsField, risksOfHarmField } from '@pages/psr-risk-analysis-page';

import { commonFunctions } from '@utils/common-helpers';
import { test } from '@fixtures/ui-auth-fixture';

const riskPredictorsError =
    'Risk predictors and likelihood of reoffending must be 20,000 characters or less';
const risksOfHarmError = 'Risks of harm and protective factors must be 20,000 characters or less';
const requiredRiskLevelErrors = [
    ['Risk to children', 'Select the level of risk to children from OASys'],
    ['Risk to public', 'Select the level of risk to the public from OASys'],
    ['Risk to known adults', 'Select the level of risk to known adults from OASys'],
    ['Risk to staff', 'Select the level of risk to staff from OASys'],
    ['Risk to prisoners', 'Select the level of risk to prisoners from OASys'],
] as const;

test.describe('Risk analysis page - unhappy paths', () => {
    test.describe.configure({ retries: 0 });

    test.beforeEach(async ({ page, psrRiskAnalysisPage }) => {
        await psrRiskAnalysisPage.openPsrRiskAnalysisPage();

        await commonFunctions.fillTextInTextArea(page, '', riskPredictorsField);
        await commonFunctions.fillTextInTextArea(page, '', risksOfHarmField);

        for (const [riskField] of requiredRiskLevelErrors) {
            await commonFunctions.selectDropdownOption(page, riskField, 'Choose an option');
        }
    });

    test('requires both analyses when the textareas are empty - @ui @regression @accessibility @risk-analysis', async ({
        page,
        psrRiskAnalysisPage,
        makeAxeBuilder,
    }) => {
        for (const [riskField] of requiredRiskLevelErrors) {
            await commonFunctions.selectDropdownOption(page, riskField, 'Low risk');
        }
        await commonFunctions.clickOnButtonByName(page, 'Save and continue');

        await commonFunctions.verifyValidationError(
            page,
            await psrRiskAnalysisPage.getRiskPredictorsTextarea(),
            riskPredictorsField,
        );
        await commonFunctions.verifyValidationError(
            page,
            await psrRiskAnalysisPage.getRisksOfHarmTextarea(),
            risksOfHarmField,
        );
        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });

    test('requires all risk levels when the dropdowns are empty - @ui @regression @accessibility @risk-analysis', async ({
        page,
        makeAxeBuilder,
    }) => {
        await commonFunctions.fillTextInTextArea(
            page,
            'Risk predictors completed',
            riskPredictorsField,
        );
        await commonFunctions.fillTextInTextArea(page, 'Risks of harm completed', risksOfHarmField);
        await commonFunctions.clickOnButtonByName(page, 'Save and continue');

        for (const [riskField, errorMessage] of requiredRiskLevelErrors) {
            await commonFunctions.verifyValidationError(
                page,
                page.getByRole('combobox', { name: riskField }),
                errorMessage,
            );
        }

        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });

    test('rejects both analyses over 20,000 characters on save - @ui @regression @accessibility @risk-analysis', async ({
        page,
        psrRiskAnalysisPage,
        makeAxeBuilder,
    }) => {
        await psrRiskAnalysisPage.completePsrRiskAnalysisPage();
        const riskPredictorsTextarea = await psrRiskAnalysisPage.getRiskPredictorsTextarea();
        const risksOfHarmTextarea = await psrRiskAnalysisPage.getRisksOfHarmTextarea();
        const overLimitRiskPredictors = `${await riskPredictorsTextarea.inputValue()}A`;
        const overLimitRisksOfHarm = `${await risksOfHarmTextarea.inputValue()}A`;
        const riskPredictorsId = await riskPredictorsTextarea.getAttribute('id');
        const risksOfHarmId = await risksOfHarmTextarea.getAttribute('id');
        if (!riskPredictorsId || !risksOfHarmId) {
            throw new Error('Could not find the risk analysis textarea IDs');
        }

        await commonFunctions.fillTextInTextArea(page, overLimitRiskPredictors, riskPredictorsField);
        await commonFunctions.fillTextInTextArea(page, overLimitRisksOfHarm, risksOfHarmField);
        await commonFunctions.clickOnButtonByName(page, 'Save and continue');

        await commonFunctions.verifyValidationError(
            page,
            riskPredictorsId,
            riskPredictorsError,
            overLimitRiskPredictors,
        );
        await commonFunctions.verifyValidationError(
            page,
            risksOfHarmId,
            risksOfHarmError,
            overLimitRisksOfHarm,
        );
        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });
});
