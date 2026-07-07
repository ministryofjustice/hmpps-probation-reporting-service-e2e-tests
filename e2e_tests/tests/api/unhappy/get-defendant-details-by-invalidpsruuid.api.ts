import { expect, test } from '@fixtures/api-auth-fixture';

import { apiTestData } from '@test-data/api.test-data';

test.describe(`PSR – API Contract and Behaviour Tests`, () => {
  test(`GET /report/{psrUuid}/defendant-details - A invalid psruuid returns a response with a
  status code of 404 - @smoke @api @regression`, async ({ apiClient, authToken }) => {
    const response = await apiClient.get(`/report/${apiTestData.invalidPSRUUID}/defendant-details}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const body = await response.json();
    console.log("ACTUAL BODY USED IN ASSERT:", body);
    expect(response.status(), 'status should be 404').toBe(404);
    expect(body.error).toEqual(`Not Found`);
  });
});
