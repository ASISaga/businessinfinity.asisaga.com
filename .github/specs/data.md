# _data Directory Specification

**Version**: 3.0.0  
**Status**: Active  
**Last Updated**: 2026-04-11  
**Applies To**: `_data/**` in businessinfinity.asisaga.com

---

## Overview

The `_data/` directory is a **Relational Knowledge Graph** for all website content on businessinfinity.asisaga.com. Content is decomposed into atomic **Entity Collections** with persistent UIDs, a global **Ontological Source of Truth**, and **Page Manifests** that subscribe to entity UIDs rather than hosting local text strings.

This architecture enforces:

| Layer | What it contains | Where it lives |
|-------|-----------------|---------------|
| **Ontology** | Global brand identity, core definitions, legal, contacts | `_data/ontology.yml` |
| **Entity Collections** | Typed, UID-tagged atoms: concepts, propositions, guarantees, etc. | `_data/entities/*.yml` |
| **Page Manifests** | Section ordering, entity subscriptions, intent mappings | `_data/manifests/*.yml` |
| **Section Components** | Reusable HTML templates that resolve entity UIDs | `_includes/sections/*.html` |
| **Manifest Renderer** | Iterates manifests and dispatches to section components | `_includes/manifest-renderer.html` |

### Key principles

1. **Zero Redundancy (DRY)** — any single piece of copy exists in exactly one location within `_data/`.
2. **Unique Identification** — every content fragment has a persistent UID for relational cross-referencing.
3. **Semantic Integrity** — strict separation between Message (Entity Collections) and Structure (HTML/Liquid).
4. **Manifest-Driven Orchestration** — pages subscribe to entity UIDs via manifests; intent dictates component selection.
5. **Multi-Endpoint Scalability** — the same entities can be rendered across different subdomains or formats without modification.

---

## Schema Architecture

### File-level schema (`_schema`)

Every data file begins with a `_schema` block:

```yaml
_schema:
  version: "3.0"                    # Schema version
  type: entity_collection           # entity_collection | page_manifest | ontological_source
  entity_type: concept              # Type of entities in this collection
  description: "..."                # Human-readable description
  last_reviewed: 2026-04-11         # Last editorial review date
```

### Entity structure

Each entity is keyed by its UID and carries typed metadata:

```yaml
network-effects:
  uid: network-effects
  _type: concept
  headline: Network Effects
  body: >
    Every decision improves not just one boardroom but the network —
    insights propagate, models upgrade, and the collective capability compounds.
  tags: [network, learning, compounding]
```

### Manifest structure

Each manifest defines page sections that subscribe to entity UIDs:

```yaml
sections:
  - id: network
    component: pills-section        # Which section component to render
    intent: persuade                # Semantic intent
    entity_collection: propositions # Which entity collection
    entity_ref: network-enterprise  # UID within that collection
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
| `engage` | Interactive elements, persona selectors |
| `convert` | CTAs, pilot offers, closing invitations |
| `support` | Contact channels, documentation |

### Common `_type` values

| `_type` | Used for |
|---------|---------|
| `concept` | Core philosophical/business concepts |
| `pain_signal` | Problems the audience experiences |
| `pain_point` | Specific audience challenges |
| `pain_set` | Collection of pain signals for an audience |
| `state_comparison` | Today vs tomorrow comparisons |
| `capability_claim` | What the product can do |
| `product_capability` | Detailed product capability |
| `process_loop` | Steps in a process/loop |
| `core_principle` | Foundational beliefs or tenets |
| `principle_set` | Collection of principles for an audience |
| `measurable_outcome` | KPI improvements or metrics |
| `safety_guarantee` | Risk mitigation measures |
| `pilot_offer` | Pilot/trial offerings with scenarios |
| `pilot_scenario` | Specific pilot scenario |
| `call_to_action` | CTA with headline, body, button |
| `solution_offering` | Product solutions with features |
| `network_proposition` | Network effect messaging |
| `case_study` | Customer success story with results |
| `testimonial` | Customer quote with attribution |
| `trust_statement` | Trust center overview content |
| `trust_dimension` | Trust principle category |
| `canvas_block` | Business Model Canvas section |

---

## Directory Structure

```
_data/
├── ontology.yml                      # Global source of truth (brand, legal, contacts)
│
├── entities/                         # Atomic entity collections
│   ├── concepts.yml                  # Core philosophical concepts (10 entities)
│   ├── propositions.yml              # Value propositions & solutions (9 entities)
│   ├── guarantees.yml                # Safety guarantees (8 entities)
│   ├── principles.yml                # Core principles/tenets (3 sets)
│   ├── capabilities.yml              # Platform capabilities (7 entities)
│   ├── evidence.yml                  # Testimonials, case studies, KPIs (6 entities)
│   ├── actions.yml                   # CTAs, pilot offers (6 entities)
│   ├── personas.yml                  # Audience personas & objectives (3 sets)
│   ├── pain_points.yml               # Customer challenges (6 sets)
│   ├── integrations.yml              # Integration layers (3 entities)
│   └── compliance.yml                # Security, privacy, audit (6 sets)
│
├── manifests/                        # Page manifests (subscribe to entity UIDs)
│   ├── about.yml                     # /about/ manifest
│   ├── bmc.yml                       # /bmc/ manifest
│   ├── enterprise.yml                # /enterprise/ manifest
│   ├── entrepreneur.yml              # /entrepreneur/ manifest
│   ├── features.yml                  # /features/ manifest
│   ├── startup.yml                   # /startup/ manifest
│   ├── startup2.yml                  # /startup2/ manifest
│   └── trust.yml                     # /trust/ manifest
│
├── agents.yml                        # C-suite agent catalogue (shared)
├── business_infinity.yml             # Product overview (shared)
├── nav.json                          # Site-wide navigation links
├── products.yml                      # Product catalogue (shared)
├── workflows.yml                     # Workflow definitions (shared)
│
└── breakthroughs/                    # /breakthroughs/ (one file per breakthrough)
    ├── index.yml                     # Breakthroughs index page copy
    └── *.json                        # Individual breakthrough data
```

---

## Manifest-Driven Page Assembly

### How it works

1. **Page file** assigns manifest: `{% assign manifest = site.data.manifests.about %}`
2. **Manifest renderer** iterates sections: `{% include manifest-renderer.html manifest=manifest %}`
3. **For each section**, the renderer resolves entity data and dispatches to the correct component
4. **Section components** render HTML using resolved entity data and local overrides

### Manifest section fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Section HTML id attribute |
| `component` | Yes | Which `_includes/sections/*.html` template to use |
| `intent` | Yes | Semantic intent (attract, persuade, convert, etc.) |
| `entity_collection` | No | Name of entity collection to resolve from |
| `entity_ref` | No | UID of entity within collection |
| `entity_refs` | No | List of UIDs or nested UID map |
| `css_prefix` | No | Override CSS class prefix (default: section id) |
| `source` | No | Local data overrides (headings, extra fields) |

### Entity resolution in components

```liquid
{% assign coll = site.data.entities[sec.entity_collection] %}
{% assign entity = coll[sec.entity_ref] %}
<h2>{{ entity.headline }}</h2>
<p>{{ entity.body }}</p>
```

---

## Section Components

Available in `_includes/sections/`:

| Component | Intent | Entity Type |
|-----------|--------|-------------|
| `hero.html` | orient | ontology brand |
| `hero-enterprise.html` | attract | local source |
| `hero-simple.html` | attract | local source |
| `features-header.html` | orient | ontology brand |
| `text-block.html` | inform/persuade | concept |
| `list-section.html` | inform | component set |
| `card-grid.html` | inform/reassure | any with title/body |
| `comparison.html` | persuade | state_comparison |
| `beats.html` | empathise | pain_set |
| `principles.html` | persuade | principle_set |
| `pills-section.html` | persuade | network_proposition |
| `kpi-grid.html` | persuade | measurable_outcome |
| `risk.html` | reassure | safety_guarantee |
| `risk-startup.html` | reassure | safety_guarantee |
| `threshold.html` | convert | pilot_offer |
| `cta.html` | convert | call_to_action |
| `cta-simple.html` | convert | call_to_action |
| `quote.html` | convert | local source |
| `closing-quote.html` | convert | local source |
| `toc.html` | orient | local source |
| `persona-selector.html` | engage | persona/objective sets |
| `boardroom.html` | inform | capability + loop |
| `agent-roster.html` | inform | agents.yml |
| `solutions.html` | persuade | solution_offering |
| `challenge-grid.html` | empathise | challenge_set |
| `case-study.html` | persuade | case_study |
| `testimonial.html` | persuade | testimonial |
| `roadmap.html` | inform | local source |
| `faq.html` | inform | local source |
| `footer-legal.html` | inform | ontology legal |
| `canvas.html` | inform | canvas_block |
| `trust-overview.html` | reassure | trust_statement |
| `trust-principles.html` | reassure | trust_dimension |
| `trust-list.html` | reassure | compliance sets |
| `contact.html` | support | ontology contacts |

---

## Validation

Before committing `_data/` changes:

- [ ] YAML file is valid (no indentation errors)
- [ ] File starts with `_schema:` block
- [ ] Entity UIDs are unique within their collection
- [ ] Manifest entity_ref UIDs exist in the referenced entity_collection
- [ ] No HTML markup in data values
- [ ] No Liquid expressions in data values
- [ ] Metadata fields use `_` prefix convention

```bash
# Validate YAML syntax
python3 -c "import yaml, sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]" _data/**/*.yml

# Verify no HTML tags in data values
grep -r '<[a-z]' _data/ --include="*.yml" && echo "WARNING: HTML found in data files"

# Check all files have _schema
for f in _data/entities/*.yml _data/manifests/*.yml _data/ontology.yml; do grep -q '_schema:' "$f" || echo "MISSING _schema: $f"; done
```

---

## Migration from v2.0

The v3.0 schema replaces page-coupled data files with an entity-centric knowledge graph:

| v2.0 (page-coupled) | v3.0 (entity-centric) |
|---------------------|----------------------|
| One data file per page | Entity collections + page manifests |
| Content duplicated across pages | Single source of truth per entity |
| Pages embed data references | Pages subscribe to entity UIDs |
| Page-specific includes | Reusable section components |
| No cross-referencing | Persistent UIDs enable relational queries |

---

## References

→ **Website editorial spec**: `.github/specs/website.md`  
→ **HTML & Liquid standards**: `.github/instructions/html.instructions.md`  
→ **Repository spec**: `.github/specs/repository.md`  
→ **Manifest renderer**: `_includes/manifest-renderer.html`  
→ **Section components**: `_includes/sections/`  
→ **Ontology**: `_data/ontology.yml`
