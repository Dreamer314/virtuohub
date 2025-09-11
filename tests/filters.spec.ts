import { test, expect } from '@playwright/test';

test.describe('VirtuoHub Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should filter posts by platform', async ({ page }) => {
    // Verify initial state shows all posts
    const initialPosts = await page.locator('[data-testid*="card-post"]').count();
    expect(initialPosts).toBeGreaterThan(0);
    
    // Click Roblox platform filter
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.waitForTimeout(500); // Allow filter to apply
    
    // Verify URL contains platform filter
    await expect(page).toHaveURL(/platform=Roblox/);
    
    // Verify only Roblox posts are visible
    const visibleCards = await page.locator('[data-testid*="card-post"]').all();
    for (const card of visibleCards) {
      await expect(card.locator('[data-testid*="platform"][data-testid*="Roblox"]')).toBeVisible();
    }
    
    // Clear filter
    await page.click('[data-testid="button-clear-filters"]');
    await expect(page).toHaveURL(/^[^?]*$/); // No query params
  });

  test('should filter by multiple platforms', async ({ page }) => {
    // Select multiple platforms
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.click('[data-testid="platform-filter-VRChat"]');
    await page.waitForTimeout(500);
    
    // Verify URL contains both platforms
    await expect(page).toHaveURL(/platform=.*Roblox/);
    await expect(page).toHaveURL(/platform=.*VRChat/);
    
    // Verify posts from either platform are visible
    const visibleCards = await page.locator('[data-testid*="card-post"]').all();
    for (const card of visibleCards) {
      const hasRoblox = await card.locator('[data-testid*="platform"][data-testid*="Roblox"]').isVisible();
      const hasVRChat = await card.locator('[data-testid*="platform"][data-testid*="VRChat"]').isVisible();
      expect(hasRoblox || hasVRChat).toBeTruthy();
    }
  });

  test('should filter by content type (subtype)', async ({ page }) => {
    // Navigate to Spotlights page
    await page.click('[data-testid="nav-spotlights"]');
    await page.waitForLoadState('networkidle');
    
    // Verify URL and content
    await expect(page).toHaveURL(/\/spotlights/);
    await expect(page).toHaveURL(/subtype=spotlight/);
    
    // Verify page shows spotlight content
    await expect(page.locator('h1')).toContainText('Creator Spotlights');
    
    // Navigate to Events page
    await page.click('[data-testid="nav-events"]');
    await page.waitForLoadState('networkidle');
    
    // Verify events filtering
    await expect(page).toHaveURL(/\/events/);
    await expect(page).toHaveURL(/subtype=event/);
    await expect(page.locator('h1')).toContainText('Virtual Events');
  });

  test('should persist filters in URL and reload state', async ({ page }) => {
    // Set up filters
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.waitForTimeout(500);
    
    // Navigate to another page and back
    await page.click('[data-testid="nav-spotlights"]');
    await page.waitForLoadState('networkidle');
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Verify filter state is preserved
    await expect(page).toHaveURL(/platform=Roblox/);
    await expect(page.locator('[data-testid="platform-filter-Roblox"]')).toHaveClass(/active|selected/);
  });

  test('should combine platform and content type filters', async ({ page }) => {
    // Go to events page (content type filter)
    await page.click('[data-testid="nav-events"]');
    await page.waitForLoadState('networkidle');
    
    // Add platform filter
    await page.click('[data-testid="platform-filter-VRChat"]');
    await page.waitForTimeout(500);
    
    // Verify both filters in URL
    await expect(page).toHaveURL(/subtype=event/);
    await expect(page).toHaveURL(/platform=VRChat/);
    
    // Verify posts match both filters
    const visibleCards = await page.locator('[data-testid*="card-post"]').all();
    if (visibleCards.length > 0) {
      for (const card of visibleCards) {
        // Should be events (check for event-specific UI elements)
        await expect(card.locator('[data-testid*="platform"][data-testid*="VRChat"]')).toBeVisible();
      }
    }
  });

  test('should handle filter clear functionality', async ({ page }) => {
    // Apply multiple filters
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.click('[data-testid="platform-filter-VRChat"]');
    await page.waitForTimeout(500);
    
    // Verify filters applied
    await expect(page.locator('[data-testid="platform-filter-Roblox"]')).toHaveClass(/active|selected/);
    await expect(page.locator('[data-testid="platform-filter-VRChat"]')).toHaveClass(/active|selected/);
    
    // Clear all filters
    await page.click('[data-testid="button-clear-filters"]');
    await page.waitForTimeout(500);
    
    // Verify filters cleared
    await expect(page).toHaveURL(/^[^?]*$/); // No query params
    await expect(page.locator('[data-testid="platform-filter-Roblox"]')).not.toHaveClass(/active|selected/);
    await expect(page.locator('[data-testid="platform-filter-VRChat"]')).not.toHaveClass(/active|selected/);
  });

  test('should filter by category', async ({ page }) => {
    // Test category filtering if available
    if (await page.locator('[data-testid="category-filter"]').isVisible()) {
      // Select a category
      await page.click('[data-testid="category-filter"]');
      await page.click('[data-testid="category-option-assets-for-sale"]');
      await page.waitForTimeout(500);
      
      // Verify URL contains category
      await expect(page).toHaveURL(/category=assets-for-sale/);
      
      // Verify filtered posts
      const visibleCards = await page.locator('[data-testid*="card-post"]').all();
      for (const card of visibleCards) {
        // Check that posts have the correct category badge/indicator
        await expect(card.locator('[data-testid*="category"]')).toContainText('Assets for Sale');
      }
    }
  });

  test('should handle search functionality', async ({ page }) => {
    // Test search if available
    if (await page.locator('[data-testid="input-search"]').isVisible()) {
      // Perform search
      await page.fill('[data-testid="input-search"]', 'VRChat');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      // Verify search in URL or results
      const visibleCards = await page.locator('[data-testid*="card-post"]').all();
      if (visibleCards.length > 0) {
        for (const card of visibleCards) {
          const cardText = await card.textContent();
          expect(cardText?.toLowerCase()).toContain('vrchat');
        }
      }
    }
  });

  test('should handle empty filter states', async ({ page }) => {
    // Apply a very specific filter that might return no results
    await page.click('[data-testid="platform-filter-inZOI"]'); // Less common platform
    await page.waitForTimeout(500);
    
    // Check if empty state is handled gracefully
    const cards = await page.locator('[data-testid*="card-post"]').count();
    if (cards === 0) {
      // Should show empty state message
      await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
      await expect(page.locator('text=No posts found')).toBeVisible();
    }
  });

  test('should handle filter transitions smoothly', async ({ page }) => {
    // Test smooth transitions between filter states
    await page.click('[data-testid="platform-filter-Roblox"]');
    await page.waitForTimeout(300);
    
    // Quickly switch to another filter
    await page.click('[data-testid="platform-filter-VRChat"]');
    await page.waitForTimeout(300);
    
    // Verify final state is correct
    await expect(page).toHaveURL(/platform=.*VRChat/);
    await expect(page.locator('[data-testid="platform-filter-VRChat"]')).toHaveClass(/active|selected/);
  });
});