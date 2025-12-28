/**
 * Workflow Execution UI - Execute business workflows
 * Uses the new /api/workflows/{workflow_name} endpoint
 */

import { BoardroomAPI } from './boardroomApi.js';

export class WorkflowUI {
  constructor() {
    this.api = new BoardroomAPI();
    this.workflows = [
      {
        name: 'product_launch',
        title: 'Product Launch',
        description: 'Market analysis → Product strategy → Technical implementation → Financial planning → Launch',
        params: [
          { name: 'product_name', label: 'Product Name', type: 'text', required: true },
          { name: 'target_market', label: 'Target Market', type: 'text', required: true },
          { name: 'launch_date', label: 'Launch Date', type: 'text', placeholder: '2025-Q2' }
        ]
      },
      {
        name: 'funding_round',
        title: 'Funding Round',
        description: 'Financial assessment → Investor outreach → Pitch preparation → Due diligence → Closing',
        params: [
          { name: 'round_type', label: 'Round Type', type: 'select', options: ['Seed', 'Series A', 'Series B', 'Series C'], required: true },
          { name: 'target_amount', label: 'Target Amount', type: 'number', required: true },
          { name: 'valuation', label: 'Valuation', type: 'number' }
        ]
      },
      {
        name: 'market_analysis',
        title: 'Market Analysis',
        description: 'Market research → Competitive analysis → Opportunity assessment',
        params: [
          { name: 'market_segment', label: 'Market Segment', type: 'text', required: true },
          { name: 'geography', label: 'Geography', type: 'text', required: true },
          { name: 'timeframe', label: 'Timeframe', type: 'text', placeholder: '2025' }
        ]
      }
    ];
  }

  /**
   * Initialize the Workflow UI
   */
  init() {
    this.createWorkflowModal();
    this.attachEventListeners();
  }

  /**
   * Create the Workflow modal dialog
   */
  createWorkflowModal() {
    const modalHTML = `
      <div id="workflowModal" class="modal fade" tabindex="-1" aria-labelledby="workflowModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="workflowModalLabel">Execute Business Workflow</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="workflowSelect" class="form-label">Select Workflow</label>
                <select id="workflowSelect" class="form-select" required>
                  <option value="">Choose a workflow...</option>
                  ${this.workflows.map(w => `
                    <option value="${w.name}">${w.title}</option>
                  `).join('')}
                </select>
                <div id="workflowDescription" class="form-text mt-2"></div>
              </div>
              <div id="workflowParams" class="mb-3"></div>
              <div id="workflowResult" class="mt-3" style="display: none;">
                <h6>Workflow Execution Result</h6>
                <div class="card">
                  <div class="card-body">
                    <div id="workflowResultContent"></div>
                  </div>
                </div>
              </div>
              <div id="workflowLoading" class="text-center mt-3" style="display: none;">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Executing workflow...</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" id="executeWorkflowBtn" class="btn btn-primary" disabled>Execute Workflow</button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (!document.getElementById('workflowModal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const workflowSelect = document.getElementById('workflowSelect');
    if (workflowSelect) {
      workflowSelect.addEventListener('change', (e) => this.handleWorkflowChange(e.target.value));
    }

    const executeBtn = document.getElementById('executeWorkflowBtn');
    if (executeBtn) {
      executeBtn.addEventListener('click', () => this.handleExecuteWorkflow());
    }
  }

  /**
   * Handle workflow selection change
   */
  handleWorkflowChange(workflowName) {
    const workflow = this.workflows.find(w => w.name === workflowName);
    const descDiv = document.getElementById('workflowDescription');
    const paramsDiv = document.getElementById('workflowParams');
    const executeBtn = document.getElementById('executeWorkflowBtn');

    if (!workflow) {
      descDiv.textContent = '';
      paramsDiv.innerHTML = '';
      executeBtn.disabled = true;
      return;
    }

    descDiv.textContent = workflow.description;
    
    // Generate parameter inputs
    paramsDiv.innerHTML = workflow.params.map(param => {
      if (param.type === 'select') {
        return `
          <div class="mb-3">
            <label for="param_${param.name}" class="form-label">
              ${param.label} ${param.required ? '<span class="text-danger">*</span>' : ''}
            </label>
            <select id="param_${param.name}" class="form-select" ${param.required ? 'required' : ''}>
              <option value="">Select ${param.label}...</option>
              ${param.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
        `;
      } else {
        return `
          <div class="mb-3">
            <label for="param_${param.name}" class="form-label">
              ${param.label} ${param.required ? '<span class="text-danger">*</span>' : ''}
            </label>
            <input 
              type="${param.type}" 
              id="param_${param.name}" 
              class="form-control" 
              placeholder="${param.placeholder || ''}"
              ${param.required ? 'required' : ''}
            />
          </div>
        `;
      }
    }).join('');

    executeBtn.disabled = false;
  }

  /**
   * Handle Execute Workflow button click
   */
  async handleExecuteWorkflow() {
    const workflowSelect = document.getElementById('workflowSelect');
    const workflowName = workflowSelect.value;
    
    if (!workflowName) {
      this.showToast('Please select a workflow', 'error');
      return;
    }

    const workflow = this.workflows.find(w => w.name === workflowName);
    
    // Collect parameters
    const params = {};
    for (const param of workflow.params) {
      const input = document.getElementById(`param_${param.name}`);
      if (input) {
        params[param.name] = input.value;
        if (param.required && !params[param.name]) {
          this.showToast(`Please provide ${param.label}`, 'error');
          return;
        }
      }
    }

    const resultDiv = document.getElementById('workflowResult');
    const loadingDiv = document.getElementById('workflowLoading');
    const resultContent = document.getElementById('workflowResultContent');

    // Show loading
    loadingDiv.style.display = 'block';
    resultDiv.style.display = 'none';

    try {
      // Execute the workflow
      const result = await this.api.executeWorkflow(workflowName, params);

      // Display result
      resultContent.innerHTML = `
        <p><strong>Execution ID:</strong> ${result.execution_id}</p>
        <p><strong>Status:</strong> <span class="badge bg-${this.getStatusColor(result.status)}">${result.status}</span></p>
        <pre class="mt-2">${JSON.stringify(result.result || {}, null, 2)}</pre>
      `;

      loadingDiv.style.display = 'none';
      resultDiv.style.display = 'block';

    } catch (error) {
      console.error('Error executing workflow:', error);
      loadingDiv.style.display = 'none';
      this.showToast('Failed to execute workflow: ' + error.message, 'error');
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /**
   * Get Bootstrap color class for status
   */
  getStatusColor(status) {
    const colorMap = {
      'running': 'primary',
      'completed': 'success',
      'failed': 'danger',
      'queued': 'warning'
    };
    return colorMap[status] || 'secondary';
  }

  /**
   * Show the Workflow modal
   */
  showModal() {
    const modal = document.getElementById('workflowModal');
    if (modal && typeof bootstrap !== 'undefined') {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.workflowUI = new WorkflowUI();
    window.workflowUI.init();
  });
} else {
  window.workflowUI = new WorkflowUI();
  window.workflowUI.init();
}
