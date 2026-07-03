import { test } from '@fixtures/ui-auth-fixture';

test.describe(`PSR UI journeys – UI behaviour validation`, () => {
  test('User successfully logs in and navigates to the PSR landing page - @smoke @ui @regression', async ({
    page,
  }) => {
    console.log('[Test] Test started, page URL:', page.url());
  });
});
