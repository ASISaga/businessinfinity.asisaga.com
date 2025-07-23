export class AgentProfileTemplate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.templateUrl = '/templates/agent-profile-template.html';
  }

  setProfile(profile) {
    this.profile = profile;
    this.render();
  }

  async render() {
    if (!this.profile) return;
    const response = await fetch(this.templateUrl);
    let templateText = await response.text();
    // Extract template from <template> tag
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = templateText;
    const templateEl = tempDiv.querySelector('template');
    let templateHtml = templateEl ? templateEl.innerHTML : templateText;
    templateHtml = templateHtml
      .replace('{{name}}', this.profile.name || '')
      .replace('{{purpose}}', this.profile.purpose || '')
      .replace('{{profile}}', this.profile.profile || '')
      .replace('{{domains}}', (this.domainsToHtml() || ''))
      .replace('{{context}}', (this.contextToHtml() || ''));
    this.shadowRoot.innerHTML = templateHtml;
  }

  domainsToHtml() {
    const domains = this.profile.domains;
    if (!domains) return '';
    try {
      return domains.map(d => `<li>${d}</li>`).join('');
    } catch {
      return '';
    }
  }

  contextToHtml() {
    const context = this.profile.context;
    if (!context) return '';
    try {
      return context.map(c => `<li>${c}</li>`).join('');
    } catch {
      return '';
    }
  }

  domainsToHtml() {
    const domains = this.getAttribute('domains');
    if (!domains) return '';
    try {
      const arr = JSON.parse(domains);
      return arr.map(d => `<li>${d}</li>`).join('');
    } catch {
      return '';
    }
  }

  contextToHtml() {
    const context = this.getAttribute('context');
    if (!context) return '';
    try {
      const arr = JSON.parse(context);
      return arr.map(c => `<li>${c}</li>`).join('');
    } catch {
      return '';
    }
  }
}

customElements.define('agent-profile-card', AgentProfileTemplate);
