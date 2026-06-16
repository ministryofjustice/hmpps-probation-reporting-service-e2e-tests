import { expect, test } from '@fixtures/api-auth-fixture';

import { apiTestData } from '@test-data/api.test-data';

test.describe(`Court Case Service – API Contract and Behaviour Tests`, () => {
  test(`GET /hearing/hearingid - A invalid hearingid returns a response with a
  status code of 404 - @smoke @api @regression @pic-5097`, async ({ apiClient, authToken }) => {
    const response = await apiClient.get(`/hearing/${apiTestData.invalidHearingId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const body = await response.json();
    expect(response.status(), 'status should be 404').toBe(404);
    expect(body.userMessage).toBe(`Hearing ${apiTestData.invalidHearingId} not found`);
  });
});
