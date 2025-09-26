// JS extracted from mentor_mode.html
// (Full script block from mentor_mode.html goes here)

// Global variables
let currentAgent = 'ceo';
let modalAgent = '';
let trainingJobs = new Map();

// Tab switching
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    // Activate selected tab button
    event.target.classList.add('active');
}

// Chat functionality
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;
    const selectedAgent = document.getElementById('chat-agent-select').value;
    // Add user message to chat
    addChatMessage('user', message);
    // Clear input
    input.value = '';
    // Send message to agent (API call)
    sendMessageToAgent(selectedAgent, message);
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${sender}`;
    if (sender === 'user') {
        messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
    } else {
        messageDiv.innerHTML = `<strong>${sender.toUpperCase()}:</strong> ${message}`;
    }
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessageToAgent(agentId, message) {
    try {
        // Show typing indicator
        addChatMessage('system', 'Agent is typing...');
        const response = await fetch(`/mentor/chat/${agentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        // Remove typing indicator
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.removeChild(chatMessages.lastChild);
        if (data.error) {
            addChatMessage('system', `Error: ${data.error}`);
        } else {
            addChatMessage(agentId, data.response);
        }
    } catch (error) {
        addChatMessage('system', `Error: ${error.message}`);
    }
}

// Modal functions
function openChatModal(agentId) {
    modalAgent = agentId;
    document.getElementById('modal-agent-name').textContent = `Chat with ${agentId.toUpperCase()}`;
    document.getElementById('modal-chat-messages').innerHTML = '';
    document.getElementById('chat-modal').style.display = 'block';
}

function closeChatModal() {
    document.getElementById('chat-modal').style.display = 'none';
}

function handleModalChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendModalChatMessage();
    }
}

function sendModalChatMessage() {
    const input = document.getElementById('modal-chat-input');
    const message = input.value.trim();
    if (!message) return;
    // Add user message to modal chat
    addModalChatMessage('user', message);
    // Clear input
    input.value = '';
    // Send message to agent
    sendModalMessageToAgent(modalAgent, message);
}

function addModalChatMessage(sender, message) {
    const chatMessages = document.getElementById('modal-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${sender}`;
    if (sender === 'user') {
        messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
    } else {
        messageDiv.innerHTML = `<strong>${sender.toUpperCase()}:</strong> ${message}`;
    }
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendModalMessageToAgent(agentId, message) {
    try {
        addModalChatMessage('system', 'Agent is typing...');
        const response = await fetch(`/mentor/chat/${agentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        // Remove typing indicator
        const chatMessages = document.getElementById('modal-chat-messages');
        chatMessages.removeChild(chatMessages.lastChild);
        if (data.error) {
            addModalChatMessage('system', `Error: ${data.error}`);
        } else {
            addModalChatMessage(agentId, data.response);
        }
    } catch (error) {
        addModalChatMessage('system', `Error: ${error.message}`);
    }
}

// Training functions
function openTrainingModal(agentId) {
    modalAgent = agentId;
    document.getElementById('modal-training-title').textContent = `Train ${agentId.toUpperCase()}`;
    document.getElementById('training-modal').style.display = 'block';
}

function closeTrainingModal() {
    document.getElementById('training-modal').style.display = 'none';
}

async function startTraining() {
    const agentSelect = document.getElementById('training-agent-select');
    const datasetInput = document.getElementById('training-dataset');
    const agentId = agentSelect.value;
    const datasetId = datasetInput.value.trim();
    if (!datasetId) {
        alert('Please enter a dataset ID');
        return;
    }
    try {
        const response = await fetch(`/mentor/fine-tune/${agentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ datasetId: datasetId })
        });
        const data = await response.json();
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            // Add job to tracking
            trainingJobs.set(data.jobId, data);
            updateTrainingJobs();
            alert(`Training job started: ${data.jobId}`);
            // Clear form
            datasetInput.value = '';
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

async function startModalTraining() {
    const datasetInput = document.getElementById('modal-dataset-id');
    const typeSelect = document.getElementById('modal-training-type');
    const datasetId = datasetInput.value.trim();
    const trainingType = typeSelect.value;
    if (!datasetId) {
        alert('Please enter a dataset ID');
        return;
    }
    try {
        const response = await fetch(`/mentor/fine-tune/${modalAgent}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                datasetId: datasetId,
                trainingType: trainingType 
            })
        });
        const data = await response.json();
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            trainingJobs.set(data.jobId, data);
            updateTrainingJobs();
            alert(`Training job started: ${data.jobId}`);
            closeTrainingModal();
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function updateTrainingJobs() {
    const container = document.getElementById('training-jobs');
    if (trainingJobs.size === 0) {
        container.innerHTML = '<p class="text-secondary">No active training jobs</p>';
        return;
    }
    let html = '';
    for (const [jobId, job] of trainingJobs) {
        html += `
            <div class="agent-item">
                <div class="agent-info">
                    <div class="agent-name">Job: ${jobId}</div>
                    <div class="agent-version">Agent: ${job.agentId.toUpperCase()}</div>
                    <span class="status-badge status-${job.status === 'queued' ? 'warning' : 'available'}">${job.status}</span>
                </div>
                <div class="agent-actions">
                    <button class="btn btn-secondary" onclick="viewTrainingLogs('${jobId}')">View Logs</button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

async function viewTrainingLogs(jobId) {
    try {
        const response = await fetch(`/mentor/logs/${jobId}`);
        const data = await response.json();
        const logsContainer = document.getElementById('training-logs');
        if (data.error) {
            logsContainer.textContent = `Error: ${data.error}`;
        } else {
            logsContainer.textContent = data.logs.join('\n');
        }
        // Switch to training tab if not already active
        switchTab('training');
    } catch (error) {
        document.getElementById('training-logs').textContent = `Error: ${error.message}`;
    }
}

// Utility functions
async function refreshAgents() {
    try {
        const response = await fetch('/mentor/agents');
        const data = await response.json();
        if (data.error) {
            alert(`Error: ${data.error}`);
            return;
        }
        // Update agents list
        const agentsList = document.getElementById('agents-list');
        let html = '';
        for (const agent of data.agents) {
            html += `
                <li class="agent-item">
                    <div class="agent-info">
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-version">Version: ${agent.loraVersion}</div>
                        <span class="status-badge status-available">${agent.status}</span>
                    </div>
                    <div class="agent-actions">
                        <button class="btn btn-primary" onclick="openChatModal('${agent.id}')">Chat</button>
                        <button class="btn btn-secondary" onclick="openTrainingModal('${agent.id}')">Train</button>
                    </div>
                </li>
            `;
        }
        agentsList.innerHTML = html;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function loadScenario(scenarioType) {
    const scenarios = {
        market_analysis: "Analyze the current market trends for our industry and identify potential expansion opportunities.",
        financial_planning: "Create a financial forecast for the next quarter including revenue projections and expense management.",
        tech_strategy: "Evaluate emerging technologies that could impact our product development and competitive position."
    };
    const input = document.getElementById('chat-input');
    input.value = scenarios[scenarioType] || '';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    refreshAgents();
});

// Close modals when clicking outside
window.onclick = function(event) {
    const chatModal = document.getElementById('chat-modal');
    const trainingModal = document.getElementById('training-modal');
    if (event.target == chatModal) {
        chatModal.style.display = 'none';
    }
    if (event.target == trainingModal) {
        trainingModal.style.display = 'none';
    }
}
