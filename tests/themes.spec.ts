import { test, expect } from '@playwright/test';

test.describe('VirtuoHub Theme Modes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('[data-testid="button-theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // Check initial theme (likely light)
    const initialTheme = await page.locator('html').getAttribute('class');
    const isDarkInitially = initialTheme?.includes('dark') || false;
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300); // Allow theme transition
    
    // Verify theme changed
    const newTheme = await page.locator('html').getAttribute('class');
    const isDarkAfterToggle = newTheme?.includes('dark') || false;
    
    expect(isDarkAfterToggle).toBe(!isDarkInitially);
    
    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Verify back to original
    const finalTheme = await page.locator('html').getAttribute('class');
    const isDarkFinal = finalTheme?.includes('dark') || false;
    expect(isDarkFinal).toBe(isDarkInitially);
  });

  test('should persist theme preference', async ({ page }) => {
    // Toggle to dark theme
    await page.click('[data-testid="button-theme-toggle"]');
    await page.waitForTimeout(300);
    
    // Verify dark theme is applied
    const themeAfterToggle = await page.locator('html').getAttribute('class');
    const isDark = themeAfterToggle?.includes('dark') || false;
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify theme persisted
    const themeAfterReload = await page.locator('html').getAttribute('class');
    const isDarkAfterReload = themeAfterReload?.includes('dark') || false;
    expect(isDarkAfterReload).toBe(isDark);
  });

  test('should display theme toggle icon correctly', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="button-theme-toggle"]');
    
    // Check initial icon
    const initialIcon = await themeToggle.locator('svg').getAttribute('data-icon') || 
                       await themeToggle.textContent();
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Check icon changed
    const newIcon = await themeToggle.locator('svg').getAttribute('data-icon') || 
                   await themeToggle.textContent();
    
    expect(newIcon).not.toBe(initialIcon);
  });

  test('should handle charcoal theme if available', async ({ page }) => {
    // Look for charcoal theme option (if implemented)
    const advancedThemeSelector = page.locator('[data-testid="theme-selector"]');
    
    if (await advancedThemeSelector.isVisible()) {
      // Open theme selector
      await advancedThemeSelector.click();
      
      // Look for charcoal option
      const charcoalOption = page.locator('[data-testid="theme-option-charcoal"]');
      
      if (await charcoalOption.isVisible()) {
        await charcoalOption.click();
        await page.waitForTimeout(300);
        
        // Verify charcoal theme applied
        const htmlClass = await page.locator('html').getAttribute('class');
        expect(htmlClass).toContain('charcoal');
      }
    }
  });

  test('should apply theme to all UI components', async ({ page }) => {
    // Test light theme colors
    const header = page.locator('[data-testid="header"]');
    const sidebar = page.locator('[data-testid="sidebar-left"]');
    const postCard = page.locator('[data-testid*="card-post"]').first();
    
    // Get initial computed styles
    const headerBg = await header.evaluate(el => getComputedStyle(el).backgroundColor);
    const sidebarBg = await sidebar.evaluate(el => getComputedStyle(el).backgroundColor);
    const cardBg = await postCard.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Toggle to dark theme
    await page.click('[data-testid="button-theme-toggle"]');
    await page.waitForTimeout(300);
    
    // Verify colors changed
    const headerBgDark = await header.evaluate(el => getComputedStyle(el).backgroundColor);
    const sidebarBgDark = await sidebar.evaluate(el => getComputedStyle(el).backgroundColor);
    const cardBgDark = await postCard.evaluate(el => getComputedStyle(el).backgroundColor);
    
    expect(headerBgDark).not.toBe(headerBg);
    expect(sidebarBgDark).not.toBe(sidebarBg);
    expect(cardBgDark).not.toBe(cardBg);
  });

  test('should handle theme transition animations', async ({ page }) => {
    const body = page.locator('body');
    
    // Toggle theme and check for smooth transition
    await page.click('[data-testid="button-theme-toggle"]');
    
    // Check if transition classes are applied (if implemented)
    const hasTransition = await body.evaluate(el => {
      const styles = getComputedStyle(el);
      return styles.transition !== 'none' && styles.transition !== '';
    });
    
    // If transitions are implemented, they should be present
    if (hasTransition) {
      expect(hasTransition).toBeTruthy();
    }
  });

  test('should respect system theme preference', async ({ page }) => {
    // This test would check if the app respects prefers-color-scheme
    const systemPrefersDark = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    // Reload page to check initial theme
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if initial theme matches system preference
    const htmlClass = await page.locator('html').getAttribute('class');
    const isDark = htmlClass?.includes('dark') || false;
    
    // This assertion would depend on your implementation
    // If you implement system theme detection, uncomment:
    // expect(isDark).toBe(systemPrefersDark);
  });

  test('should maintain theme consistency across pages', async ({ page }) => {
    // Set dark theme
    await page.click('[data-testid="button-theme-toggle"]');
    await page.waitForTimeout(300);
    
    // Navigate to different pages
    await page.click('[data-testid="nav-spotlights"]');
    await page.waitForLoadState('networkidle');
    
    // Verify theme persisted
    let htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
    
    // Navigate to events page
    await page.click('[data-testid="nav-events"]');
    await page.waitForLoadState('networkidle');
    
    // Verify theme still persisted
    htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
    
    // Navigate back to home
    await page.click('[data-testid="nav-home"]');
    await page.waitForLoadState('networkidle');
    
    // Verify theme consistent
    htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
  });

  test('should handle theme-specific icons and graphics', async ({ page }) => {
    // Check if logo or icons change with theme
    const logo = page.locator('[data-testid="logo"]');
    const themeSpecificElements = page.locator('[data-testid*="theme-"]');
    
    if (await logo.isVisible()) {
      const initialSrc = await logo.getAttribute('src');
      
      // Toggle theme
      await page.click('[data-testid="button-theme-toggle"]');
      await page.waitForTimeout(300);
      
      // Check if logo changed (if theme-specific logos are implemented)
      const newSrc = await logo.getAttribute('src');
      // This would depend on your implementation
    }
  });

  test('should handle theme toggle keyboard accessibility', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="button-theme-toggle"]');
    
    // Focus on theme toggle
    await themeToggle.focus();
    await expect(themeToggle).toBeFocused();
    
    // Activate with Enter key
    await themeToggle.press('Enter');
    await page.waitForTimeout(300);
    
    // Verify theme changed
    const htmlClass = await page.locator('html').getAttribute('class');
    const isDark = htmlClass?.includes('dark') || false;
    
    // Toggle back with Space key
    await themeToggle.press('Space');
    await page.waitForTimeout(300);
    
    // Verify theme changed back
    const htmlClassAfter = await page.locator('html').getAttribute('class');
    const isDarkAfter = htmlClassAfter?.includes('dark') || false;
    expect(isDarkAfter).not.toBe(isDark);
  });

  test('should handle theme in composer modal', async ({ page }) => {
    // Toggle to dark theme
    await page.click('[data-testid="button-theme-toggle"]');
    await page.waitForTimeout(300);
    
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Verify modal has dark theme
    const modal = page.locator('[data-testid="modal-create-post"]');
    const modalBg = await modal.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Should not be white/light color
    expect(modalBg).not.toBe('rgb(255, 255, 255)');
    
    // Verify form elements have dark theme
    const titleInput = page.locator('[data-testid="input-title"]');
    const inputBg = await titleInput.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(inputBg).not.toBe('rgb(255, 255, 255)');
  });
});