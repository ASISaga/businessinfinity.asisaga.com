# Feature Inventory and Consolidation Plan

This document tracks all features across the website and provides a plan for consolidating duplicate directories without losing functionality.

## Current Directory Structure Analysis

### Main Pages
1. **/** (index.html) - Main landing page using Jekyll layouts
2. **/features/** - Standalone features page with comprehensive feature descriptions
3. **/about/** - About pages including trust-compliances.html
4. **/trust/** - NEW: Consolidated trust center (replaces/enhances about/trust-compliances.html)

### Application Pages
5. **/boardroom/** - Boardroom interface (older version)
6. **/boardroom2/** - Boardroom interface v2 (newer version)
7. **/dashboard/** - Dashboard with MCP access control and mentor mode
8. **/mentor/** - Mentor mode interface
9. **/chat/** - Chat interface
10. **/onboarding/** - User onboarding flow with trust/compliance features

### Marketing/Pitch Pages
11. **/pitch/** - Pitch presentation (version 1)
12. **/pitch2/** - Pitch presentation (version 2)
13. **/startup/** - Startup-focused landing page (version 1)
14. **/startup2/** - Startup-focused landing page (version 2)
15. **/features2/** - Alternative features page (version 2)
16. **/enterprise/** - Enterprise-focused page
17. **/entrepreneur/** - Entrepreneur-focused page
18. **/network/** - Network features page
19. **/framework/** - Framework page

### Utility Pages
20. **/profile/** - User profile page
21. **/privacy-policy/** - Privacy policy
22. **/roadmap/** - Product roadmap
23. **/bmc/** - Business model canvas
24. **/website/** - Website structure/sitemap
25. **/endpoint/** - Endpoint testing/demo
26. **/conversations/** - Conversations interface
27. **/linkedin-login.html** - LinkedIn OAuth login

### Component Directories
28. **/client/** - Web components (BoardroomChat, McpDashboard, etc.)
29. **/components/** - HTML templates for web components
30. **/templates/** - Reusable templates

### Jekyll Directories
31. **/_includes/** - Liquid template includes
32. **/_sass/** - SCSS modules
33. **/assets/** - JavaScript, CSS, images

---

## Duplicate Features Identified

### 1. Boardroom (boardroom/ vs boardroom2/)

**boardroom/index.html** (871 bytes):
- Minimal implementation
- Likely older version

**boardroom2/index.html** (145 bytes):
- Even more minimal
- Possibly stub/redirect

**Recommendation**: 
- Keep the main boardroom implementation that's used
- Check which one is actually linked from navigation
- Consolidate into single `/boardroom/` directory
- Preserve any unique features from both

### 2. Features (features/ vs features2/)

**features/index.html** (13,954 bytes):
- Comprehensive standalone features page
- Custom styles and scripts
- Well-developed with sections: you, boardroom, agents, unison, ledger, network, integrations, assurance
- Has dedicated styles.css (5,746 bytes) and scripts.js (6,138 bytes)

**features2/index.html** (7,441 bytes):
- Alternative features presentation
- Different structure/approach
- Has app.js, script.js, scripts.js, styles.css

**Recommendation**:
- **Keep**: `/features/` as primary (more comprehensive)
- **Review**: `features2/` for any unique content or better implementations
- **Migrate**: Any superior features from features2 to features
- **Archive or Remove**: features2 after migration

### 3. Pitch (pitch/ vs pitch2/)

**pitch/index.html** (943 bytes):
- Minimal page with app.js (8,745 bytes) and styles
- Likely older version

**pitch2/index.html** (3,424 bytes):
- More content
- Simpler scripts (1,213 bytes)
- Likely newer, cleaner version

**Recommendation**:
- **Keep**: `/pitch2/` as primary (more content)
- **Review**: `pitch/app.js` for any unique functionality
- **Migrate**: Unique features to pitch2
- **Remove**: pitch/ after migration
- **Rename**: pitch2/ → pitch/

### 4. Startup (startup/ vs startup2/)

**startup/index.html** (6,135 bytes):
- Complex with animation controller and 3D scene manager
- Has animation-controller.js, animation-data.js, scene-manager.js
- More sophisticated interactive features

**startup2/index.html** (5,543 bytes):
- Simpler implementation
- Basic scripts (1,725 bytes)
- Likely newer, cleaner version without heavy animations

**Recommendation**:
- **Decision needed**: Which approach is better?
  - startup/ is more impressive (3D animations) but potentially slower/heavier
  - startup2/ is cleaner, faster, more maintainable
- **Recommended**: Keep startup2 as primary, archive startup animations for potential future use
- **Rename**: startup2/ → startup/
- **Archive**: Old startup/ to startup-archived/ or remove

---

## Consolidation Plan

### Phase 1: Immediate Actions (No Breaking Changes)

1. **Create inventory of all navigation links**
   ```bash
   grep -r "href.*boardroom" --include="*.html" --include="*.md"
   grep -r "href.*features" --include="*.html" --include="*.md"
   grep -r "href.*pitch" --include="*.html" --include="*.md"
   grep -r "href.*startup" --include="*.html" --include="*.md"
   ```

2. **Identify active links** - which version is currently used in navigation?

3. **Document unique features** in each duplicate directory

### Phase 2: Content Migration

1. **Features Consolidation**
   - Audit features2 for unique content
   - Migrate any unique features to /features/
   - Test /features/ thoroughly
   - Remove /features2/

2. **Pitch Consolidation**
   - Review pitch/app.js for unique functionality
   - Migrate to pitch2 if needed
   - Rename pitch2 → pitch
   - Remove old pitch/

3. **Startup Consolidation**
   - Evaluate animation value vs performance cost
   - Choose primary version (recommend startup2)
   - Archive or migrate animations
   - Rename startup2 → startup
   - Remove old startup/

4. **Boardroom Consolidation**
   - Identify which version is actually used
   - Verify boardroom/ vs boardroom2/ functionality
   - Consolidate to single /boardroom/
   - Update all links

### Phase 3: Update Navigation & Links

1. Update all navigation menus
2. Update footer links
3. Update README and documentation
4. Update sitemap/website structure
5. Add redirects for old URLs (if needed)

### Phase 4: Testing

1. Test all internal links
2. Test all features in consolidated pages
3. Run Playwright tests
4. Visual regression testing
5. Accessibility testing

---

## Feature Preservation Checklist

Track which features must not be lost during consolidation:

### Features from /features/
- [x] Start with you (personalization)
- [x] Perpetual boardroom
- [x] PhD-grade agents
- [x] Unison toward objectives
- [x] Decision ledger & governance
- [x] Networked value chains
- [x] Integrations (Read/Write/Identity)
- [x] Assurance & safety
- [x] Dark mode toggle
- [x] Sticky ToC navigation
- [x] Reveal animations

### Features from /features2/
- [ ] Review for unique content
- [ ] Check alternative presentation styles
- [ ] Verify any unique functionality

### Features from /pitch/
- [ ] app.js functionality
- [ ] Presentation logic
- [ ] Interactive elements

### Features from /pitch2/
- [ ] Content structure
- [ ] Simpler implementation

### Features from /startup/
- [ ] 3D animations (animation-controller.js)
- [ ] Scene management (scene-manager.js)
- [ ] Animation data

### Features from /startup2/
- [ ] Simplified approach
- [ ] Clean implementation
- [ ] Better performance

### Features from /boardroom/
- [ ] Core boardroom interface
- [ ] Chat functionality
- [ ] Agent interactions

### Features from /boardroom2/
- [ ] Any improvements over v1
- [ ] New features

---

## Navigation Update Requirements

After consolidation, update these files:

### Header Navigation
- [ ] Main index.html
- [ ] Features page header
- [ ] Trust center header
- [ ] All other page headers

### Footer Navigation
- [x] features/index.html (updated with Trust Center link)
- [ ] index.html
- [ ] Other pages

### Documentation
- [ ] README.md
- [ ] docs/specifications.md
- [ ] website_structure.json

---

## Risk Mitigation

### Backup Strategy
1. Create git branch for consolidation work
2. Tag current state before major changes
3. Keep archived versions in separate branch
4. Document rollback procedure

### Testing Strategy
1. Run full test suite before changes
2. Test after each consolidation step
3. Manual testing of all affected pages
4. User acceptance testing (if applicable)

### Communication
1. Update team on consolidation plan
2. Document breaking changes (if any)
3. Provide migration guide for any moved URLs
4. Update external documentation/links

---

## Implementation Timeline

### Week 1: Discovery & Planning
- [x] Create feature inventory
- [ ] Audit all duplicate directories
- [ ] Document unique features
- [ ] Identify active navigation links
- [ ] Get stakeholder approval

### Week 2: Content Migration
- [ ] Migrate features2 → features
- [ ] Migrate pitch → pitch2 → pitch
- [ ] Migrate startup → startup2 → startup
- [ ] Consolidate boardroom directories

### Week 3: Link Updates & Testing
- [ ] Update all navigation
- [ ] Update all internal links
- [ ] Add URL redirects if needed
- [ ] Run full test suite
- [ ] Fix any broken links

### Week 4: Cleanup & Documentation
- [ ] Remove deprecated directories
- [ ] Update documentation
- [ ] Final testing
- [ ] Deployment

---

## Success Metrics

- **Zero Features Lost**: All unique functionality preserved
- **Zero Broken Links**: All navigation works correctly
- **All Tests Pass**: Playwright tests succeed
- **Documentation Updated**: README, specs, and guides current
- **Cleaner Structure**: Reduced from 4 duplicate pairs to 0
- **Easier Maintenance**: Clear single source of truth for each feature

---

## Notes

- This consolidation supports the trust initiative by creating a more coherent, maintainable website
- A unified, consolidated codebase is easier to secure and audit
- Consolidation aligns with "Quality Covenant" in docs/specifications.md
- No features will be deleted - all unique functionality will be preserved and migrated

---

*Document created: 2025-01-XX*
*Last updated: 2025-01-XX*
*Status: Planning phase*
