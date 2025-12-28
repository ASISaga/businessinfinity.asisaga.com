/**
 * System Monitor Web Component
 * 
 * Comprehensive dashboard for monitoring BusinessInfinity and AOS systems.
 * Displays real-time status, agent interactions, workflows, and MCP servers.
 */
import { buildApiUrl } from './apiRoutes.js';
import './aos-status.js';
import './workflow-manager.js';

class SystemMonitor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._agents = [];
        this._mcpServers = {};
        this._refreshInterval = null;
    }

    connectedCallback() {
        this._render();
        this._fetchData();

        const interval = parseInt(this.getAttribute('refresh-interval') || '10000', 10);
        this._refreshInterval = setInterval(() => this._fetchData(), interval);
    }

    disconnectedCallback() {
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
        }
    }

    async _fetchData() {
        await Promise.all([
            this._fetchAgents(),
            this._fetchMcpServers()
        ]);
    }

    async _fetchAgents() {
        try {
            const response = await fetch(buildApiUrl('/agents'));
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            this._agents = data.agents || [];
            this._updateAgentsDisplay();
        } catch (error) {
            console.error('SystemMonitor: Failed to fetch agents', error);
        }
    }

    async _fetchMcpServers() {
        try {
            const response = await fetch(buildApiUrl('/mcp/servers'));
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            this._mcpServers = data.servers || {};
            this._updateMcpDisplay();
        } catch (error) {
            console.error('SystemMonitor: Failed to fetch MCP servers', error);
        }
    }

    async _askAgent(agentRole, message) {
        const inputEl = this.shadowRoot.getElementById(`agent-input-${agentRole}`);
        const responseEl = this.shadowRoot.getElementById(`agent-response-${agentRole}`);
        const btnEl = this.shadowRoot.getElementById(`agent-btn-${agentRole}`);

        if (!message.trim()) return;

        btnEl.disabled = true;
        btnEl.textContent = 'Thinking...';
        responseEl.innerHTML = '<div class="loading">Processing your query...</div>';

        try {
            const response = await fetch(buildApiUrl(`/agents/${agentRole}/ask`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, context: {} })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            responseEl.innerHTML = `
        <div class="agent-response-content">
          <div class="response-text">${this._escapeHtml(result.response || 'No response')}</div>
          <div class="response-meta">
            <span class="via-badge ${result.via}">${result.via === 'servicebus' ? '📡 Service Bus' : '🔗 Direct'}</span>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      `;
        } catch (error) {
            responseEl.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        } finally {
            btnEl.disabled = false;
            btnEl.textContent = 'Ask';
            inputEl.value = '';
        }
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .system-monitor {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
        }
        
        .monitor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        
        .monitor-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .monitor-title h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        .monitor-title-icon {
          font-size: 1.75rem;
        }
        
        .monitor-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .monitor-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition: all 0.2s;
        }
        
        .monitor-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        
        .monitor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        @media (max-width: 1024px) {
          .monitor-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .monitor-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .section-header {
          background: #f8fafc;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .section-icon {
          font-size: 1rem;
        }
        
        .section-content {
          padding: 1rem;
        }
        
        .aos-status-wrapper {
          grid-column: 1 / -1;
        }
        
        .workflow-wrapper {
          grid-column: 1 / -1;
        }
        
        /* Agents Section */
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        
        .agent-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .agent-card:hover {
          border-color: #2563eb;
          transform: translateY(-1px);
        }
        
        .agent-card.expanded {
          grid-column: 1 / -1;
          cursor: default;
        }
        
        .agent-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .agent-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 0.875rem;
        }
        
        .agent-info h4 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .agent-info p {
          margin: 0.125rem 0 0;
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .agent-chat {
          margin-top: 0.75rem;
          display: none;
        }
        
        .agent-card.expanded .agent-chat {
          display: block;
        }
        
        .agent-input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .agent-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        
        .agent-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .agent-ask-btn {
          padding: 0.5rem 1rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .agent-ask-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }
        
        .agent-ask-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        
        .agent-response-area {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0.75rem;
          min-height: 60px;
          font-size: 0.875rem;
          color: #475569;
        }
        
        .agent-response-content {
          line-height: 1.6;
        }
        
        .response-text {
          white-space: pre-wrap;
        }
        
        .response-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .via-badge {
          font-size: 0.6875rem;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-weight: 500;
        }
        
        .via-badge.servicebus {
          background: #dbeafe;
          color: #1d4ed8;
        }
        
        .via-badge.local {
          background: #d1fae5;
          color: #059669;
        }
        
        .timestamp {
          font-size: 0.6875rem;
          color: #94a3b8;
        }
        
        .loading {
          color: #64748b;
          font-style: italic;
        }
        
        .error {
          color: #dc2626;
        }
        
        /* MCP Section */
        .mcp-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .mcp-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .mcp-item:last-child {
          border-bottom: none;
        }
        
        .mcp-info {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        
        .mcp-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
        }
        
        .mcp-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }
        
        .mcp-status {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
        }
        
        .mcp-status.connected {
          background: #d1fae5;
          color: #059669;
        }
        
        .mcp-status.disconnected {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .empty-state {
          text-align: center;
          padding: 1.5rem;
          color: #64748b;
        }
        
        .empty-state-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
      </style>
      
      <div class="system-monitor">
        <div class="monitor-header">
          <div class="monitor-title">
            <span class="monitor-title-icon">📊</span>
            <h1>System Monitor</h1>
          </div>
          <div class="monitor-actions">
            <button class="monitor-btn" id="refreshBtn">
              ⟳ Refresh All
            </button>
          </div>
        </div>
        
        <div class="monitor-grid">
          <!-- AOS Status (Full Width) -->
          <div class="aos-status-wrapper">
            <aos-status refresh-interval="15000"></aos-status>
          </div>
          
          <!-- Agents Section -->
          <div class="monitor-section">
            <div class="section-header">
              <div class="section-title">
                <span class="section-icon">🤵</span>
                <span>C-Suite Agents</span>
              </div>
              <span class="agent-count" id="agentCount">0 agents</span>
            </div>
            <div class="section-content">
              <div class="agents-grid" id="agentsGrid">
                <div class="empty-state">
                  <div class="empty-state-icon">🤖</div>
                  <p>Loading agents...</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- MCP Servers Section -->
          <div class="monitor-section">
            <div class="section-header">
              <div class="section-title">
                <span class="section-icon">🔌</span>
                <span>MCP Servers</span>
              </div>
            </div>
            <div class="section-content">
              <ul class="mcp-list" id="mcpList">
                <li class="empty-state">
                  <div class="empty-state-icon">🔗</div>
                  <p>Loading MCP servers...</p>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Workflow Manager (Full Width) -->
          <div class="workflow-wrapper">
            <workflow-manager refresh-interval="15000"></workflow-manager>
          </div>
        </div>
      </div>
    `;

        // Refresh button handler
        this.shadowRoot.getElementById('refreshBtn').addEventListener('click', () => {
            this._fetchData();
            // Also refresh child components
            const aosStatus = this.shadowRoot.querySelector('aos-status');
            const workflowManager = this.shadowRoot.querySelector('workflow-manager');
            if (aosStatus) aosStatus._fetchStatus();
            if (workflowManager) workflowManager._fetchWorkflows();
        });
    }

    _updateAgentsDisplay() {
        const grid = this.shadowRoot.getElementById('agentsGrid');
        const countEl = this.shadowRoot.getElementById('agentCount');

        countEl.textContent = `${this._agents.length} agents`;

        if (this._agents.length === 0) {
            grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🤖</div>
          <p>No agents available</p>
        </div>
      `;
            return;
        }

        grid.innerHTML = this._agents.map(agent => {
            const role = agent.role || agent.name || 'Unknown';
            const initials = role.substring(0, 3).toUpperCase();
            const description = agent.description || `${role} Agent`;

            return `
        <div class="agent-card" data-role="${role}">
          <div class="agent-header">
            <div class="agent-avatar">${initials}</div>
            <div class="agent-info">
              <h4>${role}</h4>
              <p>${description}</p>
            </div>
          </div>
          <div class="agent-chat">
            <div class="agent-input-group">
              <input type="text" class="agent-input" id="agent-input-${role}" 
                placeholder="Ask ${role} a question..." />
              <button class="agent-ask-btn" id="agent-btn-${role}">Ask</button>
            </div>
            <div class="agent-response-area" id="agent-response-${role}">
              <span style="color: #94a3b8;">Click "Ask" to get a response from ${role}</span>
            </div>
          </div>
        </div>
      `;
        }).join('');

        // Attach click handlers for expanding cards
        grid.querySelectorAll('.agent-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't toggle if clicking on input or button
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

                const isExpanded = card.classList.contains('expanded');
                grid.querySelectorAll('.agent-card').forEach(c => c.classList.remove('expanded'));
                if (!isExpanded) {
                    card.classList.add('expanded');
                }
            });

            const role = card.dataset.role;
            const input = card.querySelector(`#agent-input-${role}`);
            const btn = card.querySelector(`#agent-btn-${role}`);

            btn.addEventListener('click', () => {
                this._askAgent(role, input.value);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this._askAgent(role, input.value);
                }
            });
        });
    }

    _updateMcpDisplay() {
        const list = this.shadowRoot.getElementById('mcpList');
        const serverNames = Object.keys(this._mcpServers);

        if (serverNames.length === 0) {
            list.innerHTML = `
        <li class="empty-state">
          <div class="empty-state-icon">🔗</div>
          <p>No MCP servers registered</p>
        </li>
      `;
            return;
        }

        list.innerHTML = serverNames.map(name => {
            const server = this._mcpServers[name];
            const status = server.status || 'unknown';
            const statusClass = status === 'connected' ? 'connected' : 'disconnected';

            return `
        <li class="mcp-item">
          <div class="mcp-info">
            <div class="mcp-icon">🔌</div>
            <span class="mcp-name">${name}</span>
          </div>
          <span class="mcp-status ${statusClass}">${status}</span>
        </li>
      `;
        }).join('');
    }
}

customElements.define('system-monitor', SystemMonitor);

export { SystemMonitor };
