import { test, expect } from '@playwright/test';

test.describe('VirtuoHub Polls (VHub Data Pulse)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display poll with voting options', async ({ page }) => {
    // Look for existing poll posts
    const pollCards = await page.locator('[data-testid*="poll-option"]').first();
    
    if (await pollCards.isVisible()) {
      // Test poll display
      await expect(pollCards).toBeVisible();
      
      // Verify poll question is displayed
      const pollContainer = pollCards.locator('..').locator('..');
      await expect(pollContainer.locator('text=/Vote on|poll|question/i')).toBeVisible();
      
      // Verify poll options are clickable
      const firstOption = await page.locator('[data-testid*="poll-option"]').first();
      await expect(firstOption).toBeEnabled();
    }
  });

  test('should allow voting on poll', async ({ page }) => {
    // Find first poll on the page
    const pollOption = await page.locator('[data-testid*="poll-option"]').first();
    
    if (await pollOption.isVisible()) {
      // Click on poll option to vote
      await pollOption.click();
      
      // Wait for vote to process
      await page.waitForTimeout(500);
      
      // Verify poll option shows as selected/voted
      await expect(pollOption).toHaveClass(/selected|voted|active/);
      
      // Verify percentage or vote count is displayed
      await expect(page.locator('text=/%/')).toBeVisible();
      
      // Verify other options are disabled after voting
      const allPollOptions = await page.locator('[data-testid*="poll-option"]').all();
      if (allPollOptions.length > 1) {
        for (let i = 1; i < allPollOptions.length; i++) {
          await expect(allPollOptions[i]).toBeDisabled();
        }
      }
    }
  });

  test('should show poll results after voting', async ({ page }) => {
    // Find and vote on a poll
    const pollOption = await page.locator('[data-testid*="poll-option"]').first();
    
    if (await pollOption.isVisible()) {
      await pollOption.click();
      await page.waitForTimeout(500);
      
      // Verify results are shown
      await expect(page.locator('text=/%/')).toBeVisible();
      
      // Verify vote counts or percentages for all options
      const allPollOptions = await page.locator('[data-testid*="poll-option"]').all();
      for (const option of allPollOptions) {
        // Each option should show some result indicator
        const hasPercentage = await option.locator('text=/%/').isVisible();
        const hasCount = await option.locator('text=/\\d+ votes?/i').isVisible();
        expect(hasPercentage || hasCount).toBeTruthy();
      }
    }
  });

  test('should prevent multiple votes on same poll', async ({ page }) => {
    // Find and vote on first option
    const firstOption = await page.locator('[data-testid*="poll-option"]').first();
    
    if (await firstOption.isVisible()) {
      await firstOption.click();
      await page.waitForTimeout(500);
      
      // Try to vote on another option
      const secondOption = await page.locator('[data-testid*="poll-option"]').nth(1);
      if (await secondOption.isVisible()) {
        await secondOption.click();
        await page.waitForTimeout(300);
        
        // Verify original vote is still selected
        await expect(firstOption).toHaveClass(/selected|voted|active/);
        
        // Verify second option didn't get selected
        await expect(secondOption).not.toHaveClass(/selected|voted|active/);
      }
    }
  });

  test('should create new poll through composer', async ({ page }) => {
    // Open composer
    await page.click('[data-testid="button-create-post"]');
    
    // Switch to poll type
    await page.click('[data-testid="content-type-poll"]');
    
    // Fill out poll details
    const timestamp = Date.now();
    const title = `Poll Test ${timestamp}`;
    const question = `Which platform do you prefer as of ${timestamp}?`;
    
    await page.fill('[data-testid="input-title"]', title);
    await page.fill('[data-testid="input-poll-question"]', question);
    
    // Add poll choices
    await page.fill('[data-testid="input-poll-choice-0"]', 'Roblox');
    await page.fill('[data-testid="input-poll-choice-1"]', 'VRChat');
    
    // Add third choice
    await page.click('[data-testid="button-add-choice"]');
    await page.fill('[data-testid="input-poll-choice-2"]', 'Second Life');
    
    // Select platform
    await page.click('[data-testid="platform-chip-Roblox"]');
    
    // Submit poll
    await page.click('[data-testid="button-submit"]');
    
    // Verify poll created and visible
    await expect(page.locator('[data-testid="modal-create-post"]')).not.toBeVisible();
    await page.waitForTimeout(1000);
    
    // Find the new poll
    await expect(page.locator(`text=${title}`)).toBeVisible();
    await expect(page.locator(`text=${question}`)).toBeVisible();
    
    // Verify poll options are visible and interactive
    await expect(page.locator('text=Roblox').locator('[data-testid*="poll-option"]')).toBeVisible();
    await expect(page.locator('text=VRChat').locator('[data-testid*="poll-option"]')).toBeVisible();
    await expect(page.locator('text=Second Life').locator('[data-testid*="poll-option"]')).toBeVisible();
  });

  test('should handle poll choice management in composer', async ({ page }) => {
    // Open composer and switch to poll
    await page.click('[data-testid="button-create-post"]');
    await page.click('[data-testid="content-type-poll"]');
    
    // Fill basic info
    await page.fill('[data-testid="input-title"]', 'Test Poll');
    await page.fill('[data-testid="input-poll-question"]', 'Test question?');
    
    // Test adding choices
    await page.fill('[data-testid="input-poll-choice-0"]', 'Option 1');
    await page.fill('[data-testid="input-poll-choice-1"]', 'Option 2');
    
    // Add more choices
    await page.click('[data-testid="button-add-choice"]');
    await page.fill('[data-testid="input-poll-choice-2"]', 'Option 3');
    
    await page.click('[data-testid="button-add-choice"]');
    await page.fill('[data-testid="input-poll-choice-3"]', 'Option 4');
    
    // Test removing a choice
    if (await page.locator('[data-testid="button-remove-choice-3"]').isVisible()) {
      await page.click('[data-testid="button-remove-choice-3"]');
      await expect(page.locator('[data-testid="input-poll-choice-3"]')).not.toBeVisible();
    }
    
    // Verify remaining choices still visible
    await expect(page.locator('[data-testid="input-poll-choice-0"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-poll-choice-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-poll-choice-2"]')).toBeVisible();
  });

  test('should validate poll requirements', async ({ page }) => {
    // Open composer and switch to poll
    await page.click('[data-testid="button-create-post"]');
    await page.click('[data-testid="content-type-poll"]');
    
    // Try to submit without required fields
    await page.click('[data-testid="button-submit"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="error-title"]')).toBeVisible();
    
    // Fill title but leave question empty
    await page.fill('[data-testid="input-title"]', 'Test Poll');
    await page.click('[data-testid="button-submit"]');
    
    // Should show question error
    await expect(page.locator('[data-testid="error-poll-question"]')).toBeVisible();
    
    // Fill question but leave choices empty
    await page.fill('[data-testid="input-poll-question"]', 'Test question?');
    await page.click('[data-testid="button-submit"]');
    
    // Should show choices error
    await expect(page.locator('[data-testid="error-poll-choices"]')).toBeVisible();
  });

  test('should display poll in VHub Data Pulse style', async ({ page }) => {
    // Look for VHub Data Pulse posts (polls)
    const pulsePost = await page.locator('[data-testid*="card-post"]').filter({ hasText: /VHub Data Pulse|pulse|poll/i }).first();
    
    if (await pulsePost.isVisible()) {
      // Verify pulse-specific styling
      await expect(pulsePost.locator('[data-testid*="tag"]')).toContainText(/VHub Data Pulse|Pulse/i);
      
      // Verify poll component is present
      await expect(pulsePost.locator('[data-testid*="poll-option"]')).toBeVisible();
      
      // Verify pulse icon or indicator
      await expect(pulsePost.locator('[data-testid*="pulse-indicator"]')).toBeVisible();
    }
  });

  test('should handle poll accessibility', async ({ page }) => {
    const pollOption = await page.locator('[data-testid*="poll-option"]').first();
    
    if (await pollOption.isVisible()) {
      // Verify poll options have proper ARIA attributes
      await expect(pollOption).toHaveAttribute('role', /button|option/);
      
      // Verify keyboard navigation works
      await pollOption.focus();
      await expect(pollOption).toBeFocused();
      
      // Test keyboard activation
      await pollOption.press('Enter');
      await page.waitForTimeout(300);
      
      // Verify vote was registered
      await expect(pollOption).toHaveClass(/selected|voted|active/);
    }
  });

  test('should show real-time poll updates', async ({ page }) => {
    // This test would be more meaningful with multiple users
    // For now, test basic update functionality
    const pollOption = await page.locator('[data-testid*="poll-option"]').first();
    
    if (await pollOption.isVisible()) {
      // Get initial vote count/percentage
      const initialResults = await page.locator('text=/%/').textContent();
      
      // Vote on poll
      await pollOption.click();
      await page.waitForTimeout(500);
      
      // Verify results updated
      const updatedResults = await page.locator('text=/%/').textContent();
      expect(updatedResults).not.toBe(initialResults);
    }
  });
});