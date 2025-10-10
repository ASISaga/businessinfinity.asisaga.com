/**
 * Main JavaScript file for Business Infinity Network Frontend
 * Coordinates UI interactions, navigation, and data presentation
 */

class NetworkUI {
  constructor() {
    this.networkManager = new NetworkManager();
    this.currentSection = 'dashboard';
    this.isLoading = false;
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupNetworkManagerListeners();
    this.setupNavigation();
    
    // Initialize dashboard
    await this.loadDashboard();
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.getAttribute('href').substring(1);
        this.navigateToSection(section);
      });
    });

    // Network actions
    document.getElementById('join-network-btn')?.addEventListener('click', () => {
      this.showJoinNetworkDialog();
    });

    document.getElementById('heartbeat-btn')?.addEventListener('click', () => {
      this.showNetworkStatusModal();
    });

    // Discovery
    document.getElementById('discover-btn')?.addEventListener('click', () => {
      this.performDiscovery();
    });

    // Negotiations
    document.getElementById('new-negotiation-btn')?.addEventListener('click', () => {
      UIComponents.showModal('new-negotiation-modal');
    });

    // Modal controls
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        UIComponents.hideModal(modal.id);
      });
    });

    // Modal overlay clicks
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          UIComponents.hideModal(modal.id);
        }
      });
    });

    // Forms
    document.getElementById('new-negotiation-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleNewNegotiationSubmit(e.target);
    });

    document.getElementById('cancel-negotiation')?.addEventListener('click', () => {
      UIComponents.hideModal('new-negotiation-modal');
    });

    // Tab switching for negotiations
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.target.getAttribute('data-tab');
        this.switchNegotiationTab(targetTab);
      });
    });
  }

  setupNetworkManagerListeners() {
    this.networkManager.onUpdate('networkStatus', (status) => {
      this.updateNetworkStatus(status);
    });

    this.networkManager.onUpdate('discoveryResults', (results) => {
      this.renderDiscoveryResults(results);
    });

    this.networkManager.onUpdate('negotiations', (negotiations) => {
      this.renderNegotiations(negotiations);
    });

    this.networkManager.onUpdate('agreements', (agreements) => {
      this.renderCovenants(agreements);
    });

    this.networkManager.onUpdate('activityFeed', (activities) => {
      this.renderActivityFeed(activities);
    });

    this.networkManager.onUpdate('realTimeNetworkUpdate', (data) => {
      this.updateRealtimeStats(data);
    });
  }

  setupNavigation() {
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      const section = window.location.hash.substring(1) || 'dashboard';
      this.navigateToSection(section, false);
    });

    // Set initial section based on hash
    const initialSection = window.location.hash.substring(1) || 'dashboard';
    this.navigateToSection(initialSection, false);
  }

  // Navigation
  navigateToSection(sectionName, pushState = true) {
    if (this.currentSection === sectionName) return;

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionName}`) {
        link.classList.add('active');
      }
    });

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    this.currentSection = sectionName;

    // Update URL
    if (pushState) {
      window.history.pushState(null, null, `#${sectionName}`);
    }

    // Load section-specific data
    this.loadSectionData(sectionName);
  }

  async loadSectionData(sectionName) {
    switch (sectionName) {
      case 'dashboard':
        await this.loadDashboard();
        break;
      case 'discovery':
        await this.loadDiscovery();
        break;
      case 'negotiations':
        await this.loadNegotiations();
        break;
      case 'covenants':
        await this.loadCovenants();
        break;
      case 'verification':
        await this.loadVerification();
        break;
    }
  }

  // Dashboard
  async loadDashboard() {
    try {
      this.setLoading(true);
      
      const stats = await this.networkManager.getNetworkStats();
      this.updateDashboardStats(stats);
      
      await this.networkManager.loadActivityFeed();
      
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      UIComponents.createToast('Failed to load dashboard data', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  updateDashboardStats(stats) {
    // Update stat cards
    const elements = {
      'network-nodes': stats.total_registered || 1247,
      'active-agreements': stats.active_agreements || 23,
      'active-negotiations': stats.active_negotiations || 7
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        UIComponents.animateNumber(element, value);
      }
    });

    // Update boardroom status
    const statusElement = document.getElementById('boardroom-status');
    if (statusElement && this.networkManager.localBoardroom) {
      statusElement.textContent = this.networkManager.localBoardroom.is_verified ? 'Verified' : 'Unverified';
    }
  }

  renderActivityFeed(activities) {
    const feedContainer = document.getElementById('activity-feed');
    if (!feedContainer) return;

    if (activities.length === 0) {
      feedContainer.innerHTML = UIComponents.createEmptyState('No recent network activity');
      return;
    }

    const activityHtml = activities.map(activity => 
      UIComponents.createActivityItem(activity)
    ).join('');

    UIComponents.updateWithFade(feedContainer, activityHtml);
  }

  // Discovery
  async loadDiscovery() {
    // Discovery page loads on demand when user searches
    const resultsContainer = document.getElementById('discovery-results');
    if (resultsContainer && this.networkManager.discoveredBoardrooms.length === 0) {
      resultsContainer.innerHTML = UIComponents.createEmptyState(
        'Discover verified boardrooms across the network',
        'Start Discovery',
        'this.performDiscovery()'
      );
    }
  }

  async performDiscovery() {
    const criteria = this.getDiscoveryCriteria();
    
    try {
      this.setLoading(true);
      await this.networkManager.discoverBoardrooms(criteria);
    } catch (error) {
      console.error('Discovery failed:', error);
      UIComponents.createToast('Discovery failed', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  getDiscoveryCriteria() {
    return {
      industry: document.getElementById('industry-filter')?.value || '',
      location: document.getElementById('location-filter')?.value || '',
      capabilities: document.getElementById('capability-filter')?.value || '',
      maxResults: 20
    };
  }

  renderDiscoveryResults(boardrooms) {
    const container = document.getElementById('discovery-results');
    if (!container) return;

    if (boardrooms.length === 0) {
      container.innerHTML = UIComponents.createEmptyState('No boardrooms found matching your criteria');
      return;
    }

    const boardroomCards = boardrooms.map(boardroom => 
      UIComponents.createBoardroomCard(boardroom)
    ).join('');

    UIComponents.updateWithFade(container, boardroomCards);
  }

  // Negotiations
  async loadNegotiations() {
    try {
      this.setLoading(true);
      await this.networkManager.loadNegotiations();
      this.switchNegotiationTab('active-negotiations'); // Default tab
    } catch (error) {
      console.error('Failed to load negotiations:', error);
      UIComponents.createToast('Failed to load negotiations', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  switchNegotiationTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      }
    });

    // Filter negotiations based on tab
    let filteredNegotiations = [];
    switch (tabName) {
      case 'active-negotiations':
        filteredNegotiations = this.networkManager.getNegotiationsByStatus('active');
        break;
      case 'pending-negotiations':
        filteredNegotiations = this.networkManager.getNegotiationsByStatus('pending');
        break;
      case 'completed-negotiations':
        filteredNegotiations = this.networkManager.getNegotiationsByStatus('completed');
        break;
    }

    this.renderNegotiations(filteredNegotiations);
  }

  renderNegotiations(negotiations) {
    const container = document.getElementById('negotiations-content');
    if (!container) return;

    if (negotiations.length === 0) {
      container.innerHTML = UIComponents.createEmptyState(
        'No negotiations in this category',
        'Start New Negotiation',
        'UIComponents.showModal("new-negotiation-modal")'
      );
      return;
    }

    const negotiationCards = negotiations.map(negotiation => 
      UIComponents.createNegotiationCard(negotiation)
    ).join('');

    UIComponents.updateWithFade(container, negotiationCards);
  }

  async handleNewNegotiationSubmit(form) {
    const formData = new FormData(form);
    const negotiationData = {
      type: formData.get('negotiation-type'),
      target_boardroom: formData.get('target-boardroom'),
      title: formData.get('negotiation-title'),
      description: formData.get('negotiation-description')
    };

    try {
      const result = await this.networkManager.createNegotiation(negotiationData);
      
      if (result.success) {
        UIComponents.createToast('Negotiation started successfully!', 'success');
        UIComponents.hideModal('new-negotiation-modal');
        form.reset();
        
        // Switch to active negotiations tab
        this.switchNegotiationTab('active-negotiations');
      } else {
        UIComponents.createToast(result.error || 'Failed to start negotiation', 'error');
      }
    } catch (error) {
      console.error('Failed to create negotiation:', error);
      UIComponents.createToast('Failed to start negotiation', 'error');
    }
  }

  // Covenants
  async loadCovenants() {
    try {
      this.setLoading(true);
      await this.networkManager.loadAgreements();
    } catch (error) {
      console.error('Failed to load covenants:', error);
      UIComponents.createToast('Failed to load agreements', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  renderCovenants(agreements) {
    const container = document.getElementById('covenants-grid');
    if (!container) return;

    if (agreements.length === 0) {
      container.innerHTML = UIComponents.createEmptyState('No agreements found');
      return;
    }

    const covenantCards = agreements.map(agreement => 
      UIComponents.createCovenantCard(agreement)
    ).join('');

    UIComponents.updateWithFade(container, covenantCards);
  }

  // Verification
  async loadVerification() {
    try {
      const status = await this.networkManager.getVerificationStatus();
      this.updateVerificationDisplay(status);
    } catch (error) {
      console.error('Failed to load verification status:', error);
      UIComponents.createToast('Failed to load verification status', 'error');
    }
  }

  updateVerificationDisplay(status) {
    const card = document.getElementById('verification-card');
    const companyName = document.getElementById('company-name');
    const companyIndustry = document.getElementById('company-industry');
    const verificationDate = document.getElementById('verification-date');
    const verificationExpires = document.getElementById('verification-expires');

    if (status.verified) {
      card?.classList.add('verified');
      if (companyName) companyName.textContent = status.company_name || 'Example Corp';
      if (companyIndustry) companyIndustry.textContent = status.industry || 'Technology';
      if (verificationDate) verificationDate.textContent = status.verified_at || '2024-01-15';
      if (verificationExpires) verificationExpires.textContent = status.expires_at || '2025-01-15';
    } else {
      card?.classList.remove('verified');
    }
  }

  // Utility Methods
  setLoading(isLoading) {
    this.isLoading = isLoading;
    document.body.style.cursor = isLoading ? 'wait' : '';
  }

  updateNetworkStatus(status) {
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
      statusIndicator.className = `status-indicator ${status === 'active' ? 'active' : 'inactive'}`;
    }
  }

  updateRealtimeStats(data) {
    if (data.nodes_online) {
      const element = document.getElementById('network-nodes');
      if (element) {
        element.textContent = UIComponents.formatNumber(data.nodes_online);
      }
    }
  }

  // Modal Actions
  showJoinNetworkDialog() {
    // In a real implementation, this would show a form for joining the network
    UIComponents.createToast('Join network functionality would be implemented here', 'info');
  }

  async showNetworkStatusModal() {
    try {
      const status = await this.networkManager.getNetworkStats();
      const statusDetails = document.getElementById('network-status-details');
      
      if (statusDetails) {
        statusDetails.innerHTML = `
          <div class="status-grid">
            <div class="status-item">
              <strong>Network Status:</strong> ${this.networkManager.networkStatus}
            </div>
            <div class="status-item">
              <strong>Total Nodes:</strong> ${status.total_registered || 0}
            </div>
            <div class="status-item">
              <strong>Active Negotiations:</strong> ${status.active_negotiations || 0}
            </div>
            <div class="status-item">
              <strong>Active Agreements:</strong> ${status.active_agreements || 0}
            </div>
            <div class="status-item">
              <strong>Last Heartbeat:</strong> ${new Date().toLocaleTimeString()}
            </div>
          </div>
        `;
      }
      
      UIComponents.showModal('network-status-modal');
    } catch (error) {
      console.error('Failed to load network status:', error);
      UIComponents.createToast('Failed to load network status', 'error');
    }
  }

  // Boardroom Actions
  async viewBoardroom(nodeId) {
    try {
      const details = await this.networkManager.getBoardroomDetails(nodeId);
      // Show boardroom details in a modal or navigate to detail page
      UIComponents.createToast(`Viewing details for ${details?.enterprise_name || 'boardroom'}`, 'info');
    } catch (error) {
      console.error('Failed to view boardroom:', error);
      UIComponents.createToast('Failed to load boardroom details', 'error');
    }
  }

  async startNegotiation(nodeId) {
    // Pre-fill negotiation form with target boardroom
    const targetInput = document.getElementById('target-boardroom');
    if (targetInput) {
      const boardroom = this.networkManager.discoveredBoardrooms.find(b => b.node_id === nodeId);
      targetInput.value = boardroom?.enterprise_name || nodeId;
    }
    
    UIComponents.showModal('new-negotiation-modal');
  }

  async viewNegotiation(negotiationId) {
    UIComponents.createToast(`Viewing negotiation ${negotiationId}`, 'info');
  }

  async respondToNegotiation(negotiationId) {
    UIComponents.createToast(`Responding to negotiation ${negotiationId}`, 'info');
  }

  async viewAgreement(agreementId) {
    UIComponents.createToast(`Viewing agreement ${agreementId}`, 'info');
  }

  async signAgreement(agreementId) {
    try {
      const result = await this.networkManager.signAgreement(agreementId, {
        signer_agent: 'CEO', // In a real app, this would be determined by user role
        signature_method: 'digital'
      });
      
      if (result.success) {
        UIComponents.createToast('Agreement signed successfully!', 'success');
      } else {
        UIComponents.createToast(result.error || 'Failed to sign agreement', 'error');
      }
    } catch (error) {
      console.error('Failed to sign agreement:', error);
      UIComponents.createToast('Failed to sign agreement', 'error');
    }
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.networkUI = new NetworkUI();
});

// Export for global access
window.NetworkUI = NetworkUI;