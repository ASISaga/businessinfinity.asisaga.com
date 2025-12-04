/**
 * SidebarElement Web Component
 * 
 * Note: innerHTML is used here to load trusted HTML templates from same-origin
 * /components/ directory. This is an established pattern for web components
 * loading declarative templates. The template source is server-controlled.
 */
class SidebarElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._loadTemplate();
  }

  async _loadTemplate() {
    try {
      const response = await fetch('/components/sidebar-element.html');
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status}`);
      }
      const html = await response.text();
      // Template loaded from trusted same-origin source
      this.shadowRoot.innerHTML = html;
    } catch (error) {
      console.error('SidebarElement: Template load failed', error);
    }
  }

  connectedCallback() {
    // Example: toggle logic, can be customized
    this.addEventListener('click', () => {
      this.classList.toggle('open');
    });
  }
}
customElements.define('sidebar-element', SidebarElement);
