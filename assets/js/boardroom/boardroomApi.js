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

  /**
   * Ask a specific agent a question
   * @param {string} role - Agent role (CEO, CFO, CTO, etc.)
   * @param {string} message - Question or request
   * @param {object} context - Optional context
   */
  async askAgent(role, message, context = {}) {
    const { path, method } = getApiPath('askAgent', { role });
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify({ message, context })
    });
    return await res.json();
  }

  /**
   * Create a strategic decision
   * @param {string} type - Decision type (strategic, financial, technical, operational)
   * @param {string} context - Decision context
   * @param {array} stakeholders - Optional list of agent roles
   * @param {object} params - Optional additional parameters
   */
  async createDecision(type, context, stakeholders = [], params = {}) {
    const { path, method } = getApiPath('createStrategicDecision');
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify({ type, context, stakeholders, params })
    });
    return await res.json();
  }

  /**
   * Execute a business workflow
   * @param {string} workflowName - Name of workflow (product_launch, funding_round, etc.)
   * @param {object} params - Workflow-specific parameters
   */
  async executeWorkflow(workflowName, params = {}) {
    const { path, method } = getApiPath('executeWorkflow', { workflow_name: workflowName });
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify({ params })
    });
    return await res.json();
  }

  /**
   * Get system health status
   */
  async getHealth() {
    const { path, method } = getApiPath('getHealth');
    return await fetch(path, { method, headers: this.authHeader() }).then(r => r.json());
  }
}
