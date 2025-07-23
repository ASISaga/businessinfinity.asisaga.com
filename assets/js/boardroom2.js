
import { BoardroomAPI, API } from './boardroomApi.js';
import { AgentProfileTemplate } from './AgentProfileTemplate.js';
import { AgentListItemTemplate } from './AgentListItemTemplate.js';
import { ChatMessageTemplate } from './ChatMessageTemplate.js';

class BoardroomApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.api = new BoardroomAPI();
    this.convId = null;
    this.currentAgent = null;
    this.agentProfileTemplate = new AgentProfileTemplate();
    this.agentListItemTemplate = new AgentListItemTemplate();
    this.chatMessageTemplate = new ChatMessageTemplate();
  }

  async connectedCallback() {
    // Load template
    const template = await fetch('/templates/boardroom-app.html').then(r => r.text());
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;
    const templateEl = tempDiv.querySelector('template');
    this.shadowRoot.appendChild(templateEl.content.cloneNode(true));

    // Semantic element references
    this.agentList = this.shadowRoot.getElementById('boardroom-list');
    this.agentDetailCard = this.shadowRoot.querySelector('#profile-detail .card-body');
    this.chatMessages = this.shadowRoot.getElementById('chat-messages');
    this.chatInput = this.shadowRoot.getElementById('chat-input');
    this.sendMessageButton = this.shadowRoot.getElementById('chat-send-btn');
    this.linkedinLoginButton = this.shadowRoot.getElementById('linkedin-login-btn');

    // LinkedIn Login Button Logic
    if (this.linkedinLoginButton) {
      this.linkedinLoginButton.onclick = () => {
        window.location.href = `${API}/auth/linkedin`;
      };
    }

    // Load C-suite avatars using <agent-list-item> web component
    const agents = await this.api.getAgents();
    for (const agent of agents) {
      const agentListItem = document.createElement('agent-list-item');
      agentListItem.setAgent(agent);
      agentListItem.dataset.id = agent.agentId;
      agentListItem.onclick = () => this.selectAgent(agent.agentId, agentListItem);
      this.agentList.appendChild(agentListItem);
    }

    this.sendMessageButton.onclick = () => this.sendMessage();
    this._msgInterval = setInterval(() => this.loadMsgs(), 3000);
  }

  async selectAgent(agentId, agentListItem) {
    // UI highlight
    this.agentList.querySelectorAll('li').forEach(li=>li.classList.remove('active'));
    agentListItem.classList.add('active');

    this.currentAgent = agentId;
    // Fetch full profile
    const agentProfile = await this.api.getAgentProfile(agentId);

    // Render detail using <agent-profile-card> web component
    this.agentDetailCard.innerHTML = '';
    const profileCard = document.createElement('agent-profile-card');
    profileCard.setProfile(agentProfile);
    this.agentDetailCard.appendChild(profileCard);

    // Start (or reset) conversation
    const conv = await this.api.startConversation(agentId);
    this.convId = conv.conversationId;
    this.chatMessages.innerHTML = '';
  }

  async sendMessage() {
    const text = this.chatInput.value.trim();
    if (!text || !this.convId) return;
    await this.api.sendMessage(this.convId, text);
    this.chatInput.value = '';
    this.loadMsgs();
  }

  async loadMsgs() {
    if (!this.convId) return;
    const messages = await this.api.getMessages(this.convId);
    this.chatMessages.innerHTML = '';
    for (const message of messages) {
      const msgEl = document.createElement('chat-message');
      msgEl.setMessage(message);
      this.chatMessages.appendChild(msgEl);
    }
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  disconnectedCallback() {
    if (this._msgInterval) clearInterval(this._msgInterval);
  }
}

customElements.define('boardroom-app', BoardroomApp);