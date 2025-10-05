/**
 * API Client for Business Infinity Network
 * Handles communication with the backend network services
 */

class NetworkAPI {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make HTTP request with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Network Status API
  async getNetworkStatus() {
    return await this.request('/api/network/status');
  }

  async joinNetwork(nodeData) {
    return await this.request('/api/network/join', {
      method: 'POST',
      body: JSON.stringify(nodeData)
    });
  }

  async leaveNetwork() {
    return await this.request('/api/network/leave', {
      method: 'POST'
    });
  }

  async sendHeartbeat() {
    return await this.request('/api/network/heartbeat', {
      method: 'POST'
    });
  }

  // Discovery API
  async discoverBoardrooms(criteria = {}) {
    const params = new URLSearchParams();
    
    if (criteria.industry) params.append('industry', criteria.industry);
    if (criteria.location) params.append('location', criteria.location);
    if (criteria.capabilities) params.append('capabilities', criteria.capabilities);
    if (criteria.maxResults) params.append('max_results', criteria.maxResults);
    
    const queryString = params.toString();
    const endpoint = `/api/network/discover${queryString ? '?' + queryString : ''}`;
    
    return await this.request(endpoint);
  }

  async getBoardroomDetails(nodeId) {
    return await this.request(`/api/network/boardrooms/${nodeId}`);
  }

  // Negotiations API
  async getNegotiations(status = '') {
    const endpoint = `/api/network/negotiations${status ? '?status=' + status : ''}`;
    return await this.request(endpoint);
  }

  async createNegotiation(negotiationData) {
    return await this.request('/api/network/negotiations', {
      method: 'POST',
      body: JSON.stringify(negotiationData)
    });
  }

  async getNegotiation(negotiationId) {
    return await this.request(`/api/network/negotiations/${negotiationId}`);
  }

  async respondToNegotiation(negotiationId, response) {
    return await this.request(`/api/network/negotiations/${negotiationId}/respond`, {
      method: 'POST',
      body: JSON.stringify(response)
    });
  }

  // Covenant Ledger API
  async getAgreements(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.nodeId) params.append('node_id', filters.nodeId);
    
    const queryString = params.toString();
    const endpoint = `/api/network/agreements${queryString ? '?' + queryString : ''}`;
    
    return await this.request(endpoint);
  }

  async getAgreement(agreementId) {
    return await this.request(`/api/network/agreements/${agreementId}`);
  }

  async createAgreement(agreementData) {
    return await this.request('/api/network/agreements', {
      method: 'POST',
      body: JSON.stringify(agreementData)
    });
  }

  async signAgreement(agreementId, signatureData) {
    return await this.request(`/api/network/agreements/${agreementId}/sign`, {
      method: 'POST',
      body: JSON.stringify(signatureData)
    });
  }

  async activateAgreement(agreementId) {
    return await this.request(`/api/network/agreements/${agreementId}/activate`, {
      method: 'POST'
    });
  }

  async terminateAgreement(agreementId, reason) {
    return await this.request(`/api/network/agreements/${agreementId}/terminate`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  // Verification API
  async getVerificationStatus() {
    return await this.request('/api/network/verification');
  }

  async verifyEnterprise(linkedinUrl, additionalData = {}) {
    return await this.request('/api/network/verification/verify', {
      method: 'POST',
      body: JSON.stringify({
        linkedin_url: linkedinUrl,
        additional_data: additionalData
      })
    });
  }

  async verifyEmployee(employeeLinkedinUrl, companyLinkedinUrl) {
    return await this.request('/api/network/verification/employee', {
      method: 'POST',
      body: JSON.stringify({
        employee_linkedin_url: employeeLinkedinUrl,
        company_linkedin_url: companyLinkedinUrl
      })
    });
  }

  // Activity Feed API
  async getNetworkActivity(limit = 20) {
    return await this.request(`/api/network/activity?limit=${limit}`);
  }

  // Statistics API
  async getNetworkStats() {
    return await this.request('/api/network/stats');
  }

  async getBoardroomStats() {
    return await this.request('/api/network/boardroom/stats');
  }

  // Real-time updates (placeholder for WebSocket connection)
  connectToRealTimeUpdates(onMessage) {
    // In a real implementation, this would establish a WebSocket connection
    console.log('Real-time updates would be connected here');
    
    // Simulate periodic updates for demo
    setInterval(() => {
      onMessage({
        type: 'network_update',
        timestamp: new Date().toISOString(),
        data: { nodes_online: Math.floor(Math.random() * 50) + 1200 }
      });
    }, 30000); // Update every 30 seconds
  }
}

// Export for use in other modules
window.NetworkAPI = NetworkAPI;