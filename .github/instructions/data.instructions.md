---
applyTo: "_data/**"
description: "Authoring standards for _data/ knowledge base files: YAML structure, schema, typing, metadata, and Liquid integration."
---

# _data/ Knowledge Base Instructions

All website content lives in `_data/` as a **structured knowledge base**. Each file is a collection of semantically-typed knowledge objects — not just copy strings, but structured entities with metadata.

## File Structure

Every YAML file starts with a `_schema` block, followed by sections with `_meta` blocks:

```yaml
_schema:
  version: "2.0"
  type: knowledge_base
  domain: business_infinity
  page_path: /features/
  last_reviewed: 2026-04-11
  content_types: [hero_header, capability, call_to_action]

hero:
  _meta:
    content_type: hero_header
    intent: attract
    audience: [enterprise, startup]
    funnel_stage: awareness
    priority: critical
  headline: "..."
  subhead: "..."
```

## Content Rules

- **No bare strings in arrays** — every list item is an object with `_type` and either `text` (narrative) or `label` (UI elements)
- **Plain text only** — no HTML tags, no Liquid expressions in values
- **Every section** must have a `_meta` block with `content_type` and `intent`
- **Metadata fields** use underscore prefix: `_schema`, `_meta`, `_type`
- **CTAs** — always a nested object with `label:` and `url:` fields

## Accessing Data in Templates

```liquid
{{ site.data.page_slug.section.field }}

{% for item in site.data.page_slug.section.items %}
  <li data-domain="{{ item.domain }}">{{ item.text }}</li>
{% endfor %}
```

## Shared Data

Do not duplicate content from shared files (`agents.yml`, `nav.json`, `products.yml`). Reference shared keys via `site.data.agents`, `site.data.nav`, etc.

## Reference Implementation

→ `_data/business_infinity_entrepreneur.yml` + `entrepreneur/index.html` — gold-standard example

## Full Specification

→ `.github/specs/data.md` — complete knowledge base specification with schema, type taxonomy, and validation rules
