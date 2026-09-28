import { signIn, signOut, test } from '@fixtures/ui-auth-fixture';

import { commonFunctions } from '@utils/common-helpers';

const pageName = 'Offence analysis';
const editorName = 'Analyse previous offending behaviour and response to supervision';
const sideNavigationText = 'Autosave when navigating side navigation';
const saveAndContinueText = 'Autosave when selecting Save and continue';
const inactivityText = 'Autosave after 15 seconds of inactivity';
const signOutText = 'Autosave when signing out';

test.describe('PSR autosave - Offence analysis page', () => {
  test.beforeEach(async ({ psrStartPage, psrDefendantDetailsPage }) => {
    await psrStartPage.openDefendantDetailsPage();
    await psrDefendantDetailsPage.verifyDefendantDetailsPage();
    await psrDefendantDetailsPage.continueToOffenceAnalysisPage();
  });

  test('persists offence analysis when navigating side navigation - @smoke @ui @regression @autosave @autosave-side-navigation', async ({
    page,
  }) => {
    const enteredText = await commonFunctions.fillTextInTextArea(
      page,
      sideNavigationText,
      editorName,
    );

    await commonFunctions.clickOnLinkByName(page, 'Defendant behaviour and lifestyle assessment');
    await commonFunctions.clickOnLinkByName(page, pageName);
    await commonFunctions.verifyTextIsPersisted(page, pageName, editorName, enteredText);
  });

  test('persists offence analysis when selecting Save and continue - @smoke @ui @regression @autosave @autosave-save-and-continue', async ({
    page,
  }) => {
    const enteredText = await commonFunctions.fillTextInTextArea(
      page,
      saveAndContinueText,
      editorName,
    );

    await commonFunctions.clickOnButtonByName(page, 'Save and continue');
    await commonFunctions.clickOnLinkByName(page, pageName);
    await commonFunctions.verifyTextIsPersisted(page, pageName, editorName, enteredText);
  });

  test('persists offence analysis after 15 seconds of inactivity - @smoke @ui @regression @autosave @autosave-inactivity', async ({
    page,
  }) => {
    await commonFunctions.verifyTextAreaAutoSavesAfterInactivity(
      page,
      editorName,
      pageName,
      inactivityText,
    );
  });

  test('persists offence analysis when signing out - @smoke @ui @regression @autosave @autosave-sign-out', async ({
    page,
    psrStartPage,
    psrDefendantDetailsPage,
  }) => {
    const enteredText = await commonFunctions.fillTextInTextArea(page, signOutText, editorName);

    await signOut(page);

    await signIn(page);
    await psrStartPage.openDefendantDetailsPage();
    await psrDefendantDetailsPage.verifyDefendantDetailsPage();
    await psrDefendantDetailsPage.continueToOffenceAnalysisPage();
    await commonFunctions.verifyTextIsPersisted(page, pageName, editorName, enteredText);
  });
});
