import { API, authHeader } from './utils.js';

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
    const res = await fetch(`${API}/agents`, { headers: authHeader() });
    const arr = await res.json();
    arr.forEach(a => this.agentSelect.add(new Option(a.name, a.agentId)));
  }

  async startConversation() {
    const domain = this.agentSelect.value;
    const res = await fetch(`${API}/conversations`, {
      method:'POST',
      headers:{'Content-Type':'application/json', ...authHeader()},
      body: JSON.stringify({ domain })
    });
    const body = await res.json();
    this.convId = body.conversationId;
    this.msgsDiv.innerHTML = '';
  }

  async sendMessage() {
    const txt = this.msgInp.value;
    await fetch(`${API}/conversations/${this.convId}/messages`, {
      method:'POST',
      headers:{'Content-Type':'application/json', ...authHeader()},
      body: JSON.stringify({ message: txt })
    });
    this.msgInp.value = '';
    this.loadMsgs();
  }

  async loadMsgs() {
    const res = await fetch(`${API}/conversations/${this.convId}/messages`, { headers: authHeader() });
    const b = await res.json();
    this.msgsDiv.innerHTML = b.messages.map(m =>
      `<div class="msg ${m.type}"><strong>${m.sender}:</strong> ${m.text}</div>`
    ).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ChatUI();
});