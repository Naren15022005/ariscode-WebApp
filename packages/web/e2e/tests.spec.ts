import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Aris Code WebApp E2E', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page).toHaveTitle('Aris Code');
    await expect(page.getByRole('heading', { name: 'Aris Code' })).toBeVisible();
    await expect(page.getByText(/Pattern-based code generation/)).toBeVisible();
  });

  test('database initializes', async ({ page }) => {
    const response = await page.request.post(`${BASE_URL}/api/init`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain('initialized');
  });

  test('templates endpoint returns patterns', async ({ page }) => {
    // First init
    await page.request.post(`${BASE_URL}/api/init`);

    const response = await page.request.get(`${BASE_URL}/api/templates`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('search patterns endpoint works', async ({ page }) => {
    await page.request.post(`${BASE_URL}/api/init`);

    const response = await page.request.get(`${BASE_URL}/api/patterns?q=react`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('generate endpoint accepts POST', async ({ page }) => {
    await page.request.post(`${BASE_URL}/api/init`);

    const response = await page.request.post(`${BASE_URL}/api/generate`, {
      data: {
        patternId: 'seed-hello-world',
        variables: { name: 'Test' },
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.files || body.success).toBeTruthy();
  });

  test('projects endpoint works', async ({ page }) => {
    await page.request.post(`${BASE_URL}/api/init`);

    const response = await page.request.get(`${BASE_URL}/api/projects`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('solutions endpoint works', async ({ page }) => {
    await page.request.post(`${BASE_URL}/api/init`);

    const response = await page.request.get(`${BASE_URL}/api/solutions?error=TypeError`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('sync endpoint triggers GitHub sync', async ({ page }) => {
    await page.request.post(`${BASE_URL}/api/init`);

    const response = await page.request.post(`${BASE_URL}/api/sync`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.stats).toBeDefined();
  });

  test('templates page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/templates`);

    await expect(page).toHaveTitle('Aris Code');
    await page.waitForLoadState('networkidle');
  });

  test('generate page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/generate`);

    await expect(page).toHaveTitle('Aris Code');
    await page.waitForLoadState('networkidle');
  });

  test('projects page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);

    await expect(page).toHaveTitle('Aris Code');
    await page.waitForLoadState('networkidle');
  });

  test('solutions page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/solutions`);

    await expect(page).toHaveTitle('Aris Code');
    await page.waitForLoadState('networkidle');
  });

  test('navigation works between pages', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByRole('link', { name: /Templates/ }).first().click();
    await expect(page).toHaveURL(/\/templates/);

    await page.getByRole('link', { name: /Aris Code/ }).first().click();
    await expect(page).toHaveURL(BASE_URL);
  });

  test('full generation flow', async ({ page }) => {
    await page.request.post(`${BASE_URL}/api/init`);

    // Visit generate page with pattern ID
    await page.goto(`${BASE_URL}/generate?patternId=seed-hello-world`);

    await page.waitForLoadState('networkidle');

    // Should contain the app shell
    await expect(page.getByText(/Aris Code/)).toBeVisible();
  });
});
