# business-infinity.asisaga.com — Boardroom UX Specification

**Version**: 1.0.0  
**Last Updated**: 2026-04-03

This document defines the intended user experience for the Business Infinity
boardroom frontend. It complements
`/docs/workflow/pr/business-infinity.asisaga.com/Readme.md` by describing what
users should see, understand, and be able to do across the boardroom and
workflow editor surfaces.

## Overview

The frontend must feel like a single executive workspace with two closely
related experiences:

1. **Boardroom conversation** — A live interface for structured workflows and
   dynamic CXO discussions.
2. **Workflow editor** — An authenticated configuration surface for maintaining
   structured workflow YAML through forms instead of raw text editing.

The UX should make these experiences feel coherent, trustworthy, and calm. The
user should always know:

- what mode they are in
- who is speaking
- what the current step or session status is
- what action is expected next
- whether their data is loading, saved, or blocked by authentication

## UX Principles

### 1. One Surface, Two Modes

The same boardroom page supports both structured workflows and dynamic
discussion. The UI must clearly differentiate the modes without making them
feel like separate products.

- **Structured workflow** shows workflow name, owner, step progress, and guided
  next/back actions.
- **Dynamic discussion** removes step framing and emphasizes open-ended
  multi-agent collaboration.

### 2. Calm Executive Interaction

The interface should feel deliberate and high-trust:

- restrained typography
- dark, polished boardroom theme
- minimal visual noise
- strong hierarchy between primary content and supporting controls

### 3. Clear System State

Every important state change needs visible feedback:

- connecting
- authenticated
- loading session history
- waiting for agent response
- save in progress
- save success
- save failure

### 4. Guided Progress Without Lock-In

Structured workflows should guide the user through a sequence, but users should
still feel oriented and in control. The system should show where they are, what
comes next, and how to go back.

### 5. Accessibility as Default

All interactive elements must remain readable, keyboard-usable, and screen
reader friendly across desktop and mobile layouts.

## Primary Users

### External participant

A founder, customer, partner, or prospect interacting with a structured
workflow.

**Needs**
- immediate understanding of the conversation purpose
- confidence that the right executive persona is guiding them
- clear actions to take when links or decisions are presented

### Internal operator

A Business Infinity team member launching boardroom sessions or reviewing
dynamic boardroom conversations.

**Needs**
- quick workflow selection
- clarity on whether they are in guided or dynamic mode
- confidence that reconnects restore the latest state

### Workflow editor

An authorized user with the `editor` role who maintains workflow definitions.

**Needs**
- quick scan of available workflows
- safe, form-driven editing
- strong validation before save
- confidence that changes were persisted

## Information Architecture

### 1. Landing / workflow selection

Purpose: help users enter the correct boardroom mode.

**Content**
- page title and one-sentence boardroom explanation
- cards for each registered structured workflow
- one card for dynamic boardroom discussion
- optional entry point to workflow editor for authorized users

**Card content**
- workflow display name
- owner agent label
- short description of the workflow purpose
- estimated number of steps for structured workflows
- primary CTA: `Open boardroom`

### 2. Boardroom page

Purpose: host live session interaction.

**Layout zones**
- top navigation / brand bar
- boardroom header
- conversation stream
- action and navigation region within the stream
- chat input / composer

### 3. Workflow editor page

Purpose: manage workflow structure through a safe, guided form workflow.

**Layout zones**
- page header with save action
- workflow selection sidebar
- workflow metadata summary
- step list
- step form
- inline status alerts

## Boardroom Experience

## Entry States

### A. Structured workflow entry

Triggered by `?workflow=<workflow_id>`.

**Header content**
- page title: `Boardroom`
- workflow title
- owner display (role + persona name)
- progress indicator (`Step X of Y`)
- mode badge: `Structured workflow`

**Initial system behaviour**
- show skeleton/loading state while session and conversation history load
- connect chatroom with the workflow-specific endpoint configuration
- apply the authenticated token as soon as it becomes available
- replay prior messages before accepting new interaction

### B. Dynamic discussion entry

Triggered when no workflow parameter is present.

**Header content**
- page title: `Boardroom`
- subtitle describing live CXO discussion
- owner display fallback: `Boardroom`
- no step progress indicator
- mode badge: `Dynamic discussion`

## Conversation Layout

### Header

The boardroom header should stay visually stable across mode changes and
contain:

- title area
- owner / boardroom identity
- progress indicator or mode context
- connection/authentication status

**Priority**
1. Session identity
2. Progress or mode context
3. Status feedback

### Message stream

The conversation stream is the dominant visual area.

**Text messages**
- standard chat bubbles
- clear distinction between user and agent/system entries
- timestamps optional visually, but preserved for assistive tech and replay

**Structured workflow MCP payload**
- `narrative` appears as the primary message block
- `response` appears immediately after as supporting explanation
- `actions` appear grouped beneath the related message
- `navigation` appears as persistent contextual controls for the current step

### Composer

The input area should:

- remain available in both modes
- preserve a simple “message the boardroom” mental model
- allow `cmd:` navigation to be sent by UI buttons rather than typed manually

## Structured Workflow UX Details

### Step framing

Each workflow step should feel like a guided stage, not a disconnected message.

**Visible cues**
- progress text (`Step 3 of 9`)
- current owner identity
- grouped actions tied to the current step
- next/back navigation when available

### Actions

Actions represent recommended off-platform next steps.

**Presentation**
- description text first
- primary button second
- enough spacing to distinguish multiple actions

**Interaction**
- clicking opens the destination in a new tab
- user remains in the boardroom
- opened action should not remove the user’s current place in the workflow

### Navigation

Navigation buttons should be visually secondary to business actions but easy to
find.

**Rules**
- show `Next` only when `navigation.next` exists
- show `Back` only when `navigation.back` exists
- disable repeated clicks while a navigation command is in flight
- maintain button position for predictability

### Completion state

If a structured workflow reaches its final step:

- replace progress messaging with a completion state
- show a short completion confirmation
- preserve the conversation history
- keep any final action buttons available
- offer a clear path back to workflow selection

## Dynamic Discussion UX Details

Dynamic discussion should feel broader and less procedural than structured
workflow mode.

**Characteristics**
- no step progress or workflow framing
- `Boardroom` identity instead of a single owner
- free-form text and MCP app visuals can appear interleaved
- the conversation should emphasize ongoing deliberation, not completion

**User expectation**
- the boardroom is thinking collaboratively
- different CXO voices may appear over time
- reconnect restores the full debate context

## Authentication UX

Authentication should feel lightweight but explicit.

### Boardroom

- if no JWT is present, show a non-destructive sign-in prompt
- once the JWT is captured, silently apply it to the component
- if the token expires, show a clear re-authentication prompt without losing
  visible conversation history

### Workflow editor

- the editor must not appear writable until the user is authenticated
- users without the `editor` role should see an access denied state with no
  editable controls
- save controls should be hidden or disabled until access is confirmed

## Loading, Empty, and Error States

### Loading states

Use explicit loading feedback for:

- initial page bootstrap
- session replay
- workflow list fetch
- workflow detail fetch
- workflow save

Preferred treatments:

- skeletons for panels and cards
- inline spinners in buttons
- short status text near the affected region

### Empty states

Provide purpose-specific empty states:

- no workflow selected yet in the editor
- no previous conversation history in a new session
- no workflows returned by the backend

Each empty state should explain what to do next.

### Error states

Errors should be actionable and local when possible.

**Boardroom examples**
- connection lost
- authentication failed
- workflow not found
- replay failed

**Workflow editor examples**
- workflow list failed to load
- save validation failed
- backend rejected save

Every error state should include:

- plain-language explanation
- whether retry is possible
- visible retry action when appropriate

## Workflow Editor Experience

## Editor entry experience

The `/workflow-editor/` page should immediately communicate:

- this is an administrative tool
- workflows are edited through structured forms
- saves affect shared workflow behaviour

The header should include:

- page title
- short description
- current auth/access status
- primary save action

## Workflow selection sidebar

The sidebar is the user’s navigation backbone.

Each workflow card should show:

- workflow ID
- owner
- step count
- active/selected state

Cards should support:

- click/tap selection
- clear hover/focus treatment
- persistent selected styling

## Step list panel

The step list should optimize scanning and reordering.

Each row should display:

- step ID
- warning state if invalid
- selected state
- delete affordance

Expected behaviours:

- add step appends a new editable draft row
- drag-and-drop provides obvious insertion feedback
- keyboard navigation mirrors pointer navigation

## Step form panel

The form panel is the main editing workspace.

### Form priorities

1. identify the step
2. edit core messaging (`narrative`, `response`)
3. manage external actions
4. configure navigation links

### Form usability requirements

- labels always visible
- enough spacing between repeated action groups
- destructive controls visually distinct
- validation anchored near the failing field and reflected in the step list

## Save UX

Saving should feel safe and explicit.

### Before save

- validate all required content
- highlight invalid steps and fields
- move focus to the first visible error when possible

### During save

- disable the save button
- show progress state (`Saving workflow...`)
- prevent duplicate submissions

### After save success

- show success alert/banner
- keep the user on the same workflow and step
- update any dirty-state indicators

### After save failure

- show error alert/banner with backend message
- keep unsaved edits in place
- re-enable save immediately after failure

## Responsive Behaviour

### Desktop

- full two-panel layouts for boardroom header + conversation and workflow
  editor sidebar + form
- progress and owner information can remain in a single header row

### Tablet

- preserve hierarchy while reducing side panel width
- keep save and navigation controls visible without crowding

### Mobile

- stack panels vertically
- collapse secondary metadata into smaller blocks
- keep primary actions full-width where needed
- ensure chat input, workflow cards, and form controls remain thumb-friendly

## Accessibility Requirements

- all controls must be reachable by keyboard
- focus order must follow the visual reading order
- status changes should be announced to assistive technology
- colour must not be the only indicator of mode, selection, or validation
- labels must remain visible for every input
- hit targets should be comfortable on touch devices

## Content and Tone

The boardroom voice should feel:

- executive
- clear
- confident
- calm

UI copy should avoid internal implementation language. Prefer user-facing terms
such as:

- `Boardroom`
- `Structured workflow`
- `Dynamic discussion`
- `Save workflow`
- `Reconnect`
- `Access denied`

Avoid exposing backend endpoint names or transport details in the interface.

## Acceptance Criteria

The UX is successful when:

1. a new user can tell within a few seconds whether they are in structured or
   dynamic mode
2. a structured workflow user always knows the current step and next available
   action
3. a reconnect restores prior context without confusion
4. an editor can load, modify, validate, and save a workflow without touching
   raw YAML
5. authentication and failure states are understandable without reading logs or
   developer documentation

## References

→ **Frontend PR scope**:
`/docs/workflow/pr/business-infinity.asisaga.com/Readme.md`  
→ **Theme component requirements**:
`/docs/workflow/pr/theme.asisaga.com/Readme.md`  
→ **Architecture**: `/docs/workflow/Architecture.md`  
→ **Communication protocol**: `/docs/workflow/Communication.md`  
→ **Roadmap**: `/docs/multi-repository-implementation.md`
