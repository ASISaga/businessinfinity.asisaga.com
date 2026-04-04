/**
 * Boardroom Web Component
 * Extends the generic chatroom for business-specific features.
 * Includes: agent list, profiles, toggle strip, members sidebar.
 *
 * Chat messages are routed through the server-side CopilotKit runtime
 * (@copilotkit/sdk-js compatible AG-UI HTTP protocol) when a
 * `copilotkit-runtime-url` attribute is present on the element.
 */

// Import ChatroomApp from the remote theme
// This path will be resolved by GitHub Pages through the remote_theme configuration
import ChatroomApp from '/assets/js/chatroom-app.js';
import { CopilotKitClient } from '/assets/js/copilotkit-client.js';

class BoardroomApp extends ChatroomApp {
    constructor() {
        super();

        // Boardroom-specific configuration
        this.boardroomConfig = {
            showToggleStrip: this.hasAttribute('show-toggle-strip'),
            showMembersSidebar: this.hasAttribute('show-members-sidebar'),
            showAgentProfiles: this.hasAttribute('show-agent-profiles'),
            apiBase: this.getAttribute('api-base') || '/api/boardroom',
            enableScreenShare: this.hasAttribute('enable-screen-share'),
            enableVideoCall: this.hasAttribute('enable-video-call'),
            enableFileAttach: this.hasAttribute('enable-file-attach'),
            enableFormatting: this.hasAttribute('enable-formatting'),
            copilotKitRuntimeUrl: this.getAttribute('copilotkit-runtime-url') || null,
        };

        // Boardroom state
        this.agents = [];
        this.currentAgent = null;
        this.conversationId = null;
        this.members = [];

        // CopilotKit client – initialised in connectedCallback if runtime URL is set
        this.copilotKit = null;
    }

    async connectedCallback() {
        // Call parent connectedCallback
        await super.connectedCallback();

        // Initialize boardroom-specific features
        await this.initializeBoardroom();

        // Emit boardroom-ready event
        this.dispatchEvent(new CustomEvent('boardroom-ready', {
            bubbles: true,
            detail: { config: { ...this.config, ...this.boardroomConfig } }
        }));
    }

    async initializeBoardroom() {
        // Initialize the CopilotKit runtime client if a URL was provided
        this._initCopilotKit();

        // Load agents if agent profiles are enabled
        if (this.boardroomConfig.showAgentProfiles) {
            await this.loadAgents();
        }

        // Initialize toggle strip
        if (this.boardroomConfig.showToggleStrip) {
            this.initializeToggleStrip();
        }

        // Initialize members sidebar
        if (this.boardroomConfig.showMembersSidebar) {
            this.initializeMembersSidebar();
        }

        // Attach boardroom-specific event handlers
        this.attachBoardroomEventHandlers();
    }

    /**
     * Initialise the CopilotKit client that connects to the server-side
     * CopilotKit runtime (@copilotkit/sdk-js / AG-UI HTTP protocol).
     *
     * The runtime URL is read from the `copilotkit-runtime-url` element attribute.
     * Falls back gracefully to the legacy REST API when no URL is supplied.
     */
    _initCopilotKit() {
        const runtimeUrl = this.boardroomConfig.copilotKitRuntimeUrl;
        if (!runtimeUrl) return;

        this.copilotKit = new CopilotKitClient({ runtimeUrl });

        // Stream each incoming token into the active AI bubble
        this.copilotKit.onStreamChunk = (chunk, messageId) => {
            this._appendStreamChunk(chunk, messageId);
        };

        // Called when the AI starts a new message
        this.copilotKit.onMessageStart = (messageId, agentName) => {
            this._createStreamingBubble(messageId, agentName || this.currentAgent?.name);
        };

        // Called when the AI message is complete
        this.copilotKit.onMessageEnd = (messageId, fullContent) => {
            this._finalizeStreamingBubble(messageId, fullContent);
        };

        // Error handler
        this.copilotKit.onError = (error) => {
            console.error('[CopilotKit] Error:', error);
            this.showToast('AI response error – please try again', 'error');
            this.hideLoading();
        };
    }

    initializeElements() {
        // Call parent initializeElements
        super.initializeElements();

        // Get boardroom-specific elements
        this.boardroomElements = {
            // Toggle strip in partials uses the members-sidebar naming; fall back to legacy class if present
            toggleStrip: this.querySelector('.boardroom-members-sidebar-toggle-strip') || this.querySelector('.boardroom-toggle-strip'),
            membersSidebar: this.querySelector('.boardroom-members-sidebar'),
            // Members list container provided by Jekyll partials
            agentList: this.querySelector('#membersListContainer'),
            chatArea: this.querySelector('.boardroom-chat-area'),
            // Optional profile detail section; tolerate absence
            profileDetail: this.querySelector('[data-boardroom-region="profile"]') || this.querySelector('#profile-detail'),
            loadingOverlay: this.querySelector('.boardroom-loading-overlay'),
            toastContainer: this.querySelector('.boardroom-toast-container')
        };
    }

    attachBoardroomEventHandlers() {
        // Agent selection
        if (this.boardroomElements.agentList) {
            this.boardroomElements.agentList.addEventListener('click', (e) => {
                const agentItem = e.target.closest('[data-agent-id]');
                if (agentItem) {
                    const agentId = agentItem.dataset.agentId;
                    this.selectAgent(agentId);
                }
            });
        }

        // Screen share button
        const screenShareBtn = this.querySelector('[title="Screen Share"]');
        if (screenShareBtn && this.boardroomConfig.enableScreenShare) {
            screenShareBtn.addEventListener('click', () => this.startScreenShare());
        }

        // Video call button
        const videoCallBtn = this.querySelector('[title="Video Call"]');
        if (videoCallBtn && this.boardroomConfig.enableVideoCall) {
            videoCallBtn.addEventListener('click', () => this.startVideoCall());
        }

        // File attach button
        const fileAttachBtn = this.querySelector('[title="Attach File"]');
        if (fileAttachBtn && this.boardroomConfig.enableFileAttach) {
            fileAttachBtn.addEventListener('click', () => this.attachFile());
        }
    }

    initializeToggleStrip() {
        if (!this.boardroomElements.toggleStrip) return;

        const toggleButtons = this.boardroomElements.toggleStrip.querySelectorAll('[data-toggle-view]');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.toggleView;
                this.toggleView(view);
            });
        });

        const membersToggleBtn = this.querySelector('#toggleMembersBtn');
        if (membersToggleBtn && this.boardroomElements.membersSidebar) {
            membersToggleBtn.addEventListener('click', () => {
                const willHide = !this.boardroomElements.membersSidebar.classList.contains('hidden');
                this.boardroomElements.membersSidebar.classList.toggle('hidden', willHide);
                membersToggleBtn.setAttribute('aria-expanded', (!willHide).toString());

                const icon = this.querySelector('#membersSidebarToggleIcon img');
                if (icon) {
                    icon.setAttribute('alt', willHide ? 'Expand' : 'Collapse');
                }
            });
        }
    }

    initializeMembersSidebar() {
        if (!this.boardroomElements.membersSidebar) return;

        // Search functionality
        const searchInput = this.boardroomElements.membersSidebar.querySelector('.boardroom-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterMembers(e.target.value);
            });
        }
    }

    async loadAgents() {
        try {
            const response = await fetch(`${this.boardroomConfig.apiBase}/agents`);
            if (response.ok) {
                this.agents = await response.json();
                this.renderAgents();
            }
        } catch (error) {
            console.error('Error loading agents:', error);
            this.showToast('Failed to load agents', 'error');
        }
    }

    renderAgents() {
        if (!this.boardroomElements.agentList) return;

        this.boardroomElements.agentList.innerHTML = '';

        this.agents.forEach(agent => {
            const agentItem = document.createElement('div');
            agentItem.className = 'boardroom-agent-item';
            agentItem.dataset.agentId = agent.agentId;
            agentItem.innerHTML = `
        <img src="${agent.avatar}" alt="${agent.name}" class="boardroom-agent-avatar">
        <div class="boardroom-agent-info">
          <div class="boardroom-agent-name">${agent.name}</div>
          <div class="boardroom-agent-role">${agent.role}</div>
        </div>
        <span class="boardroom-agent-status ${agent.online ? 'online' : 'offline'}"></span>
      `;
            this.boardroomElements.agentList.appendChild(agentItem);
        });
    }

    async selectAgent(agentId) {
        this.showLoading('Connecting to agent...');

        try {
            // Highlight selected agent
            this.boardroomElements.agentList.querySelectorAll('.boardroom-agent-item').forEach(item => {
                item.classList.remove('active');
            });
            const selectedItem = this.boardroomElements.agentList.querySelector(`[data-agent-id="${agentId}"]`);
            if (selectedItem) {
                selectedItem.classList.add('active');
            }

            this.currentAgent = this.agents.find(a => a.agentId === agentId);

            // Inform the CopilotKit client which agent is now active so that
            // subsequent messages are routed to the correct runtime agent.
            if (this.copilotKit) {
                this.copilotKit.setAgent(agentId);
                // Start a fresh conversation thread for the new agent
                this.copilotKit.resetThread();
            }

            // Load agent profile
            const profileResponse = await fetch(`${this.boardroomConfig.apiBase}/agents/${agentId}`);
            if (profileResponse.ok) {
                const profile = await profileResponse.json();
                this.renderAgentProfile(profile);
            }

            if (this.copilotKit) {
                // CopilotKit path – no separate conversation API needed
                this.updateTitle(this.currentAgent?.name ?? agentId);
                this._clearMessages();
            } else {
                // Legacy REST path
                const convResponse = await fetch(`${this.boardroomConfig.apiBase}/conversations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ agentId })
                });

                if (convResponse.ok) {
                    const conversation = await convResponse.json();
                    this.conversationId = conversation.conversationId;
                    this.config.apiEndpoint = `${this.boardroomConfig.apiBase}/conversations/${this.conversationId}`;
                    await this.loadMessages();
                    this.updateTitle(this.currentAgent.name);
                }
            }

            this.hideLoading();

            this.dispatchEvent(new CustomEvent('boardroom-agent-selected', {
                bubbles: true,
                detail: { agent: this.currentAgent, conversationId: this.conversationId }
            }));
        } catch (error) {
            console.error('Error selecting agent:', error);
            this.showToast('Failed to connect to agent', 'error');
            this.hideLoading();
        }
    }

    renderAgentProfile(profile) {
        if (!this.boardroomElements.profileDetail) return;

        this.boardroomElements.profileDetail.innerHTML = `
      <div class="boardroom-profile-header">
        <img src="${profile.avatar}" alt="${profile.name}" class="boardroom-profile-avatar">
        <h3 class="boardroom-profile-name">${profile.name}</h3>
        <p class="boardroom-profile-role">${profile.role}</p>
      </div>
      <div class="boardroom-profile-details">
        <p class="boardroom-profile-bio">${profile.bio || ''}</p>
        <div class="boardroom-profile-stats">
          <div class="boardroom-profile-stat">
            <span class="boardroom-profile-stat-label">Experience</span>
            <span class="boardroom-profile-stat-value">${profile.experience || 'N/A'}</span>
          </div>
          <div class="boardroom-profile-stat">
            <span class="boardroom-profile-stat-label">Specialization</span>
            <span class="boardroom-profile-stat-value">${profile.specialization || 'N/A'}</span>
          </div>
        </div>
      </div>
    `;
    }

    toggleView(view) {
        this.dispatchEvent(new CustomEvent('boardroom-view-change', {
            bubbles: true,
            detail: { view }
        }));

        // Add view-specific logic here
        if (view === 'chat') {
            this.boardroomElements.chatArea?.classList.remove('hidden');
            this.boardroomElements.profileDetail?.classList.add('hidden');
        } else if (view === 'profile') {
            this.boardroomElements.chatArea?.classList.add('hidden');
            this.boardroomElements.profileDetail?.classList.remove('hidden');
        }
    }

    filterMembers(query) {
        const lowerQuery = query.toLowerCase();
        this.boardroomElements.agentList.querySelectorAll('.boardroom-agent-item').forEach(item => {
            const name = item.querySelector('.boardroom-agent-name').textContent.toLowerCase();
            const role = item.querySelector('.boardroom-agent-role').textContent.toLowerCase();
            const matches = name.includes(lowerQuery) || role.includes(lowerQuery);
            item.style.display = matches ? '' : 'none';
        });
    }

    // Enhanced sendMessage to include agent context
    async sendMessage() {
        // When a CopilotKit runtime is configured, use it for all messages.
        // An agent does not need to be pre-selected – the runtime can handle
        // boardroom-level requests and route them internally.
        if (this.copilotKit) {
            await this._sendViaCopilotKit();
            return;
        }

        // Legacy REST path: agent must be selected
        if (!this.conversationId || !this.currentAgent) {
            this.showToast('Please select an agent first', 'warning');
            return;
        }

        await super.sendMessage();
    }

    /**
     * Send the current input via the CopilotKit runtime (AG-UI HTTP protocol).
     * Renders a user bubble immediately, then streams the AI response token-by-token.
     */
    async _sendViaCopilotKit() {
        const inputEl = this._getChatInputElement();
        if (!inputEl) return;

        const text = inputEl.value.trim();
        if (!text) return;

        // Clear the input
        inputEl.value = '';
        this._updateCharCount(inputEl);

        // Dismiss the empty-state placeholder if shown
        const emptyState = this.querySelector('#chat-empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // Render the user's message immediately
        this._appendUserMessage(text);

        try {
            // Stream the response from CopilotKit runtime
            await this.copilotKit.sendMessage(text, {
                context: this.currentAgent
                    ? [{ description: `Active boardroom agent: ${this.currentAgent.name} (${this.currentAgent.role || ''})` }]
                    : [],
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('[CopilotKit] sendMessage failed:', error);
            }
        }
    }

    // ── DOM helpers for CopilotKit streaming messages ───────────────────────

    /** Get the chat textarea element */
    _getChatInputElement() {
        return (
            this.querySelector('textarea[name="message"]') ||
            this.querySelector('#chat-input') ||
            this.querySelector('.chatroom-input-textarea') ||
            this.querySelector('textarea')
        );
    }

    /** Update character-count display after clearing input */
    _updateCharCount(inputEl) {
        const counter = this.querySelector('#char-count');
        if (counter) {
            counter.textContent = `0/${inputEl.maxLength > 0 ? inputEl.maxLength : 1000}`;
        }
    }

    /** Clear all messages from the chat area */
    _clearMessages() {
        const messagesEl = this.querySelector('#chatMessages');
        if (messagesEl) {
            messagesEl.innerHTML = '';
        }
        // Re-show empty state if it exists
        const emptyState = this.querySelector('#chat-empty-state');
        if (emptyState) {
            emptyState.style.display = '';
        }
    }

    /** Append the user's own message bubble to the chat */
    _appendUserMessage(text) {
        const messagesEl = this.querySelector('#chatMessages');
        if (!messagesEl) return;

        const safeText = this._escapeHtml(text);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const article = document.createElement('article');
        article.className = 'boardroom-message-row flex-row-reverse';
        article.setAttribute('aria-label', 'Your message');
        article.innerHTML = `
            <div class="boardroom-message-content">
                <div class="boardroom-message-bubble bg-primary text-white">${safeText}</div>
                <div class="boardroom-message-meta boardroom-message-meta-sent">
                    <span class="boardroom-message-timestamp">${time}</span>
                </div>
            </div>`;
        messagesEl.appendChild(article);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    /**
     * Create a new AI streaming bubble when the CopilotKit runtime starts a message.
     * @param {string} messageId - Unique ID from the runtime SSE stream
     * @param {string} [agentName] - Display name of the responding agent
     */
    _createStreamingBubble(messageId, agentName) {
        const messagesEl = this.querySelector('#chatMessages');
        if (!messagesEl) return;

        const agent = agentName || this.currentAgent?.name || 'AI';
        const role = this.currentAgent?.role || 'AI Assistant';
        const avatar = this.currentAgent?.avatar || '';
        const avatarHtml = avatar
            ? `<img src="${this._escapeHtml(avatar)}" alt="${this._escapeHtml(agent)}" class="boardroom-message-avatar" width="40" height="40">`
            : '';

        const article = document.createElement('article');
        article.className = 'boardroom-message-row';
        article.id = `copilotkit-msg-${messageId}`;
        article.setAttribute('aria-label', `Message from ${agent}`);
        article.innerHTML = `
            <div class="boardroom-message-avatar-block">
                ${avatarHtml}
                <div class="boardroom-message-avatar-meta">
                    <span class="boardroom-message-avatar-name">${this._escapeHtml(agent)}</span><br>
                    <span class="boardroom-message-avatar-role">${this._escapeHtml(role)}</span>
                </div>
            </div>
            <div class="boardroom-message-content">
                <div class="boardroom-message-bubble bg-white text-dark" id="copilotkit-bubble-${messageId}">
                    <span class="boardroom-streaming-cursor">▍</span>
                </div>
                <div class="boardroom-message-meta boardroom-message-meta-received">
                    <span class="boardroom-message-timestamp" id="copilotkit-time-${messageId}">…</span>
                </div>
            </div>`;
        messagesEl.appendChild(article);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    /**
     * Append a streaming text chunk to the active AI bubble.
     * @param {string} chunk - New token(s) to append
     * @param {string} messageId - ID matching the bubble created by _createStreamingBubble
     */
    _appendStreamChunk(chunk, messageId) {
        const bubble = this.querySelector(`#copilotkit-bubble-${messageId}`);
        if (!bubble) return;

        // Remove the blinking cursor if it is still present
        const cursor = bubble.querySelector('.boardroom-streaming-cursor');
        if (cursor) cursor.remove();

        // Append text node
        bubble.appendChild(document.createTextNode(chunk));

        // Re-add cursor at the end
        const newCursor = document.createElement('span');
        newCursor.className = 'boardroom-streaming-cursor';
        newCursor.textContent = '▍';
        bubble.appendChild(newCursor);

        const messagesEl = this.querySelector('#chatMessages');
        if (messagesEl) {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }

    /**
     * Finalize a streaming AI bubble once the message is complete.
     * Removes the cursor and adds the timestamp.
     * @param {string} messageId
     * @param {string} fullContent - Complete response text
     */
    _finalizeStreamingBubble(messageId, fullContent) {
        const bubble = this.querySelector(`#copilotkit-bubble-${messageId}`);
        if (bubble) {
            // Remove cursor
            const cursor = bubble.querySelector('.boardroom-streaming-cursor');
            if (cursor) cursor.remove();

            // Ensure the full content is rendered (guards against dropped chunks)
            if (bubble.textContent.trim() !== fullContent.trim()) {
                bubble.textContent = '';
                bubble.appendChild(document.createTextNode(fullContent));
            }
        }

        // Update timestamp
        const timeEl = this.querySelector(`#copilotkit-time-${messageId}`);
        if (timeEl) {
            timeEl.textContent = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        }

        const messagesEl = this.querySelector('#chatMessages');
        if (messagesEl) {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }

    /** Minimal HTML escaping to prevent XSS when inserting untrusted content */
    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = String(str ?? '');
        return div.innerHTML;
    }

    // Boardroom-specific features
    async startScreenShare() {
        this.showToast('Screen share initiated', 'info');
        this.dispatchEvent(new CustomEvent('boardroom-screen-share', { bubbles: true }));
    }

    async startVideoCall() {
        this.showToast('Video call initiated', 'info');
        this.dispatchEvent(new CustomEvent('boardroom-video-call', { bubbles: true }));
    }

    async attachFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                await this.uploadFile(file);
            }
        };
        input.click();
    }

    async uploadFile(file) {
        this.showToast(`Uploading ${file.name}...`, 'info');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('conversationId', this.conversationId);

            const response = await fetch(`${this.boardroomConfig.apiBase}/files`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showToast('File uploaded successfully', 'success');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            this.showToast('Failed to upload file', 'error');
        }
    }

    showLoading(message = 'Loading...') {
        if (!this.boardroomElements.loadingOverlay) return;

        this.boardroomElements.loadingOverlay.querySelector('.boardroom-loading-text').textContent = message;
        this.boardroomElements.loadingOverlay.classList.add('active');
    }

    hideLoading() {
        if (!this.boardroomElements.loadingOverlay) return;
        this.boardroomElements.loadingOverlay.classList.remove('active');
    }

    showToast(message, type = 'info') {
        if (!this.boardroomElements.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `boardroom-toast boardroom-toast-${type}`;
        toast.textContent = message;

        this.boardroomElements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    disconnectedCallback() {
        // Abort any in-flight CopilotKit stream to free resources
        if (this.copilotKit) {
            this.copilotKit.abort();
        }
        super.disconnectedCallback();
        this.dispatchEvent(new CustomEvent('boardroom-disconnected', { bubbles: true }));
    }
}

// Register the custom element if not already defined to avoid duplicate-define errors
if (!customElements.get('boardroom-app')) {
    customElements.define('boardroom-app', BoardroomApp);
}

export default BoardroomApp;
