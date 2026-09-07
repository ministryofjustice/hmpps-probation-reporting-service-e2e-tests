const defaultUiBaseUrl = 'https://pre-sentence-service-dev.hmpps.service.justice.gov.uk';

export const uiTestData = {
    uiBaseUrl: process.env.DEV_PSR_UI_BASE_URL ?? defaultUiBaseUrl,
    psrUUID: 'e377242b-77c7-4480-9547-b4cc40f798ac',
};