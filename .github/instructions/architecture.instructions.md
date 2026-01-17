---
applyTo: "**/*"
description: "Repository architecture, companion-file roles, integration points, and agent responsibilities for the subdomain."
---

## Repository layout (agent interpretation)

- `Website/` — contains all subdomain sites and a local clone of the shared theme. Agents should treat `Website/` as the root for site-level checks.
- `Website/<subdomain>.asisaga.com/` — subdomain content: `_includes`, `_layouts`, `_sass`, `assets`, `scripts`, and CI hooks.
- `Website/theme.asisaga.com/` — canonical theme source; changes here usually require coordinated PRs across subdomains.

## Integration points (high level)

- **Genesis Ontological SCSS Design System:** The theme provides the Genesis Semantic Engine with six ontological categories for styling. Subdomain SCSS files use only ontological mixins - no raw CSS properties allowed.
- **Theme coordination (overview):** Changes to the ontological system require coordinated PRs to the theme repository. Subdomains can propose new ontological variants via Ontological Proposition PRs.
- **Vendor flow (overview):** Vendor artifacts are prepared locally and committed under vendor directories in `assets` or `_sass/vendor` for reproducible builds.
- **CI hooks:** Automated checks should be wired into the repository's CI (GitHub Actions) and may call Buddhi/MCP tools for heavier audits.

For specific guidance on templates, accessibility, component mappings, SCSS conventions, and JS vendor/initialization rules, consult the focused instruction files below rather than duplicating their content here:

- `.github/instructions/html.instructions.md` — HTML, Jekyll/Liquid templates, includes, accessibility, and template-level checks.
- `.github/instructions/scss.instructions.md` — Genesis Ontological SCSS Design System, ontological mixins, zero raw CSS enforcement, and semantic styling.
- `.github/instructions/js.instructions.md` — JS entry points, vendor flow, runtime initialization, and forbidden patterns.

## Buddhi / MCP guidance

For Buddhi/MCP-specific agent behavior and operational guidance (agent prompt contracts, execution mapping, and interaction patterns), see: `.github/agents/buddhi-agent.md`.

## Agent responsibilities (architecture-specific)

Agents should consult the domain-specific instruction files listed above when performing validation related to HTML templates, SCSS partials, or JS assets. High-level responsibilities remain:

- Validate site structure and that overrides are intentional and documented.
- Ensure cross-repo coordination for breaking changes to shared theme artifacts.
- Invoke Buddhi/MCP tooling for heavy audits and provide an invocation artifact under `.github/prompts/` when required.

## Change coordination guidance

- **For ontological system evolution:** Submit Ontological Proposition PRs to the theme repository to add new semantic variants. Review theme's `GENOME.md` and existing 31 variants before proposing new ones.
- **For breaking changes to ontology:** Create a coordination issue, link PRs across theme and subdomain repos, and assign reviewers from both teams.
- **Prefer semantic propositions** over raw CSS workarounds. If a semantic pattern is missing, propose it to the theme rather than breaking the abstraction.
- Document cross-repo rationale and migration steps in PR bodies to make review and rollout deterministic.