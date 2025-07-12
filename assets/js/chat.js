import { API, authHeader } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const agentSelect = document.getElementById('chat-agent');
  const startBtn = document.getElementById('chat-start-btn');
  const sendBtn = document.getElementById('chat-send-btn');
  const msgInp = document.getElementById('chat-input');
  const msgsDiv = document.getElementById('chat-messages');
  let convId;

  // load agents
  fetch(`${API}/agents`, { headers: authHeader() })
    .then(r=>r.json())
    .then(arr => {
      arr.forEach(a => agentSelect.add(new Option(a.name, a.agentId)));
    });

  startBtn.onclick = async () => {
    const domain = agentSelect.value;
    const res = await fetch(`${API}/conversations`, {
      method:'POST',
      headers:{'Content-Type':'application/json', ...authHeader()},
      body: JSON.stringify({ domain })
    });
    const body = await res.json();
    convId = body.conversationId;
    msgsDiv.innerHTML = '';
  };

  sendBtn.onclick = async () => {
    const txt = msgInp.value;
    await fetch(`${API}/conversations/${convId}/messages`, {
      method:'POST',
      headers:{'Content-Type':'application/json', ...authHeader()},
      body: JSON.stringify({ message: txt })
    });
    msgInp.value = '';
    loadMsgs();
  };

  function loadMsgs() {
    fetch(`${API}/conversations/${convId}/messages`, { headers: authHeader() })
      .then(r=>r.json())
      .then(b => {
        msgsDiv.innerHTML = b.messages.map(m=>
          <div class="msg ${m.type}"><strong>${m.sender}:</strong> ${m.text}</div>
        ).join('');
      });
  }
});