---
applyTo: "**/*.html,_includes/**,_layouts/**"
description: "HTML and Jekyll/Liquid guidance for businessinfinity.asisaga.com: templates, includes, accessibility, and site-level coordination."
---

# Subdomain & Deployment Context
- This is the repo for `businessinfinity.asisaga.com` subdomain, deployed on GitHub Pages.

# Theme Structure (HTML/Liquid)
- The canonical theme lives in `Website/theme.asisaga.com` locally, and `ASISaga/theme.asisaga.com` repository on GitHub.
- The theme supplies shared `_layouts`, `_includes`, and  `assets`, for all subdomains, which the GitHub Pages merges the theme into the subdomain at build time.
- The html code for head, navigation, and footer is implemented in theme for all subdomains.
- Custom partials / UI components: place under `_includes/` only if they are subdomain-specific and not available in the theme.
- Page templates and layouts: use `_layouts/` from theme.asisaga.com. 

# Jekyll & Liquid Guidance
- Use Liquid includes: `{% include 'name.html' %}` for small partials and `{% include_cached %}` if available in the theme for expensive fragments.
- Keep logic thin in templates; heavy logic belongs in data files or build-time processing.
— Prefer includes for repeatable fragments.
- Do not add build-time logic in templates; keep Liquid simple and testable.

# Accessible Markup & Patterns
- Mobile-first, semantic markup is required.
- Use meaningful, semantic class names that describe WHAT the content is, not HOW it looks (e.g., `.research-paper`, not `.blue-box`).
- Use ARIA only when necessary; prefer native semantic elements first (buttons, nav, main, header, footer, form controls).
- Ensure interactive patterns are keyboard-accessible and that landmarks are present for screen readers.

# Semantic Class Names for Ontological SCSS
- HTML class names should be semantic and content-focused.
- Think about WHAT the element represents, not its visual appearance.
- Examples:
  - ✅ CORRECT: `.dashboard-panel`, `.blog-post`, `.product-card`, `.research-paper`
  - ❌ WRONG: `.blue-box`, `.rounded-button`, `.big-text`, `.glassmorphism-card`
- These semantic classes will be mapped to ontological mixins in SCSS files.
- One semantic class per element is preferred.

# Color & Contrast
- Color tokens and layout variables must meet WCAG AA contrast for normal text. If a new token is added, document use-cases and include contrast test results.

## Pattern Scans & Forbidden Patterns
- **Inline assets (fail):** Do not commit inline `<style>` or `<script>` tags inside `_includes/`, `_layouts/`, or content files. Use the theme or component partials instead.
- **Inline event handlers (fail):** Avoid `on*=` attributes in templates (e.g., `onclick=`). Prefer unobtrusive event binding in `assets/js`.
- **Example regexes:** Use these patterns in CI scans for template-level violations:
	- Inline style/script: `/<\\s*style[\\s>]/i`, `/<\\s*script[\\s>]/i`
	- Inline event handlers: `/\\s(on\\w+)\\s*=/i`, `/style=\"/i`
