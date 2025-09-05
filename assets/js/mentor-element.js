class MentorElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Load external HTML template
    fetch('/components/mentor-element.html')
      .then(response => response.text())
      .then(html => {
  this.shadowRoot.innerHTML = html;
      });
  }
  connectedCallback() {
    // Mentor logic here
  }
}
customElements.define('mentor-element', MentorElement);
