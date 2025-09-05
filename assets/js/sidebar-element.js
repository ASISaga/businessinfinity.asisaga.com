class SidebarElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    fetch('/components/sidebar-element.html')
      .then(response => response.text())
      .then(html => {
        this.shadowRoot.innerHTML = html;
      });
  }
  connectedCallback() {
    // Example: toggle logic, can be customized
    this.addEventListener('click', () => {
      this.classList.toggle('open');
    });
  }
}
customElements.define('sidebar-element', SidebarElement);
