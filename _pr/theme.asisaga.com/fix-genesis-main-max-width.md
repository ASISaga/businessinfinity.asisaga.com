# Theme PR: Fix `.genesis-main` max-width bleed

**Target repo**: `ASISaga/theme.asisaga.com`  
**File**: `_sass/components/core/_genesis-core.scss`  
**Priority**: High — causes content-width regression on all subdomains

## Problem

When subdomain page SCSS files use unscoped element selectors such as:

```scss
main {
  @include genesis-environment('focused');  // sets max-width: 70ch
}
```

the rule cascades to the `<main class="genesis-main">` element rendered by the
theme's `default.html` layout. Even though `.genesis-main` sets `width: 100%`,
that does **not** override a subsequent `max-width: 70ch` on the same element,
because `max-width` and `width` are separate properties and `max-width` wins
whenever the computed `width` exceeds it.

Result: page content is capped at `70ch ≈ 564.375px` on desktop, regardless of
viewport width.

## Root cause (confirmed in compiled CSS)

```css
/* From subdomain pages/_about.scss — unscoped, bleeds to all pages */
main {
  display: grid;
  grid-template-columns: 1fr;
  max-width: var(--width-reading, 70ch);   /* ← 564.375px at 16px */
  margin-inline: auto;
  …
}

/* From theme _genesis-core.scss — width: 100% does NOT cancel max-width */
.genesis-main {
  display: grid;
  grid-template-columns: 1fr;
  padding: 0;
  margin: 0;
  width: 100%;    /* ← does NOT override max-width from the rule above */
}
```

## Fix

Add `max-width: none` to `.genesis-main` in `_genesis-core.scss`.  Class
selectors (specificity `0,1,0`) outweigh element selectors (specificity
`0,0,1`), so `.genesis-main { max-width: none }` beats any `main { max-width: …
}` rule regardless of source order.

### Diff for `_sass/components/core/_genesis-core.scss`

```diff
 .genesis-main {
   @include genesis-environment('chronological');
 
   padding: 0;
   margin: 0;
   width: 100%;
+  max-width: none;   // Prevent page-level main{} rules from constraining layout
 
   // Focus management for skip link
   &:focus {
     outline: none;
   }
 }
```

## Why both fixes are needed

| Fix | Layer | Effect |
|-----|-------|--------|
| Subdomain: remove unscoped `main {}` and `section {}` from page SCSS | Subdomain | Removes the erroneous global rule |
| Theme: add `max-width: none` to `.genesis-main` | Theme | Defense-in-depth — ensures genesis-main is never accidentally narrowed by page-level element rules in any subdomain |

The subdomain fix (already applied in this PR) addresses the root cause.
The theme fix ensures robustness against the same class of error across all
subdomains now and in the future.

## References

- Affected subdomain files (fixed): `_sass/pages/_about.scss`, `_sass/pages/_bmc.scss`, `_sass/pages/_client.scss`
- Theme file to patch: `_sass/components/core/_genesis-core.scss` (`.genesis-main` block)
- `genesis-environment('focused')` definition: `_sass/ontology/engines/_environment.scss`
