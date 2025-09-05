import { authHeader } from './utils.js';
import { getApiPath } from '../apiRoutes.js';

class ChatUI {
  constructor() {
    this.agentSelect = document.getElementById('chat-agent');
    this.startBtn = document.getElementById('chat-start-btn');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.msgInp = document.getElementById('chat-input');
    this.msgsDiv = document.getElementById('chat-messages');
    this.convId = null;
    this.init();
  }

  async init() {
    await this.loadAgents();
    this.startBtn.onclick = () => this.startConversation();
    this.sendBtn.onclick = () => this.sendMessage();
  }

  async loadAgents() {
  const { path, method } = getApiPath('getAgents');
  const res = await fetch(path, { method, headers: authHeader() });
    const arr = await res.json();
    arr.forEach(a => this.agentSelect.add(new Option(a.name, a.agentId)));
  }

  async startConversation() {
    const domain = this.agentSelect.value;
    const { path, method } = getApiPath('startConversation');
    const res = await fetch(path, {
      method,
      headers:{'Content-Type':'application/json', ...authHeader()},
      body: JSON.stringify({ domain })
    });
    const body = await res.json();
    this.convId = body.conversationId;
    this.msgsDiv.innerHTML = '';
  }

  async sendMessage() {
    const txt = this.msgInp.value;
    const { path, method } = getApiPath('postConversationMessage', { id: this.convId });
    await fetch(path, {
      method,
      headers:{'Content-Type':'application/json', ...authHeader()},
      body: JSON.stringify({ message: txt })
    });
    this.msgInp.value = '';
    this.loadMsgs();
  }

  async loadMsgs() {
  const { path, method } = getApiPath('getConversationMessages', { id: this.convId });
  const res = await fetch(path, { method, headers: authHeader() });
    const b = await res.json();
    this.msgsDiv.innerHTML = b.messages.map(m =>
      `<div class="msg ${m.type}"><strong>${m.sender}:</strong> ${m.text}</div>`
    ).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ChatUI();
});