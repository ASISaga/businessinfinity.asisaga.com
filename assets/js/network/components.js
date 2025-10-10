/**
 * UI Components for Business Infinity Network Frontend
 * Reusable components and utilities for rendering network elements
 */

class UIComponents {
  /**
   * Create an activity item for the activity feed
   */
  static createActivityItem(activity) {
    const timeAgo = this.timeAgo(new Date(activity.timestamp));
    
    return `
      <div class="activity-item">
        <div class="activity-icon">${activity.icon || '📡'}</div>
        <div class="activity-content">
          <h4>${activity.title}</h4>
          <p>${activity.description}</p>
        </div>
        <div class="activity-time">${timeAgo}</div>
      </div>
    `;
  }

  /**
   * Create a boardroom card for discovery results
   */
  static createBoardroomCard(boardroom) {
    const initials = boardroom.enterprise_name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return `
      <div class="boardroom-card" data-node-id="${boardroom.node_id}">
        <div class="boardroom-header">
          <div class="boardroom-avatar">${initials}</div>
          <div class="boardroom-info">
            <h3>${boardroom.enterprise_name}</h3>
            <p>${boardroom.industry} • ${boardroom.location}</p>
          </div>
          ${boardroom.is_verified ? '<div class="verification-badge">✓ Verified</div>' : ''}
        </div>
        
        <div class="boardroom-stats">
          <div class="boardroom-stat">
            <div class="stat-value">${boardroom.active_agents || 0}</div>
            <div class="stat-label">Agents</div>
          </div>
          <div class="boardroom-stat">
            <div class="stat-value">${boardroom.capabilities?.length || 0}</div>
            <div class="stat-label">Capabilities</div>
          </div>
          <div class="boardroom-stat">
            <div class="stat-value">${boardroom.agreements_count || 0}</div>
            <div class="stat-label">Agreements</div>
          </div>
        </div>

        <div class="boardroom-actions">
          <button class="btn-outline" onclick="NetworkUI.viewBoardroom('${boardroom.node_id}')">
            View Details
          </button>
          <button class="btn-outline" onclick="NetworkUI.startNegotiation('${boardroom.node_id}')">
            Negotiate
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Create a negotiation card
   */
  static createNegotiationCard(negotiation) {
    const statusClass = `status-${negotiation.status}`;
    const timeAgo = this.timeAgo(new Date(negotiation.created_at));

    return `
      <div class="negotiation-card" data-negotiation-id="${negotiation.id}">
        <div class="negotiation-header">
          <h3 class="negotiation-title">${negotiation.title}</h3>
          <div class="negotiation-status ${statusClass}">${negotiation.status}</div>
        </div>
        <p class="negotiation-description">${negotiation.description}</p>
        <div class="negotiation-meta">
          <p><strong>Type:</strong> ${negotiation.type}</p>
          <p><strong>With:</strong> ${negotiation.target_enterprise}</p>
          <p><strong>Started:</strong> ${timeAgo}</p>
        </div>
        <div class="negotiation-actions">
          <button class="btn-outline" onclick="NetworkUI.viewNegotiation('${negotiation.id}')">
            View Details
          </button>
          ${negotiation.status === 'pending' ? 
            '<button class="btn-primary" onclick="NetworkUI.respondToNegotiation(\'' + negotiation.id + '\')">Respond</button>' : 
            ''}
        </div>
      </div>
    `;
  }

  /**
   * Create a covenant/agreement card
   */
  static createCovenantCard(agreement) {
    const statusClass = `status-${agreement.status}`;
    
    return `
      <div class="covenant-card" data-agreement-id="${agreement.id}">
        <div class="covenant-header">
          <h3>${agreement.title}</h3>
          <div class="covenant-status ${statusClass}">${agreement.status}</div>
        </div>
        <div class="covenant-details">
          <p><strong>Type:</strong> ${agreement.type}</p>
          <p><strong>Parties:</strong> ${agreement.participating_enterprises?.join(', ') || 'Loading...'}</p>
          <p><strong>Created:</strong> ${new Date(agreement.created_at).toLocaleDateString()}</p>
          ${agreement.effective_date ? 
            `<p><strong>Effective:</strong> ${new Date(agreement.effective_date).toLocaleDateString()}</p>` : 
            ''}
        </div>
        <div class="covenant-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${this.calculateSignatureProgress(agreement)}%"></div>
          </div>
          <p class="progress-text">${agreement.signatures?.length || 0} / ${agreement.required_signers?.length || 0} signatures</p>
        </div>
        <div class="covenant-actions">
          <button class="btn-outline" onclick="NetworkUI.viewAgreement('${agreement.id}')">
            View Details
          </button>
          ${this.canSignAgreement(agreement) ? 
            '<button class="btn-primary" onclick="NetworkUI.signAgreement(\'' + agreement.id + '\')">Sign Agreement</button>' : 
            ''}
        </div>
      </div>
    `;
  }

  /**
   * Create toast notification
   */
  static createToast(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <p>${message}</p>
      </div>
    `;

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration);

    return toast;
  }

  /**
   * Create loading spinner
   */
  static createLoadingSpinner(text = 'Loading...') {
    return `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>${text}</p>
      </div>
    `;
  }

  /**
   * Create empty state message
   */
  static createEmptyState(message, actionText = null, actionCallback = null) {
    const actionButton = actionText && actionCallback ? 
      `<button class="btn-primary" onclick="${actionCallback}">${actionText}</button>` : '';

    return `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>${message}</h3>
        ${actionButton}
      </div>
    `;
  }

  /**
   * Utility: Calculate time ago
   */
  static timeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  }

  /**
   * Utility: Calculate signature progress percentage
   */
  static calculateSignatureProgress(agreement) {
    if (!agreement.signatures || !agreement.required_signers) return 0;
    return Math.floor((agreement.signatures.length / agreement.required_signers.length) * 100);
  }

  /**
   * Utility: Check if current user can sign agreement
   */
  static canSignAgreement(agreement) {
    // In a real implementation, this would check against current user's permissions
    return agreement.status === 'proposed' && 
           agreement.signatures?.length < agreement.required_signers?.length;
  }

  /**
   * Format number with commas
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Format capability tags
   */
  static formatCapabilities(capabilities) {
    if (!capabilities || capabilities.length === 0) return 'No capabilities listed';
    
    return capabilities
      .slice(0, 3)
      .map(cap => `<span class="capability-tag">${cap}</span>`)
      .join(' ') + 
      (capabilities.length > 3 ? ` <span class="capability-more">+${capabilities.length - 3} more</span>` : '');
  }

  /**
   * Animate number counting up
   */
  static animateNumber(element, endValue, duration = 1000) {
    const startValue = 0;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      element.textContent = UIComponents.formatNumber(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }

  /**
   * Show/hide modal
   */
  static showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  static hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Update element with fade transition
   */
  static updateWithFade(element, newContent) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      element.innerHTML = newContent;
      element.style.opacity = '1';
    }, 300);
  }
}

// Export for global use
window.UIComponents = UIComponents;