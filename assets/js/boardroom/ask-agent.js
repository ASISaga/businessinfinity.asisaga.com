/**
 * Ask Agent Feature - Direct interaction with business agents
 * Uses the new /api/agents/{role}/ask endpoint
 */

import { BoardroomAPI } from './boardroomApi.js';

export class AskAgentUI {
  constructor() {
    this.api = new BoardroomAPI();
    this.currentRole = null;
    this.keyboardListenerAdded = false;
  }

  /**
   * Initialize the Ask Agent UI
   */
  init() {
    this.createAskAgentModal();
    this.attachEventListeners();
  }

  /**
   * Create the Ask Agent modal dialog
   */
  createAskAgentModal() {
    const modalHTML = `
      <div id="askAgentModal" class="modal fade" tabindex="-1" aria-labelledby="askAgentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="askAgentModalLabel">Ask an Agent</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="agentRoleSelect" class="form-label">Select Agent</label>
                <select id="agentRoleSelect" class="form-select" required>
                  <option value="">Choose an agent...</option>
                  <option value="CEO">CEO - Strategic Leadership</option>
                  <option value="CFO">CFO - Financial Analysis</option>
                  <option value="CTO">CTO - Technology & Innovation</option>
                  <option value="CMO">CMO - Marketing Strategy</option>
                  <option value="COO">COO - Operations Excellence</option>
                  <option value="Founder">Founder - Vision & Innovation</option>
                  <option value="Investor">Investor - Investment Analysis</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="agentQuestion" class="form-label">Your Question</label>
                <textarea id="agentQuestion" class="form-control" rows="4" 
                  placeholder="Ask the agent a question or provide context for analysis..."
                  required></textarea>
              </div>
              <div id="agentResponse" class="mt-3" style="display: none;">
                <h6>Agent Response</h6>
                <div class="card">
                  <div class="card-body">
                    <div id="agentResponseContent"></div>
                    <div class="mt-2">
                      <small class="text-muted">
                        Confidence: <span id="agentConfidence"></span>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div id="agentLoading" class="text-center mt-3" style="display: none;">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Consulting with agent...</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" id="askAgentBtn" class="btn btn-primary">Ask Agent</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to body if it doesn't exist
    if (!document.getElementById('askAgentModal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const askBtn = document.getElementById('askAgentBtn');
    if (askBtn) {
      askBtn.addEventListener('click', () => this.handleAskAgent());
    }

    // Add keyboard shortcut: Ctrl+K to open modal (only if not already added)
    if (!this.keyboardListenerAdded) {
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault();
          this.showModal();
        }
      });
      this.keyboardListenerAdded = true;
    }
  }

  /**
   * Show the Ask Agent modal
   */
  showModal() {
    const modal = document.getElementById('askAgentModal');
    if (modal && typeof bootstrap !== 'undefined') {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  /**
   * Handle Ask Agent button click
   */
  async handleAskAgent() {
    const roleSelect = document.getElementById('agentRoleSelect');
    const questionInput = document.getElementById('agentQuestion');
    const responseDiv = document.getElementById('agentResponse');
    const loadingDiv = document.getElementById('agentLoading');
    const responseContent = document.getElementById('agentResponseContent');
    const confidenceSpan = document.getElementById('agentConfidence');

    const role = roleSelect.value;
    const question = questionInput.value.trim();

    if (!role) {
      this.showToast('Please select an agent', 'error');
      return;
    }

    if (!question) {
      this.showToast('Please enter a question', 'error');
      return;
    }

    // Show loading, hide response
    loadingDiv.style.display = 'block';
    responseDiv.style.display = 'none';

    try {
      // Call the new askAgent API
      const result = await this.api.askAgent(role, question);

      // Display the response
      responseContent.innerHTML = this.formatResponse(result.answer);
      confidenceSpan.textContent = `${(result.confidence * 100).toFixed(0)}%`;

      // Show response, hide loading
      loadingDiv.style.display = 'none';
      responseDiv.style.display = 'block';

    } catch (error) {
      console.error('Error asking agent:', error);
      loadingDiv.style.display = 'none';
      this.showToast('Failed to get response from agent: ' + error.message, 'error');
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
   * Format the agent response with better readability
   */
  formatResponse(text) {
    // Convert line breaks to paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${this.escapeHtml(p)}</p>`).join('');
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.askAgentUI = new AskAgentUI();
    window.askAgentUI.init();
  });
} else {
  window.askAgentUI = new AskAgentUI();
  window.askAgentUI.init();
}
