import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Define the breakpoints you want to test
const viewports = [
  { name: 'mobile', width: 375, height: 812 },   // iPhone X-ish
  { name: 'tablet', width: 768, height: 1024 },  // iPad portrait
  { name: 'desktop', width: 1440, height: 900 }  // typical laptop
];

for (const vp of viewports) {
  test.describe(`${vp.name} viewport`, () => {
    test(`should have no accessibility, overflow, or overlap issues`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('https://your-site.com');

      // 1. Accessibility scan with axe-core
      const axeResults = await new AxeBuilder({ page }).analyze();
      expect(axeResults.violations, `Accessibility violations at ${vp.name}`).toEqual([]);

      // 2. Overflow detection
      const overflowIssues = await page.evaluate(() => {
        const issues: string[] = [];
        const all = Array.from(document.querySelectorAll<HTMLElement>('body *'));

        for (const el of all) {
          const style = window.getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none') continue;

          if (el.scrollWidth > el.clientWidth) {
            issues.push(`Horizontal overflow in <${el.tagName}>.${el.className}`);
          }
          if (el.scrollHeight > el.clientHeight) {
            issues.push(`Vertical overflow in <${el.tagName}>.${el.className}`);
          }
        }
        return issues;
      });
      expect(overflowIssues, `Overflow issues at ${vp.name}:\n${overflowIssues.join('\n')}`).toEqual([]);

      // 3. Overlap detection
      const overlapIssues = await page.evaluate(() => {
        const issues: string[] = [];
        const elements = Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .filter(el => {
            const style = window.getComputedStyle(el);
            return style.visibility !== 'hidden' && style.display !== 'none';
          });

        for (let i = 0; i < elements.length; i++) {
          const rect1 = elements[i].getBoundingClientRect();
          for (let j = i + 1; j < elements.length; j++) {
            const rect2 = elements[j].getBoundingClientRect();

            const overlap =
              rect1.left < rect2.right &&
              rect1.right > rect2.left &&
              rect1.top < rect2.bottom &&
              rect1.bottom > rect2.top;

            if (overlap) {
              issues.push(
                `Overlap between <${elements[i].tagName}>.${elements[i].className} and <${elements[j].tagName}>.${elements[j].className}`
              );
            }
          }
        }
        return issues;
      });
      expect(overlapIssues, `Overlap issues at ${vp.name}:\n${overlapIssues.join('\n')}`).toEqual([]);
    });
  });
}