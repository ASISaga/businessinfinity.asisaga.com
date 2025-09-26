// JS extracted from mcp_access_control.html
// Mock data for demonstration
const mockAccessLevels = {
    'none': 'none',
    'read_only': 'read_only', 
    'limited_write': 'limited_write',
    'full_write': 'full_write',
    'admin': 'admin'
};

const mockRolePermissions = {
    'Founder': {
        'linkedin': 'admin',
        'reddit': 'full_write',
        'erpnext': 'admin',
        'businessinfinity_config': 'admin'
    },
    'CEO': {
        'linkedin': 'full_write',
        'reddit': 'full_write',
        'erpnext': 'admin',
        'businessinfinity_config': 'full_write'
    },
    'CFO': {
        'linkedin': 'limited_write',
        'reddit': 'read_only',
        'erpnext': 'admin',
        'businessinfinity_config': 'limited_write'
    },
    'Employee': {
        'linkedin': 'none',
        'reddit': 'none',
        'erpnext': 'read_only',
        'businessinfinity_config': 'none'
    }
};

// Mock data for boardroom agents
const mockBoardroomAgents = {
    'CEO': {
        enabled: false,
        onboarding_stage: 'observer',
        days_in_stage: 0,
        legendary_profile: 'Steve Jobs',
        domain: 'innovation_leadership',
        mcp_access: { linkedin: 'none', reddit: 'none', erpnext: 'none' },
        recent_decisions: 0
    },
    'CFO': {
        enabled: false,
        onboarding_stage: 'observer', 
        days_in_stage: 0,
        legendary_profile: 'Mary Barra',
        domain: 'operational_excellence',
        mcp_access: { linkedin: 'none', reddit: 'none', erpnext: 'none' },
        recent_decisions: 0
    },
    'CTO': {
        enabled: false,
        onboarding_stage: 'observer',
        days_in_stage: 0,
        legendary_profile: 'Alan Kay',
        domain: 'technology_vision',
        mcp_access: { linkedin: 'none', reddit: 'none', erpnext: 'none' },
        recent_decisions: 0
    },
    'CMO': {
        enabled: false,
        onboarding_stage: 'observer',
        days_in_stage: 0,
        legendary_profile: 'Philip Kotler',
        domain: 'marketing_mastery',
        mcp_access: { linkedin: 'none', reddit: 'none', erpnext: 'none' },
        recent_decisions: 0
    },
    'CHRO': {
        enabled: false,
        onboarding_stage: 'observer',
        days_in_stage: 0,
        legendary_profile: 'Jack Welch',
        domain: 'organizational_development',
        mcp_access: { linkedin: 'none', reddit: 'none', erpnext: 'none' },
        recent_decisions: 0
    },
    'Investor': {
        enabled: true,
        onboarding_stage: 'participant',
        days_in_stage: 45,
        legendary_profile: 'Warren Buffett',
        domain: 'investment_strategy',
        mcp_access: { linkedin: 'read_only', reddit: 'read_only', erpnext: 'read_only' },
        recent_decisions: 3
    },
    'Founder': {
        enabled: true,
        onboarding_stage: 'trusted',
        days_in_stage: 365,
        legendary_profile: 'Elon Musk',
        domain: 'visionary_leadership',
        mcp_access: { linkedin: 'admin', reddit: 'admin', erpnext: 'admin' },
        recent_decisions: 12
    }
};

const mockViolations = [
    {
        user_role: 'Employee',
        mcp_server: 'linkedin',
        operation: 'create',
        reason: 'Access level none does not permit operation create',
        timestamp: new Date().toISOString(),
        severity: 'medium'
    },
    {
        user_role: 'Investor',
        mcp_server: 'erpnext',
        operation: 'delete',
        reason: 'Access level read_only does not permit operation delete',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: 'high'
    },
    {
        user_role: 'BoardroomAgent:CEO',
        mcp_server: 'linkedin',
        operation: 'admin',
        reason: 'Boardroom agent CEO is not enabled',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        severity: 'high'
    }
];

function loadRolePermissions() {
    const roleSelect = document.getElementById('roleSelect');
    const role = roleSelect.value;
    const permissionsDiv = document.getElementById('rolePermissions');
    const matrixBody = document.getElementById('accessMatrixBody');
    if (!role) {
        permissionsDiv.style.display = 'none';
        return;
    }
    permissionsDiv.style.display = 'block';
    const permissions = mockRolePermissions[role] || {};
    const servers = ['linkedin', 'reddit', 'erpnext', 'businessinfinity_config'];
    matrixBody.innerHTML = '';
    servers.forEach(server => {
        const row = document.createElement('tr');
        const accessLevel = permissions[server] || 'none';
        row.innerHTML = `
            <td><strong>${server}</strong></td>
            <td>
                <span class="access-level access-${accessLevel}">${accessLevel}</span>
            </td>
            <td>
                <select onchange="updateAccess('${role}', '${server}', this.value)">
                    ${Object.keys(mockAccessLevels).map(level => 
                        `<option value="${level}" ${level === accessLevel ? 'selected' : ''}>${level}</option>`
                    ).join('')}
                </select>
            </td>
        `;
        matrixBody.appendChild(row);
    });
}

function updateAccess(role, server, newLevel) {
    if (!mockRolePermissions[role]) {
        mockRolePermissions[role] = {};
    }
    mockRolePermissions[role][server] = newLevel;
    loadRolePermissions(); // Refresh the display
}

function saveRolePermissions() {
    alert('Role permissions saved successfully!');
    // In real implementation, this would make API call to save permissions
}

function resetRolePermissions() {
    loadRolePermissions();
    alert('Permissions reset to original values.');
}

function loadUserPermissions() {
    const userRoleSelect = document.getElementById('userRoleSelect');
    const role = userRoleSelect.value;
    const display = document.getElementById('userPermissionsDisplay');
    if (!role) {
        display.innerHTML = '';
        return;
    }
    // Mock user permissions data
    const mockUserProfile = {
        role: role,
        onboarding_stage: role === 'Employee' ? 'observer' : 'trusted',
        stage_started: new Date(Date.now() - 86400000).toISOString(),
        days_in_stage: 1,
        mcp_access: mockRolePermissions[role] || {},
        restrictions: role === 'Employee' ? { max_queries_per_hour: 10 } : {},
        recent_usage: {}
    };
    display.innerHTML = `
        <div class="onboarding-stage">
            <h4>User Profile: ${role}</h4>
            <p><strong>Onboarding Stage:</strong> ${mockUserProfile.onboarding_stage}</p>
            <p><strong>Days in Stage:</strong> ${mockUserProfile.days_in_stage}</p>
            <p><strong>Restrictions:</strong> ${JSON.stringify(mockUserProfile.restrictions)}</p>
        </div>
    `;
}

function loadViolations() {
    const violationsList = document.getElementById('violationsList');
    violationsList.innerHTML = '';
    mockViolations.forEach(violation => {
        const div = document.createElement('div');
        div.className = 'violation-entry';
        div.innerHTML = `
            <p><strong>${violation.user_role}</strong> attempted <strong>${violation.operation}</strong> on <strong>${violation.mcp_server}</strong></p>
            <p><em>${violation.reason}</em></p>
            <small>Severity: ${violation.severity} | ${new Date(violation.timestamp).toLocaleString()}</small>
        `;
        violationsList.appendChild(div);
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and tab contents
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    if (tabName === 'violations') {
        loadViolations();
    } else if (tabName === 'agents') {
        loadBoardroomAgents();
    }
}

function saveConfiguration() {
    const auditEnabled = document.getElementById('auditEnabled').checked;
    const alertsEnabled = document.getElementById('alertsEnabled').checked;
    const retentionDays = document.getElementById('retentionDays').value;
    alert(`Configuration saved:\nAudit Logging: ${auditEnabled}\nAlerts: ${alertsEnabled}\nRetention: ${retentionDays} days`);
}

// Boardroom Agent Management Functions
function loadBoardroomAgents() {
    const agentGrid = document.getElementById('agentGrid');
    agentGrid.innerHTML = '';
    Object.keys(mockBoardroomAgents).forEach(agentRole => {
        const agent = mockBoardroomAgents[agentRole];
        const agentCard = createAgentCard(agentRole, agent);
        agentGrid.appendChild(agentCard);
    });
}

function createAgentCard(agentRole, agent) {
    const card = document.createElement('div');
    card.className = `agent-card ${agent.enabled ? 'enabled' : 'disabled'}`;
    const statusClass = agent.enabled ? 'status-enabled' : 'status-disabled';
    const statusText = agent.enabled ? 'Enabled' : 'Disabled';
    const stageColor = {
        'observer': '#fed7d7',
        'participant': '#fef2de', 
        'trusted': '#c6f6d5'
    }[agent.onboarding_stage] || '#f7fafc';
    card.innerHTML = `
        <div class="agent-header">
            <div class="agent-name">${agentRole}</div>
            <div class="agent-status ${statusClass}">${statusText}</div>
        </div>
        <div class="agent-details">
            <strong>Profile:</strong> ${agent.legendary_profile}<br>
            <strong>Domain:</strong> ${agent.domain}
        </div>
        <div class="agent-stage">
            <div style="background-color: ${stageColor}; padding: 0.5rem; border-radius: 4px; margin-bottom: 0.5rem;">
                <strong>Stage:</strong> ${agent.onboarding_stage} (${agent.days_in_stage} days)
            </div>
        </div>
        <div class="agent-details">
            <strong>Recent Decisions:</strong> ${agent.recent_decisions}<br>
            <strong>MCP Access:</strong> ${Object.values(agent.mcp_access).filter(level => level !== 'none').length} systems
        </div>
        <div class="agent-actions">
            ${agent.enabled ? 
                `<button class="btn btn-small btn-danger" onclick="toggleAgent('${agentRole}', false)">Disable</button>` :
                `<button class="btn btn-small" onclick="toggleAgent('${agentRole}', true)">Enable</button>`
            }
            ${agent.enabled ? 
                `<button class="btn btn-small btn-secondary" onclick="progressAgent('${agentRole}')">Progress</button>` : 
                ''
            }
            <button class="btn btn-small btn-secondary" onclick="viewAgentDetails('${agentRole}')">Details</button>
        </div>
    `;
    return card;
}

function toggleAgent(agentRole, enable) {
    mockBoardroomAgents[agentRole].enabled = enable;
    if (enable) {
        mockBoardroomAgents[agentRole].days_in_stage = 0;
        alert(`Boardroom Agent ${agentRole} has been enabled and started onboarding.`);
    } else {
        alert(`Boardroom Agent ${agentRole} has been disabled.`);
    }
    loadBoardroomAgents();
}

function progressAgent(agentRole) {
    const agent = mockBoardroomAgents[agentRole];
    const stages = ['observer', 'participant', 'trusted'];
    const currentIndex = stages.indexOf(agent.onboarding_stage);
    if (currentIndex < stages.length - 1) {
        agent.onboarding_stage = stages[currentIndex + 1];
        agent.days_in_stage = 0;
        // Update access levels based on new stage
        if (agent.onboarding_stage === 'participant') {
            agent.mcp_access = { linkedin: 'read_only', reddit: 'read_only', erpnext: 'limited_write' };
        } else if (agent.onboarding_stage === 'trusted') {
            agent.mcp_access = { linkedin: 'full_write', reddit: 'full_write', erpnext: 'admin' };
        }
        alert(`Agent ${agentRole} progressed to ${agent.onboarding_stage} stage.`);
        loadBoardroomAgents();
    } else {
        alert(`Agent ${agentRole} is already at the highest onboarding stage.`);
    }
}

function viewAgentDetails(agentRole) {
    const agent = mockBoardroomAgents[agentRole];
    const accessLevels = Object.entries(agent.mcp_access)
        .map(([server, level]) => `${server}: ${level}`)
        .join('\n');
    alert(`Agent Details: ${agentRole}
        \nProfile: ${agent.legendary_profile}
Domain: ${agent.domain}
Status: ${agent.enabled ? 'Enabled' : 'Disabled'}
Onboarding Stage: ${agent.onboarding_stage}
Days in Stage: ${agent.days_in_stage}
Recent Decisions: ${agent.recent_decisions}
\nMCP Access Levels:\n${accessLevels}`);
}

function refreshAgents() {
    loadBoardroomAgents();
    alert('Boardroom agents status refreshed.');
}

function enableAllAgents() {
    if (confirm('Are you sure you want to enable all boardroom agents? This will grant them progressive access to business systems.')) {
        Object.keys(mockBoardroomAgents).forEach(agentRole => {
            if (agentRole !== 'Founder') { // Founder already enabled
                mockBoardroomAgents[agentRole].enabled = true;
                mockBoardroomAgents[agentRole].days_in_stage = 0;
            }
        });
        loadBoardroomAgents();
        alert('All boardroom agents have been enabled.');
    }
}

function disableAllAgents() {
    if (confirm('Are you sure you want to disable all boardroom agents? This will revoke their access to business systems.')) {
        Object.keys(mockBoardroomAgents).forEach(agentRole => {
            if (agentRole !== 'Founder') { // Keep Founder enabled
                mockBoardroomAgents[agentRole].enabled = false;
            }
        });
        loadBoardroomAgents();
        alert('All boardroom agents (except Founder) have been disabled.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadViolations();
});
