# _data Directory Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2026-04-11  
**Applies To**: `_data/**` in businessinfinity.asisaga.com

---

## Overview

The `_data/` directory is the **single source of truth for all website copy** on businessinfinity.asisaga.com. Copy (the text a visitor reads — headlines, body paragraphs, labels, CTAs, list items) is stored as structured YAML data files. HTML pages and `_includes/` templates contain only markup and Liquid expressions that reference this data. No hard-coded copy appears in `.html` files.

This separation enforces the Copy / Markup duality:

| Layer | What it contains | Where it lives |
|-------|-----------------|---------------|
| **Copy** | Headlines, paragraphs, labels, CTAs, list items | `_data/` YAML files |
| **Markup** | HTML structure, CSS classes, ARIA attributes, Liquid expressions | `.html` page files and `_includes/` |

---

## Scope

- Directory structure and file naming conventions
- YAML schema conventions for page-level data files
- How Liquid templates reference data
- Relationship between data files and the page hierarchy
- Validation and maintenance guidelines

---

## Directory Structure

The `_data/` directory mirrors the website's page hierarchy. Each top-level page or section has a corresponding YAML data file.

```
_data/
├── nav.json                          # Site-wide navigation links
├── agents.yml                        # C-suite agent definitions (shared)
├── products.yml                      # Product catalogue entries (shared)
├── workflows.yml                     # Workflow definitions (shared)
│
├── index.yml                         # / — Home / Boardroom page copy
├── about.yml                         # /about/
├── bmc.yml                           # /bmc/  — Business Model Canvas
├── enterprise.yml                    # /enterprise/
├── features.yml                      # /features/
├── startup.yml                       # /startup/
├── startup2.yml                      # /startup2/
├── trust.yml                         # /trust/
│
└── breakthroughs/                    # /breakthroughs/ (one file per breakthrough)
    ├── index.yml                     # Breakthroughs index page copy
    └── *.json                        # Individual breakthrough data (existing pattern)
```

New page sections are added as top-level YAML files using the page's URL slug as the filename.

---

## File Naming Convention

| Page URL | Data file |
|----------|-----------|
| `/` | `_data/index.yml` |
| `/about/` | `_data/about.yml` |
| `/bmc/` | `_data/bmc.yml` |
| `/enterprise/` | `_data/enterprise.yml` |
| `/features/` | `_data/features.yml` |
| `/startup/` | `_data/startup.yml` |
| `/startup2/` | `_data/startup2.yml` |
| `/trust/` | `_data/trust.yml` |
| `/breakthroughs/` | `_data/breakthroughs/index.yml` |

Use **kebab-case** for multi-word page slugs (e.g., `decision-framework.yml`).

---

## YAML Schema Conventions

### Top-level structure

Each data file is organized by **section**, matching the page's visual sections (and, for pages using `_includes/`, matching the include names):

```yaml
# _data/page-slug.yml

# Page-level metadata (optional)
page:
  title: "Page Title"
  description: "Meta description for SEO"

# Section keys match the include name or logical section
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

### Key schema rules

1. **Section keys** match the corresponding `_includes/` filename (e.g., `hero:` for `_includes/page/hero.html`).
2. **Copy fields** use semantic names: `heading`, `subhead`, `body`, `label`, `description`, `quote`.
3. **Lists of items** use an `items:` array where each item has consistent field names.
4. **CTA blocks** are nested objects with `label:` and `url:` fields.
5. **No HTML markup** in data values. Plain text only. Use YAML block scalars (`|`) for multi-sentence paragraphs.
6. **No Liquid expressions** in data values. Data is pure content, not template logic.

### Example: complete page data file

```yaml
# _data/enterprise.yml

hero:
  headline: "Stop managing the gaps"
  subhead: |
    The silent tax isn't in your ERP, MES, CRM, or planning tools.
    It's in the space between them.
  cta_primary:
    label: "Cross the threshold"
    url: "#threshold"
  cta_secondary:
    label: "See how it earns trust"
    url: "#risk"

intro:
  beats:
    - "Every delayed hand‑off."
    - "Every re‑decision."
    - "Every plan that dies before the first action."
  body: >
    Business Infinity closes that space forever. Not with another dashboard —
    with a boardroom that never adjourns.

flow:
  heading: "From lag to flow"
  today:
    eyebrow: "Today"
    body: "Every function optimises its lane..."
  tomorrow:
    eyebrow: "Tomorrow"
    items:
      - lead: "Domain agents:"
        text: "CEO, CFO, COO, CRO, CHRO debating in real time."
      - lead: "Guarded actions:"
        text: "Instant writes into ERP/MES/CRM with rollback."
      - lead: "Living ledger:"
        text: "Every trade‑off, decision, and outcome captured."
    closing: "Your enterprise doesn't just act faster. It remembers faster."
```

---

## Accessing Data in Templates

### In page files (`.html`)

```liquid
{{ site.data.enterprise.hero.headline }}
{{ site.data.enterprise.hero.cta_primary.label }}

{% for beat in site.data.enterprise.intro.beats %}
  <p class="beat">{{ beat }}</p>
{% endfor %}
```

### In `_includes/` files

Includes access data via the same `site.data.PAGE_SLUG.SECTION.*` path. The section key should match the include's own name:

```liquid
{# _includes/enterprise/hero.html #}
<h1 class="headline reveal">{{ site.data.enterprise.hero.headline }}</h1>
<p class="sub lead reveal">{{ site.data.enterprise.hero.subhead }}</p>
<a href="{{ site.data.enterprise.hero.cta_primary.url }}" class="btn btn-primary">
  {{ site.data.enterprise.hero.cta_primary.label }}
</a>
```

### Iterating over lists

```liquid
{% for item in site.data.features.agents.roster %}
  <div class="card roster">
    <h3>{{ item.name }}</h3>
    <ul class="list">
      <li><strong>Scope:</strong> {{ item.scope }}</li>
      <li><strong>Strength:</strong> {{ item.strength }}</li>
      <li><strong>Gives you:</strong> {{ item.gives }}</li>
    </ul>
  </div>
{% endfor %}
```

---

## Shared vs Page-Scoped Data

Some data is **shared** across many pages and lives at the top level of `_data/`:

| File | Shared content |
|------|---------------|
| `agents.yml` | C-suite agent definitions (name, role, archetype name, agent ID) |
| `nav.json` | Primary navigation links |
| `products.yml` | Product catalogue entries |
| `workflows.yml` | Orchestration workflow definitions |

Page-scoped data files **must not** duplicate shared data. Reference shared data by key instead:

```liquid
{# Reference shared agent data, not page-specific copy #}
{% for agent in site.data.agents %}
  <span>{{ agent.archetype_name }}</span>
{% endfor %}
```

---

## Validation

Before committing `_data/` changes:

- [ ] YAML file is valid (no indentation errors, no unquoted colons in values)
- [ ] Section keys match the corresponding `_includes/` filenames
- [ ] No HTML markup in data values
- [ ] No Liquid expressions in data values
- [ ] Copy uses archetype names (not celebrity names) for public-facing agent references
- [ ] Long paragraphs use YAML block scalars (`|` or `>`) for readability

```bash
# Validate YAML syntax
python3 -c "import yaml, sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]" _data/**/*.yml

# Verify no HTML tags in data values
grep -r '<[a-z]' _data/ --include="*.yml" && echo "WARNING: HTML found in data files"
```

---

## References

→ **Website editorial spec**: `.github/specs/website.md`  
→ **HTML & Liquid standards**: `.github/instructions/html.instructions.md`  
→ **Repository spec**: `.github/specs/repository.md`  
→ **Entrepreneur example** (reference implementation): `entrepreneur/index.html` + `_data/business_infinity_entrepreneur.yml`
