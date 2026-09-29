import { test as base, expect } from '@fixtures/ui-auth-fixture';

import { PsrDefendantBehaviourAndLifestyleAssessmentPage } from '@pages/psr-defendant-behaviour-and-lifestyle-assessment';
import { PsrDefendantDetailsPage } from '@pages/psr-defendant-details-page';
import { PsrOffenceAnalysisPage } from '@pages/psr-offence-analysis-page';
import { PsrRiskAnalysisPage } from '@pages/psr-risk-analysis-page';
import { PsrSentencingProposalPage } from '@pages/psr-sentencing-proposal-page';
import { PsrSourcesOfInformationPage } from '@pages/psr-sources-of-information-page';
import { PsrStartPage } from '@pages/psr-start-page';
import { e2eTestData } from '@test-data/e2e.test-data';

const { e2ePsrUUID } = e2eTestData;

export const test = base.extend({
  psrStartPage: async ({ page }, use) => {
    await use(new PsrStartPage(page, e2ePsrUUID));
  },
  psrDefendantDetailsPage: async ({ page }, use) => {
    await use(new PsrDefendantDetailsPage(page, e2ePsrUUID));
  },
  psrOffenceAnalysisPage: async ({ page }, use) => {
    await use(new PsrOffenceAnalysisPage(page, e2ePsrUUID));
  },
  psrDefendantBehaviourAndLifestyleAssessmentPage: async ({ page }, use) => {
    await use(new PsrDefendantBehaviourAndLifestyleAssessmentPage(page, e2ePsrUUID));
  },
  psrRiskAnalysisPage: async ({ page }, use) => {
    await use(new PsrRiskAnalysisPage(page, e2ePsrUUID));
  },
  psrSentencingProposalPage: async ({ page }, use) => {
    await use(new PsrSentencingProposalPage(page, e2ePsrUUID));
  },
  psrSourcesOfInformationPage: async ({ page }, use) => {
    await use(new PsrSourcesOfInformationPage(page, e2ePsrUUID));
  },
});

export { expect };
