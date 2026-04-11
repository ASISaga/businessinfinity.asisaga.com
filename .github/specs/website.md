# Website Content & Editorial Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2026-04-11  
**Applies To**: businessinfinity.asisaga.com

---

## Overview

This specification defines the editorial standards, content architecture, and copy conventions for the Business Infinity website. It covers how content is authored, structured, and presented across all pages — from top-level narrative copy to semantic markup — and establishes the principles that guide every written and coded element of the site.

## Scope

- Editorial framework: copy, markup, and informational architecture
- Content hierarchy and semantic structure
- SEO and accessibility requirements for content
- Archetype naming conventions and legal compliance
- Copyright requirements and disclaimer placement
- Tone, voice, and writing standards

---

## Context of Editorial

### Copy

Semantically, copy acts as a directional framework. Headlines designate primary topics, subheaders provide structural organization, embedded links form informational pathways, and calls to action define concrete user actions. Each part builds an intuitive narrative of what the user can achieve.

Every piece of copy on businessinfinity.asisaga.com serves one of three functions:

| Function | Description | Examples |
|----------|-------------|---------|
| **Inform** | Communicates facts about the platform, capabilities, or agents | Product descriptions, feature explanations, methodology documentation |
| **Direct** | Guides users toward a specific action or pathway | CTAs, onboarding prompts, navigation labels |
| **Legitimize** | Establishes credibility and trust with visitors | Disclaimers, attributions, copyright notices, methodology references |

### Markup

While "copy" is the text you read, "markup" is the code behind the scenes that tells the browser how to display it. Think of it like an invisible guide that says, "This is a headline," or "This is a paragraph." It provides structure, giving the copy context without being the actual words.

Markup conventions for this site:

- **Semantic HTML5** — use `<h1>`–`<h6>` for hierarchy, `<p>` for prose, `<ul>`/`<ol>` for lists, `<blockquote>` for excerpts
- **Meaningful class names** — describe WHAT content is, not HOW it looks (e.g., `.agent-profile`, not `.blue-card`)
- **Liquid templates** — prefer `{% include %}` for reusable fragments; keep logic thin in templates
- **No inline styles** — all styling via SCSS partials using ontological mixins

---

## Content Architecture

### Informational Hierarchy

Every page follows a three-tier hierarchy:

1. **Primary message** — the single most important idea on the page (expressed in the `<h1>` and opening paragraph)
2. **Supporting context** — sections that elaborate the primary message (`<h2>` sections)
3. **Action pathways** — CTAs, links, and forms that convert intent into action

### Page Types and Copy Patterns

| Page Type | Primary Goal | Tone | Key Elements |
|-----------|-------------|------|--------------|
| Landing / Home | Capture attention, establish value | Bold, visionary | Hero headline, value proposition, primary CTA |
| Boardroom | Enable agent interaction | Professional, direct | Role labels, action prompts, governance framing |
| Breakthroughs Index | Showcase methodologies | Educational, authoritative | Archetype names, bibliographic references, disclaimers |
| Feature / Product pages | Explain capabilities | Clear, benefit-focused | Feature headlines, use cases, supporting CTAs |
| Documentation | Guide implementation | Technical, precise | Code examples, step-by-step instructions, validation |
| Legal / Policy | Establish compliance | Formal, unambiguous | Copyright notices, disclaimers, affiliation statements |

---

## Archetype Naming Convention

All public-facing copy must use **functional archetype names** instead of celebrity names to comply with 2026 Digital Replica laws and Personality Rights protections.

### Canonical Archetype Names

| Role | Archetype Name | Agent ID | Methodological Inspiration |
|------|---------------|----------|---------------------------|
| Chief Executive Officer | The Prime Visionary | `ceo` | Innovation-first leadership frameworks |
| Chief Marketing Officer | The Market Oracle | `cmo` | Permission Marketing and Remarkability frameworks |
| Chief Financial Officer | The Capital Steward | `cfo` | Value investing and capital allocation principles |
| Chief Operating Officer | The Systems Architect | `coo` | Systems thinking and quality management frameworks |
| Chief Human Resources Officer | The People Strategist | `chro` | Knowledge worker and management-by-objectives frameworks |
| Chief Technology Officer | The Digital Vanguard | `cto` | Computational theory and AI-first architecture principles |
| Chief Strategy Officer | The Grand Strategist | `cso` | Sun Tzu strategic doctrine and competitive positioning |

### Application Scope

**Archetype names MUST be used in:**
- All UI legend badges and role labels
- CTA button copy and action labels
- Page titles and meta descriptions
- JSON-LD structured data `offers` fields
- Navigation labels and sidebar identifiers

**Real names MAY appear in (with attribution):**
- Technical documentation and methodology pages (as bibliographic references)
- Source code comments (with clear attribution context)
- `/docs/methodology` page entries (once created)

---

## Copyright Requirements

### Footer Copyright Notice

Every page must include in the footer:

```html
&copy; [year] ASI Saga. All rights reserved.
```

Current year: **2026**. The footer copyright notice must be updated annually.

### Non-Affiliation Disclaimer

All pages featuring agent archetypes or methodology references must include the following disclaimer, delivered via `{% include copyright-disclaimer.html %}`:

> **Methodology Disclaimer:** The AI C-suite agents in Business Infinity are original functional archetypes created by ASI Saga. Their strategic logic is informed by publicly documented business frameworks and methodologies. Business Infinity is an independent research and product platform. It is not affiliated with, endorsed by, or sponsored by any individual, estate, publisher, or organization referenced in our methodology documentation.

### Copyright Ownership Statement

All original content — including workflows, governance frameworks, AI orchestration architecture, product copy, and visual design — is the exclusive intellectual property of **ASI Saga**, protected under applicable copyright law.

**Copyright Notice:** © 2026 ASI Saga. All rights reserved.

---

## Voice and Tone

### Brand Voice

Business Infinity speaks as a **visionary platform at the frontier of AI superintelligence** — confident, precise, and forward-looking. The voice is:

- **Authoritative** without being academic
- **Accessible** without being casual
- **Ambitious** without being hyperbolic
- **Precise** without being jargon-heavy

### Writing Standards

| Principle | Guideline |
|-----------|-----------|
| **Clarity** | Use plain language. Prefer short sentences. Avoid jargon unless the audience is technical. |
| **Active voice** | "The agent analyses markets" — not "Markets are analysed by the agent." |
| **Conciseness** | Remove filler words. Every sentence must earn its place. |
| **Consistency** | Use archetype names consistently. Do not mix celebrity names with archetype names in the same context. |
| **Accuracy** | All methodology references must cite documented public frameworks. Do not invent attributions. |

### Headlines

Headlines must:
- Communicate the page's primary value proposition immediately
- Use title case for `<h1>` and sentence case for `<h2>`–`<h6>`
- Avoid clickbait — headlines must accurately reflect the content below them

---

## SEO and Metadata

### Meta Description Requirements

Every page must have a unique `<meta name="description">` that:
- Summarizes the page content in 150–160 characters
- Uses archetype names (not celebrity names) when referencing agents
- Includes a relevant keyword naturally (do not keyword-stuff)

### Structured Data

Pages featuring agent archetypes should include JSON-LD structured data using archetype names and ASI Saga as the provider organization.

### Canonical URLs

All pages must specify a canonical URL via `<link rel="canonical">` to prevent duplicate content indexing. The canonical URL must follow the pattern `https://businessinfinity.asisaga.com/[path]` — for example, `https://businessinfinity.asisaga.com/breakthroughs/` for the Breakthroughs Index.

---

## Accessibility Requirements

Content must meet **WCAG 2.1 AA** standards:

- All images require descriptive `alt` attributes; decorative images use `alt=""`
- Heading hierarchy must not skip levels (e.g., `<h1>` → `<h2>` → `<h3>`)
- Link text must be descriptive (e.g., "View the strategic review workflow" — not "Click here")
- Tables must include `<caption>` and `<th scope="...">` for header cells
- Colour contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text

---

## Validation

```bash
# Validate SCSS compilation (includes content partials)
npm run sass:compile

# Run all validation tools
npm run validate
```

Content reviews should verify:
- [ ] All agent references use archetype names in public-facing copy
- [ ] Footer copyright year is current
- [ ] Non-affiliation disclaimer present on pages featuring archetypes
- [ ] Meta descriptions use archetype names and are within 160 characters
- [ ] All images have appropriate `alt` attributes

---

## References

→ **Copyright protection strategy**: `_copyright/actions.md`  
→ **Repository spec**: `.github/specs/repository.md`  
→ **HTML & Liquid standards**: `.github/instructions/html.instructions.md`  
→ **SCSS standards**: `.github/instructions/scss.instructions.md`  
→ **Architecture**: `docs/specifications/architecture.md`  
→ **Disclaimer component**: `_includes/copyright-disclaimer.html`
