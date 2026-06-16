import { expect, test } from '@fixtures/api-auth-fixture';

import { apiTestData } from '@test-data/api.test-data';

test.describe(`Court Case Service – API Contract and Behaviour Tests`, () => {
  test(`GET /hearing/hearingid - A valid hearingid returns a successful response with a
  status code of 200 - @smoke @api @regression @pic-5097`, async ({ apiClient, authToken }) => {
    const response = await apiClient.get(`/hearing/${apiTestData.validHearingId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(response.status(), 'status should be 200').toBe(200);
    expect(response.ok(), 'response should be ok').toBeTruthy();
  });
});
