class BoardroomDashboard extends HTMLElement {
  async connectedCallback() {
    const manifestUrl = this.getAttribute('manifest-url');
    const roleFilter = this.getAttribute('role');

    const res = await fetch(manifestUrl);
    const manifest = await res.json();

    let panels = manifest.panels;
    if (roleFilter) {
      panels = panels.filter(p => p.role.toLowerCase() === roleFilter.toLowerCase());
    }

    const roles = {};
    panels.forEach(panel => {
      if (!roles[panel.role]) roles[panel.role] = {};
      roles[panel.role][panel.scope || 'default'] = panel;
    });

    this.render(roles, manifest.actionBindings);

    // Add admin endpoint buttons
    this.renderAdminEndpoints();
  }

  render(roles, bindings) {
    const container = document.createElement('div');
    container.className = 'dashboard';

    Object.keys(roles).forEach(role => {
      const roleContainer = document.createElement('div');

      const header = document.createElement('div');
      header.className = 'role-header';

      const title = document.createElement('h2');
      title.textContent = role;
      header.appendChild(title);

      const toggle = document.createElement('div');
      toggle.className = 'scope-toggle';

      const scopes = Object.keys(roles[role]);
      scopes.forEach(scope => {
        const btn = document.createElement('button');
        btn.textContent = scope.charAt(0).toUpperCase() + scope.slice(1);
        btn.addEventListener('click', () => {
          toggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderPanel(roleContainer, roles[role][scope], bindings);
        });
        toggle.appendChild(btn);
      });

      header.appendChild(toggle);
      roleContainer.appendChild(header);

      const defaultScope = scopes[0];
      this.renderPanel(roleContainer, roles[role][defaultScope], bindings);
      toggle.querySelector('button').classList.add('active');

      container.appendChild(roleContainer);
    });

    this.innerHTML = '';
    this.appendChild(container);
  }

  renderPanel(container, panel, bindings) {
    container.querySelectorAll('.panel').forEach(p => p.remove());

    const panelEl = document.createElement('div');
    panelEl.className = 'panel';

    const h3 = document.createElement('h3');
    h3.textContent = panel.title;
    panelEl.appendChild(h3);

    const actionsEl = document.createElement('div');
    actionsEl.className = 'actions';

    panel.actions.forEach(action => {
      const btn = document.createElement('button');
      btn.textContent = action.label;
      btn.addEventListener('click', () => this.triggerAction(action.id, bindings));
      actionsEl.appendChild(btn);
    });

    panelEl.appendChild(actionsEl);
    container.appendChild(panelEl);
  }

  async triggerAction(actionId, bindings) {
    const binding = bindings.find(b => b.actionId === actionId);
    if (!binding) {
      alert(`No binding found for ${actionId}`);
      return;
    }
    const params = {}; // Could prompt user for paramsSchema here
    const res = await fetch('/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: binding.mcpMethod, params })
    });
    const data = await res.json();
    alert(`${actionId} result: ${JSON.stringify(data.result || data.error)}`);
  }

  renderAdminEndpoints() {
    const adminContainer = document.createElement('div');
    adminContainer.className = 'admin-endpoints';

    // Dashboard endpoint
    const dashboardBtn = document.createElement('button');
    dashboardBtn.textContent = 'Fetch Dashboard';
    dashboardBtn.onclick = async () => {
      const res = await fetch('/dashboard');
      const data = await res.json();
      alert('Dashboard: ' + JSON.stringify(data));
    };
    adminContainer.appendChild(dashboardBtn);

    // Status endpoint
    const statusBtn = document.createElement('button');
    statusBtn.textContent = 'Fetch Status';
    statusBtn.onclick = async () => {
      const res = await fetch('/status');
      const data = await res.json();
      alert('Status: ' + JSON.stringify(data));
    };
    adminContainer.appendChild(statusBtn);

    // Health endpoint
    const healthBtn = document.createElement('button');
    healthBtn.textContent = 'Fetch Health';
    healthBtn.onclick = async () => {
      const res = await fetch('/health');
      const data = await res.json();
      alert('Health: ' + JSON.stringify(data));
    };
    adminContainer.appendChild(healthBtn);

    this.appendChild(adminContainer);
  }
}

customElements.define('boardroom-dashboard', BoardroomDashboard);