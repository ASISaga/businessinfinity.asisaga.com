const HOST = location.origin.replace('businessinfinity', 'cloud.businessinfinity');

class AmlDemo extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:'open'}); }
  connectedCallback(){
    this.shadowRoot.innerHTML = `
      <div class="panel">
        <h3>AML Demo / Training</h3>
        <div class="row">
          <form id="infer">
            <label>Agent ID</label><input name="agentId" value="cmo"/>
            <label>Prompt</label><textarea name="prompt"></textarea>
            <button>Infer</button>
          </form>
          <form id="train">
            <label>Job Name</label><input name="jobName" />
            <label>Model Name</label><input name="modelName" />
            <label>Dataset URI</label><input name="datasetUri" />
            <button>Train</button>
          </form>
        </div>
        <pre id="out"></pre>
      </div>
    `;
    this.shadowRoot.getElementById('infer').addEventListener('submit', e => this.call(e, '/aml/infer'));
    this.shadowRoot.getElementById('train').addEventListener('submit', e => this.call(e, '/aml/train'));
  }
  async call(e, path){
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch(`${HOST}${path}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
    const json = await res.json();
    this.shadowRoot.getElementById('out').textContent = JSON.stringify(json, null, 2);
  }
}
