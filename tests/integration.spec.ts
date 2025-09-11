import { test, expect } from '@playwright/test';

test.describe('VirtuoHub Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should perform end-to-end user workflow', async ({ page }) => {
    const timestamp = Date.now();

    // 1. Create a new post
    await page.click('[data-testid="button-create-post"]');
    await page.fill('[data-testid="input-title"]', `Integration Test Post ${timestamp}`);
    await page.fill('[data-testid="textarea-content"]', `This is an integration test created at ${timestamp}`);
    await page.click('[data-testid="platform-chip-Roblox"]');
    await page.click('[data-testid="button-submit"]');
    
    // Verify post was created
    await expect(page.locator('[data-testid="modal-create-post"]')).not.toBeVisible();
    await page.waitForTimeout(1000);
    await expect(page.locator(`text=Integration Test Post ${timestamp}`)).toBeVisible();

    // 2. Filter by platform used in post
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.waitForTimeout(500);
    
    // Verify URL and filtering
    await expect(page).toHaveURL(/platform=Roblox/);
    await expect(page.locator(`text=Integration Test Post ${timestamp}`)).toBeVisible();

    // 3. Navigate to content type pages
    await page.click('[data-testid="nav-spotlights"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/spotlights/);

    await page.click('[data-testid="nav-events"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/events/);

    // 4. Return to home and verify state
    await page.click('[data-testid="nav-home"]');
    await page.waitForLoadState('networkidle');
    
    // Clear filters and verify post still exists
    if (await page.locator('[data-testid="button-clear-filters"]').isVisible()) {
      await page.click('[data-testid="button-clear-filters"]');
    }
    await expect(page.locator(`text=Integration Test Post ${timestamp}`)).toBeVisible();
  });

  test('should handle theme switching during user workflow', async ({ page }) => {
    // Start in light theme
    let htmlClass = await page.locator('html').getAttribute('class');
    const initialTheme = htmlClass?.includes('dark') ? 'dark' : 'light';

    // Switch to dark theme
    await page.click('[data-testid="button-theme-toggle"]');
    await page.waitForTimeout(300);

    // Create post in dark theme
    await page.click('[data-testid="button-create-post"]');
    await expect(page.locator('[data-testid="modal-create-post"]')).toBeVisible();
    
    // Verify modal has dark theme
    const modal = page.locator('[data-testid="modal-create-post"]');
    const modalBg = await modal.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(modalBg).not.toBe('rgb(255, 255, 255)'); // Should not be white

    // Close modal and navigate pages
    await page.keyboard.press('Escape');
    await page.click('[data-testid="nav-spotlights"]');
    
    // Verify theme persisted across navigation
    htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
  });

  test('should handle complex filtering scenarios', async ({ page }) => {
    // Apply multiple filters
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.click('[data-testid="platform-filter-VRChat"]');
    await page.waitForTimeout(500);

    // Navigate to events page with filters
    await page.click('[data-testid="nav-events"]');
    await page.waitForLoadState('networkidle');

    // Verify both content type and platform filters are applied
    await expect(page).toHaveURL(/subtype=event/);
    await expect(page).toHaveURL(/platform=.*Roblox/);
    await expect(page).toHaveURL(/platform=.*VRChat/);

    // Clear filters and verify
    await page.click('[data-testid="button-clear-filters"]');
    await page.waitForTimeout(500);
    
    // Should keep content type filter but clear platform filters
    await expect(page).toHaveURL(/subtype=event/);
    await expect(page).not.toHaveURL(/platform=/);
  });

  test('should handle poll creation and voting workflow', async ({ page }) => {
    const timestamp = Date.now();

    // Create a poll
    await page.click('[data-testid="button-create-post"]');
    await page.click('[data-testid="content-type-poll"]');
    
    await page.fill('[data-testid="input-title"]', `Poll Integration Test ${timestamp}`);
    await page.fill('[data-testid="input-poll-question"]', `Integration test poll ${timestamp}?`);
    await page.fill('[data-testid="input-poll-choice-0"]', 'Option A');
    await page.fill('[data-testid="input-poll-choice-1"]', 'Option B');
    
    await page.click('[data-testid="platform-chip-Roblox"]');
    await page.click('[data-testid="button-submit"]');

    // Wait for poll to appear
    await page.waitForTimeout(1000);
    await expect(page.locator(`text=Poll Integration Test ${timestamp}`)).toBeVisible();

    // Find and vote on the poll
    const pollOption = await page.locator('[data-testid*="poll-option"]').first();
    if (await pollOption.isVisible()) {
      await pollOption.click();
      await page.waitForTimeout(500);
      
      // Verify voting worked
      await expect(pollOption).toHaveClass(/selected|voted|active/);
      await expect(page.locator('text=/%/')).toBeVisible();
    }
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test navigation to non-existent post
    await page.goto('/post/nonexistent-id');
    
    // Should show 404 page or error state
    const is404 = await page.locator('text=/404|not found/i').isVisible();
    const hasErrorBoundary = await page.locator('[data-testid="error-boundary"]').isVisible();
    
    expect(is404 || hasErrorBoundary).toBeTruthy();

    // Navigate back to home should work
    if (await page.locator('[data-testid="link-home"]').isVisible()) {
      await page.click('[data-testid="link-home"]');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/');
    }
  });

  test('should handle responsive layout changes', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('[data-testid="sidebar-left"]')).toBeVisible();
    await expect(page.locator('[data-testid="sidebar-right"]')).toBeVisible();

    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    
    // Sidebars might be hidden or collapsed on smaller screens
    const leftSidebarVisible = await page.locator('[data-testid="sidebar-left"]').isVisible();
    const rightSidebarVisible = await page.locator('[data-testid="sidebar-right"]').isVisible();
    
    // Main content should always be visible
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    
    // Mobile menu might be available
    const mobileMenu = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
    }
  });

  test('should handle performance with many posts', async ({ page }) => {
    // Navigate to home and measure load time
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(5000); // 5 seconds

    // Test scrolling performance
    const postCount = await page.locator('[data-testid*="card-post"]').count();
    expect(postCount).toBeGreaterThan(0);

    // Test lazy loading if implemented
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Should handle scrolling without crashes
    await expect(page.locator('body')).toBeVisible();
  });

  test('should maintain data consistency', async ({ page }) => {
    const timestamp = Date.now();

    // Create post on home page
    await page.click('[data-testid="button-create-post"]');
    await page.fill('[data-testid="input-title"]', `Consistency Test ${timestamp}`);
    await page.fill('[data-testid="textarea-content"]', 'Testing data consistency');
    await page.click('[data-testid="platform-chip-VRChat"]');
    await page.click('[data-testid="button-submit"]');
    
    await page.waitForTimeout(1000);
    
    // Navigate to events page and back
    await page.click('[data-testid="nav-events"]');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="nav-home"]');
    await page.waitForLoadState('networkidle');
    
    // Post should still be visible
    await expect(page.locator(`text=Consistency Test ${timestamp}`)).toBeVisible();
    
    // Filter by VRChat (platform used in post)
    await page.click('[data-testid="platform-filter-VRChat"]');
    await page.waitForTimeout(500);
    
    // Post should still be visible after filtering
    await expect(page.locator(`text=Consistency Test ${timestamp}`)).toBeVisible();
  });

  test('should handle concurrent user actions', async ({ page }) => {
    // Simulate rapid user interactions
    const timestamp = Date.now();
    
    // Rapid theme switching
    await page.click('[data-testid="button-theme-toggle"]');
    await page.click('[data-testid="button-theme-toggle"]');
    await page.waitForTimeout(300);
    
    // Rapid filter changes
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.click('[data-testid="platform-filter-VRChat"]');
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.waitForTimeout(500);
    
    // Should handle rapid changes gracefully
    await expect(page.locator('body')).toBeVisible();
    
    // Final state should be consistent
    const htmlClass = await page.locator('html').getAttribute('class');
    const currentUrl = page.url();
    
    // Should have a valid theme
    expect(htmlClass).toMatch(/light|dark|charcoal/);
    
    // Should have valid URL structure
    expect(currentUrl).toContain('localhost:5000');
  });
});