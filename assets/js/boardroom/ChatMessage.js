export class ChatMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.templateUrl = '/templates/chat-message-template.html';
  }
  setMessage(message) {
    this.message = message;
    this.render();
  }

  async render() {
    if (!this.message) return;
    const response = await fetch(this.templateUrl);
    let templateText = await response.text();
    // Extract template from <template> tag
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = templateText;
    const templateEl = tempDiv.querySelector('template');
    let templateHtml = templateEl ? templateEl.innerHTML : templateText;
    templateHtml = templateHtml
      .replace('{{type}}', this.message.type || '')
      .replace('{{sender}}', this.message.sender || '')
      .replace('{{text}}', this.message.text || '');
    this.shadowRoot.innerHTML = templateHtml;
  }
}

customElements.define('chat-message', ChatMessage);