import { test } from '@fixtures/ui-auth-fixture';

test.describe(`PACFS UI journeys – UI behaviour validation`, () => {
  test('User successfully logs in and navigates to the Search/Home page - @smoke @ui @regression @pic-5113', async ({
    page,
  }) => {
    console.log('[Test] Test started, page URL:', page.url());
  });
});
