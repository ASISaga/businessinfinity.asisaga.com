# business-infinity.asisaga.com — Generic Boardroom Interface

**Version**: 1.1.0  
**Last Updated**: 2026-04-03

## Objective

Configure the `<chatroom>` Web Component on business-infinity.asisaga.com to
serve as the generic boardroom interface, supporting any registered workflow
(pitch, marketing, onboarding, etc.) and dynamic CXO discussions through the
same page.

## Context

The boardroom page is the single entry point for all boardroom interactions.
It supports two modes:

1. **Structured workflow** — Selected via URL parameter (e.g.
   `?workflow=pitch_business_infinity`).  The owner agent conducts the
   step-by-step conversation.
2. **Dynamic discussion** — No workflow parameter.  The full C-suite
   engages in purpose-driven debate.

A third capability is available independently of the boardroom session:

3. **Workflow Editor** — A step-wise, form-based editor at `/workflow-editor/`
   that allows authorised users to configure the YAML workflow files
   (`docs/workflow/samples/`) without writing raw YAML.

Detailed interaction, state, and accessibility expectations for these surfaces
are defined in `docs/workflow/pr/business-infinity.asisaga.com/UX.md`.

## Requirements

### 1. Generic Boardroom Page

Create a single boardroom page (`/boardroom/`) that initialises the
`<chatroom>` component dynamically based on the URL:

```html
<!-- Structured workflow mode -->
<chatroom
  api-endpoint="https://business-infinity.azurewebsites.net/api/workflows/workflow-orchestration"
  app-id="boardroom_ui"
  workflow-id="pitch_business_infinity">
</chatroom>

<!-- Dynamic discussion mode (no workflow-id) -->
<chatroom
  api-endpoint="https://business-infinity.azurewebsites.net/api/workflows/boardroom-debate"
  app-id="boardroom_ui">
</chatroom>
```

The page reads `?workflow=<workflow_id>` from the URL to determine the mode.

### 2. Authentication Bridge

Implement a JavaScript listener on the boardroom page to capture the Google
Identity Services JWT and update the `access-token` attribute of the
`<chatroom>` component dynamically.

### 3. MCP Payload Rendering

Listen for `mcp_app` payloads where `app_id === "boardroom_ui"` and render:

- **Narrative** → Primary chat bubble (agent message)
- **Response** → Agent response bubble
- **Actions** → For each action, render the `description` as small text
  followed by a `<sl-button variant="primary">` with the `label`. On click,
  execute `window.open(url, '_blank')`.
- **Navigation** → Render "Next" and "Back" as `<sl-button variant="default">`.
  Clicking these sends `cmd:next` or `cmd:back` through the chat stream.

### 4. Workflow Selection

Support workflow selection via:
- URL parameter: `?workflow=marketing_business_infinity`
- JavaScript API: `chatroom.setAttribute('workflow-id', 'onboard_new_business')`
- Landing page with workflow cards showing all available workflows

### 5. Step Progress Indicator

Display a step progress indicator (e.g. "Step 3 of 9") using the `step_id`
and `total_steps` returned by the `workflow-orchestration` response.
Hide the indicator for dynamic discussion mode.

### 6. Owner Agent Display

Show the workflow owner's name and role (e.g. "CMO — David Ogilvy") in the
chat header during structured workflows.  Show "Boardroom" for dynamic
discussions.

### 7. SCSS Theming

Apply "Boardroom" aesthetic overrides to the Shadow DOM:
- Brand colours from the ASI Saga identity
- Formal typography
- Minimal border radii
- Dark mode support for the boardroom environment

### 8. Workflow Editor Page

Create a page at `/workflow-editor/` that embeds the `<workflow-editor>`
Web Component from `theme.asisaga.com`.  This page allows authorised users
to configure any registered workflow in a step-wise, form-based interface
without writing raw YAML.

#### 8.1 Page Initialisation

```html
<!-- /workflow-editor/ -->
<workflow-editor
  api-endpoint="https://business-infinity.azurewebsites.net/api/workflows"
  access-token="">
</workflow-editor>
```

The page captures the Google Identity Services JWT (same bridge as the
boardroom page) and sets the `access-token` attribute so the editor can
call authenticated backend endpoints.

#### 8.2 Backend Endpoints

The editor page communicates with three backend endpoints provided by the
`business-infinity` Azure Functions app:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `workflow-editor-list` | POST | Retrieve metadata for all registered workflows |
| `workflow-editor-get` | POST `{"workflow_id": "…"}` | Retrieve full structured content of a workflow |
| `workflow-editor-save` | POST `{workflow data}` | Save updated workflow structure back to YAML |

#### 8.3 Workflow Selection Panel

On load, the page calls `workflow-editor-list` and renders a sidebar with
one card per workflow showing:
- Workflow ID
- Owner agent name (e.g. "Founder", "CMO")
- Number of steps

Clicking a card calls `workflow-editor-get` and loads the step editor.

#### 8.4 Step Editor Panel

Once a workflow is loaded the editor renders a two-panel layout:

- **Step list** (left) — Ordered list of all step IDs.  Steps can be
  reordered by drag-and-drop.  An "Add Step" button appends a blank step.
  Each step row has a delete icon.
- **Step form** (right) — When a step is selected, the form shows:
  - **Step ID** — Read-only for existing steps; editable text input for
    new steps.
  - **Narrative** — Multi-line text area (the agent's opening statement).
  - **Response** — Multi-line text area (the agent's elaboration).
  - **Actions** — Repeatable group.  Each action has three text inputs:
    `label`, `description`, and `url`.  An "Add Action" button appends a
    new blank action row.  Each row has a remove icon.
  - **Navigation** — Two dropdowns ("Next step", "Back step"), each
    populated with the current step IDs of the workflow.  Selecting "—"
    (none) omits the field.

#### 8.5 Save and Validation

A "Save Workflow" button at the top of the step editor calls
`workflow-editor-save` with the complete updated workflow structure.
Client-side validation runs before the call and highlights any step missing
a `narrative`, `response`, or `actions` field.  The response shows a success
or error banner.

#### 8.6 Authentication

The editor page requires the same Google Identity Services JWT used by the
boardroom.  Access is restricted to users with the `editor` role in the
ASI Saga identity system.  The `access-token` attribute is checked by the
backend before any write operation.

## Dependencies

- `theme.asisaga.com` — `<chatroom>` and `<workflow-editor>` Web Components
- `agent-operating-system` — MCP SSE endpoint for boardroom payload delivery
- `business-infinity` — `workflow-orchestration`, `boardroom-debate`, and
  `workflow-editor-*` backends

## References

→ **Frontend prompt**: `docs/workflow/prompts/frontend.md`
→ **Detailed UX specification**: `docs/workflow/pr/business-infinity.asisaga.com/UX.md`
→ **Workflow YAML samples**: `docs/workflow/samples/`
→ **Boardroom schema**: `docs/workflow/boardroom.yaml`
→ **Communication protocol**: `docs/workflow/Communication.md`
→ **Multi-repo roadmap**: `docs/multi-repository-implementation.md`
