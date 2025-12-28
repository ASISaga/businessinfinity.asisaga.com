/**
 * Workflow Manager Web Component
 * 
 * Provides UI for viewing and executing workflows via AOS Service Bus.
 * Displays workflow history, status, and allows triggering new workflows.
 */
import { buildApiUrl } from './apiRoutes.js';

class WorkflowManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._workflows = [];
        this._availableWorkflows = [
            { name: 'strategic_planning', label: 'Strategic Planning', description: 'C-Suite collaborative planning workflow' },
            { name: 'market_analysis', label: 'Market Analysis', description: 'CMO-led market research workflow' },
            { name: 'financial_review', label: 'Financial Review', description: 'CFO quarterly review workflow' },
            { name: 'tech_assessment', label: 'Tech Assessment', description: 'CTO technology evaluation workflow' },
            { name: 'hr_onboarding', label: 'HR Onboarding', description: 'CHRO employee onboarding workflow' },
            { name: 'security_audit', label: 'Security Audit', description: 'CSO security review workflow' },
            { name: 'operations_review', label: 'Operations Review', description: 'COO operational efficiency workflow' }
        ];
        this._refreshInterval = null;
    }

    connectedCallback() {
        this._render();
        this._fetchWorkflows();

        const interval = parseInt(this.getAttribute('refresh-interval') || '15000', 10);
        this._refreshInterval = setInterval(() => this._fetchWorkflows(), interval);
    }

    disconnectedCallback() {
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
        }
    }

    async _fetchWorkflows() {
        try {
            const response = await fetch(buildApiUrl('/status'));
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            // In a real implementation, this would come from a dedicated workflows endpoint
            this._workflows = [];
            this._updateWorkflowList();
        } catch (error) {
            console.error('WorkflowManager: Failed to fetch workflows', error);
        }
    }

    async _executeWorkflow(workflowName, params = {}) {
        const executeBtn = this.shadowRoot.querySelector(`[data-workflow="${workflowName}"]`);
        if (executeBtn) {
            executeBtn.disabled = true;
            executeBtn.textContent = 'Executing...';
        }

        try {
            const response = await fetch(buildApiUrl(`/workflows/${workflowName}`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            this._showNotification(`Workflow "${workflowName}" started successfully`, 'success');

            // Dispatch workflow execution event
            this.dispatchEvent(new CustomEvent('workflow-executed', {
                detail: result,
                bubbles: true
            }));

            // Refresh workflow list
            await this._fetchWorkflows();
        } catch (error) {
            console.error('WorkflowManager: Failed to execute workflow', error);
            this._showNotification(`Failed to execute workflow: ${error.message}`, 'error');
        } finally {
            if (executeBtn) {
                executeBtn.disabled = false;
                executeBtn.textContent = 'Execute';
            }
        }
    }

    _showNotification(message, type = 'info') {
        const notification = this.shadowRoot.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification notification-${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    _render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .workflow-manager {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .wf-header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .wf-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .wf-icon {
          font-size: 1.25rem;
        }
        
        .wf-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .wf-tab {
          flex: 1;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s;
        }
        
        .wf-tab:hover {
          color: #1e293b;
          background: #f8fafc;
        }
        
        .wf-tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }
        
        .wf-content {
          padding: 1rem;
        }
        
        .wf-section {
          display: none;
        }
        
        .wf-section.active {
          display: block;
        }
        
        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        
        .workflow-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.2s;
        }
        
        .workflow-card:hover {
          border-color: #2563eb;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }
        
        .wf-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .wf-card-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9375rem;
        }
        
        .wf-card-status {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          background: #dbeafe;
          color: #1d4ed8;
        }
        
        .wf-card-status.running {
          background: #fef3c7;
          color: #d97706;
        }
        
        .wf-card-status.completed {
          background: #d1fae5;
          color: #059669;
        }
        
        .wf-card-status.failed {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .wf-card-description {
          font-size: 0.8125rem;
          color: #64748b;
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }
        
        .wf-card-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .wf-btn {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .wf-btn-primary {
          background: #2563eb;
          color: white;
        }
        
        .wf-btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
        }
        
        .wf-btn-primary:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        
        .wf-btn-secondary {
          background: #e2e8f0;
          color: #475569;
        }
        
        .wf-btn-secondary:hover {
          background: #cbd5e1;
        }
        
        .wf-history-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .wf-history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .wf-history-item:last-child {
          border-bottom: none;
        }
        
        .wf-history-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .wf-history-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
        
        .wf-history-icon.running {
          background: #fef3c7;
        }
        
        .wf-history-icon.completed {
          background: #d1fae5;
        }
        
        .wf-history-icon.failed {
          background: #fee2e2;
        }
        
        .wf-history-details h4 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }
        
        .wf-history-details p {
          margin: 0.125rem 0 0;
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .wf-history-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }
        
        .empty-state-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .notification {
          display: none;
          padding: 0.75rem 1rem;
          margin: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        
        .notification-success {
          background: #d1fae5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        
        .notification-error {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        
        .notification-info {
          background: #dbeafe;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }
      </style>
      
      <div class="workflow-manager">
        <div class="wf-header">
          <div class="wf-title">
            <span class="wf-icon">⚡</span>
            <span>Workflow Manager</span>
          </div>
        </div>
        
        <div id="notification" class="notification"></div>
        
        <div class="wf-tabs">
          <button class="wf-tab active" data-tab="available">Available Workflows</button>
          <button class="wf-tab" data-tab="history">Execution History</button>
        </div>
        
        <div class="wf-content">
          <div id="availableSection" class="wf-section active">
            <div class="workflow-grid" id="workflowGrid"></div>
          </div>
          
          <div id="historySection" class="wf-section">
            <ul class="wf-history-list" id="historyList">
              <li class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No workflow executions yet</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;

        // Setup tab switching
        this.shadowRoot.querySelectorAll('.wf-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.shadowRoot.querySelectorAll('.wf-tab').forEach(t => t.classList.remove('active'));
                this.shadowRoot.querySelectorAll('.wf-section').forEach(s => s.classList.remove('active'));
                tab.classList.add('active');
                const section = this.shadowRoot.getElementById(`${tab.dataset.tab}Section`);
                if (section) section.classList.add('active');
            });
        });

        this._renderAvailableWorkflows();
    }

    _renderAvailableWorkflows() {
        const grid = this.shadowRoot.getElementById('workflowGrid');
        grid.innerHTML = this._availableWorkflows.map(wf => `
      <div class="workflow-card">
        <div class="wf-card-header">
          <div class="wf-card-title">${wf.label}</div>
          <span class="wf-card-status">Available</span>
        </div>
        <div class="wf-card-description">${wf.description}</div>
        <div class="wf-card-actions">
          <button class="wf-btn wf-btn-primary" data-workflow="${wf.name}">Execute</button>
        </div>
      </div>
    `).join('');

        // Attach execute handlers
        grid.querySelectorAll('[data-workflow]').forEach(btn => {
            btn.addEventListener('click', () => {
                this._executeWorkflow(btn.dataset.workflow);
            });
        });
    }

    _updateWorkflowList() {
        const historyList = this.shadowRoot.getElementById('historyList');

        if (this._workflows.length === 0) {
            historyList.innerHTML = `
        <li class="empty-state">
          <div class="empty-state-icon">📋</div>
          <p>No workflow executions yet</p>
        </li>
      `;
            return;
        }

        historyList.innerHTML = this._workflows.map(wf => `
      <li class="wf-history-item">
        <div class="wf-history-info">
          <div class="wf-history-icon ${wf.status}">
            ${wf.status === 'completed' ? '✓' : wf.status === 'running' ? '⟳' : '✗'}
          </div>
          <div class="wf-history-details">
            <h4>${wf.name}</h4>
            <p>ID: ${wf.id}</p>
          </div>
        </div>
        <div class="wf-history-time">${new Date(wf.started_at).toLocaleString()}</div>
      </li>
    `).join('');
    }
}

customElements.define('workflow-manager', WorkflowManager);

export { WorkflowManager };
