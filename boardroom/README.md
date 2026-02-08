# Boardroom Interface (Version 1)

This directory contains the main boardroom interface using Jekyll layouts.

## Status
- **Active**: Yes (uses Jekyll layout system)
- **Purpose**: Main boardroom interface
- **Alternative Version**: `/boardroom2/` uses web components

## Implementation

This version uses Jekyll includes and layouts:
- Layout: `chatroom` (from theme)
- Includes:
  - `boardroom/toggle-strip.html` - Control strip
  - `boardroom/members-sidebar.html` - Member list
  - `chatroom/header.html` - Chat header (from theme)
  - `chatroom/input.html` - Chat input area (from theme)
  - `boardroom/chat-area/empty-state.html` - Empty state message

### Features
- Loading overlay for connection state
- Toast notifications for user feedback
- Structured using Jekyll's templating system
- Integrates with site-wide layouts

## Preservation Rationale

This is the primary boardroom interface implementation and should NOT be removed. It:
1. Provides the core boardroom functionality
2. Uses the established Jekyll architecture
3. Integrates with the site's design system
4. Supports all boardroom features (chat, agents, governance)

## vs /boardroom2/

The `/boardroom2/` directory uses a web component approach:
- Uses `<boardroom/>` custom element
- Module-based JavaScript (`Boardroom.js`)
- Different architecture (component-based vs. include-based)

Both approaches have merit:
- `/boardroom/` - Better for Jekyll integration, server-side rendering
- `/boardroom2/` - Better for client-side state management, reusability

## Usage

This is the main boardroom interface. Access via:
- URL: `/boardroom/`
- Should be linked from main navigation
- Primary user interface for boardroom features

## Files

- `index.html` - Main boardroom page (uses Jekyll front matter)

## Dependencies

Requires Jekyll includes:
- `_includes/boardroom/toggle-strip.html`
- `_includes/boardroom/members-sidebar.html`
- `_includes/chatroom/header.html` (from remote theme)
- `_includes/chatroom/input.html` (from remote theme)
- `_includes/boardroom/chat-area/empty-state.html`

Layout:
- `_layouts/chatroom.html` (from remote theme)

## Last Updated
2026-02-08 - Migrated from `app` layout to `chatroom` layout
