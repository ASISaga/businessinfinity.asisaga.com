class BoardroomApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    fetch('/components/boardroom-app.html')
      .then(response => response.text())
      .then(html => {
        this.shadowRoot.innerHTML = html;
      });
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
