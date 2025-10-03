# Website Specifications

## 1. Overview
This repository (`business-infinity-site`) is the **frontend for the Business Infinity app**, deployed on **GitHub Pages** and integrated with backend services hosted on **Azure Functions**.  
The site is both a **documentation hub** and the **Boardroom interface** — a conversational space where onboarding, governance, and daily collaboration between agents occur.

---

## 2. Technology Stack
- **Static Site Generator**: Jekyll (Liquid templates, Markdown content)  
- **Markup**: HTML5 (semantic, accessible structure)  
- **Styling**: SCSS compiled to CSS3  
- **Framework**: Bootstrap (latest stable release)  
- **JavaScript**: ES6+ (modular, standards‑compliant)  
- **Components**: Web Components (chat bubbles, role badges, decision cards)  
- **Deployment**: GitHub Pages (frontend) + Azure Functions (backend services)  

---

## 3. Structure & Layout
- `_layouts/` for base templates  
- `_includes/` for reusable snippets  
- `_posts/` for updates or covenant logs  
- `assets/` for SCSS, JS, images  
- `tests_playwright/` for browser‑level tests  

Navigation:
- Responsive Bootstrap navbar with dropdown support  
- Footer with site map and external links  
- Sidebar (if enabled) generated dynamically via Liquid  

---

## 4. Boardroom Chat Interface
- **Onboarding Flow**  
  - New users welcomed via scripted covenant prompts.  
  - Liquid‑templated messages guide setup (profile, role, consent).  
  - Schema validation ensures covenant acceptance and role assignment.  
  - Onboarding thread merges seamlessly into the ongoing Boardroom discussion.  

- **Day‑to‑Day Discussion**  
  - Agents (Founder, Investor, C‑suite) exchange proposals, clarifications, affirmations, and resolutions.  
  - Messages tagged with roles and speech‑act types (proposal, question, objection, resolution).  
  - Decisions logged as covenant‑compliant records.  
  - Threading supports sagas and arbitration flows.  

---

## 5. Styling & Theming
- SCSS variables define **color palette, typography, spacing, breakpoints**.  
- Bootstrap grid system ensures responsive layouts.  
- Custom SCSS overrides modularized in `assets/scss/`.  
- CSS compiled and minified for production.  

---

## 6. JavaScript Behavior
- ES6 modules handle interactivity (chat input, threading, notifications).  
- Bootstrap JS components (modals, dropdowns, accordions) initialized correctly.  
- Web Components encapsulate reusable UI blocks with Shadow DOM isolation.  
- No console errors or warnings permitted in production builds.  

---

## 7. Accessibility
- Semantic HTML5 structure (`<header>`, `<main>`, `<footer>`, `<nav>`).  
- ARIA roles applied to chat log, input box, and interactive Bootstrap components.  
- All images include descriptive `alt` attributes.  
- Text contrast meets WCAG AA standards.  
- Full keyboard navigation supported.  

---

## 8. Performance
- Page load time under **2 seconds** on standard broadband.  
- CSS and JS minified and served with caching headers.  
- Images optimized (compressed, responsive sizes).  
- No blocking scripts in `<head>`; defer or async where possible.  

---

## 9. Roles & Interaction Dynamics
- **Founder**: Guardian of vision, proposes schema upgrades, anchors onboarding.  
- **Investor**: Provides oversight, demands accountability, approves resource‑linked proposals.  
- **C‑Suite Members**: Operational stewards (CEO, CTO, COO, etc.), report on execution, negotiate trade‑offs.  

Interaction Patterns:  
- Founder ↔ Investor: Vision vs. accountability.  
- Founder ↔ C‑Suite: Vision vs. execution.  
- Investor ↔ C‑Suite: Oversight vs. delivery.  
- All Together: Consensus rituals logged as covenant‑compliant resolutions.  

---

## 10. Quality Covenant
Every contribution must uphold:  
- **Legibility**: Code and content must be clear and maintainable.  
- **Accessibility**: No feature shipped without accessibility validation.  
- **Resilience**: Layouts and components must degrade gracefully.  
- **Consistency**: SCSS variables, Bootstrap conventions, and Liquid includes must be used instead of ad‑hoc styling.  
- **Covenant Compliance**: All interactions (onboarding, discussions, resolutions) must be schema‑validated and logged.