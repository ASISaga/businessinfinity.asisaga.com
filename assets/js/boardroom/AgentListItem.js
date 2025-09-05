export class AgentListItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.templateUrl = '/templates/agent-list-item-template.html';
  }

  setAgent(agent) {
    this.agent = agent;
    this.render();
  }

  async render() {
    if (!this.agent) return;
    const response = await fetch(this.templateUrl);
    let templateText = await response.text();
    // Extract template from <template> tag
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = templateText;
    const templateEl = tempDiv.querySelector('template');
    let templateHtml = templateEl ? templateEl.innerHTML : templateText;
    templateHtml = templateHtml
      .replace('{{photo}}', this.agent.photo || '')
      .replace('{{name}}', this.agent.name || '');
    this.shadowRoot.innerHTML = templateHtml;
  }
}

customElements.define('agent-list-item', AgentListItem);
