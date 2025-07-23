// BoardroomAPI: Handles all API interactions for the Boardroom client app
export class BoardroomAPI {
  /**
   * Initialize API base URL from site config
   */
  constructor() {
    this.API = "{{ site.apibaseurl }}";
  }

  /**
   * Returns Authorization header if access_token is present in localStorage
   */
  authHeader() {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Fetches list of agents (C-suite avatars)
   */
  async getAgents() {
    return await fetch(`${this.API}/agents`, { headers: this.authHeader() }).then(r => r.json());
  }

  /**
   * Fetches full profile for a given agent
   * @param {string} agentId
   */
  async getAgentProfile(agentId) {
    return await fetch(`${this.API}/agents/${agentId}`, { headers: this.authHeader() }).then(r => r.json());
  }

  /**
   * Starts a new conversation with the selected agent
   * @param {string} agentId
   */
  async startConversation(agentId) {
    const res = await fetch(`${this.API}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify({ domain: agentId })
    });
    return await res.json();
  }

  /**
   * Sends a message to the current conversation
   * @param {string} convId
   * @param {string} text
   */
  async sendMessage(convId, text) {
    await fetch(`${this.API}/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify({ message: text })
    });
  }

  /**
   * Fetches all messages for the current conversation
   * @param {string} convId
   */
  async getMessages(convId) {
    return await fetch(`${this.API}/conversations/${convId}/messages`, { headers: this.authHeader() })
      .then(r => r.json())
      .then(b => b.messages);
  }
}
