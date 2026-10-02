import { PsrDefendantBehaviourAndLifestyleAssessmentPage } from '@pages/psr-defendant-behaviour-and-lifestyle-assessment';
import { PsrDefendantDetailsPage } from '@pages/psr-defendant-details-page';
import { PsrOffenceAnalysisPage } from '@pages/psr-offence-analysis-page';
import { PsrRiskAnalysisPage } from '@pages/psr-risk-analysis-page';
import { PsrSentencingProposalPage } from '@pages/psr-sentencing-proposal-page';
import { PsrSourcesOfInformationPage } from '@pages/psr-sources-of-information-page';
import { PsrStartPage } from '@pages/psr-start-page';
import { test as base } from '@playwright/test';

type PageFixtures = {
  psrStartPage: PsrStartPage;
  psrDefendantDetailsPage: PsrDefendantDetailsPage;
  psrOffenceAnalysisPage: PsrOffenceAnalysisPage;
  psrDefendantBehaviourAndLifestyleAssessmentPage: PsrDefendantBehaviourAndLifestyleAssessmentPage;
  psrRiskAnalysisPage: PsrRiskAnalysisPage;
  psrSentencingProposalPage: PsrSentencingProposalPage;
  psrSourcesOfInformationPage: PsrSourcesOfInformationPage;
};

export const pageFixtures = base.extend<PageFixtures>({
  psrStartPage: async ({ page }, use) => {
    await use(new PsrStartPage(page));
  },
  psrDefendantDetailsPage: async ({ page }, use) => {
    await use(new PsrDefendantDetailsPage(page));
  },
  psrOffenceAnalysisPage: async ({ page }, use) => {
    await use(new PsrOffenceAnalysisPage(page));
  },
  psrDefendantBehaviourAndLifestyleAssessmentPage: async ({ page }, use) => {
    await use(new PsrDefendantBehaviourAndLifestyleAssessmentPage(page));
  },
  psrRiskAnalysisPage: async ({ page }, use) => {
    await use(new PsrRiskAnalysisPage(page));
  },
  psrSentencingProposalPage: async ({ page }, use) => {
    await use(new PsrSentencingProposalPage(page));
  },
  psrSourcesOfInformationPage: async ({ page }, use) => {
    await use(new PsrSourcesOfInformationPage(page));
  },
});
