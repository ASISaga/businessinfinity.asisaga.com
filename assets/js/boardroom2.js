import { API, authHeader } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const listEl = document.getElementById('boardroom-list');
  const detailEl = document.querySelector('#profile-detail .card-body');
  const msgsEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  let convId, currentAgent;

  // 1) Load C-suite avatars
  const agents = await fetch(`${API}/agents`, { headers: authHeader() })
                     .then(r=>r.json());

  agents.forEach(a => {
    const li = document.createElement('li');
    li.dataset.id = a.agentId;
    li.innerHTML = `<img src="${a.photo}" class="card-img-top mb-1"/> 
                    <strong>${a.name}</strong>`;
    listEl.appendChild(li);
    li.onclick = () => selectAgent(a.agentId, li);
  });

  // 2) On avatar click: highlight + fetch detail + start conv
  async function selectAgent(agentId, liEl) {
    // UI highlight
    listEl.querySelectorAll('li').forEach(li=>li.classList.remove('active'));
    liEl.classList.add('active');

    currentAgent = agentId;
    // Fetch full profile
    const data = await fetch(`${API}/agents/${agentId}`, { headers: authHeader() })
                      .then(r=>r.json());

    // Render detail
    detailEl.innerHTML = `
      <h5>${data.name}</h5>
      <p><em>${data.purpose}</em></p>
      <p>${data.profile}</p>
      <h6>Domains:</h6>
      <ul>${data.domains.map(d=><li>${d}</li>).join('')}</ul>
      <h6>Context:</h6>
      <ul class="context">${data.context.map(l=><li>${l}</li>).join('')}</ul>
    `;

    // Start (or reset) conversation
    const res = await fetch(`${API}/conversations`, {
      method: 'POST',
      headers: {'Content-Type':'application/json', ...authHeader()},
      body: JSON.stringify({ domain: agentId })
    });
    convId = (await res.json()).conversationId;
    msgsEl.innerHTML = '';
  }

  // 3) Send message
  sendBtn.onclick = async () => {
    const text = inputEl.value.trim();
    if (!text || !convId) return;
    await fetch(`${API}/conversations/${convId}/messages`, {
      method: 'POST',
      headers: {'Content-Type':'application/json', ...authHeader()},
      body: JSON.stringify({ message: text })
    });
    inputEl.value = '';
    loadMsgs();
  };

  // 4) Poll messages
  setInterval(loadMsgs, 3000);
  async function loadMsgs() {
    if (!convId) return;
    const msgs = await fetch(`${API}/conversations/${convId}/messages`, { headers: authHeader() })
                       .then(r=>r.json())
                       .then(b=>b.messages);
    msgsEl.innerHTML = msgs.map(m => 
      `<div class="msg ${m.type}"><strong>${m.sender}</strong>: ${m.text}</div>`
    ).join('');
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
});