/**
 * AOS Status Web Component
 * 
 * Displays Agent Operating System connection status and health information.
 * Shows deployment mode (Service Bus vs Direct) and real-time health metrics.
 */
import { buildApiUrl } from './apiRoutes.js';

class AOSStatus extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._refreshInterval = null;
        this._status = {
            aos_status: 'unknown',
            deployment_mode: 'unknown',
            agents_available: 0,
            last_check: null
        };
    }

    static get observedAttributes() {
        return ['refresh-interval', 'compact'];
    }

    connectedCallback() {
        this._render();
        this._fetchStatus();

        const interval = parseInt(this.getAttribute('refresh-interval') || '30000', 10);
        this._refreshInterval = setInterval(() => this._fetchStatus(), interval);
    }

    disconnectedCallback() {
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'refresh-interval' && oldValue !== newValue) {
            if (this._refreshInterval) {
                clearInterval(this._refreshInterval);
            }
            const interval = parseInt(newValue || '30000', 10);
            this._refreshInterval = setInterval(() => this._fetchStatus(), interval);
        }
        if (name === 'compact') {
            this._render();
        }
    }

    async _fetchStatus() {
        try {
            const response = await fetch(buildApiUrl('/status'));
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            this._status = {
                aos_status: data.aos_status || 'unknown',
                deployment_mode: data.deployment_mode || 'unknown',
                agents_available: data.agents_count || 0,
                initialized: data.initialized || false,
                active_workflows: data.active_workflows || 0,
                completed_workflows: data.completed_workflows || 0,
                config: data.config || {},
                last_check: new Date().toISOString()
            };
            this._updateDisplay();
        } catch (error) {
            console.error('AOSStatus: Failed to fetch status', error);
            this._status.aos_status = 'error';
            this._updateDisplay();
        }
    }

    _getStatusColor(status) {
        const colors = {
            connected: '#10b981',
            direct: '#3b82f6',
            unavailable: '#ef4444',
            unreachable: '#f59e0b',
            unknown: '#6b7280',
            error: '#ef4444'
        };
        return colors[status] || colors.unknown;
    }

    _getStatusIcon(status) {
        const icons = {
            connected: '🟢',
            direct: '🔵',
            unavailable: '🔴',
            unreachable: '🟠',
            unknown: '⚪',
            error: '🔴'
        };
        return icons[status] || icons.unknown;
    }

    _render() {
        const isCompact = this.hasAttribute('compact');

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .aos-status-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 12px;
          padding: ${isCompact ? '0.75rem' : '1.5rem'};
          color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .aos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: ${isCompact ? '0.5rem' : '1rem'};
        }
        
        .aos-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: ${isCompact ? '0.875rem' : '1.125rem'};
          font-weight: 600;
        }
        
        .aos-title-icon {
          font-size: 1.25rem;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .aos-metrics {
          display: grid;
          grid-template-columns: repeat(${isCompact ? '2' : '3'}, 1fr);
          gap: ${isCompact ? '0.5rem' : '1rem'};
        }
        
        .metric-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: ${isCompact ? '0.5rem' : '0.75rem'};
          text-align: center;
        }
        
        .metric-value {
          font-size: ${isCompact ? '1.25rem' : '1.5rem'};
          font-weight: 700;
          color: #60a5fa;
        }
        
        .metric-label {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }
        
        .deployment-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: ${isCompact ? '0.5rem' : '1rem'};
          padding-top: ${isCompact ? '0.5rem' : '0.75rem'};
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.75rem;
          color: #94a3b8;
        }
        
        .deployment-mode {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        
        .mode-icon {
          font-size: 0.875rem;
        }
        
        .last-check {
          font-style: italic;
        }
        
        .refresh-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #94a3b8;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
        }
        
        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
      </style>
      
      <div class="aos-status-card">
        <div class="aos-header">
          <div class="aos-title">
            <span class="aos-title-icon">🤖</span>
            <span>Agent Operating System</span>
          </div>
          <div class="status-badge" id="statusBadge">
            <span class="status-indicator" id="statusIndicator"></span>
            <span id="statusText">Loading...</span>
          </div>
        </div>
        
        <div class="aos-metrics" id="metricsGrid">
          <div class="metric-card">
            <div class="metric-value" id="agentsCount">-</div>
            <div class="metric-label">Agents</div>
          </div>
          <div class="metric-card">
            <div class="metric-value" id="activeWorkflows">-</div>
            <div class="metric-label">Active Workflows</div>
          </div>
          ${!isCompact ? `
          <div class="metric-card">
            <div class="metric-value" id="completedWorkflows">-</div>
            <div class="metric-label">Completed</div>
          </div>
          ` : ''}
        </div>
        
        <div class="deployment-info">
          <div class="deployment-mode">
            <span class="mode-icon" id="modeIcon">📡</span>
            <span id="modeText">Checking...</span>
          </div>
          <button class="refresh-btn" id="refreshBtn">⟳ Refresh</button>
        </div>
      </div>
    `;

        this.shadowRoot.getElementById('refreshBtn').addEventListener('click', () => {
            this._fetchStatus();
        });
    }

    _updateDisplay() {
        const status = this._status;
        const statusIndicator = this.shadowRoot.getElementById('statusIndicator');
        const statusText = this.shadowRoot.getElementById('statusText');
        const agentsCount = this.shadowRoot.getElementById('agentsCount');
        const activeWorkflows = this.shadowRoot.getElementById('activeWorkflows');
        const completedWorkflows = this.shadowRoot.getElementById('completedWorkflows');
        const modeIcon = this.shadowRoot.getElementById('modeIcon');
        const modeText = this.shadowRoot.getElementById('modeText');

        // Update status badge
        const color = this._getStatusColor(status.aos_status);
        statusIndicator.style.backgroundColor = color;
        statusText.textContent = status.aos_status.charAt(0).toUpperCase() + status.aos_status.slice(1);

        // Update metrics
        agentsCount.textContent = status.agents_available;
        activeWorkflows.textContent = status.active_workflows;
        if (completedWorkflows) {
            completedWorkflows.textContent = status.completed_workflows;
        }

        // Update deployment mode
        if (status.deployment_mode === 'servicebus') {
            modeIcon.textContent = '📡';
            modeText.textContent = 'Service Bus Mode';
        } else if (status.deployment_mode === 'direct') {
            modeIcon.textContent = '🔗';
            modeText.textContent = 'Direct Mode';
        } else {
            modeIcon.textContent = '❓';
            modeText.textContent = 'Unknown Mode';
        }

        // Dispatch status change event
        this.dispatchEvent(new CustomEvent('aos-status-change', {
            detail: status,
            bubbles: true
        }));
    }
}

customElements.define('aos-status', AOSStatus);

export { AOSStatus };
