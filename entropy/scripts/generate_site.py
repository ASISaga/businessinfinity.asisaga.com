#!/usr/bin/env python3
"""Generate the Business Infinity static website — The Entropy Index.

Usage::

    python scripts/generate_site.py [--output website]

Reads the canonical SEO taxonomy from ``src/business_infinity/seo.py`` and
the workflow YAML files from ``docs/workflow/samples/`` to produce:

- ``index.html``               — The Entropy Index hub page
- ``entropy-index/<slug>.html`` — 10 pillar pages (one per pain category)
- ``specs/<slug>.html``        — 10 workflow "Public Spec" mirror pages

All pages include embedded JSON-LD structured data for FAQ Schema and the
site-wide Knowledge Graph.
"""

from __future__ import annotations

import argparse
import html
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

# Ensure the src directory is importable
_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_ROOT / "src"))

import yaml  # noqa: E402
from business_infinity.seo import (  # noqa: E402
    PAIN_TAXONOMY,
    SITE_URL,
    chatroom_deep_link,
    generate_faq_jsonld,
    generate_knowledge_graph_jsonld,
    generate_workflow_spec_jsonld,
    github_yaml_url,
    pillar_page_url,
    render_jsonld_script,
    spec_page_url,
    total_query_count,
)

# ── HTML Templates ───────────────────────────────────────────────────────────

_CSS = """\
:root {
  --bg: #0a0a0f;
  --surface: #12121a;
  --border: #1e1e2e;
  --text: #e0e0e8;
  --muted: #8888a0;
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --gold: #f59e0b;
  --danger: #ef4444;
  --success: #22c55e;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg); color: var(--text);
  line-height: 1.7; max-width: 960px; margin: 0 auto;
  padding: 2rem 1.5rem;
}
a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--accent-hover); text-decoration: underline; }
h1 { font-size: 2.2rem; margin-bottom: 0.5rem; color: #fff; }
h2 { font-size: 1.6rem; margin: 2.5rem 0 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
h3 { font-size: 1.15rem; margin: 1.8rem 0 0.5rem; color: var(--gold); font-style: italic; }
p { margin-bottom: 1rem; }
.subtitle { color: var(--muted); font-size: 1.1rem; margin-bottom: 2rem; }
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;
}
.card h3 { margin-top: 0; }
.tag {
  display: inline-block; font-size: 0.75rem; padding: 2px 10px;
  border-radius: 9999px; border: 1px solid var(--border);
  color: var(--muted); margin-right: 0.5rem; margin-bottom: 0.3rem;
}
.tag--technical { border-color: var(--accent); color: var(--accent); }
.tag--emotional { border-color: var(--danger); color: var(--danger); }
.tag--financial { border-color: var(--success); color: var(--success); }
.diagnostic { color: var(--muted); font-size: 0.97rem; margin-bottom: 0.8rem; }
.cta {
  display: inline-block; background: var(--accent); color: #fff;
  padding: 0.6rem 1.4rem; border-radius: 8px; font-weight: 600;
  font-size: 0.95rem; margin-top: 0.5rem; margin-right: 0.5rem;
  transition: background 0.2s;
}
.cta:hover { background: var(--accent-hover); text-decoration: none; }
.cta--secondary {
  background: transparent; border: 1px solid var(--accent); color: var(--accent);
}
.cta--secondary:hover { background: var(--accent); color: #fff; }
.legend-badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: var(--surface); border: 1px solid var(--gold);
  border-radius: 8px; padding: 0.3rem 0.8rem; font-size: 0.85rem;
  color: var(--gold); margin-bottom: 1rem;
}
.breadcrumb { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
.breadcrumb a { color: var(--muted); }
.breadcrumb a:hover { color: var(--accent); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; }
.stat { text-align: center; padding: 1.5rem; }
.stat-number { font-size: 2.5rem; font-weight: 700; color: var(--accent); }
.stat-label { color: var(--muted); font-size: 0.9rem; }
nav { margin-bottom: 2rem; }
nav a.nav-link {
  display: inline-block; padding: 0.4rem 0.8rem; margin: 0.2rem;
  border: 1px solid var(--border); border-radius: 6px;
  font-size: 0.85rem; color: var(--muted);
}
nav a.nav-link:hover { border-color: var(--accent); color: var(--accent); text-decoration: none; }
pre {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; padding: 1.2rem; overflow-x: auto;
  font-size: 0.88rem; line-height: 1.6; color: var(--muted);
}
code { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
footer {
  margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border);
  color: var(--muted); font-size: 0.85rem; text-align: center;
}
"""


def _page(
    title: str,
    body: str,
    *,
    jsonld_blocks: List[str] | None = None,
    description: str = "",
    canonical: str = "",
) -> str:
    """Wrap body HTML in a full page with head, CSS, and JSON-LD."""
    ld = "\n".join(jsonld_blocks or [])
    desc_tag = ""
    if description:
        desc_tag = f'<meta name="description" content="{html.escape(description, quote=True)}">'
    canon_tag = ""
    if canonical:
        canon_tag = f'<link rel="canonical" href="{html.escape(canonical)}">'
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)} — Business Infinity</title>
{desc_tag}
{canon_tag}
<style>{_CSS}</style>
{ld}
</head>
<body>
{body}
<footer>
  <p>&copy; ASI Saga &mdash; Business Infinity &mdash; The Entropy Index</p>
  <p>
    <a href="{SITE_URL}">Home</a> &middot;
    <a href="{SITE_URL}/entropy-index">Entropy Index</a> &middot;
    <a href="https://github.com/ASISaga/business-infinity">GitHub</a>
  </p>
</footer>
</body>
</html>"""


# ── Index Page (The Entropy Index Hub) ───────────────────────────────────────


def _render_index() -> str:
    total_q = total_query_count()
    cat_cards = []
    for cat in PAIN_TAXONOMY:
        qcount = len(cat["queries"])
        cat_cards.append(f"""
<a href="{SITE_URL}/entropy-index/{cat['slug']}" class="card" style="text-decoration:none;display:block">
  <div class="legend-badge">{html.escape(cat['owner_legend'])} &mdash; {html.escape(cat['owner_title'])}</div>
  <h3 style="color:var(--text);font-style:normal">{cat['number']}. {html.escape(cat['title'])}</h3>
  <p class="diagnostic">{html.escape(cat['symptom'])}</p>
  <span class="tag">{qcount} panic queries</span>
  <span class="tag">Workflow: <code>{html.escape(cat['workflow_id'])}</code></span>
</a>""")

    body = f"""
<h1>The Entropy Index</h1>
<p class="subtitle">
  {total_q} panic-driven queries that founders type at 2:00&nbsp;AM &mdash;
  organized into the 10 categories of organizational pain that
  Business&nbsp;Infinity resolves.
</p>

<div class="grid" style="margin-bottom:2rem">
  <div class="card stat">
    <div class="stat-number">{total_q}</div>
    <div class="stat-label">Panic Queries Indexed</div>
  </div>
  <div class="card stat">
    <div class="stat-number">10</div>
    <div class="stat-label">Pain Categories</div>
  </div>
  <div class="card stat">
    <div class="stat-number">7</div>
    <div class="stat-label">Legendary CXO Agents</div>
  </div>
</div>

<h2>The Pain Taxonomy</h2>
<p>
  Every pain maps to one of ten categories. Each category is owned by a
  legendary CXO agent and backed by an executable workflow that a founder
  can activate in seconds.
</p>

<div class="grid">
{''.join(cat_cards)}
</div>

<h2>How It Works</h2>
<div class="card">
  <p><strong>1. Search</strong> &mdash; Founder types a panic query into Google or an AI assistant.</p>
  <p><strong>2. Find</strong> &mdash; This Entropy Index appears as a Featured Snippet with the legendary diagnostic.</p>
  <p><strong>3. Click</strong> &mdash; The founder clicks a deep-link that carries their specific intent.</p>
  <p><strong>4. Activate</strong> &mdash; The chatroom opens with the correct workflow and legend pre-loaded.</p>
  <p><strong>5. Resolve</strong> &mdash; The AOS is already analyzing their crisis before they type a word.</p>
</div>

<h2>Public Workflow Specs</h2>
<p>
  Every workflow is an open-source YAML specification that governs the
  conversation. Transparency is integrity.
</p>
<nav>
{''.join(f'<a class="nav-link" href="{spec_page_url(cat["workflow_id"])}">{html.escape(cat["title"])}</a>' for cat in PAIN_TAXONOMY)}
</nav>
"""

    kg = generate_knowledge_graph_jsonld()
    return _page(
        "The Entropy Index",
        body,
        jsonld_blocks=[render_jsonld_script(kg)],
        description=(
            f"The Entropy Index: {total_q} panic-driven search queries "
            "organized into 10 categories of organizational pain, each "
            "governed by a legendary CXO agent. Business Infinity meets "
            "founders when their integrity is failing."
        ),
        canonical=f"{SITE_URL}/entropy-index",
    )


# ── Pillar Page ──────────────────────────────────────────────────────────────


def _render_pillar(cat: Dict[str, Any]) -> str:
    queries_html = []
    for q in cat["queries"]:
        dialect_class = f"tag--{q['dialect']}"
        deep_link = chatroom_deep_link(cat["workflow_id"], cat["owner_agent"])
        queries_html.append(f"""
<div class="card">
  <h3>&ldquo;{html.escape(q['q'])}&rdquo;</h3>
  <span class="tag {dialect_class}">{q['dialect']}</span>
  <p class="diagnostic">{html.escape(q['diagnostic'])}</p>
  <a class="cta" href="{html.escape(deep_link)}">
    Initialize {html.escape(cat['owner_legend'])} Consultation &rarr;
  </a>
</div>""")

    prev_cat = None
    next_cat = None
    for i, c in enumerate(PAIN_TAXONOMY):
        if c["slug"] == cat["slug"]:
            if i > 0:
                prev_cat = PAIN_TAXONOMY[i - 1]
            if i < len(PAIN_TAXONOMY) - 1:
                next_cat = PAIN_TAXONOMY[i + 1]
            break

    nav_links = ""
    if prev_cat:
        nav_links += f'<a class="cta cta--secondary" href="{pillar_page_url(prev_cat["slug"])}">&larr; {html.escape(prev_cat["title"])}</a> '
    if next_cat:
        nav_links += f'<a class="cta cta--secondary" href="{pillar_page_url(next_cat["slug"])}">{html.escape(next_cat["title"])} &rarr;</a>'

    body = f"""
<div class="breadcrumb">
  <a href="{SITE_URL}/entropy-index">The Entropy Index</a> &rsaquo;
  Category {cat['number']}
</div>

<h1>{cat['number']}. {html.escape(cat['title'])}</h1>
<p class="subtitle">{html.escape(cat['disease'])}</p>

<div class="legend-badge">{html.escape(cat['owner_legend'])} &mdash; {html.escape(cat['owner_title'])}</div>

<div class="card" style="border-color:var(--danger)">
  <strong>The Bleeding Symptom:</strong> {html.escape(cat['symptom'])}
</div>

<div style="margin-bottom:2rem">
  <a class="cta" href="{html.escape(chatroom_deep_link(cat['workflow_id'], cat['owner_agent']))}">
    Initialize {html.escape(cat['workflow_id'])} with the {html.escape(cat['owner_legend'])} Agent &rarr;
  </a>
  <a class="cta cta--secondary" href="{html.escape(spec_page_url(cat['workflow_id']))}">
    View Workflow Spec
  </a>
</div>

<h2>Panic Queries &mdash; The Symptoms</h2>
<p>
  These are the raw, panic-driven questions that founders type into Google
  or AI assistants at 2:00&nbsp;AM. Each one is a signal that their organization&rsquo;s
  integrity is failing in this category. Click any query to activate the
  corresponding workflow.
</p>

{''.join(queries_html)}

<h2>The Workflow</h2>
<div class="card">
  <p>
    The <code>{html.escape(cat['workflow_id'])}</code> workflow is an executable YAML
    specification that governs a structured consultation with the
    {html.escape(cat['owner_legend'])} agent ({html.escape(cat['owner_title'])}).
  </p>
  <p>
    When a founder activates this workflow, the Agent Operating System (AOS)
    pre-loads the context, selects the appropriate legendary agent, and begins
    analyzing the crisis before the founder types a single word.
    This is not a chatbot &mdash; it is an Integrated Strategic Environment.
  </p>
  <a class="cta" href="{html.escape(spec_page_url(cat['workflow_id']))}">
    See the {html.escape(cat['workflow_id'])} Spec &rarr;
  </a>
  <a class="cta cta--secondary" href="{html.escape(github_yaml_url(cat['yaml_path']))}">
    View Source on GitHub
  </a>
</div>

<div style="margin-top:2rem">{nav_links}</div>
"""

    faq_ld = generate_faq_jsonld(cat)
    return _page(
        f"{cat['title']} — Entropy Index",
        body,
        jsonld_blocks=[render_jsonld_script(faq_ld)],
        description=(
            f"{cat['title']}: {len(cat['queries'])} panic-driven queries "
            f"that signal organizational integrity failure. Governed by the "
            f"{cat['owner_legend']} agent ({cat['owner_title']}). "
            f"Backed by the {cat['workflow_id']} workflow."
        ),
        canonical=pillar_page_url(cat["slug"]),
    )


# ── Workflow Spec Page ───────────────────────────────────────────────────────


def _render_spec(cat: Dict[str, Any], yaml_content: str) -> str:
    """Render a human-readable public spec page for a workflow."""
    # Parse YAML for structured display
    try:
        spec = yaml.safe_load(yaml_content)
    except yaml.YAMLError:
        spec = {}

    steps_html = ""
    if spec and "steps" in spec:
        for step_id, step in spec["steps"].items():
            narrative = step.get("narrative", "")
            response = step.get("response", "")
            actions = step.get("actions", [])
            actions_html = ""
            if actions:
                action_items = "".join(
                    f'<li><strong>{html.escape(a.get("label", ""))}</strong>: '
                    f'{html.escape(a.get("description", ""))}</li>'
                    for a in actions
                )
                actions_html = f"<ul>{action_items}</ul>"

            steps_html += f"""
<div class="card">
  <h3>{html.escape(step_id.replace('_', ' ').title())}</h3>
  <p><strong>Narrative:</strong> {html.escape(narrative)}</p>
  <p class="diagnostic"><strong>Response:</strong> {html.escape(response)}</p>
  {actions_html}
</div>"""

    body = f"""
<div class="breadcrumb">
  <a href="{SITE_URL}/entropy-index">The Entropy Index</a> &rsaquo;
  <a href="{pillar_page_url(cat['slug'])}">{html.escape(cat['title'])}</a> &rsaquo;
  Workflow Spec
</div>

<h1>Workflow Spec: <code>{html.escape(cat['workflow_id'])}</code></h1>
<p class="subtitle">
  A structured consultation governed by the {html.escape(cat['owner_legend'])}
  agent ({html.escape(cat['owner_title'])}), addressing {html.escape(cat['title'].lower())}.
</p>

<div class="legend-badge">{html.escape(cat['owner_legend'])} &mdash; {html.escape(cat['owner_title'])}</div>

<div class="card">
  <p><strong>Workflow ID:</strong> <code>{html.escape(cat['workflow_id'])}</code></p>
  <p><strong>Version:</strong> {html.escape(str(spec.get('version', '1.0.0')))}</p>
  <p><strong>Owner:</strong> {html.escape(cat['owner_agent'])} ({html.escape(cat['owner_legend'])})</p>
  <p><strong>Pain Category:</strong>
    <a href="{pillar_page_url(cat['slug'])}">{cat['number']}. {html.escape(cat['title'])}</a>
  </p>
</div>

<div style="margin-bottom:2rem">
  <a class="cta" href="{html.escape(chatroom_deep_link(cat['workflow_id'], cat['owner_agent']))}">
    Activate This Workflow &rarr;
  </a>
  <a class="cta cta--secondary" href="{html.escape(github_yaml_url(cat['yaml_path']))}">
    View Source on GitHub
  </a>
</div>

<h2>Conversation Steps</h2>
<p>
  This workflow is a YAML specification that governs a step-by-step
  consultation. Each step presents a narrative, receives a response from
  the legendary agent, and offers actions. The AOS executes this spec
  in real-time through the chatroom interface.
</p>

{steps_html}

<h2>Source Specification</h2>
<pre><code>{html.escape(yaml_content)}</code></pre>

<div style="margin-top:2rem">
  <a class="cta" href="{html.escape(chatroom_deep_link(cat['workflow_id'], cat['owner_agent']))}">
    Initialize {html.escape(cat['owner_legend'])} Consultation &rarr;
  </a>
  <a class="cta cta--secondary" href="{pillar_page_url(cat['slug'])}">
    &larr; Back to {html.escape(cat['title'])}
  </a>
</div>
"""

    spec_ld = generate_workflow_spec_jsonld(cat)
    return _page(
        f"{cat['workflow_id']} Workflow Spec",
        body,
        jsonld_blocks=[render_jsonld_script(spec_ld)],
        description=(
            f"Public specification for the {cat['workflow_id']} workflow. "
            f"Governed by the {cat['owner_legend']} agent. "
            f"View the YAML logic spec that powers autonomous consultations "
            f"for {cat['title'].lower()}."
        ),
        canonical=spec_page_url(cat["workflow_id"]),
    )


# ── Main ─────────────────────────────────────────────────────────────────────


def generate(output_dir: Path) -> None:
    """Generate the full static website into *output_dir*."""
    output_dir.mkdir(parents=True, exist_ok=True)

    # Index page
    index_path = output_dir / "index.html"
    index_path.write_text(_render_index(), encoding="utf-8")
    print(f"  ✓ {index_path}")

    # Pillar pages
    pillar_dir = output_dir / "entropy-index"
    pillar_dir.mkdir(exist_ok=True)
    for cat in PAIN_TAXONOMY:
        p = pillar_dir / f"{cat['slug']}.html"
        p.write_text(_render_pillar(cat), encoding="utf-8")
        print(f"  ✓ {p}")

    # Spec pages
    spec_dir = output_dir / "specs"
    spec_dir.mkdir(exist_ok=True)
    for cat in PAIN_TAXONOMY:
        yaml_path = _ROOT / cat["yaml_path"]
        if yaml_path.exists():
            yaml_content = yaml_path.read_text(encoding="utf-8")
        else:
            yaml_content = f"# Workflow: {cat['workflow_id']}\n# YAML spec not found at {cat['yaml_path']}"
        slug = cat["workflow_id"].replace("_", "-")
        p = spec_dir / f"{slug}.html"
        p.write_text(_render_spec(cat, yaml_content), encoding="utf-8")
        print(f"  ✓ {p}")

    # Knowledge graph JSON-LD (standalone for embedding)
    kg = generate_knowledge_graph_jsonld()
    kg_path = output_dir / "knowledge-graph.jsonld"
    kg_path.write_text(json.dumps(kg, indent=2), encoding="utf-8")
    print(f"  ✓ {kg_path}")

    total_files = 1 + len(PAIN_TAXONOMY) * 2 + 1
    print(f"\n✅ Generated {total_files} files in {output_dir}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate the Business Infinity Entropy Index website"
    )
    parser.add_argument(
        "--output",
        default="website",
        help="Output directory (default: website)",
    )
    args = parser.parse_args()
    output = _ROOT / args.output
    print(f"Generating site into {output} …")
    generate(output)


if __name__ == "__main__":
    main()
