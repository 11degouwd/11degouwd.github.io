import { test, expect } from '@playwright/test';

test.describe('core site health', () => {
  test('home page loads with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    expect(errors, `Console errors: ${errors.join('\n')}`).toHaveLength(0);
  });

  test('no broken internal images', async ({ page, request }) => {
    await page.goto('/');
    const srcs = await page.locator('img').evaluateAll((imgs) =>
      imgs.map((i) => (i as HTMLImageElement).src)
    );
    for (const src of srcs) {
      if (!src.startsWith('http://localhost:1313')) continue;
      const res = await request.get(src);
      expect(res.ok(), `Broken image: ${src}`).toBeTruthy();
    }
  });

  test('nav links resolve', async ({ page, request, baseURL }) => {
    await page.goto('/');
    const hrefs = await page.locator('nav a').evaluateAll((as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute('href'))
    );
    for (const href of hrefs) {
      if (!href || href.startsWith('#') || href.startsWith('http')) continue;
      const res = await request.get(new URL(href, baseURL).toString());
      expect(res.ok(), `Broken nav link: ${href}`).toBeTruthy();
    }
  });
});

test.describe('project filtering', () => {
  test('filtering by tag shows expected results', async ({ page }) => {
    await page.goto('/portfolio/');
    const initialCount = await page.locator('#portfolio-cards .project-card').count();
    expect(initialCount).toBeGreaterThan(0);

    // Index 0 is the "All" button (already active); click the first real tag filter.
    const tagFilter = page.locator('#portfolio .filter-btn').nth(1);
    if (await tagFilter.count()) {
      await tagFilter.click();
      await expect(page.locator('#portfolio-cards .project-card:visible')).not.toHaveCount(0);
    }
  });

  test('an unrecognized ?tag= in the URL leaves the grid intact, not broken', async ({ page }) => {
    await page.goto('/portfolio/');
    const initialCount = await page.locator('#portfolio-cards .project-card').count();

    // portfolioList.js only looks up a filter button matching the URL's tag param;
    // there's no button for a made-up tag, so the lookup silently no-ops and the
    // "All" filter (and every card) stays visible — there's no dedicated empty-state
    // element in the markup, so that's the actual "doesn't break" behavior to assert.
    await page.goto('/portfolio/?tag=__no_such_tag__');
    await expect(page.locator('#portfolio-cards .project-card:visible')).toHaveCount(initialCount);
  });
});

test.describe('visual snapshots', () => {
  for (const path of ['/', '/portfolio/']) {
    test(`screenshot: ${path}`, async ({ page }, testInfo) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(
        `${path.replace(/\//g, '_') || 'home'}-${testInfo.project.name}.png`,
        { fullPage: true, maxDiffPixelRatio: 0.02 }
      );
    });
  }
});
