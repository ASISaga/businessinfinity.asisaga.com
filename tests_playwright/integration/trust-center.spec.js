/**
 * Trust Center Page Tests
 * 
 * Tests for the /trust/ page including:
 * - Page structure and navigation
 * - Content sections
 * - Interactive elements (data export, deletion requests)
 * - Dynamic compliance data loading
 * - Accessibility
 */

import { test, expect } from '@playwright/test';

test.describe('Trust Center Page', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/trust/');
  });

  test('should load trust center page', async ({ page }) => {
    await expect(page).toHaveTitle(/Trust Center/i);
  });

  test('should have correct meta description', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('security');
    expect(description).toContain('compliance');
  });

  test('should display trust center heading', async ({ page }) => {
    const heading = page.locator('h2:has-text("Trust Center")');
    await expect(heading).toBeVisible();
  });

  test('should show guiding principle quote', async ({ page }) => {
    const quote = page.locator('text=Trust is earned through evidence, not claimed through words');
    await expect(quote).toBeVisible();
  });

  test('should have table of contents navigation', async ({ page }) => {
    const toc = page.locator('#toc');
    await expect(toc).toBeVisible();
    
    // Check for key TOC items
    await expect(toc.locator('a[href="#overview"]')).toBeVisible();
    await expect(toc.locator('a[href="#compliance"]')).toBeVisible();
    await expect(toc.locator('a[href="#security"]')).toBeVisible();
    await expect(toc.locator('a[href="#privacy"]')).toBeVisible();
    await expect(toc.locator('a[href="#audit"]')).toBeVisible();
  });

  test('should display trust principles section', async ({ page }) => {
    const principlesSection = page.locator('#principles');
    await expect(principlesSection).toBeVisible();
    
    // Check for all 4 principle categories
    await expect(principlesSection.locator('text=Product-Level Trust')).toBeVisible();
    await expect(principlesSection.locator('text=Process-Level Trust')).toBeVisible();
    await expect(principlesSection.locator('text=Ecosystem-Level Trust')).toBeVisible();
    await expect(principlesSection.locator('text=Cultural Trust')).toBeVisible();
  });

  test('should display compliance certifications', async ({ page }) => {
    const complianceSection = page.locator('#compliance');
    await expect(complianceSection).toBeVisible();
    
    // Check for key certifications
    await expect(complianceSection.locator('text=ISO/IEC 27001')).toBeVisible();
    await expect(complianceSection.locator('text=SOC 1, 2, 3')).toBeVisible();
    await expect(complianceSection.locator('text=GDPR')).toBeVisible();
    await expect(complianceSection.locator('text=HIPAA')).toBeVisible();
  });

  test('should display security practices section', async ({ page }) => {
    const securitySection = page.locator('#security');
    await expect(securitySection).toBeVisible();
    
    // Check for security categories
    await expect(securitySection.locator('text=Infrastructure Security')).toBeVisible();
    await expect(securitySection.locator('text=Identity & Access')).toBeVisible();
    await expect(securitySection.locator('text=Monitoring & Response')).toBeVisible();
    await expect(securitySection.locator('text=Secure Development')).toBeVisible();
  });

  test('should display privacy rights section with action buttons', async ({ page }) => {
    const privacySection = page.locator('#privacy');
    await expect(privacySection).toBeVisible();
    
    // Check for privacy rights
    await expect(privacySection.locator('text=Right to Access')).toBeVisible();
    await expect(privacySection.locator('text=Right to Erasure')).toBeVisible();
    await expect(privacySection.locator('text=Right to Portability')).toBeVisible();
    
    // Check for action buttons
    await expect(privacySection.locator('button:has-text("Export My Data")')).toBeVisible();
    await expect(privacySection.locator('button:has-text("Request Deletion")')).toBeVisible();
  });

  test('should display transparency metrics', async ({ page }) => {
    const transparencySection = page.locator('#transparency');
    await expect(transparencySection).toBeVisible();
    
    // Check for metric cards
    await expect(transparencySection.locator('#uptimeMetric')).toBeVisible();
    await expect(transparencySection.locator('#responseMetric')).toBeVisible();
    await expect(transparencySection.locator('#securityMetric')).toBeVisible();
    await expect(transparencySection.locator('#certMetric')).toBeVisible();
  });

  test('should display audit trail section', async ({ page }) => {
    const auditSection = page.locator('#audit');
    await expect(auditSection).toBeVisible();
    
    await expect(auditSection.locator('text=Data Access Events')).toBeVisible();
    await expect(auditSection.locator('text=Data Modifications')).toBeVisible();
    await expect(auditSection.locator('text=Data Lifecycle')).toBeVisible();
    await expect(auditSection.locator('text=Security Events')).toBeVisible();
  });

  test('should display contact information', async ({ page }) => {
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();
    
    // Check for contact emails
    await expect(contactSection.locator('a[href*="security@businessinfinity.asisaga.com"]')).toBeVisible();
    await expect(contactSection.locator('a[href*="privacy@businessinfinity.asisaga.com"]')).toBeVisible();
  });

  test('should have skip link for accessibility', async ({ page }) => {
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute('href', '#main');
  });

  test('should have footer with navigation', async ({ page }) => {
    const footer = page.locator('footer.site-footer');
    await expect(footer).toBeVisible();
    
    // Check footer links
    await expect(footer.locator('a[href="#overview"]')).toBeVisible();
    await expect(footer.locator('a[href="#compliance"]')).toBeVisible();
    await expect(footer.locator('a[href="/privacy-policy"]')).toBeVisible();
  });

  test('should link to Trust.md on GitHub', async ({ page }) => {
    const githubLink = page.locator('a[href*="github.com"][href*="Trust.md"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('TOC links should navigate to sections', async ({ page }) => {
    // Click on compliance link
    await page.locator('#toc a[href="#compliance"]').click();
    
    // Wait a bit for scroll
    await page.waitForTimeout(500);
    
    // Check that compliance section is in viewport
    const complianceSection = page.locator('#compliance');
    await expect(complianceSection).toBeInViewport();
  });

  test('should load JavaScript file', async ({ page }) => {
    // Check if trust-scripts.js is loaded
    const scriptTags = await page.locator('script[src*="trust-scripts.js"]').count();
    expect(scriptTags).toBeGreaterThan(0);
  });

  test('should load CSS file', async ({ page }) => {
    // Check if trust-styles.css is loaded
    const styleTags = await page.locator('link[href*="trust-styles.css"]').count();
    expect(styleTags).toBeGreaterThan(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text).toContain('Business Infinity');
  });

  test('header should have home and features links', async ({ page }) => {
    const header = page.locator('header.site-header');
    await expect(header.locator('a[href="/"]')).toBeVisible();
    await expect(header.locator('a[href="/features"]')).toBeVisible();
  });

  test.describe('Interactive Elements', () => {
    
    test('export data button should be clickable', async ({ page }) => {
      const exportButton = page.locator('button:has-text("Export My Data")').first();
      await expect(exportButton).toBeEnabled();
    });

    test('request deletion button should be clickable', async ({ page }) => {
      const deleteButton = page.locator('button:has-text("Request Deletion")').first();
      await expect(deleteButton).toBeEnabled();
    });

    test('view audit trail link should work', async ({ page }) => {
      const auditLink = page.locator('a[href="/dashboard#audit"]');
      await expect(auditLink).toBeVisible();
      await expect(auditLink).toHaveAttribute('href', '/dashboard#audit');
    });
  });

  test.describe('Responsive Design', () => {
    
    test('should be mobile friendly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const mainContent = page.locator('main#main');
      await expect(mainContent).toBeVisible();
      
      // TOC might be hidden on mobile
      const toc = page.locator('#toc');
      // Just check it exists, may not be visible on mobile
      await expect(toc).toBeAttached();
    });

    test('should be tablet friendly', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      const mainContent = page.locator('main#main');
      await expect(mainContent).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    
    test('should have proper ARIA labels', async ({ page }) => {
      const toc = page.locator('#toc');
      await expect(toc).toHaveAttribute('aria-label', 'Table of contents');
      
      const footer = page.locator('footer nav');
      await expect(footer).toHaveAttribute('aria-label', 'Footer');
    });

    test('main content should have tabindex', async ({ page }) => {
      const main = page.locator('main#main');
      await expect(main).toHaveAttribute('tabindex', '-1');
    });

    test('should have alt text or aria labels for icons', async ({ page }) => {
      const logo = page.locator('.logo');
      if (await logo.count() > 0) {
        await expect(logo).toHaveAttribute('aria-hidden', 'true');
      }
    });
  });

  test.describe('Performance', () => {
    
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/trust/');
      const loadTime = Date.now() - startTime;
      
      // Should load in less than 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });
  });

});
