# _data Directory Specification

**Version**: 2.0.0  
**Status**: Active  
**Last Updated**: 2026-04-11  
**Applies To**: `_data/**` in businessinfinity.asisaga.com

---

## Overview

The `_data/` directory is a **structured knowledge base** for all website content on businessinfinity.asisaga.com. Each data file is a semantically-typed collection of **knowledge objects** — not just copy strings, but structured entities that carry semantic meaning and functional metadata.

This architecture enforces:

| Layer | What it contains | Where it lives |
|-------|-----------------|---------------|
| **Knowledge Objects** | Typed, metadata-rich content: headlines, claims, principles, capabilities, metrics | `_data/` YAML files |
| **Markup** | HTML structure, CSS classes, ARIA attributes, Liquid expressions | `.html` page files and `_includes/` |
| **Schema** | File-level type definitions, content taxonomies, validation rules | `_schema` blocks in each data file |

### Key principles

1. **Every content item is a typed object** — no bare strings in arrays. Every list item is an object with at least `text` and `_type` fields.
2. **Every section carries metadata** — `_meta` blocks declare content_type, intent, audience, funnel_stage, and priority.
3. **Every file declares its schema** — `_schema` blocks define the knowledge base version, domain, page path, and content type taxonomy.
4. **HTML templates consume metadata** — templates expose metadata as `data-*` attributes for JS/CSS hooks and progressive enhancement.

---

## Schema Architecture

### File-level schema (`_schema`)

Every data file begins with a `_schema` block:

```yaml
_schema:
  version: "2.0"                    # Schema version
  type: knowledge_base              # Always "knowledge_base"
  domain: business_infinity         # Product domain
  page_path: /features/             # URL this file serves
  last_reviewed: 2026-04-11         # Last editorial review date
  content_types:                    # Taxonomy of types used in this file
    - hero_header
    - capability
    - agent_roster
    - call_to_action
```

### Section-level metadata (`_meta`)

Each section has a `_meta` block describing its semantic role:

```yaml
hero:
  _meta:
    content_type: hero_header       # What kind of content this section is
    intent: attract                 # attract | empathise | inform | persuade | reassure | convert | support
    audience: [enterprise, startup] # Target audiences
    funnel_stage: awareness         # awareness | consideration | decision | retention
    priority: critical              # critical | high | medium | low
    relates_to: [cta]              # Cross-references to other sections (optional)
  headline: "..."
  subhead: "..."
```

### Item-level typing (`_type`)

Every item in a list is a typed object:

```yaml
items:
  - _type: capability_claim         # Semantic type of this item
    title: "Always-on awareness"
    description: "Signals streamed from ERP/MES/CRM/SaaS..."
    domain: monitoring              # Functional domain (optional, type-specific)
```

---

## Content Type Taxonomy

### Intent values

| Intent | When to use |
|--------|------------|
| `attract` | Hero sections, first impressions |
| `empathise` | Pain points, problem statements |
| `orient` | Navigation, headers, table of contents |
| `inform` | Feature descriptions, architecture, FAQ |
| `persuade` | Value propositions, comparisons, principles |
| `reassure` | Trust, risk mitigation, safety guarantees |
| `qualify` | Audience segmentation, use case targeting |
| `convert` | CTAs, pilot offers, closing invitations |
| `support` | Contact channels, documentation |

### Funnel stages

| Stage | Description |
|-------|------------|
| `awareness` | Visitor first discovers the product |
| `consideration` | Visitor evaluates features and fit |
| `decision` | Visitor is ready to commit |
| `retention` | Existing customer support |

### Common `_type` values

| `_type` | Used for |
|---------|---------|
| `pain_signal` | Problems the audience experiences |
| `capability_claim` | What the product can do |
| `process_step` | Steps in a process/loop |
| `core_principle` | Foundational beliefs or tenets |
| `measurable_outcome` | KPI improvements or metrics |
| `safety_guarantee` | Risk mitigation measures |
| `pilot_scenario` | Specific pilot/trial offerings |
| `agent_capability` | C-suite agent definitions |
| `trust_commitment` | Trust-related promises |
| `network_capability` | Network effect features |
| `platform_component` | System architecture components |
| `milestone` | Roadmap items with status |
| `solution_offering` | Product solutions with features |
| `feature_detail` | Individual feature within a solution |
| `canvas_block` | Business Model Canvas sections |
| `contact_method` | Contact channel definitions |

---

## Directory Structure

```
_data/
├── nav.json                          # Site-wide navigation links
├── agents.yml                        # C-suite agent catalogue (shared, schema v2.0)
├── products.yml                      # Product catalogue (shared, schema v2.0)
├── workflows.yml                     # Workflow definitions (shared)
│
├── about.yml                         # /about/ — knowledge base
├── bmc.yml                           # /bmc/ — Business Model Canvas knowledge base
├── business_infinity.yml             # /business-infinity/ — product knowledge base
├── business_infinity_entrepreneur.yml # /entrepreneur/ — knowledge base
├── enterprise.yml                    # /enterprise/ — knowledge base
├── features.yml                      # /features/ — knowledge base
├── startup.yml                       # /startup/ — knowledge base
├── startup2.yml                      # /startup2/ — knowledge base
├── trust.yml                         # /trust/ — knowledge base
│
└── breakthroughs/                    # /breakthroughs/ (one file per breakthrough)
    ├── index.yml                     # Breakthroughs index page copy
    └── *.json                        # Individual breakthrough data
```

---

## YAML Schema Rules

1. **Every file** starts with `_schema:` block.
2. **Every section** has a `_meta:` block with at least `content_type` and `intent`.
3. **No bare strings in arrays** — every list item is an object with `text` and `_type`.
4. **Section keys** match the corresponding `_includes/` filename.
5. **CTA blocks** are nested objects with `label:` and `url:` fields.
6. **No HTML markup** in data values. Plain text only.
7. **No Liquid expressions** in data values.
8. **Metadata fields** use underscore prefix: `_schema`, `_meta`, `_type`.

### Example: complete section

```yaml
levers:
  _meta:
    content_type: kpi_lever
    intent: persuade
    audience: [enterprise]
    funnel_stage: decision
    priority: high
  heading: "The hard levers"
  items:
    - _type: measurable_outcome
      eyebrow: "Revenue & margin"
      body: "Faster, better allocations in mix, pricing, and fill rate."
      metric_category: revenue
    - _type: measurable_outcome
      eyebrow: "Cost-to-serve"
      body: "Fewer fire-drills. Less expedite waste."
      metric_category: cost
```

---

## Accessing Data in Templates

### Direct field access (unchanged)

```liquid
{{ site.data.enterprise.hero.headline }}
{{ site.data.enterprise.hero.cta_primary.label }}
```

### Object items (text field)

```liquid
{% for beat in site.data.enterprise.intro.beats %}
  <p class="beat">{{ beat.text }}</p>
{% endfor %}
```

### Exposing metadata as data attributes

```liquid
{% for agent in site.data.features.agents.roster %}
<div class="card roster" data-agent-id="{{ agent.agent_id }}" data-domain="{{ agent.domain }}">
  <h3>{{ agent.name }}</h3>
</div>
{% endfor %}
```

### Section metadata in templates

```liquid
{% for item in site.data.about.roadmap.items %}
<li data-status="{{ item.status }}" data-phase="{{ item.phase }}">{{ item.text }}</li>
{% endfor %}
```

---

## Shared vs Page-Scoped Data

| File | Shared content | Schema |
|------|---------------|--------|
| `agents.yml` | C-suite agent catalogue with domain/decision_scope | v2.0 |
| `nav.json` | Primary navigation links | — |
| `products.yml` | Product catalogue with domain/audience | v2.0 |
| `workflows.yml` | Orchestration workflow definitions | — |

Page-scoped data files **must not** duplicate shared data.

---

## Validation

Before committing `_data/` changes:

- [ ] YAML file is valid (no indentation errors)
- [ ] File starts with `_schema:` block
- [ ] Every section has `_meta:` with `content_type` and `intent`
- [ ] No bare strings in arrays — every item is an object with `text` and `_type`
- [ ] Section keys match the corresponding `_includes/` filenames
- [ ] No HTML markup in data values
- [ ] No Liquid expressions in data values
- [ ] Metadata fields use `_` prefix convention

```bash
# Validate YAML syntax
python3 -c "import yaml, sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]" _data/**/*.yml

# Verify no HTML tags in data values
grep -r '<[a-z]' _data/ --include="*.yml" && echo "WARNING: HTML found in data files"

# Check all files have _schema
for f in _data/*.yml; do grep -q '_schema:' "$f" || echo "MISSING _schema: $f"; done
```

---

## Migration from v1.0

The v2.0 schema is a superset of v1.0. Key changes:

| v1.0 (copy) | v2.0 (knowledge base) |
|-------------|----------------------|
| Bare string arrays | Object arrays with `text` and `_type` |
| No section metadata | `_meta` blocks on every section |
| No file schema | `_schema` header on every file |
| Simple key-value items | Enriched objects with semantic fields |

HTML templates were updated to access `item.text` instead of `item` for converted arrays, and to expose metadata as `data-*` attributes.

---

## References

→ **Website editorial spec**: `.github/specs/website.md`  
→ **HTML & Liquid standards**: `.github/instructions/html.instructions.md`  
→ **Repository spec**: `.github/specs/repository.md`  
→ **Entrepreneur example** (reference implementation): `entrepreneur/index.html` + `_data/business_infinity_entrepreneur.yml`
