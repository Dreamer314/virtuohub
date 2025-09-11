import { test, expect } from '@playwright/test';

// Basic smoke test to verify Playwright setup
test.describe('VirtuoHub Basic Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify basic page structure
    await expect(page).toHaveTitle(/VirtuoHub/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have basic navigation elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for header
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    
    // Check for main content area
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });

  test('should handle basic user interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try clicking on any interactive element
    const interactiveElements = await page.locator('button, a, [role="button"]').all();
    expect(interactiveElements.length).toBeGreaterThan(0);
  });
});