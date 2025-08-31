const HOST = location.origin.replace('businessinfinity', 'cloud.businessinfinity');
const BOARDROOM_ID = 'business-infinity';
const CONV_ID = 'default';

class BoardroomChat extends HTMLElement {
  constructor(){ super(); this.interval = null; this.lastKey = null; this.attachShadow({mode:'open'}); }
  connectedCallback(){ this.render(); this.startPolling(); }
  disconnectedCallback(){ clearInterval(this.interval); }
  render(){
    this.shadowRoot.innerHTML = `<div class="panel"><h3>Chat</h3><div id="msgs"></div></div>`;
    const style = document.createElement('style');
    style.textContent = `:host{display:block}.panel{border:1px solid #e5e7eb;border-radius:8px;padding:12px}.msg{padding:8px;border-bottom:1px solid #eee}.meta{color:#6b7280;font-size:12px}`;
    this.shadowRoot.appendChild(style);
  }
  async poll(){
    const qs = new URLSearchParams({ boardroomId: BOARDROOM_ID, conversationId: CONV_ID });
    if (this.lastKey) qs.set('since', this.lastKey);
    const res = await fetch(`${HOST}/messages?${qs}`, { cache: 'no-store' });
    const data = await res.json();
    const msgs = data.messages || [];
    if (!msgs.length) return;
    const list = this.shadowRoot.querySelector('#msgs');
    for (const m of msgs) {
      const div = document.createElement('div');
      div.className = 'msg';
      div.innerHTML = `<div class="meta">${m.senderAgentId} • ${new Date(m.timestamp*1000).toLocaleString()}</div><div>${escapeHtml(JSON.stringify(m.payload))}</div>`;
      list.appendChild(div);
      this.lastKey = `${Math.floor(m.timestamp*1000).toString().padStart(13,'0')}-${m.messageId}`;
    }
  }
  startPolling(){ this.interval = setInterval(()=>this.poll().catch(()=>{}), 5000); this.poll(); }
}

function escapeHtml(s){ return s.replace(/[&<>"]|'|/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
