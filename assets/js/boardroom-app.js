/**
 * BoardroomApp Web Component
 * 
 * Note: innerHTML is used here to load trusted HTML templates from same-origin
 * /components/ directory. This is an established pattern for web components
 * loading declarative templates. The template source is server-controlled.
 */
class BoardroomApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._loadTemplate();
  }

  async _loadTemplate() {
    try {
      const response = await fetch('/components/boardroom-app.html');
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status}`);
      }
      const html = await response.text();
      // Template loaded from trusted same-origin source
      this.shadowRoot.innerHTML = html;
    } catch (error) {
      console.error('BoardroomApp: Template load failed', error);
    }
  }

  connectedCallback() {
    // Boardroom app logic here
    // Example: initialize Boardroom
    if (window.Boardroom) {
      const app = new window.Boardroom();
      app.init();
    }
  }
}
customElements.define('boardroom-app', BoardroomApp);
