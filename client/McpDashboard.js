const HOST = location.origin.replace('businessinfinity', 'cloud.businessinfinity');
const BOARDROOM_ID = 'business-infinity';
const CONV_ID = 'default';

class McpDashboard extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:'open'}); }
  async connectedCallback(){
    const role = this.getAttribute('role') || 'CMO';
    const scope = this.getAttribute('scope') || 'local';
    const res = await fetch(`${HOST}/dashboard?role=${role}&scope=${scope}`);
    const { uiSchema } = await res.json();
    this.render(uiSchema);
  }
  render(schema){
    const panels = (schema.panels||[]).map(p => `
      <div class="panel">
        <h3>${p.title}</h3>
        ${p.actions.map(a => `
          <form data-agent="${a.agentId}" data-action="${a.id}">
            ${Object.entries(a.argsSchema||{}).map(([k,def]) => `
              <label>${k}</label>
              ${def.enum ? `<select name="${k}">${def.enum.map(v=>`<option value="${v}">${v}</option>`).join('')}</select>` : `<input name="${k}" type="text" />`}
            `).join('')}
            <button type="submit">${a.label}</button>
          </form>
        `).join('')}
      </div>`).join('');
    this.shadowRoot.innerHTML = `<div>${panels}</div>`;
    this.shadowRoot.querySelectorAll('form').forEach(f => f.addEventListener('submit', e => this.submit(e)));
  }
  async submit(e){
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const agentId = form.dataset.agent;
    const action = form.dataset.action;
    await fetch(`${HOST}/action`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        boardroomId: BOARDROOM_ID,
        conversationId: CONV_ID,
        agentId, action, args: data, scope: 'local'
      })
    });
    alert('Queued');
  }
}
