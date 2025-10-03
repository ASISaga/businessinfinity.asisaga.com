# Test Plan

This plan ensures that all specifications are validated through automated and manual tests.

---

## 1. Core Page Health
- [ ] Homepage and all key routes load successfully.  
- [ ] `<title>` and `<h1>` populated from Liquid variables.  
- [ ] Meta tags (SEO, OpenGraph, canonical) rendered correctly.  

---

## 2. Navigation & Layout
- [ ] Bootstrap navbar collapses/expands correctly at all breakpoints.  
- [ ] Liquid‑generated menus produce valid links.  
- [ ] Footer and sidebar links resolve without 404s.  

---

## 3. Styling & SCSS
- [ ] Compiled CSS3 applied without missing stylesheets.  
- [ ] SCSS variables and mixins reflected in UI.  
- [ ] Responsive layouts verified across mobile, tablet, desktop.  

---

## 4. JavaScript (ES6)
- [ ] ES6 modules load without syntax errors.  
- [ ] Bootstrap JS components (modals, dropdowns, accordions) function correctly.  
- [ ] No console errors on page load or interaction.  
- [ ] OpenAPI spec loads successfully from backend.  
- [ ] `apiRoutes.js` helper functions (`buildApiUrl`, `getApiPath`) resolve correctly.  
- [ ] API operations resolved by `operationId` from OpenAPI spec.  
- [ ] Authentication headers included in API requests.  
- [ ] Web component templates load from `/components/` directory.  
- [ ] Shadow DOM isolation maintains component encapsulation.  
- [ ] Event delegation and handlers function correctly.  

---

## 5. Web Components
- [ ] Custom elements render and upgrade correctly.  
- [ ] Shadow DOM encapsulation does not break global styles.  
- [ ] Attributes and properties reflect correctly in rendered output.  
- [ ] `<boardroom-chat>` component initializes and polls for messages.  
- [ ] `<mcp-dashboard>` component renders role-based UI from backend schema.  
- [ ] `<aml-demo>` component handles inference and training form submissions.  
- [ ] `<sidebar-element>`, `<dashboard-panel>`, `<mentor-element>`, `<boardroom-app>` load templates correctly.  
- [ ] Component lifecycle methods (`connectedCallback`, `disconnectedCallback`) execute properly.  
- [ ] Event handlers attached to components function without errors.  

---

## 6. Boardroom Chat Interface
- [ ] Onboarding prompts render correctly and guide user setup.  
- [ ] Schema validation enforces role assignment and covenant acceptance.  
- [ ] Messages tagged with roles and speech‑act types.  
- [ ] Decisions logged as covenant‑compliant records.  
- [ ] Threading supports sagas and arbitration flows.  
- [ ] Real-time polling fetches new messages every 5 seconds.  
- [ ] Message rendering includes sender, timestamp, and escaped payload.  
- [ ] `since` parameter correctly tracks last message for incremental updates.  
- [ ] HTML escaping prevents XSS vulnerabilities in message display.  
- [ ] Agent selection dropdown populates from backend API.  
- [ ] Conversation can be started with selected agent domain.  
- [ ] Messages can be sent and appear in chat log.  
- [ ] Loading states and error handling function correctly.  

---

## 7. Accessibility
- [ ] Semantic HTML5 structure verified.  
- [ ] ARIA roles applied to chat log, input box, and Bootstrap components.  
- [ ] All images include descriptive `alt` attributes.  
- [ ] Text contrast meets WCAG AA standards.  
- [ ] Full keyboard navigation supported.  

---

## 8. Visual Consistency
- [ ] Baseline screenshots captured for homepage, covenant pages, and chat interface.  
- [ ] Visual regression tests detect unintended SCSS or Bootstrap changes.  
- [ ] Responsive layouts validated across viewport sizes.  

---

## 9. Performance
- [ ] Page load time < 2 seconds on standard broadband.  
- [ ] CSS and JS minified and cached.  
- [ ] Images optimized and responsive.  
- [ ] No blocking scripts in `<head>`.  

---

## 10. Roles & Interaction Dynamics
- [ ] Founder messages tagged and logged correctly.  
- [ ] Investor oversight actions validated.  
- [ ] C‑Suite reports and escalations logged.  
- [ ] Consensus rituals recorded as covenant‑compliant resolutions.

---

## 11. API Integration
- [ ] Backend API accessible at `cloud.businessinfinity.asisaga.com`.  
- [ ] OpenAPI specification loads from `/openapi.json` endpoint.  
- [ ] `getAgents` operation returns valid agent list.  
- [ ] `startConversation` operation creates new conversation with domain.  
- [ ] `postConversationMessage` operation sends messages successfully.  
- [ ] `getConversationMessages` operation retrieves conversation history.  
- [ ] Dashboard endpoint returns role-based UI schemas.  
- [ ] AML endpoints (`/aml/infer`, `/aml/train`) handle requests correctly.  
- [ ] Authentication tokens included in protected endpoints.  
- [ ] Error responses handled gracefully with user feedback.  
- [ ] API responses conform to OpenAPI schema definitions.