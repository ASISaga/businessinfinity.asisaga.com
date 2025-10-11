import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Define the breakpoints you want to test
const viewports = [
  { name: 'mobile', width: 375, height: 812 },   // iPhone X-ish
  { name: 'tablet', width: 768, height: 1024 },  // iPad portrait
  { name: 'desktop', width: 1440, height: 900 }  // typical laptop
];

// All internal URLs from sitemap (relative to root)
const urls = [
  '/',
  '/features',
  '/trust',
  '/about',
  '/boardroom',
  '/dashboard',
  '/mentor',
  '/onboarding',
  '/chat',
  '/profile',
  '/enterprise',
  '/entrepreneur',
  '/startup',
  '/network',
  '/framework',
  '/roadmap',
  '/pitch',
  '/bmc',
  '/privacy-policy'
];

for (const vp of viewports) {
  for (const url of urls) {
    test.describe(`${vp.name} viewport - ${url}`, () => {
      test(`should have no accessibility, overflow, or overlap issues`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`https://businessinfinity.asisaga.com${url}`);

        // 1. Accessibility scan with axe-core (comprehensive)
        const axeResults = await new AxeBuilder({ page })
          .include('body')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
          .analyze();
        expect(axeResults.violations, `Accessibility violations at ${vp.name} ${url}`).toEqual([]);

        // 2. Layout system verification
        const layoutIssues = await page.evaluate(() => {
          const issues: string[] = [];
          
          // Check for proper containment
          const containers = document.querySelectorAll('.layout-container, .section-container, .grid-container, .article-container');
          containers.forEach(container => {
            const style = window.getComputedStyle(container);
            if (!style.contain || style.contain === 'none') {
              issues.push(`Missing containment on ${container.tagName}.${container.className}`);
            }
          });
          
          // Check for minimum touch targets
          const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
          interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
              issues.push(`Touch target too small: ${el.tagName}.${el.className} (${rect.width}x${rect.height})`);
            }
          });
          
          // Check for focus indicators
          const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
          focusableElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.focus) {
              htmlEl.focus();
              const style = window.getComputedStyle(el);
              if (style.outline === 'none 0px' && !style.boxShadow.includes('outline')) {
                issues.push(`Missing focus indicator on ${el.tagName}.${el.className}`);
              }
            }
          });
          
          return issues;
        });
        expect(layoutIssues, `Layout system issues at ${vp.name} ${url}:\n${layoutIssues.join('\n')}`).toEqual([]);

        // 3. Overflow detection (enhanced)
        const overflowIssues = await page.evaluate(() => {
          const issues = [];
          const all = Array.from(document.querySelectorAll('body *'));
          for (const el of all) {
            const style = window.getComputedStyle(el);
            if (style.visibility === 'hidden' || style.display === 'none') continue;
            
            // Skip elements that are intentionally scrollable
            if (style.overflow === 'auto' || style.overflow === 'scroll' || 
                style.overflowX === 'auto' || style.overflowX === 'scroll' ||
                style.overflowY === 'auto' || style.overflowY === 'scroll') continue;
            
            if (el.scrollWidth > el.clientWidth + 1) { // Allow 1px tolerance
              issues.push(`Horizontal overflow in <${el.tagName}>.${el.className} (${el.scrollWidth}px > ${el.clientWidth}px)`);
            }
            if (el.scrollHeight > el.clientHeight + 1) { // Allow 1px tolerance
              issues.push(`Vertical overflow in <${el.tagName}>.${el.className} (${el.scrollHeight}px > ${el.clientHeight}px)`);
            }
          }
          return issues;
        });
        expect(overflowIssues, `Overflow issues at ${vp.name} ${url}:\n${overflowIssues.join('\n')}`).toEqual([]);

        // 4. Element overlap detection (improved)
        const overlapIssues = await page.evaluate(() => {
          const issues = [];
          const elements = Array.from(document.querySelectorAll('main *, section *, article *, .card, .hero'))
            .filter(el => {
              const style = window.getComputedStyle(el);
              return style.visibility !== 'hidden' && 
                     style.display !== 'none' &&
                     style.position !== 'absolute' && // Skip positioned elements
                     style.position !== 'fixed';
            });
          
          for (let i = 0; i < elements.length - 1; i++) {
            const rect1 = elements[i].getBoundingClientRect();
            if (rect1.width === 0 || rect1.height === 0) continue;
            
            for (let j = i + 1; j < elements.length; j++) {
              const rect2 = elements[j].getBoundingClientRect();
              if (rect2.width === 0 || rect2.height === 0) continue;
              
              // Check if elements are parent/child (skip if so)
              if (elements[i].contains(elements[j]) || elements[j].contains(elements[i])) continue;
              
              const overlap = rect1.left < rect2.right - 2 &&
                            rect1.right > rect2.left + 2 &&
                            rect1.top < rect2.bottom - 2 &&
                            rect1.bottom > rect2.top + 2; // 2px tolerance
              
              if (overlap) {
                issues.push(
                  `Overlap between <${elements[i].tagName}>.${elements[i].className} and <${elements[j].tagName}>.${elements[j].className}`
                );
              }
            }
          }
          return issues.slice(0, 10); // Limit to first 10 to avoid overwhelming output
        });
        expect(overlapIssues, `Overlap issues at ${vp.name} ${url}:\n${overlapIssues.join('\n')}`).toEqual([]);

        // 5. Color contrast verification (additional check)
        const contrastIssues = await page.evaluate(() => {
          const issues: string[] = [];
          const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, li');
          
          textElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            // Skip elements with transparent or no background
            if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') return;
            
            // This is a simplified check - axe-core does the heavy lifting
            // We're just checking for obviously problematic combinations
            if (color === 'rgb(255, 255, 255)' && bgColor === 'rgb(255, 255, 255)') {
              issues.push(`White text on white background: ${el.tagName}.${el.className}`);
            }
            if (color === 'rgb(0, 0, 0)' && bgColor === 'rgb(0, 0, 0)') {
              issues.push(`Black text on black background: ${el.tagName}.${el.className}`);
            }
          });
          
          return issues;
        });
        expect(contrastIssues, `Color contrast issues at ${vp.name} ${url}:\n${contrastIssues.join('\n')}`).toEqual([]);
      });
    });
  }
}