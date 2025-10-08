# Startup Landing Page (Version 2)

This directory contains a startup-focused landing page for Business Infinity.

## Status
- **Active**: No (not currently linked from main navigation)
- **Purpose**: Startup audience targeting
- **Alternative Version**: `/startup/` contains version 1 with 3D animations

## Content Focus

This version targets startups with messaging about:
- Decision drag as the hidden killer
- "Scale your judgment as fast as your product"
- Persistent AI boardroom for startups
- De-risking runway and reducing decision latency

### Key Sections
1. **Hero** - "Your runway deserves more than guesswork"
2. **Problem** - Decision drag, late hires, lost leads
3. **Solution** - Boardroom that never adjourns
4. **Transformation** - From reaction to orchestration
5. **Risk Mitigation** - De-risking approach
6. **Threshold** - Call to action

## Design
- Clean, startup-friendly aesthetic
- Beat-based storytelling ("Every late hire. Every lost lead.")
- Emphasis on speed and decisiveness
- Conversational, relatable tone

## Preservation Rationale

This startup landing page is preserved because:
1. Unique messaging tailored for startup founders
2. Addresses specific startup pain points (burn rate, runway, pivots)
3. Different tone and language than enterprise pages
4. May be useful for startup accelerator partnerships
5. Provides alternative segmentation strategy

## vs /startup/

The original `/startup/` directory contains a more elaborate version:
- 3D animations and interactive elements
- animation-controller.js (17KB)
- scene-manager.js (5.5KB)
- animation-data.js (8KB)
- More visually impressive but heavier
- May have performance implications

**Recommendation**: This version (startup2) is simpler and more performant. The original version's 3D animations are impressive but may be overkill for most use cases.

## Usage

Not currently linked from main navigation. Access via:
- Direct URL: `/startup2/`
- Could be used for startup-specific campaigns
- May be linked from accelerator partnerships

## Technical Notes

- Lightweight implementation (~5.5KB HTML, 1.7KB styles, 1.7KB scripts)
- No heavy animations or 3D libraries
- Fast loading and mobile-friendly
- Easier to maintain than the animation-heavy version

## Files

- `index.html` - Main landing page HTML
- `styles.css` - Startup page styling
- `scripts.js` - Simple interactions

## Migration Consideration

If consolidating to a single startup page:
- Consider using this version as primary (better performance)
- Archive the animation-heavy version for potential future use
- Could add optional animations as progressive enhancement

## Last Updated
2025-01-10
