---
applyTo: "_data/**"
description: "Authoring standards for _data/ relational knowledge graph: entity collections, ontology, manifests, and Liquid integration."
---

# _data/ Relational Knowledge Graph Instructions

All website content lives in `_data/` as a **Relational Knowledge Graph**. Content is decomposed into atomic Entity Collections with persistent UIDs, a global Ontological Source of Truth, and Page Manifests that subscribe to entity UIDs.

## Architecture

| Layer | Location | Purpose |
|-------|----------|---------|
| Ontology | `_data/ontology.yml` | Global brand identity, legal, contacts |
| Entities | `_data/entities/*.yml` | Atomic, UID-tagged content atoms |
| Manifests | `_data/manifests/*.yml` | Page section ordering + entity subscriptions |

## Entity Collections

Every entity file starts with `_schema` and contains keyed entities:

```yaml
_schema:
  version: "3.0"
  type: entity_collection
  entity_type: concept
  last_reviewed: 2026-04-11

network-effects:
  uid: network-effects
  _type: concept
  headline: Network Effects
  body: "Every decision improves not just one boardroom but the network..."
  tags: [network, learning]
```

## Page Manifests

Manifests define section order, component selection, and entity subscriptions:

```yaml
_schema:
  version: "3.0"
  type: page_manifest
  page_path: /enterprise/

sections:
  - id: network
    component: pills-section
    intent: persuade
    entity_collection: propositions
    entity_ref: network-enterprise
```

## Content Rules

- **Zero redundancy** — each piece of copy exists in exactly one entity
- **Persistent UIDs** — every entity has a unique `uid` for cross-referencing
- **Plain text only** — no HTML tags, no Liquid expressions in values
- **No bare strings in arrays** — every list item is a typed object
- **Metadata fields** use underscore prefix: `_schema`, `_type`

## Accessing Data in Templates

```liquid
{% comment %} Via manifest renderer (preferred) {% endcomment %}
{% assign manifest = site.data.manifests.about %}
{% include manifest-renderer.html manifest=manifest %}

{% comment %} Direct entity access {% endcomment %}
{% assign concept = site.data.entities.concepts["network-effects"] %}
{{ concept.headline }}

{% comment %} Ontology global access {% endcomment %}
{{ site.data.ontology.brand.name }}
{{ site.data.ontology.legal.copyright }}
```

## Shared Data

Do not duplicate content from shared files (`agents.yml`, `nav.json`, `products.yml`). Reference shared keys via `site.data.agents`, `site.data.nav`, etc.

## Reference Implementation

→ `_data/manifests/enterprise.yml` + `enterprise/index.html` — manifest-driven page example
→ `_data/entities/concepts.yml` — entity collection example

## Full Specification

→ `.github/specs/data.md` — complete knowledge graph specification with schema, type taxonomy, and validation rules
