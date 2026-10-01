import { requiredEnvironmentVariable } from 'root/psr_tests/utils/environment';

export const uiTestData = {
  get uiBaseUrl() {
    return requiredEnvironmentVariable('DEV_PSR_UI_BASE_URL');
  },
  get psrUUID() {
    return requiredEnvironmentVariable('DEV_PSR_UI_PSR_UUID');
  },
};
