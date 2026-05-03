import { test, expect } from '@playwright/test';

test.describe('Aris Code - Full Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Initialize database
    await page.goto('/api/init');
    await expect(page.locator('body')).toContainText('initialized');
  });

  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Aris Code');
    await expect(page.locator('text=Generate Code')).toBeVisible();
  });

  test('should display templates list', async ({ page }) => {
    await page.goto('/templates');
    await expect(page.locator('h1')).toContainText('Code Templates');

    // Wait for patterns to load
    await page.waitForTimeout(1000);
    const cards = await page.locator('[class*="rounded-lg"]').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('should generate code from pattern', async ({ page }) => {
    // Navigate to templates
    await page.goto('/templates');

    // Wait for patterns to load and click first one
    await page.waitForTimeout(1000);
    const generateButton = page.locator('text=Generate').first();
    await generateButton.click();

    // Should redirect to generate page
    await page.waitForURL(/\/generate/);
    await expect(page.locator('h2')).toContainText('Configuration');

    // Fill in variables
    await page.fill('input[placeholder="e.g., my-project"]', 'TestProject');

    // Generate code
    await page.click('button:has-text("Generate Code")');

    // Wait for code preview
    await page.waitForTimeout(2000);
    const codeBlock = page.locator('pre');
    await expect(codeBlock).toBeVisible();
  });

  test('should search patterns', async ({ page }) => {
    await page.goto('/templates');

    // Search for a pattern
    await page.fill('input[placeholder="Search templates..."]', 'hello');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Should find at least one result
    const cards = await page.locator('[class*="rounded-lg"][class*="p-6"]').count();
    expect(cards).toBeGreaterThanOrEqual(1);
  });

  test('should handle missing pattern gracefully', async ({ page }) => {
    await page.goto('/generate?patternId=nonexistent');

    // Fill in name
    await page.fill('input[placeholder="e.g., my-project"]', 'Test');

    // Try to generate
    await page.click('button:has-text("Generate Code")');

    // Should show error
    await page.waitForTimeout(1000);
    // Alert or error message should appear
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Click Templates link
    await page.click('text=Templates');
    await expect(page).toHaveURL(/\/templates/);

    // Click Projects link
    await page.click('text=Projects');
    await expect(page).toHaveURL(/\/projects/);

    // Go back home
    await page.click('text=Aris Code');
    await expect(page).toHaveURL('/');
  });
});
