# CSS Page Partials

This folder contains page-specific SCSS files for the BusinessInfinity boardroom/chatroom UI. Each SCSS file should only contain layout or page-level structure, and import all relevant component partials from `../components/`.

- Use `@import` to include component partials.
- Do not write direct CSS property definitions in page files; use `@extend`, `@include`, or Bootstrap utilities.
- All page files must use a single, descriptive class per element.
- See `/assets/css/components/` for reusable UI component partials.
