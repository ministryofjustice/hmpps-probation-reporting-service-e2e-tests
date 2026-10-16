import { commonFunctions } from '@utils/common-helpers';
import { generateRandomParagraph } from '@utils/random-paragraph-generator';
import { test } from '@fixtures/ui-auth-fixture';

const offencesField = 'offencesUnderConsideration';
const previousOffendingField = 'offencesPattern';
const noPreviousOffencesCheckbox =
    'The defendant has no previous offences or experience of supervision';
const maximumLength = 20000;
const exactLengthOptions = { includeSpaces: false, includeSpecialCharacters: false };

test.describe('Offence analysis page - unhappy paths', () => {
    test.describe.configure({ retries: 0 });

    test.beforeEach(async ({ page, psrOffenceAnalysisPage }) => {
        await psrOffenceAnalysisPage.openPsrOffenceAnalysisPage();
        await commonFunctions.fillTextInTextArea(page, '', offencesField);
        await commonFunctions.fillTextInTextArea(page, '', previousOffendingField);

        await commonFunctions.selectCheckBoxByName(page, noPreviousOffencesCheckbox, true, false);
    });

    test('shows validation errors when selecting Save and continue with required fields empty - @ui @regression @accessibility @offence-analysis', async ({
        page,
        makeAxeBuilder,
    }) => {
        await commonFunctions.clickOnButtonByName(page, 'Save and continue');

        const textAreas = page.locator('textarea:visible');
        await commonFunctions.verifyValidationError(
            page,
            textAreas.nth(0),
            'Analyse the offences under consideration',
        );
        await commonFunctions.verifyValidationError(
            page,
            textAreas.nth(1),
            'Analyse the pattern of offending and response to supervision',
        );
        await commonFunctions.verifyValidationError(
            page,
            page.getByRole('checkbox', { name: noPreviousOffencesCheckbox, exact: true }),
            'Check the box if the defendant has no previous offences or experience of supervision',
        );
        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });

    test('warns when either analysis exceeds 20,000 characters - @ui @regression @accessibility @offence-analysis', async ({
        page,
        makeAxeBuilder,
    }) => {
        const textAreas = page.locator('textarea:visible');

        await commonFunctions.fillTextInTextArea(
            page,
            `${generateRandomParagraph(maximumLength, exactLengthOptions)}A`,
            offencesField,
        );
        await commonFunctions.verifyCharacterCountMessage(
            page,
            textAreas.nth(0),
            'You have 1 characters too many',
        );

        await commonFunctions.fillTextInTextArea(
            page,
            `${generateRandomParagraph(maximumLength, exactLengthOptions)}A`,
            previousOffendingField,
        );
        await commonFunctions.verifyCharacterCountMessage(
            page,
            textAreas.nth(1),
            'You have 1 characters too many',
        );
        await commonFunctions.verifyNoAccessibilityViolations(makeAxeBuilder);
    });

    test('rejects analyses over 20,000 characters on Save and continue - @ui @regression @offence-analysis', async ({
        page,
    }) => {
        const overLimitOffences = `${generateRandomParagraph(maximumLength, exactLengthOptions)}A`;
        const overLimitPreviousOffending = `${generateRandomParagraph(maximumLength, exactLengthOptions)}A`;
        const textAreas = page.locator('textarea:visible');

        await commonFunctions.fillTextInTextArea(page, overLimitOffences, offencesField);
        await commonFunctions.fillTextInTextArea(
            page,
            overLimitPreviousOffending,
            previousOffendingField,
        );
        await commonFunctions.selectCheckBoxByName(page, noPreviousOffencesCheckbox, true);
        await commonFunctions.clickOnButtonByName(page, 'Save and continue');

        await commonFunctions.verifyValidationError(
            page,
            textAreas.nth(0),
            'Offences under consideration must be 20,000 characters or less',
            overLimitOffences,
        );
        await commonFunctions.verifyValidationError(
            page,
            textAreas.nth(1),
            'Pattern of offending must be 20,000 characters or less',
            overLimitPreviousOffending,
        );
    });
});
