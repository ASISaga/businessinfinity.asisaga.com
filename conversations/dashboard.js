// JS for dashboard.html moved to external file
// Mock data for demonstration
const mockAgents = [
    { id: 'founder', name: 'Founder', role: 'Vision Steward', conversations: 12 },
    { id: 'ceo', name: 'CEO', role: 'Organizational Steward', conversations: 18 },
    { id: 'cfo', name: 'CFO', role: 'Financial Steward', conversations: 15 },
    { id: 'cto', name: 'CTO', role: 'Technology Steward', conversations: 22 },
    { id: 'cmo', name: 'CMO', role: 'Market Steward', conversations: 8 },
    { id: 'coo', name: 'COO', role: 'Operational Steward', conversations: 14 },
    { id: 'investor', name: 'Investor', role: 'Resource Steward', conversations: 6 }
];

const mockConversations = [
    {
        id: '1',
        title: 'AI Strategy Framework 2024',
        type: 'strategic_frame',
        champion: 'Founder',
        status: 'completed',
        content: 'Comprehensive AI strategy for next fiscal year focusing on infrastructure and talent acquisition.',
        created_at: '2024-01-15T10:00:00Z',
        signatures: [
            { signer_name: 'Sarah Chen', signer_role: 'Founder', timestamp: '2024-01-15T14:30:00Z' }
        ]
    },
    {
        id: '2',
        title: 'Series A Funding Round',
        type: 'investment_decision',
        champion: 'Investor',
        status: 'signed',
        content: 'Proposal for $5M Series A funding round to accelerate product development and market expansion.',
        created_at: '2024-01-14T09:00:00Z',
        signatures: [
            { signer_name: 'Michael Rodriguez', signer_role: 'Investor', timestamp: '2024-01-14T15:45:00Z' },
            { signer_name: 'Lisa Kim', signer_role: 'CFO', timestamp: '2024-01-15T09:15:00Z' }
        ]
    },
    {
        id: '3',
        title: 'Q1 Budget Allocation',
        type: 'budget_commitment',
        champion: 'CFO',
        status: 'draft',
        content: 'Quarterly budget allocation focusing on R&D and infrastructure improvements.',
        created_at: '2024-01-16T08:00:00Z',
        signatures: []
    }
];

let selectedAgent = null;
let allConversations = mockConversations;

function initializePage() {
    loadAgents();
    loadConversations();
}

function loadAgents() {
    const agentList = document.getElementById('agentList');
    const agentHTML = mockAgents.map(agent => `
        <div class="agent-item" onclick="selectAgent('${agent.id}')">
            <div class="agent-avatar">${agent.name.charAt(0)}</div>
            <div class="agent-info">
                <h4>${agent.name}</h4>
                <p>${agent.role} • ${agent.conversations} conversations</p>
            </div>
        </div>
    `).join('');
    agentList.innerHTML = agentHTML;
}

function selectAgent(agentId) {
    selectedAgent = agentId;
    // Update UI
    document.querySelectorAll('.agent-item').forEach(item => item.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    // Filter conversations
    filterConversations();
}

function loadConversations() {
    displayConversations(allConversations);
}

function displayConversations(conversations) {
    const conversationList = document.getElementById('conversationList');
    if (conversations.length === 0) {
        conversationList.innerHTML = `
            <div class="empty-state">
                <h3>No conversations found</h3>
                <p>Try adjusting your filters or create a new conversation</p>
            </div>
        `;
        return;
    }
    const conversationHTML = conversations.map(conv => `
        <div class="conversation-item">
            <div class="conversation-header">
                <h3 class="conversation-title">${conv.title}</h3>
                <span class="conversation-status status-${conv.status}">${conv.status}</span>
            </div>
            <div class="conversation-meta">
                <span>👑 Champion: ${conv.champion}</span>
                <span>📅 ${new Date(conv.created_at).toLocaleDateString()}</span>
                <span>🏷️ ${conv.type.replace('_', ' ')}</span>
            </div>
            <div class="conversation-content">
                ${conv.content}
            </div>
            ${conv.signatures.length > 0 ? `
                <div class="conversation-signatures">
                    <strong>Signatures:</strong>
                    ${conv.signatures.map(sig => `
                        <div class="signature">
                            <div class="signature-icon">✓</div>
                            <span>${sig.signer_name} (${sig.signer_role}) - ${new Date(sig.timestamp).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
    conversationList.innerHTML = conversationHTML;
}

function filterConversations() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    let filtered = allConversations;
    // Filter by selected agent
    if (selectedAgent) {
        const agentName = mockAgents.find(a => a.id === selectedAgent)?.name;
        filtered = filtered.filter(conv => conv.champion === agentName);
    }
    // Filter by status
    if (statusFilter) {
        filtered = filtered.filter(conv => conv.status === statusFilter);
    }
    // Filter by type
    if (typeFilter) {
        filtered = filtered.filter(conv => conv.type === typeFilter);
    }
    displayConversations(filtered);
}

function refreshConversations() {
    document.getElementById('conversationList').innerHTML = '<div class="loading">Refreshing conversations...</div>';
    // Simulate API call
    setTimeout(() => {
        loadConversations();
    }, 1000);
}

function showCreateDialog() {
    alert('Create New Conversation feature would open a modal dialog here.\n\nThis would integrate with the Business Infinity API endpoints:\n- POST /conversations\n- POST /conversations/a2a');
}

// Auto-refresh every 30 seconds
setInterval(refreshConversations, 30000);

// Initialize page
initializePage();
