import { expect, test } from '@fixtures/api-auth-fixture';

import { apiTestData } from '@test-data/api.test-data';

test.describe(`PSR – API Contract and Behaviour Tests`, () => {
  test(`GET /report/{psrUuid}/defendant-details - An invalid PSR UUID returns a 404 response - @smoke @api @regression`, async ({
    apiClient,
    authToken,
  }) => {
    const response = await apiClient.get(
      `/report/${apiTestData.invalidPSRUUID}/defendant-details`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    const body = await response.json();
    expect(response.status(), 'status should be 404').toBe(404);
    expect(body).toMatchObject({
      status: 404,
      message: expect.stringMatching(/not found$/i),
    });
  });
});
