class DashboardPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    fetch('/components/dashboard-panel.html')
      .then(response => response.text())
      .then(html => {
        this.shadowRoot.innerHTML = html;
      });
  }
  connectedCallback() {
    // Dashboard logic here
  }
}
customElements.define('dashboard-panel', DashboardPanel);
