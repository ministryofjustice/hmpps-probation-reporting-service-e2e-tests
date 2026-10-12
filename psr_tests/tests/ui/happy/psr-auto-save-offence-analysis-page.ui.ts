import { expect, signIn, signOut, test } from '@fixtures/ui-auth-fixture';

import { commonFunctions } from '@utils/common-helpers';

const pageName = 'Offence analysis';
const editorName = 'Analyse previous offending behaviour and response to supervision';
const sideNavigationText = 'Autosave when navigating side navigation';
const saveAndContinueText = 'Autosave when selecting Save and continue';
const inactivityText = 'Autosave after 15 seconds of inactivity';
const signOutText = 'Autosave when signing out';
const connectionProblemMessage =
  /^There is a problem with the connection\.\s*Your changes will be saved when it is restored\.$/;

test.describe('PSR autosave - Offence analysis page', () => {
  test.describe.configure({ retries: 0 });

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

  test('keeps the page open when cancelling the browser close prompt before autosave - @ui @regression @autosave @autosave-close-cancel', async ({
    page,
  }) => {
    const enteredText = `Autosave before close ${Date.now()}`;
    const pageUrl = page.url();

    await commonFunctions.fillTextInTextArea(page, enteredText, editorName);
    const fillCompletedAt = Date.now();

    const dialogPromise = page.waitForEvent('dialog');
    const closeAttempt = page.close({ runBeforeUnload: true });
    const dialog = await dialogPromise;

    await dialog.dismiss();
    await closeAttempt;
    expect(dialog.type()).toBe('beforeunload');
    expect(Date.now() - fillCompletedAt).toBeLessThan(15_000);

    await expect(page.getByRole('heading', { name: pageName, exact: true })).toBeVisible();
    expect(page.url()).toBe(pageUrl);
    await commonFunctions.verifyTextIsPersisted(page, pageName, editorName, enteredText);
  });

  test('updates the last saved time after inactivity autosave - @ui @regression @autosave @autosave-last-saved', async ({
    page,
  }) => {
    test.setTimeout(120_000);

    const lastSavedMessage = page.getByText(/^This page was last saved at /);
    const lastSavedFormat = /^This page was last saved at ([01]\d|2[0-3]):[0-5]\d$/;

    await expect(lastSavedMessage).toHaveText(lastSavedFormat);
    const previousLastSavedMessage = await lastSavedMessage.innerText();
    const savedMinute = await page.evaluate(() => Math.floor(Date.now() / 60_000));

    await expect
      .poll(() => page.evaluate(() => Math.floor(Date.now() / 60_000)), {
        timeout: 65_000,
        intervals: [1_000],
      })
      .toBeGreaterThan(savedMinute);

    const enteredText = await commonFunctions.fillTextInTextArea(
      page,
      `Autosave timestamp edit ${Date.now()}`,
      editorName,
    );
    await expect(lastSavedMessage).not.toHaveText(previousLastSavedMessage, {
      timeout: 25_000,
    });
    await expect(lastSavedMessage).toHaveText(lastSavedFormat);

    await page.reload();
    await commonFunctions.verifyTextIsPersisted(page, pageName, editorName, enteredText);
  });

  test('shows the connection warning when offline - @ui @regression @autosave @autosave-connection @autosave-offline-warning', async ({
    page,
    context,
  }) => {
    const connectionProblem = page.getByText(connectionProblemMessage);
    const connectionRestored = page.getByText('The connection has been restored.', {
      exact: true,
    });

    await expect(connectionProblem).toBeHidden();
    await expect(connectionRestored).toBeHidden();

    try {
      await context.setOffline(true);
      await expect(connectionProblem).toBeVisible({ timeout: 25_000 });
      await expect(connectionRestored).toBeHidden();
    } finally {
      await context.setOffline(false);
    }
  });

  test('shows the restored message when reconnecting - @ui @regression @autosave @autosave-connection @autosave-connection-restored', async ({
    page,
    context,
  }) => {
    const connectionProblem = page.getByText(connectionProblemMessage);
    const connectionRestored = page.getByText('The connection has been restored.', {
      exact: true,
    });

    try {
      await context.setOffline(true);
      await expect(connectionProblem).toBeVisible({ timeout: 25_000 });
      await expect(connectionRestored).toBeHidden();

      await context.setOffline(false);
      await expect(connectionRestored).toBeVisible({ timeout: 25_000 });
      await expect(connectionProblem).toBeHidden();
    } finally {
      await context.setOffline(false);
    }
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
