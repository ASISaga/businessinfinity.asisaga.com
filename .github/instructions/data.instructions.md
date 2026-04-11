---
applyTo: "_data/**"
description: "Authoring standards for _data/ copy files: YAML structure, naming, and Liquid integration for the copy/markup separation pattern."
---

# _data/ Copy Files Instructions

All website copy lives in `_data/` as structured YAML. HTML pages and `_includes/` contain only markup and Liquid expressions — **never hard-coded text strings**.

## File Naming

- One YAML file per top-level page, named after the page's URL slug
- Match the page hierarchy: `/features/` → `_data/features.yml`
- Use kebab-case for multi-word slugs: `decision-framework.yml`

## YAML Structure

Organize by **section**, with section keys matching the corresponding `_includes/` filename:

```yaml
hero:
  headline: "..."
  subhead: "..."
  cta:
    label: "..."
    url: "..."

section_name:
  heading: "..."
  body: "..."
  items:
    - title: "..."
      description: "..."
```

## Content Rules

- **Plain text only** — no HTML tags, no Liquid expressions in values
- **Multi-sentence paragraphs** — use YAML block scalars (`|` literal or `>` folded)
- **Lists of items** — use `items:` arrays with consistent field names per array
- **CTAs** — always a nested object with `label:` and `url:` fields
- **Archetype names** — use canonical archetype names for public-facing agent copy (see `.github/specs/website.md`)

## Accessing Data in Templates

```liquid
{{ site.data.page_slug.section.field }}

{% for item in site.data.page_slug.section.items %}
  {{ item.title }} — {{ item.description }}
{% endfor %}
```

## Shared Data

Do not duplicate content from shared files (`agents.yml`, `nav.json`, `products.yml`). Reference shared keys via `site.data.agents`, `site.data.nav`, etc.

## Reference Implementation

→ `_data/business_infinity_entrepreneur.yml` + `entrepreneur/index.html` — gold-standard example of the copy/markup separation pattern

## Full Specification

→ `.github/specs/data.md` — complete data directory specification with schema, examples, and validation rules
