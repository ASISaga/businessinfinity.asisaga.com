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
├── pages/startup1
├── pages/startup2
├── pages/chat
├── pages/profiles
├── pages/mentor
├── pages/about
├── pages/features
├── pages/features2
├── pages/trust
├── pages/enterprise
├── pages/network
├── pages/pitch
├── pages/pitch1
├── pages/framework
├── pages/bmc
├── pages/dashboard
├── pages/mcp-access-control
├── pages/mentor-mode
├── pages/onboarding
├── pages/conversations
├── pages/client
├── pages/roadmap
├── pages/website
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
│   ├── index.scss              # Main index page
│   ├── _boardroom.scss         # Boardroom page
│   ├── _boardroom2.scss        # Alternative boardroom page
│   ├── _business-infinity.scss # Business Infinity page
│   ├── _entrepreneur.scss      # Entrepreneur page
│   ├── _privacy-policy.scss    # Privacy policy page
│   ├── _startup.scss           # Startup page (original)
│   ├── _startup1.scss          # Startup page variant 1
│   ├── _startup2.scss          # Startup page variant 2
│   ├── _chat.scss              # Chat page
│   ├── _profiles.scss          # Profiles page
│   ├── _mentor.scss            # Mentor page
│   ├── _about.scss             # About page
│   ├── _features.scss          # Features page (primary)
│   ├── _features2.scss         # Features page variant 2
│   ├── _trust.scss             # Trust Center page
│   ├── _enterprise.scss        # Enterprise page
│   ├── _network.scss           # Network page
│   ├── _pitch.scss             # Pitch page (pitch2 consolidated)
│   ├── _pitch1.scss            # Pitch page variant 1
│   ├── _framework.scss         # Framework page
│   ├── _bmc.scss               # Business model canvas page
│   ├── _dashboard.scss         # Dashboard page
│   ├── _mcp-access-control.scss # MCP Access Control dashboard
│   ├── _mentor-mode.scss       # Mentor Mode dashboard
│   ├── _onboarding.scss        # Onboarding page
│   ├── _conversations.scss     # Conversations page
│   ├── _client.scss            # Client components page
│   ├── _roadmap.scss           # Roadmap page
│   └── _website.scss           # Website structure page
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

All SCSS files have been consolidated into the `_sass` directory. Entry point files are created in `/assets/css/pages/` for each page, which import from `_sass/pages/`.

For example, `/assets/css/pages/features.scss` imports `@import "pages/features";` which resolves to `_sass/pages/_features.scss`.

## Compilation

The SCSS files are compiled by Jekyll during the GitHub Pages build process. Entry point files in `/assets/css/pages/` are compiled to CSS and linked from HTML pages.

## Notes

- All CSS files have been converted to SCSS and moved to `_sass/pages/`
- JavaScript files have been consolidated to `/assets/js/` directory with subdirectories for each page/component
- Original CSS and JS files remain in their original locations for backward compatibility
- The `components/_boardroom.scss` file exists but is not used. It was superseded by `components/boardroom/_main.scss`.
- Empty placeholder files (`_chat-area.scss`, `_members-sidebar.scss`) exist in `components/boardroom/` but are not imported because the actual implementations are in subdirectories.
- Archive files (`_toggle-strip-old.scss`, `_toggle-strip-new.scss`) are kept for reference but not imported.

## Last Updated

2025-10-10 (CSS/JS consolidation completed)
