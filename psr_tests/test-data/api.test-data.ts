import { requiredEnvironmentVariable } from 'root/psr_tests/utils/environment';

export const apiTestData = {
  psrUUID: requiredEnvironmentVariable('DEV_PSR_API_PSR_UUID'),
  invalidPSRUUID: requiredEnvironmentVariable('DEV_PSR_API_INVALID_PSR_UUID'),
};
