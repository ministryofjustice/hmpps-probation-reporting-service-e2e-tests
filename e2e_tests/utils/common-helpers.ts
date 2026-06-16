import { Page, expect } from '@playwright/test';

export async function clickOnLinkByName(page: Page, linkName: string) {
  await page.getByRole('link', { name: `${linkName}` }).click();
}

export async function verifyLinkIsVisibleByName(page: Page, linkName: string) {
  await expect(page.getByRole('link', { name: `${linkName}`, exact: true })).toBeVisible();
}

export async function selectFromComboBox(page: Page, enterTextOnComboBox: string[]) {
  const combo = page.locator('input.autocomplete__input');

  for (const nameOfTheCourt of enterTextOnComboBox) {
    await combo.click();
    await combo.fill(nameOfTheCourt);
    await page.getByRole('option', { name: nameOfTheCourt, exact: true }).waitFor();
    await page.getByRole('option', { name: nameOfTheCourt, exact: true }).click();
  }
}

export async function clickOnButtonByName(page: Page, buttonName: string) {
  await page.getByRole('button', { name: `${buttonName}` }).click();
}

export async function verifyPageHeadingsByName(page: Page, pageHeadingName: string) {
  await expect(page.getByRole('heading', { name: `${pageHeadingName}` })).toBeVisible();
}

export const commonFunctions = {
  clickOnLinkByName,
  verifyLinkIsVisibleByName,
  clickOnButtonByName,
  verifyPageHeadingsByName,
  selectFromComboBox
};
