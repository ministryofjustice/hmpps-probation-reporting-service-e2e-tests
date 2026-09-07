import { Page, expect, test } from '@playwright/test';
import { RandomParagraphMode, generateRandomParagraph, generateReadableRandomParagraph } from '@utils/random-paragraph-generator';

import AxeBuilder from '@axe-core/playwright';

function formatAccessibilitySummary(results: Awaited<ReturnType<AxeBuilder['analyze']>>) {
  if (results.violations.length === 0) {
    return 'No accessibility violations were detected.';
  }

  return results.violations
    .map((violation, index) => {
      const impactedNodes = violation.nodes
        .map((node, nodeIndex) => {
          const target = node.target.join(' | ');
          const failureSummary = node.failureSummary ?? 'No failure summary provided';
          return [
            `  ${nodeIndex + 1}. Target: ${target}`,
            `     HTML: ${node.html}`,
            `     Failure: ${failureSummary.replace(/\n/g, ' ')}`,
          ].join('\n');
        })
        .join('\n');

      return [
        `${index + 1}. ${violation.id} (${violation.impact ?? 'unknown impact'})`,
        `   Help: ${violation.help}`,
        `   Description: ${violation.description}`,
        `   More info: ${violation.helpUrl}`,
        `   Affected nodes:`,
        impactedNodes,
      ].join('\n');
    })
    .join('\n\n');
}

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

function getOptionalTestInfo() {
  try {
    return test.info();
  } catch {
    return undefined;
  }
}

export async function verifyNoAccessibilityViolations(makeAxeBuilder: () => AxeBuilder) {
  const results = await makeAxeBuilder().analyze();
  const summary = formatAccessibilitySummary(results);
  const testInfo = getOptionalTestInfo();

  if (testInfo) {
    await testInfo.attach('accessibility-summary', {
      body: Buffer.from(summary, 'utf-8'),
      contentType: 'text/plain',
    });

    await testInfo.attach('accessibility-violations', {
      body: Buffer.from(JSON.stringify(results.violations, null, 2), 'utf-8'),
      contentType: 'application/json',
    });
  }

  expect(results.violations.length, `Accessibility violations detected:\n\n${summary}`).toBe(0);
}

export async function fillTextInTextArea(
  page: Page,
  textOrLength: string | number = 'AUTO-TESTING',
  textAreaKey?: string,
  randomMode: RandomParagraphMode = 'readable',
) {
  let textArea = page.locator('textarea');

  if (textAreaKey) {
    const byNameOrId = page.locator(
      `textarea[name="${textAreaKey}"], textarea#${textAreaKey}`,
    );

    if (await byNameOrId.count()) {
      textArea = byNameOrId.first();
    } else {
      const heading = page.getByRole('heading', {
        name: textAreaKey,
        exact: true,
      }).first();

      await expect(heading).toBeVisible();

      const inFormGroup = heading.locator('xpath=ancestor::*[contains(@class,"govuk-form-group")][1]//textarea').first();
      if (await inFormGroup.count()) {
        textArea = inFormGroup;
      } else {
        textArea = heading.locator('xpath=following::textarea[1]').first();
      }
    }
  }

  const matches = await textArea.count();
  if (matches === 0) {
    throw new Error('No textarea found. Pass textarea name/id or heading text.');
  }

  if (!textAreaKey && matches > 1) {
    throw new Error('Multiple textareas found. Pass textarea name/id or heading text to disambiguate.');
  }

  textArea = textArea.first();

  const textToFill = typeof textOrLength === 'number'
    ? randomMode === 'readable'
      ? generateReadableRandomParagraph(textOrLength)
      : generateRandomParagraph(textOrLength)
    : textOrLength;

  await textArea.click();
  await expect(textArea).toBeEditable();
  await textArea.clear();
  await textArea.fill(textToFill);

  return textToFill;
}

export async function selectCheckBoxByName(page: Page, checkBoxName: string) {
  await page.getByRole('checkbox', { name: `${checkBoxName}` }).check();
  const isChecked = await page.getByRole('checkbox', { name: `${checkBoxName}` }).isChecked();
  expect(isChecked).toBeTruthy();
}

export const commonFunctions = {
  clickOnLinkByName,
  searchBox,
  verifyPageByText,
  verifyLinkIsVisibleByName,
  clickOnButtonByName,
  verifyPageHeadingsByName,
  verifyNoAccessibilityViolations,
  generateRandomParagraph,
  generateReadableRandomParagraph,
  fillTextInTextArea,
  selectCheckBoxByName,
};
