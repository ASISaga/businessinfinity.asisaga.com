/**
 * Agent Chat Web Component
 * 
 * Provides a chat interface for interacting with C-Suite agents.
 * Supports real-time messaging via AOS Service Bus.
 */
import { buildApiUrl } from './apiRoutes.js';

class AgentChat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._messages = [];
        this._currentAgent = null;
        this._agents = [];
    }

    static get observedAttributes() {
        return ['agent', 'compact'];
    }

    connectedCallback() {
        this._currentAgent = this.getAttribute('agent') || null;
        this._render();
        this._fetchAgents();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'agent' && oldValue !== newValue) {
            this._currentAgent = newValue;
            this._messages = [];
            this._updateChatDisplay();
        }
        if (name === 'compact') {
            this._render();
        }
    }

    async _fetchAgents() {
        try {
            const response = await fetch(buildApiUrl('/agents'));
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            this._agents = data.agents || [];
            this._updateAgentSelector();
        } catch (error) {
            console.error('AgentChat: Failed to fetch agents', error);
        }
    }

    async _sendMessage(message) {
        if (!message.trim() || !this._currentAgent) return;

        // Add user message to chat
        this._messages.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        this._updateChatDisplay();

        // Clear input
        const input = this.shadowRoot.getElementById('messageInput');
        input.value = '';
        input.disabled = true;

        const sendBtn = this.shadowRoot.getElementById('sendBtn');
        sendBtn.disabled = true;
        sendBtn.textContent = '...';

        // Add typing indicator
        this._addTypingIndicator();

        try {
            const response = await fetch(buildApiUrl(`/agents/${this._currentAgent}/ask`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, context: {} })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();

            // Remove typing indicator and add agent response
            this._removeTypingIndicator();
            this._messages.push({
                role: 'agent',
                agent: this._currentAgent,
                content: result.response || 'No response received',
                via: result.via || 'unknown',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            this._removeTypingIndicator();
            this._messages.push({
                role: 'error',
                content: `Error: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        } finally {
            input.disabled = false;
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send';
            input.focus();
            this._updateChatDisplay();
        }
    }

    _addTypingIndicator() {
        const messagesEl = this.shadowRoot.getElementById('messages');
        const typingEl = document.createElement('div');
        typingEl.className = 'message message-typing';
        typingEl.id = 'typingIndicator';
        typingEl.innerHTML = `
      <div class="message-avatar">${this._currentAgent?.substring(0, 2) || 'AI'}</div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
        messagesEl.appendChild(typingEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    _removeTypingIndicator() {
        const typingEl = this.shadowRoot.getElementById('typingIndicator');
        if (typingEl) typingEl.remove();
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _render() {
        const isCompact = this.hasAttribute('compact');

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .agent-chat {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: ${isCompact ? '400px' : '600px'};
        }
        
        .chat-header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .chat-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }
        
        .chat-icon {
          font-size: 1.25rem;
        }
        
        .agent-selector {
          padding: 0.375rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .agent-selector option {
          background: #1e293b;
          color: white;
        }
        
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #f8fafc;
        }
        
        .message {
          display: flex;
          gap: 0.5rem;
          max-width: 85%;
        }
        
        .message-user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        
        .message-agent {
          align-self: flex-start;
        }
        
        .message-error {
          align-self: center;
        }
        
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        
        .message-user .message-avatar {
          background: #2563eb;
          color: white;
        }
        
        .message-agent .message-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .message-content {
          background: white;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        .message-user .message-content {
          background: #2563eb;
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .message-agent .message-content {
          border-bottom-left-radius: 4px;
        }
        
        .message-error .message-content {
          background: #fee2e2;
          color: #dc2626;
          border-radius: 8px;
        }
        
        .message-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 0.375rem;
          font-size: 0.6875rem;
          color: #94a3b8;
        }
        
        .message-user .message-meta {
          color: rgba(255, 255, 255, 0.7);
          justify-content: flex-end;
        }
        
        .via-badge {
          padding: 0.0625rem 0.25rem;
          border-radius: 3px;
          font-size: 0.625rem;
          font-weight: 500;
        }
        
        .via-badge.servicebus {
          background: #dbeafe;
          color: #1d4ed8;
        }
        
        .via-badge.local {
          background: #d1fae5;
          color: #059669;
        }
        
        .message-user .via-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .typing-dots {
          display: flex;
          gap: 0.25rem;
        }
        
        .typing-dots span {
          width: 6px;
          height: 6px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
        
        .chat-input {
          padding: 0.75rem 1rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 0.5rem;
          background: white;
        }
        
        .chat-input input {
          flex: 1;
          padding: 0.625rem 0.875rem;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        
        .chat-input input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .chat-input input:disabled {
          background: #f1f5f9;
        }
        
        .send-btn {
          padding: 0.625rem 1.25rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .send-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }
        
        .send-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        
        .empty-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }
        
        .empty-chat-icon {
          font-size: 3rem;
          margin-bottom: 0.75rem;
          opacity: 0.5;
        }
        
        .empty-chat h3 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .empty-chat p {
          margin: 0;
          font-size: 0.875rem;
        }
      </style>
      
      <div class="agent-chat">
        <div class="chat-header">
          <div class="chat-title">
            <span class="chat-icon">💬</span>
            <span>Agent Chat</span>
          </div>
          <select class="agent-selector" id="agentSelector">
            <option value="">Select Agent...</option>
          </select>
        </div>
        
        <div class="messages" id="messages">
          <div class="empty-chat">
            <div class="empty-chat-icon">🤵</div>
            <h3>Start a Conversation</h3>
            <p>Select an agent and type a message to begin</p>
          </div>
        </div>
        
        <div class="chat-input">
          <input type="text" id="messageInput" placeholder="Type your message..." 
            ${!this._currentAgent ? 'disabled' : ''} />
          <button class="send-btn" id="sendBtn" ${!this._currentAgent ? 'disabled' : ''}>Send</button>
        </div>
      </div>
    `;

        // Event handlers
        const input = this.shadowRoot.getElementById('messageInput');
        const sendBtn = this.shadowRoot.getElementById('sendBtn');
        const selector = this.shadowRoot.getElementById('agentSelector');

        sendBtn.addEventListener('click', () => {
            this._sendMessage(input.value);
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._sendMessage(input.value);
            }
        });

        selector.addEventListener('change', (e) => {
            this._currentAgent = e.target.value || null;
            this._messages = [];
            input.disabled = !this._currentAgent;
            sendBtn.disabled = !this._currentAgent;
            this._updateChatDisplay();
        });
    }

    _updateAgentSelector() {
        const selector = this.shadowRoot.getElementById('agentSelector');
        selector.innerHTML = `
      <option value="">Select Agent...</option>
      ${this._agents.map(agent => {
            const role = agent.role || agent.name || 'Unknown';
            return `<option value="${role}" ${this._currentAgent === role ? 'selected' : ''}>${role}</option>`;
        }).join('')}
    `;
    }

    _updateChatDisplay() {
        const messagesEl = this.shadowRoot.getElementById('messages');

        if (this._messages.length === 0) {
            messagesEl.innerHTML = `
        <div class="empty-chat">
          <div class="empty-chat-icon">🤵</div>
          <h3>${this._currentAgent ? `Chat with ${this._currentAgent}` : 'Start a Conversation'}</h3>
          <p>${this._currentAgent ? 'Type a message to begin' : 'Select an agent and type a message to begin'}</p>
        </div>
      `;
            return;
        }

        messagesEl.innerHTML = this._messages.map(msg => {
            if (msg.role === 'user') {
                return `
          <div class="message message-user">
            <div class="message-avatar">You</div>
            <div class="message-content">
              ${this._escapeHtml(msg.content)}
              <div class="message-meta">
                <span>${new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        `;
            } else if (msg.role === 'agent') {
                return `
          <div class="message message-agent">
            <div class="message-avatar">${msg.agent?.substring(0, 2) || 'AI'}</div>
            <div class="message-content">
              ${this._escapeHtml(msg.content)}
              <div class="message-meta">
                <span class="via-badge ${msg.via}">${msg.via === 'servicebus' ? '📡 SB' : '🔗 Local'}</span>
                <span>${new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        `;
            } else {
                return `
          <div class="message message-error">
            <div class="message-content">${this._escapeHtml(msg.content)}</div>
          </div>
        `;
            }
        }).join('');

        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
}

customElements.define('agent-chat', AgentChat);

export { AgentChat };
