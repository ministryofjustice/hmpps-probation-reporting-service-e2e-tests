import { expect, test } from '@fixtures/api-auth-fixture';

import { apiTestData } from '@test-data/api.test-data';

test.describe(`PSR – API Contract and Behaviour Tests`, () => {
  test(`GET /report/{psrUuid}/defendant-details - A valid psruuid returns a successful response with a
  status code of 200 - @smoke @api @regression`, async ({ apiClient, authToken }) => {
    const response = await apiClient.get(`/report/${apiTestData.psrUUID}/defendant-details`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status(), 'status should be 200').toBe(200);
    expect(response.ok(), 'response should be ok').toBeTruthy();
  });
});
