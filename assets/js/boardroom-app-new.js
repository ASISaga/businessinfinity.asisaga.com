/**
 * Boardroom Web Component
 * Extends the generic chatroom for business-specific features
 * Includes: agent list, profiles, toggle strip, members sidebar
 */

// Import ChatroomApp from the remote theme
// This path will be resolved by GitHub Pages through the remote_theme configuration
import ChatroomApp from '/assets/js/chatroom-app.js';

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
            enableFormatting: this.hasAttribute('enable-formatting')
        };

        // Boardroom state
        this.agents = [];
        this.currentAgent = null;
        this.conversationId = null;
        this.members = [];
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

            // Load agent profile
            const profileResponse = await fetch(`${this.boardroomConfig.apiBase}/agents/${agentId}`);
            if (profileResponse.ok) {
                const profile = await profileResponse.json();
                this.renderAgentProfile(profile);
            }

            // Start conversation with agent
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
        if (!this.conversationId || !this.currentAgent) {
            this.showToast('Please select an agent first', 'warning');
            return;
        }

        await super.sendMessage();
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
        super.disconnectedCallback();
        this.dispatchEvent(new CustomEvent('boardroom-disconnected', { bubbles: true }));
    }
}

// Register the custom element if not already defined to avoid duplicate-define errors
if (!customElements.get('boardroom-app')) {
    customElements.define('boardroom-app', BoardroomApp);
}

export default BoardroomApp;
