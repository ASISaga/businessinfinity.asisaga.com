# CSS Component Partials

This folder contains reusable SCSS partials for UI components in the BusinessInfinity boardroom/chatroom UI. Each partial should:

- Be named with an underscore prefix (e.g., `_chatroom-members-sidebar.scss`)
- Contain styles for a single, isolated component only
- Use a single, descriptive class per element
- Be imported into page SCSS files as needed
- Avoid direct property definitions in page files; use `@extend`, `@include`, or Bootstrap utilities

See `/assets/css/pages/` for page-level SCSS files that import these partials.
