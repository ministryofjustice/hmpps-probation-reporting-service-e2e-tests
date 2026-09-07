const defaultUiBaseUrl = 'https://pre-sentence-service-dev.hmpps.service.justice.gov.uk';
const envUiBaseUrl = process.env.DEV_PSR_UI_BASE_URL?.trim();

export const uiTestData = {
    uiBaseUrl: envUiBaseUrl || defaultUiBaseUrl,
    psrUUID: 'e377242b-77c7-4480-9547-b4cc40f798ac',
};