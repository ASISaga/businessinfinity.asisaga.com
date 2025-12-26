/**
 * System Health Status Component
 * Displays backend health and component status using /api/health endpoint
 */

import { BoardroomAPI } from './boardroomApi.js';

export class HealthStatusUI {
  constructor() {
    this.api = new BoardroomAPI();
    this.refreshInterval = null;
  }

  /**
   * Initialize health status monitoring
   */
  init() {
    this.createHealthBadge();
    this.startMonitoring();
  }

  /**
   * Create health status badge in the navbar
   */
  createHealthBadge() {
    const badgeHTML = `
      <div id="healthStatusBadge" class="health-status-badge" title="System Health">
        <span class="health-indicator" id="healthIndicator">●</span>
        <span class="health-text" id="healthText">Checking...</span>
      </div>
    `;

    // Find a suitable location in the navbar to add the badge
    const navbar = document.querySelector('nav') || document.querySelector('header');
    if (navbar) {
      navbar.insertAdjacentHTML('beforeend', badgeHTML);
      
      // Add click handler to show detailed status
      const badge = document.getElementById('healthStatusBadge');
      if (badge) {
        badge.addEventListener('click', () => this.showDetailedStatus());
        badge.style.cursor = 'pointer';
      }
    }
  }

  /**
   * Start health monitoring with periodic refresh
   */
  startMonitoring(interval = 30000) {
    // Stop any existing monitoring first
    this.stopMonitoring();
    
    // Initial check
    this.checkHealth();
    
    // Periodic checks
    this.refreshInterval = setInterval(() => this.checkHealth(), interval);
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Check system health
   */
  async checkHealth() {
    try {
      const health = await this.api.getHealth();
      this.updateHealthBadge(health);
      this.lastHealthData = health;
    } catch (error) {
      console.error('Health check failed:', error);
      this.updateHealthBadge({ status: 'error', components: {} });
    }
  }

  /**
   * Update the health badge display
   */
  updateHealthBadge(health) {
    const indicator = document.getElementById('healthIndicator');
    const text = document.getElementById('healthText');
    
    if (!indicator || !text) return;

    const status = health.status || 'unknown';
    
    // Update indicator color
    indicator.className = 'health-indicator health-' + status;
    
    // Update text
    const statusText = {
      'ok': 'Online',
      'degraded': 'Degraded',
      'error': 'Offline',
      'unknown': 'Unknown'
    };
    text.textContent = statusText[status] || 'Unknown';
  }

  /**
   * Show detailed health status modal
   */
  showDetailedStatus() {
    const health = this.lastHealthData || { status: 'unknown', components: {} };
    
    const modalHTML = `
      <div id="healthStatusModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">System Health Status</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <h6>Overall Status</h6>
                <span class="badge bg-${this.getStatusColor(health.status)}">${health.status}</span>
              </div>
              <div>
                <h6>Components</h6>
                <ul class="list-group">
                  ${this.renderComponents(health.components)}
                </ul>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if present
    const existingModal = document.getElementById('healthStatusModal');
    if (existingModal) {
      existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('healthStatusModal');
    if (modal && typeof bootstrap !== 'undefined') {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      
      // Clean up modal when hidden
      modal.addEventListener('hidden.bs.modal', () => modal.remove());
    }
  }

  /**
   * Render component status list
   */
  renderComponents(components) {
    if (!components || Object.keys(components).length === 0) {
      return '<li class="list-group-item">No component data available</li>';
    }

    return Object.entries(components).map(([name, data]) => {
      const status = data.status || 'unknown';
      const badge = `<span class="badge bg-${this.getStatusColor(status)}">${status}</span>`;
      return `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${name}
        ${badge}
      </li>`;
    }).join('');
  }

  /**
   * Get Bootstrap color for status
   */
  getStatusColor(status) {
    const colorMap = {
      'ok': 'success',
      'available': 'success',
      'degraded': 'warning',
      'error': 'danger',
      'offline': 'danger',
      'unknown': 'secondary'
    };
    return colorMap[status] || 'secondary';
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.healthStatusUI = new HealthStatusUI();
    window.healthStatusUI.init();
  });
} else {
  window.healthStatusUI = new HealthStatusUI();
  window.healthStatusUI.init();
}
