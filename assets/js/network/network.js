/**
 * Network Business Logic for Business Infinity Network Frontend
 * Handles network-specific operations and state management
 */

class NetworkManager {
  constructor() {
    this.api = new NetworkAPI();
    this.networkStatus = 'disconnected';
    this.localBoardroom = null;
    this.discoveredBoardrooms = [];
    this.negotiations = [];
    this.agreements = [];
    this.activityFeed = [];
    
    // Real-time update handlers
    this.updateHandlers = new Map();
    
    this.init();
  }

  async init() {
    try {
      await this.loadNetworkStatus();
      await this.loadBoardroomData();
      this.setupRealTimeUpdates();
    } catch (error) {
      console.error('Failed to initialize network manager:', error);
    }
  }

  // Network Status Management
  async loadNetworkStatus() {
    try {
      const status = await this.api.getNetworkStatus();
      this.networkStatus = status.local_node?.status || 'disconnected';
      this.localBoardroom = status.local_node;
      
      this.notifyUpdate('networkStatus', this.networkStatus);
      this.notifyUpdate('localBoardroom', this.localBoardroom);
    } catch (error) {
      console.error('Failed to load network status:', error);
      this.networkStatus = 'error';
    }
  }

  async joinNetwork(enterpriseData) {
    try {
      const result = await this.api.joinNetwork(enterpriseData);
      if (result.success) {
        this.networkStatus = 'active';
        this.localBoardroom = result.boardroom;
        
        this.notifyUpdate('networkJoined', result);
        await this.loadNetworkStatus();
        
        return { success: true, message: 'Successfully joined the network!' };
      } else {
        throw new Error(result.error || 'Failed to join network');
      }
    } catch (error) {
      console.error('Failed to join network:', error);
      return { success: false, error: error.message };
    }
  }

  async sendHeartbeat() {
    try {
      await this.api.sendHeartbeat();
      console.log('Heartbeat sent successfully');
    } catch (error) {
      console.error('Failed to send heartbeat:', error);
    }
  }

  // Discovery Management
  async discoverBoardrooms(criteria = {}) {
    try {
      const results = await this.api.discoverBoardrooms(criteria);
      this.discoveredBoardrooms = results.boardrooms || [];
      
      this.notifyUpdate('discoveryResults', this.discoveredBoardrooms);
      return this.discoveredBoardrooms;
    } catch (error) {
      console.error('Discovery failed:', error);
      return [];
    }
  }

  async getBoardroomDetails(nodeId) {
    try {
      const details = await this.api.getBoardroomDetails(nodeId);
      return details;
    } catch (error) {
      console.error('Failed to get boardroom details:', error);
      return null;
    }
  }

  // Negotiations Management
  async loadNegotiations() {
    try {
      const negotiations = await this.api.getNegotiations();
      this.negotiations = negotiations.negotiations || [];
      
      this.notifyUpdate('negotiations', this.negotiations);
      return this.negotiations;
    } catch (error) {
      console.error('Failed to load negotiations:', error);
      return [];
    }
  }

  async createNegotiation(negotiationData) {
    try {
      const result = await this.api.createNegotiation(negotiationData);
      if (result.success) {
        await this.loadNegotiations(); // Refresh the list
        return { success: true, negotiationId: result.negotiation_id };
      } else {
        throw new Error(result.error || 'Failed to create negotiation');
      }
    } catch (error) {
      console.error('Failed to create negotiation:', error);
      return { success: false, error: error.message };
    }
  }

  async respondToNegotiation(negotiationId, response) {
    try {
      const result = await this.api.respondToNegotiation(negotiationId, response);
      if (result.success) {
        await this.loadNegotiations(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to respond to negotiation');
      }
    } catch (error) {
      console.error('Failed to respond to negotiation:', error);
      return { success: false, error: error.message };
    }
  }

  getNegotiationsByStatus(status) {
    return this.negotiations.filter(neg => neg.status === status);
  }

  // Agreements Management
  async loadAgreements() {
    try {
      const agreements = await this.api.getAgreements();
      this.agreements = agreements.agreements || [];
      
      this.notifyUpdate('agreements', this.agreements);
      return this.agreements;
    } catch (error) {
      console.error('Failed to load agreements:', error);
      return [];
    }
  }

  async signAgreement(agreementId, signatureData) {
    try {
      const result = await this.api.signAgreement(agreementId, signatureData);
      if (result.success) {
        await this.loadAgreements(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to sign agreement');
      }
    } catch (error) {
      console.error('Failed to sign agreement:', error);
      return { success: false, error: error.message };
    }
  }

  async activateAgreement(agreementId) {
    try {
      const result = await this.api.activateAgreement(agreementId);
      if (result.success) {
        await this.loadAgreements(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to activate agreement');
      }
    } catch (error) {
      console.error('Failed to activate agreement:', error);
      return { success: false, error: error.message };
    }
  }

  getAgreementsByStatus(status) {
    return this.agreements.filter(agreement => agreement.status === status);
  }

  // Activity Feed Management
  async loadActivityFeed() {
    try {
      const activity = await this.api.getNetworkActivity();
      this.activityFeed = activity.activities || [];
      
      this.notifyUpdate('activityFeed', this.activityFeed);
      return this.activityFeed;
    } catch (error) {
      console.error('Failed to load activity feed:', error);
      return [];
    }
  }

  // Statistics
  async getNetworkStats() {
    try {
      const stats = await this.api.getNetworkStats();
      return stats;
    } catch (error) {
      console.error('Failed to get network stats:', error);
      return {};
    }
  }

  // Verification Management
  async getVerificationStatus() {
    try {
      const status = await this.api.getVerificationStatus();
      return status;
    } catch (error) {
      console.error('Failed to get verification status:', error);
      return { verified: false, error: error.message };
    }
  }

  async verifyEnterprise(linkedinUrl, additionalData = {}) {
    try {
      const result = await this.api.verifyEnterprise(linkedinUrl, additionalData);
      return result;
    } catch (error) {
      console.error('Failed to verify enterprise:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time Updates
  setupRealTimeUpdates() {
    this.api.connectToRealTimeUpdates((message) => {
      this.handleRealTimeUpdate(message);
    });
    
    // Setup periodic heartbeat
    setInterval(() => {
      if (this.networkStatus === 'active') {
        this.sendHeartbeat();
      }
    }, 30000); // Every 30 seconds
    
    // Setup periodic data refresh
    setInterval(() => {
      this.refreshData();
    }, 60000); // Every minute
  }

  handleRealTimeUpdate(message) {
    console.log('Real-time update received:', message);
    
    switch (message.type) {
      case 'network_update':
        this.notifyUpdate('realTimeNetworkUpdate', message.data);
        break;
      case 'new_negotiation':
        this.loadNegotiations();
        break;
      case 'agreement_signed':
        this.loadAgreements();
        break;
      case 'discovery_update':
        // Refresh discovery results if user is on discovery page
        if (window.location.hash === '#discovery') {
          this.discoverBoardrooms();
        }
        break;
    }
  }

  async refreshData() {
    try {
      await Promise.all([
        this.loadNetworkStatus(),
        this.loadActivityFeed(),
        // Only refresh other data if we're on the relevant pages
        ...(window.location.hash === '#negotiations' ? [this.loadNegotiations()] : []),
        ...(window.location.hash === '#covenants' ? [this.loadAgreements()] : [])
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }

  // Utility Methods
  async loadBoardroomData() {
    await Promise.all([
      this.loadActivityFeed(),
      this.loadNegotiations(),
      this.loadAgreements()
    ]);
  }

  // Event System for UI Updates
  onUpdate(event, handler) {
    if (!this.updateHandlers.has(event)) {
      this.updateHandlers.set(event, new Set());
    }
    this.updateHandlers.get(event).add(handler);
  }

  offUpdate(event, handler) {
    if (this.updateHandlers.has(event)) {
      this.updateHandlers.get(event).delete(handler);
    }
  }

  notifyUpdate(event, data) {
    if (this.updateHandlers.has(event)) {
      this.updateHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Update handler error:', error);
        }
      });
    }
  }

  // Search and Filter Utilities
  searchBoardrooms(query, boardrooms = null) {
    const items = boardrooms || this.discoveredBoardrooms;
    const searchTerm = query.toLowerCase();
    
    return items.filter(boardroom => 
      boardroom.enterprise_name.toLowerCase().includes(searchTerm) ||
      boardroom.industry.toLowerCase().includes(searchTerm) ||
      boardroom.location.toLowerCase().includes(searchTerm) ||
      (boardroom.capabilities && boardroom.capabilities.some(cap => 
        cap.toLowerCase().includes(searchTerm)
      ))
    );
  }

  filterNegotiations(filters) {
    let filtered = [...this.negotiations];
    
    if (filters.status) {
      filtered = filtered.filter(neg => neg.status === filters.status);
    }
    
    if (filters.type) {
      filtered = filtered.filter(neg => neg.type === filters.type);
    }
    
    if (filters.enterprise) {
      filtered = filtered.filter(neg => 
        neg.target_enterprise.toLowerCase().includes(filters.enterprise.toLowerCase())
      );
    }
    
    return filtered;
  }

  // Export/Import functionality (for data portability)
  exportNetworkData() {
    return {
      timestamp: new Date().toISOString(),
      localBoardroom: this.localBoardroom,
      discoveredBoardrooms: this.discoveredBoardrooms,
      negotiations: this.negotiations,
      agreements: this.agreements,
      activityFeed: this.activityFeed
    };
  }
}

// Export for global use
window.NetworkManager = NetworkManager;