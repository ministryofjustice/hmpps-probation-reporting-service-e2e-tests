import { commonFunctions } from '@utils/common-helpers';
import { generateRandomParagraph } from '@utils/random-paragraph-generator';
import { test } from '@fixtures/ui-auth-fixture';

const offencesField = 'offencesUnderConsideration';
const previousOffendingField = 'offencesPattern';
const maximumLength = 20000;
const exactLengthOptions = { includeSpaces: false, includeSpecialCharacters: false };

test.describe('Offence analysis page - unhappy paths', () => {
    test.describe.configure({ retries: 0 });

    test.beforeEach(async ({ page, psrOffenceAnalysisPage }) => {
        await psrOffenceAnalysisPage.openPsrOffenceAnalysisPage();
        await commonFunctions.fillTextInTextArea(page, '', offencesField);
        await commonFunctions.fillTextInTextArea(page, '', previousOffendingField);
    });

    test('shows validation errors when selecting Save and continue with required fields empty - @ui @regression @accessibility @offence-analysis', async ({
        page,
        makeAxeBuilder,
    }) => {
        await commonFunctions.clickOnButtonByName(page, 'Save and continue');

        const offencesTextarea = await commonFunctions.getTextAreaLocator(page, offencesField);
        const previousOffendingTextarea = await commonFunctions.getTextAreaLocator(
            page,
            previousOffendingField,
        );
        await commonFunctions.verifyValidationError(
            page,
            offencesTextarea,
            'Analyse the offences under consideration',
        );
        await commonFunctions.verifyValidationError(
            page,
            previousOffendingTextarea,
            'Analyse previous offending behaviour and response to supervision or briefly explain why this does not apply',
        );
        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });

    test('warns when either analysis exceeds 20,000 characters - @ui @regression @accessibility @offence-analysis', async ({
        page,
        makeAxeBuilder,
    }) => {
        const offencesTextarea = await commonFunctions.getTextAreaLocator(page, offencesField);
        const previousOffendingTextarea = await commonFunctions.getTextAreaLocator(
            page,
            previousOffendingField,
        );

        await commonFunctions.fillTextInTextArea(
            page,
            `${generateRandomParagraph(maximumLength, exactLengthOptions)}A`,
            offencesField,
        );
        await commonFunctions.verifyCharacterCountMessage(
            page,
            offencesTextarea,
            'You have 1 characters too many',
        );

        await commonFunctions.fillTextInTextArea(
            page,
            `${generateRandomParagraph(maximumLength, exactLengthOptions)}A`,
            previousOffendingField,
        );
        await commonFunctions.verifyCharacterCountMessage(
            page,
            previousOffendingTextarea,
            'You have 1 characters too many',
        );
        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });

    test('rejects analyses over 20,000 characters on Save and continue - @ui @regression @offence-analysis', async ({
        page,
    }) => {
        const overLimitOffences = `${generateRandomParagraph(maximumLength, exactLengthOptions)}A`;
        const overLimitPreviousOffending = `${generateRandomParagraph(maximumLength, exactLengthOptions)}A`;
        const offencesTextarea = await commonFunctions.getTextAreaLocator(page, offencesField);
        const previousOffendingTextarea = await commonFunctions.getTextAreaLocator(
            page,
            previousOffendingField,
        );

        await commonFunctions.fillTextInTextArea(page, overLimitOffences, offencesField);
        await commonFunctions.fillTextInTextArea(
            page,
            overLimitPreviousOffending,
            previousOffendingField,
        );
        await commonFunctions.clickOnButtonByName(page, 'Save and continue');

        await commonFunctions.verifyValidationError(
            page,
            offencesTextarea,
            'Offences under consideration must be 20,000 characters or less',
            overLimitOffences,
        );
        await commonFunctions.verifyValidationError(
            page,
            previousOffendingTextarea,
            'Pattern of offending must be 20,000 characters or less',
            overLimitPreviousOffending,
        );
    });
});
