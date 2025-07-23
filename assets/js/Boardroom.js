// BoardroomApp: Main web component for the boardroom chat interface
// Handles agent list, profile details, chat messages, and LinkedIn login

import { BoardroomAPI, API } from './boardroomApi.js';
import { AgentProfileCard } from './AgentProfileCard.js';
import { AgentListItem } from './AgentListItem.js';
import { ChatMessage } from './ChatMessage.js';
import page from 'page';

class Boardroom extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
    // API and state
    this.api = new BoardroomAPI();
    this.convId = null;
    this.currentAgent = null;
    // Template helpers (not used directly for DOM creation)
    this.agentProfileCard = new AgentProfileCard();
    this.agentListItem = new AgentListItem();
    this.chatMessage = new ChatMessage();
  }

  async connectedCallback() {
    
    // Set up Page.js routes for chat/profile views
    page('/chat', () => this.showChat());
    page('/profile/:agentId', ctx => this.showProfile(ctx.params.agentId));
    page();

    // Load boardroom UI template from external HTML file
    const template = await fetch('/templates/boardroom-app.html').then(r => r.text());
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;
    const templateEl = tempDiv.querySelector('template');
    this.shadowRoot.appendChild(templateEl.content.cloneNode(true));

    // Get references to key DOM elements in the shadow root
    this.agentList = this.shadowRoot.getElementById('boardroom-list');
    this.agentDetailCard = this.shadowRoot.querySelector('#profile-detail .card-body');
    this.chatMessages = this.shadowRoot.getElementById('chat-messages');
    this.chatInput = this.shadowRoot.getElementById('chat-input');
    this.sendMessageButton = this.shadowRoot.getElementById('chat-send-btn');
    this.linkedinLoginButton = this.shadowRoot.getElementById('linkedin-login-btn');

    // LinkedIn Login Button Logic
    // Redirects user to LinkedIn OAuth when clicked
    if (this.linkedinLoginButton) {
      this.linkedinLoginButton.onclick = () => {
        window.location.href = `${API}/auth/linkedin`;
      };
    }

    // Load C-suite avatars using <agent-list-item> web component
    // Each agent is rendered as a custom element in the sidebar
    const agents = await this.api.getAgents();
    for (const agent of agents) {
      const agentListItem = document.createElement('agent-list-item');
      agentListItem.setAgent(agent);
      agentListItem.dataset.id = agent.agentId;
      agentListItem.onclick = () => {
        page.show(`/profile/${agent.agentId}`);
      };
      this.agentList.appendChild(agentListItem);
    }

    // Set up chat send button and periodic message refresh
    this.sendMessageButton.onclick = () => this.sendMessage();
    this._msgInterval = setInterval(() => this.loadMsgs(), 3000);
  }

  // Show profile view for selected agent (called by router)
  async showProfile(agentId) {
    // UI highlight for selected agent
    this.agentList.querySelectorAll('li').forEach(li=>li.classList.remove('active'));
    const agentListItem = this.agentList.querySelector(`[data-id="${agentId}"]`);
    if (agentListItem) agentListItem.classList.add('active');

    this.currentAgent = agentId;
    // Fetch full profile for selected agent
    const agentProfile = await this.api.getAgentProfile(agentId);

    // Render agent profile using <agent-profile-card> web component
    this.agentDetailCard.innerHTML = '';
    const profileCard = document.createElement('agent-profile-card');
    profileCard.setProfile(agentProfile);
    this.agentDetailCard.appendChild(profileCard);

    // Start (or reset) conversation with selected agent
    const conv = await this.api.startConversation(agentId);
    this.convId = conv.conversationId;
    this.chatMessages.innerHTML = '';
    // Optionally, navigate to chat view after profile
    // this.router.navigate('chat');
  }

  // Show chat view (called by router)
  async showChat() {
    await this.loadMsgs();
  }

  // Sends a chat message to the current agent
  async sendMessage() {
    const text = this.chatInput.value.trim();
    if (!text || !this.convId) return;
    await this.api.sendMessage(this.convId, text);
    this.chatInput.value = '';
    this.loadMsgs();
  }

  // Loads and renders chat messages for the current conversation
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

  // Clean up interval when component is removed from DOM
  disconnectedCallback() {
    if (this._msgInterval) clearInterval(this._msgInterval);
  }
}

customElements.define('boardroom', Boardroom);