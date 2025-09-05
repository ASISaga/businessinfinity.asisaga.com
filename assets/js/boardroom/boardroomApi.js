// BoardroomAPI: Handles all API interactions for the Boardroom client app
import { getApiPath } from '../apiRoutes.js';

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
    const { path, method } = getApiPath('getAgents');
    return await fetch(path, { method, headers: this.authHeader() }).then(r => r.json());
  }

  /**
   * Fetches full profile for a given agent
   * @param {string} agentId
   */
  async getAgentProfile(agentId) {
    const { path, method } = getApiPath('getAgentProfile', { agentId });
    return await fetch(path, { method, headers: this.authHeader() }).then(r => r.json());
  }

  /**
   * Starts a new conversation with the selected agent
   * @param {string} agentId
   */
  async startConversation(agentId) {
    const { path, method } = getApiPath('startConversation');
    const res = await fetch(path, {
      method,
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
    const { path, method } = getApiPath('postConversationMessage', { id: convId });
    await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify({ message: text })
    });
  }

  /**
   * Fetches all messages for the current conversation
   * @param {string} convId
   */
  async getMessages(convId) {
    const { path, method } = getApiPath('getConversationMessages', { id: convId });
    return await fetch(path, { method, headers: this.authHeader() })
      .then(r => r.json())
      .then(b => b.messages);
  }
}
