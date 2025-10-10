# SCSS Import Hierarchy

This document describes the SCSS file structure and import hierarchy for the Business Infinity website.

## Entry Point

- **`_main.scss`** - Main entry point that imports all component and page-specific styles

## Import Tree

```
_main.scss
├── components/ui-utilities
├── components/boardroom/main
│   ├── toggle-strip
│   ├── toggle-strip/icon-white
│   ├── ui-enhancements
│   ├── boardroom-icons
│   ├── members-sidebar/main
│   ├── members-sidebar/container
│   ├── members-sidebar/header
│   ├── members-sidebar/search-form
│   ├── members-sidebar/empty-state
│   ├── members-sidebar/member-status
│   ├── members-sidebar/members
│   ├── chat-area/main
│   ├── chat-area/header
│   ├── chat-area/message-input
│   └── chat-area/empty-state
├── pages/index
├── pages/boardroom
├── pages/boardroom2
├── pages/business-infinity
├── pages/entrepreneur
├── pages/privacy-policy
├── pages/startup
├── pages/chat
├── pages/profiles
├── pages/mentor
└── sections/business-infinity
```

## Directory Structure

```
_sass/
├── _main.scss              # Main entry point
├── components/
│   ├── _ui-utilities.scss  # Common utility classes
│   ├── _boardroom.scss     # [UNUSED] Legacy file
│   └── boardroom/
│       ├── _main.scss                  # Boardroom components aggregator
│       ├── _toggle-strip.scss          # Toggle strip component
│       ├── _toggle-strip-old.scss      # [ARCHIVE] Old version
│       ├── _toggle-strip-new.scss      # [ARCHIVE] Same as current
│       ├── _ui-enhancements.scss       # UI enhancements (loading, toasts)
│       ├── _boardroom-icons.scss       # Icon styles
│       ├── _chat-area.scss             # [EMPTY] Placeholder
│       ├── _members-sidebar.scss       # [EMPTY] Placeholder
│       ├── chat-area/
│       │   ├── _main.scss              # Chat area container
│       │   ├── _header.scss            # Chat header
│       │   ├── _message-input.scss     # Message input
│       │   └── _empty-state.scss       # Empty state
│       ├── members-sidebar/
│       │   ├── _main.scss              # Sidebar container
│       │   ├── _container.scss         # Sidebar wrapper
│       │   ├── _header.scss            # Sidebar header
│       │   ├── _search-form.scss       # Member search
│       │   ├── _empty-state.scss       # Empty state
│       │   ├── _member-status.scss     # Member status badges
│       │   └── _members.scss           # Member list items
│       └── toggle-strip/
│           └── _icon-white.scss        # Icon utilities
├── pages/
│   ├── index.scss              # Boardroom page styles (Note: file comments say "Boardroom page styles")
│   ├── _boardroom.scss         # Boardroom page
│   ├── _boardroom2.scss        # Alternative boardroom page
│   ├── _business-infinity.scss # Business Infinity page
│   ├── _entrepreneur.scss      # Entrepreneur page
│   ├── _privacy-policy.scss    # Privacy policy page
│   ├── _startup.scss           # Startup page
│   ├── _chat.scss              # Chat page
│   ├── _profiles.scss          # Profiles page
│   └── _mentor.scss            # Mentor page
└── sections/
    └── _business-infinity.scss # Business Infinity section styles
```

## File Naming Conventions

- Files starting with `_` are **partials** and can be imported
- Files without `_` are **entry points** that can be compiled directly
- When importing, the `_` prefix is omitted: `@import "pages/boardroom"` finds `pages/_boardroom.scss`

## Legacy/Archive Files

The following files are present but not imported (archived versions or placeholders):

- `components/_boardroom.scss` - Legacy aggregator, superseded by `components/boardroom/_main.scss`
- `components/boardroom/_chat-area.scss` - Empty placeholder
- `components/boardroom/_members-sidebar.scss` - Empty placeholder
- `components/boardroom/_toggle-strip-old.scss` - Archived version with extra content
- `components/boardroom/_toggle-strip-new.scss` - Identical to `_toggle-strip.scss`

## Dependencies

Most SCSS files depend on:
- Bootstrap variables and mixins
- Remote theme variables from `theme.asisaga.com`
- Jekyll SCSS compilation

## Compilation

The SCSS files are compiled by Jekyll during the GitHub Pages build process. The main entry point (`_main.scss`) is imported by Jekyll layouts or compiled separately.

## Standalone SCSS Files

The following SCSS files exist outside the `_sass` directory and are compiled independently:

- `trust/trust-styles.scss` - Styles for the Trust Center page

These files are not part of the main import hierarchy and are included directly in their respective pages.

## Notes

- The `components/_boardroom.scss` file exists but is not used. It was superseded by `components/boardroom/_main.scss`.
- Empty placeholder files (`_chat-area.scss`, `_members-sidebar.scss`) exist in `components/boardroom/` but are not imported because the actual implementations are in subdirectories.
- Archive files (`_toggle-strip-old.scss`, `_toggle-strip-new.scss`) are kept for reference but not imported.

## Last Updated

2025-10-10
