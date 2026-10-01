import { requiredEnvironmentVariable } from 'root/psr_tests/utils/environment';

export const e2eTestData = {
  e2ePsrUUID: requiredEnvironmentVariable('DEV_PSR_E2E_PSR_UUID'),
};
