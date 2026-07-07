import { Page, expect } from '@playwright/test';

export async function clickOnLinkByName(page: Page, linkName: string) {
  await page.getByRole('link', { name: `${linkName}` }).click();
}

export async function searchBox(page: Page, searchName: string) {
  await page.getByRole('textbox', { name: 'Enter the CRN or full name of' }).fill(searchName);
}

export async function verifyPageByText(page: Page, pageTextName: string) {
  await expect(page.getByText(`${pageTextName}`).first()).toBeVisible();
}

export async function verifyLinkIsVisibleByName(page: Page, linkName: string) {
  await expect(page.getByRole('link', { name: `${linkName}`, exact: true })).toBeVisible();
}

export async function clickOnButtonByName(page: Page, buttonName: string) {
  await page.getByRole('button', { name: `${buttonName}` }).click();
}

export async function verifyPageHeadingsByName(page: Page, pageHeadingName: string) {
  await expect(page.getByRole('heading', { name: `${pageHeadingName}`, exact: true })).toBeVisible({ timeout: 5000 });
}

export const commonFunctions = {
  clickOnLinkByName,
  searchBox,
  verifyPageByText,
  verifyLinkIsVisibleByName,
  clickOnButtonByName,
  verifyPageHeadingsByName,
};
