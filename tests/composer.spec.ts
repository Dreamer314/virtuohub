import { test, expect, type Page } from '@playwright/test';

test.describe('VirtuoHub Composer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open and close composer modal', async ({ page }) => {
    // Test opening composer
    await page.click('[data-testid="button-create-post"]');
    await expect(page.locator('[data-testid="modal-create-post"]')).toBeVisible();
    
    // Test closing with X button
    await page.click('[data-testid="button-close-modal"]');
    await expect(page.locator('[data-testid="modal-create-post"]')).not.toBeVisible();
    
    // Test opening again and closing with escape key
    await page.click('[data-testid="button-create-post"]');
    await expect(page.locator('[data-testid="modal-create-post"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="modal-create-post"]')).not.toBeVisible();
  });

  test('should create a basic post', async ({ page }) => {
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Fill out basic post form
    const timestamp = Date.now();
    const title = `Test Post ${timestamp}`;
    const content = `This is a test post created at ${timestamp}`;
    
    await page.fill('[data-testid="input-title"]', title);
    await page.fill('[data-testid="textarea-content"]', content);
    
    // Select category
    await page.click('[data-testid="select-category"]');
    await page.click('[data-testid="category-option-general"]');
    
    // Select platform
    await page.click('[data-testid="platform-chip-Roblox"]');
    await expect(page.locator('[data-testid="platform-chip-Roblox"]')).toHaveClass(/selected/);
    
    // Submit post
    await page.click('[data-testid="button-submit"]');
    
    // Verify modal closes
    await expect(page.locator('[data-testid="modal-create-post"]')).not.toBeVisible();
    
    // Verify post appears in feed (may need to wait for refresh)
    await page.waitForTimeout(1000);
    await expect(page.locator(`[data-testid*="title"]:has-text("${title}")`)).toBeVisible();
  });

  test('should create a poll (VHub Data Pulse)', async ({ page }) => {
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Switch to poll type
    await page.click('[data-testid="content-type-poll"]');
    
    // Fill out poll details
    const timestamp = Date.now();
    const title = `Poll Test ${timestamp}`;
    const question = `What's your favorite platform as of ${timestamp}?`;
    
    await page.fill('[data-testid="input-title"]', title);
    await page.fill('[data-testid="input-poll-question"]', question);
    
    // Add poll choices
    await page.fill('[data-testid="input-poll-choice-0"]', 'Roblox');
    await page.fill('[data-testid="input-poll-choice-1"]', 'VRChat');
    
    // Add a third choice
    await page.click('[data-testid="button-add-choice"]');
    await page.fill('[data-testid="input-poll-choice-2"]', 'Second Life');
    
    // Select platform
    await page.click('[data-testid="platform-chip-Roblox"]');
    
    // Submit poll
    await page.click('[data-testid="button-submit"]');
    
    // Verify modal closes and poll appears
    await expect(page.locator('[data-testid="modal-create-post"]')).not.toBeVisible();
    await page.waitForTimeout(1000);
    await expect(page.locator(`[data-testid*="title"]:has-text("${title}")`)).toBeVisible();
    
    // Verify poll component is visible
    await expect(page.locator('[data-testid*="poll-option"]').first()).toBeVisible();
  });

  test('should create an event post', async ({ page }) => {
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Switch to event type
    await page.click('[data-testid="content-type-event"]');
    
    // Fill out event details
    const timestamp = Date.now();
    const title = `Event Test ${timestamp}`;
    const content = `Virtual event happening at ${timestamp}`;
    
    await page.fill('[data-testid="input-title"]', title);
    await page.fill('[data-testid="textarea-content"]', content);
    
    // Set event date (if date picker exists)
    if (await page.locator('[data-testid="input-event-date"]').isVisible()) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      await page.fill('[data-testid="input-event-date"]', futureDate.toISOString().split('T')[0]);
    }
    
    // Select platform
    await page.click('[data-testid="platform-chip-VRChat"]');
    
    // Submit event
    await page.click('[data-testid="button-submit"]');
    
    // Verify event created
    await expect(page.locator('[data-testid="modal-create-post"]')).not.toBeVisible();
    await page.waitForTimeout(1000);
    await expect(page.locator(`[data-testid*="title"]:has-text("${title}")`)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Try to submit without required fields
    await page.click('[data-testid="button-submit"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="error-title"]')).toBeVisible();
    
    // Fill title but leave content empty
    await page.fill('[data-testid="input-title"]', 'Test Title');
    await page.click('[data-testid="button-submit"]');
    
    // Should still show content error for certain post types
    // (This will depend on your validation rules)
  });

  test('should handle platform selection', async ({ page }) => {
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Test single platform selection
    await page.click('[data-testid="platform-chip-Roblox"]');
    await expect(page.locator('[data-testid="platform-chip-Roblox"]')).toHaveClass(/selected/);
    
    // Test multi-platform selection
    await page.click('[data-testid="platform-chip-VRChat"]');
    await expect(page.locator('[data-testid="platform-chip-VRChat"]')).toHaveClass(/selected/);
    await expect(page.locator('[data-testid="platform-chip-Roblox"]')).toHaveClass(/selected/);
    
    // Test deselection
    await page.click('[data-testid="platform-chip-Roblox"]');
    await expect(page.locator('[data-testid="platform-chip-Roblox"]')).not.toHaveClass(/selected/);
    await expect(page.locator('[data-testid="platform-chip-VRChat"]')).toHaveClass(/selected/);
  });

  test('should handle image upload placeholder', async ({ page }) => {
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Check if image upload section exists
    if (await page.locator('[data-testid="image-upload-section"]').isVisible()) {
      // Test image upload placeholder behavior
      await page.click('[data-testid="button-add-image"]');
      
      // Verify image preview area appears
      await expect(page.locator('[data-testid="image-preview-area"]')).toBeVisible();
    }
  });

  test('should preserve form data when switching content types', async ({ page }) => {
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Fill some basic info
    await page.fill('[data-testid="input-title"]', 'Test Title');
    await page.click('[data-testid="platform-chip-Roblox"]');
    
    // Switch content types
    await page.click('[data-testid="content-type-poll"]');
    
    // Verify basic info is preserved
    await expect(page.locator('[data-testid="input-title"]')).toHaveValue('Test Title');
    await expect(page.locator('[data-testid="platform-chip-Roblox"]')).toHaveClass(/selected/);
    
    // Switch back
    await page.click('[data-testid="content-type-general"]');
    
    // Verify info still preserved
    await expect(page.locator('[data-testid="input-title"]')).toHaveValue('Test Title');
  });
});