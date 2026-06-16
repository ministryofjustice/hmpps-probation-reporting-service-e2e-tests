import { APIRequestContext, test as base, expect, request } from '@playwright/test';

type apiFixtures = {
  apiClient: APIRequestContext;
  authToken: string;
};

export const test = base.extend<apiFixtures>({
  apiClient: async ({}, use) => {
    const api = await request.newContext({
      baseURL: process.env.DEV_API_BASE_URL!,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    await use(api);
  },

  authToken: async ({ apiClient }, use) => {
    const response = await apiClient.post(process.env.DEV_API_AUTH_URL!, {
      params: { grant_type: 'client_credentials' },
      headers: {
        Accept: 'application/json',
        Authorization:
          'Basic ' +
          Buffer.from(`${process.env.DEV_API_USERNAME}:${process.env.DEV_API_PASSWORD}`).toString(
            'base64',
          ),
      },
    });

    expect(
      response.ok(),
      `API authentication failed: ${response.status()} ${response.statusText()}`,
    ).toBeTruthy();

    const body = await response.json();
    await use(body.access_token);
  },
});

export { expect };
