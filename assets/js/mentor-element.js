/**
 * MentorElement Web Component
 * 
 * Note: innerHTML is used here to load trusted HTML templates from same-origin
 * /components/ directory. This is an established pattern for web components
 * loading declarative templates. The template source is server-controlled.
 */
class MentorElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._loadTemplate();
  }

  async _loadTemplate() {
    try {
      const response = await fetch('/components/mentor-element.html');
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status}`);
      }
      const html = await response.text();
      // Template loaded from trusted same-origin source
      this.shadowRoot.innerHTML = html;
    } catch (error) {
      console.error('MentorElement: Template load failed', error);
    }
  }

  connectedCallback() {
    // Mentor logic here
  }
}
customElements.define('mentor-element', MentorElement);
