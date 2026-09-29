import { requiredEnvironmentVariable } from '@utils/environment';

export const uiTestData = {
  uiBaseUrl: requiredEnvironmentVariable('DEV_PSR_UI_BASE_URL'),
  psrUUID: requiredEnvironmentVariable('DEV_PSR_UI_PSR_UUID'),
};
