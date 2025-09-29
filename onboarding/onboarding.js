// JS extracted from onboarding.html
let currentStep = 1;
let onboardingData = {};
let connectedSystems = [];

function updateProgress() {
    const progress = (currentStep / 10) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step-card').forEach(card => {
        card.classList.remove('active');
    });
    // Show current step
    document.getElementById('step-' + stepNumber).classList.add('active');
    currentStep = stepNumber;
    updateProgress();
}

function nextStep() {
    if (currentStep < 10) {
        showStep(currentStep + 1);
    }
}

function skipStep() {
    nextStep();
}

async function continueWithLinkedIn() {
    onboardingData.authMethod = 'linkedin';
    onboardingData.companyName = document.getElementById('company-name').value;
    nextStep();
}

async function continueWithEmail() {
    onboardingData.authMethod = 'email';
    onboardingData.companyName = document.getElementById('company-name').value;
    // Skip LinkedIn step
    showStep(3);
}

async function authorizeLinkedIn() {
    document.getElementById('linkedin-auth-loading').classList.remove('hidden');
    try {
        // Call LinkedIn OAuth endpoint
        const response = await fetch('/api/linkedin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state: 'onboarding' })
        });
        const result = await response.json();
        if (result.login_url) {
            window.location.href = result.login_url;
        }
    } catch (error) {
        console.error('LinkedIn auth error:', error);
        alert('LinkedIn authentication failed. Please try again.');
    }
    document.getElementById('linkedin-auth-loading').classList.add('hidden');
}

async function parseWebsite() {
    const websiteUrl = document.getElementById('website-url').value;
    if (!websiteUrl) {
        alert('Please enter a website URL');
        return;
    }
    try {
        const response = await fetch('/api/onboarding/parse-website', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: websiteUrl })
        });
        const result = await response.json();
        if (result.success) {
            document.getElementById('website-preview').classList.remove('hidden');
            document.getElementById('parsed-content').innerHTML = `
                <p><strong>Company:</strong> ${result.data.company_name || 'Not found'}</p>
                <p><strong>Tagline:</strong> ${result.data.tagline || 'Not found'}</p>
                <p><strong>Description:</strong> ${result.data.description || 'Not found'}</p>
            `;
            onboardingData.websiteData = result.data;
        }
    } catch (error) {
        console.error('Website parsing error:', error);
        alert('Website parsing failed. Please try again.');
    }
}

function handleFileUpload(input) {
    const files = input.files;
    console.log('Files selected:', files.length);
}

async function processDeck() {
    const fileInput = document.getElementById('pitch-deck');
    if (!fileInput.files.length) {
        alert('Please select a file to upload');
        return;
    }
    const formData = new FormData();
    formData.append('deck', fileInput.files[0]);
    try {
        const response = await fetch('/api/onboarding/upload-deck', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            onboardingData.deckData = result.data;
            alert('Deck uploaded and processed successfully!');
            nextStep();
        }
    } catch (error) {
        console.error('Deck upload error:', error);
        alert('Deck upload failed. Please try again.');
    }
}

async function processFinancials() {
    const fileInput = document.getElementById('financial-docs');
    if (!fileInput.files.length) {
        alert('Please select files to upload');
        return;
    }
    const formData = new FormData();
    Array.from(fileInput.files).forEach(file => {
        formData.append('financials', file);
    });
    try {
        const response = await fetch('/api/onboarding/upload-financials', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            onboardingData.financialData = result.data;
            alert('Financial documents uploaded successfully!');
            nextStep();
        }
    } catch (error) {
        console.error('Financial upload error:', error);
        alert('Financial document upload failed. Please try again.');
    }
}

async function connectSystem(systemName) {
    try {
        const response = await fetch(`/api/onboarding/connect-system`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ system: systemName })
        });
        const result = await response.json();
        if (result.auth_url) {
            window.open(result.auth_url, '_blank', 'width=600,height=600');
            // Mark as connected for demo
            document.querySelector(`[onclick="connectSystem('${systemName}')"]`).classList.add('connected');
            connectedSystems.push(systemName);
        }
    } catch (error) {
        console.error('System connection error:', error);
        alert('System connection failed. Please try again.');
    }
}

function quickBaseline() {
    onboardingData.baselineType = 'quick';
    nextStep();
}

async function generateVoiceProfile() {
    try {
        const response = await fetch('/api/onboarding/generate-voice-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(onboardingData)
        });
        const result = await response.json();
        if (result.success) {
            document.getElementById('voice-preview').classList.remove('hidden');
            document.getElementById('voice-themes').innerHTML = `
                <p><strong>Key Themes:</strong> ${result.data.themes.join(', ')}</p>
                <p><strong>Tone:</strong> ${result.data.tone}</p>
                <p><strong>Communication Style:</strong> ${result.data.style}</p>
            `;
            onboardingData.voiceProfile = result.data;
        }
    } catch (error) {
        console.error('Voice profile error:', error);
        alert('Voice profile generation failed. Please try again.');
    }
}

function editVoiceProfile() {
    alert('Voice profile editing interface would open here');
}

async function viewAuditTrail() {
    window.open('/api/onboarding/audit-trail', '_blank');
}

function inviteTeam() {
    alert('Team invitation interface would open here');
}

function saveGovernanceSettings() {
    const settings = {
        notificationFrequency: document.getElementById('notification-frequency').value,
        securitySummaries: document.getElementById('security-summaries').checked
    };
    onboardingData.governanceSettings = settings;
    nextStep();
}

async function sendQuickAction() {
    const input = document.getElementById('quick-action-input');
    const message = input.value.trim();
    if (!message) return;
    // Add user message
    addChatMessage('final-chat', 'user', message);
    input.value = '';
    // Send to backend
    try {
        const response = await fetch('/api/onboarding/quick-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, onboardingData })
        });
        const result = await response.json();
        if (result.success) {
            addChatMessage('final-chat', 'agent', result.response);
        }
    } catch (error) {
        console.error('Quick action error:', error);
        addChatMessage('final-chat', 'agent', 'I apologize, but I encountered an error. Please try again.');
    }
}

function addChatMessage(chatId, sender, message) {
    const chatMessages = document.getElementById(chatId);
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.innerHTML = message;
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// New trust and compliance functions
async function exportMyData() {
    try {
        // Call export data endpoint
        const response = await fetch('/api/compliance/export-data', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ userId: onboardingData.userId || 'current' })
        });
        
        if (response.ok) {
            const result = await response.json();
            alert('Data export request submitted successfully. You will receive a download link via email within 24 hours.');
        } else {
            throw new Error('Export request failed');
        }
    } catch (error) {
        console.error('Export data error:', error);
        alert('Unable to process export request. Please try again or contact support.');
    }
}

async function requestDataDeletion() {
    if (confirm('Are you sure you want to request deletion of your data? This action cannot be undone and will result in permanent loss of your business insights and boardroom configuration.')) {
        try {
            const response = await fetch('/api/compliance/request-deletion', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ 
                    userId: onboardingData.userId || 'current',
                    reason: 'User requested deletion during onboarding'
                })
            });
            
            if (response.ok) {
                alert('Data deletion request submitted. Our team will contact you within 48 hours to confirm and process this request.');
            } else {
                throw new Error('Deletion request failed');
            }
        } catch (error) {
            console.error('Request deletion error:', error);
            alert('Unable to process deletion request. Please contact security@businessinfinity.asisaga.com directly.');
        }
    }
}

async function viewMyRoles() {
    try {
        const response = await fetch('/api/rbac/user-roles', {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            displayUserRoles(data.roles, data.permissions);
            document.getElementById('rolesModal').style.display = 'block';
        } else {
            throw new Error('Failed to fetch roles');
        }
    } catch (error) {
        console.error('View roles error:', error);
        alert('Unable to load role information. Please try again later.');
    }
}

function displayUserRoles(roles, permissions) {
    const rolesList = document.getElementById('userRolesList');
    const currentPermissions = document.getElementById('currentPermissions');
    
    // Display roles
    rolesList.innerHTML = roles.map(role => `
        <div class="role-item">
            <strong>${role.name}</strong>
            <p>${role.description}</p>
            <small>Assigned: ${new Date(role.assignedAt).toLocaleDateString()}</small>
        </div>
    `).join('');
    
    // Display permissions
    currentPermissions.innerHTML = `
        <ul>
            ${permissions.map(perm => `<li><span class="permission-name">${perm.name}:</span> ${perm.description}</li>`).join('')}
        </ul>
    `;
}

async function viewFullConsent() {
    try {
        const response = await fetch('/api/compliance/user-consent', {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const consentData = await response.json();
            displayConsentDetails(consentData);
            document.getElementById('consentModal').style.display = 'block';
        } else {
            throw new Error('Failed to fetch consent data');
        }
    } catch (error) {
        console.error('View consent error:', error);
        alert('Unable to load consent details. Please try again later.');
    }
}

function displayConsentDetails(consentData) {
    const detailsContainer = document.getElementById('fullConsentDetails');
    
    detailsContainer.innerHTML = `
        <div class="consent-section">
            <h3>Data Collection Consent</h3>
            <p><strong>Status:</strong> ${consentData.status}</p>
            <p><strong>Granted:</strong> ${new Date(consentData.grantedAt).toLocaleString()}</p>
            <p><strong>Purpose:</strong> ${consentData.purpose}</p>
            
            <h4>Specific Consents:</h4>
            <ul>
                ${consentData.specificConsents.map(consent => `
                    <li><strong>${consent.type}:</strong> ${consent.granted ? 'Granted' : 'Denied'} 
                        <small>(${new Date(consent.timestamp).toLocaleString()})</small>
                    </li>
                `).join('')}
            </ul>
            
            <h4>Data Categories Covered:</h4>
            <ul>
                ${consentData.dataCategories.map(cat => `<li>${cat}</li>`).join('')}
            </ul>
        </div>
    `;
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Load consent summary on page load
async function loadConsentSummary() {
    try {
        const response = await fetch('/api/compliance/user-consent', {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('consent-status').textContent = data.status;
            document.getElementById('data-collection-consent').textContent = 
                data.specificConsents.find(c => c.type === 'data_collection')?.granted ? 'Granted' : 'Pending';
            document.getElementById('consent-timestamp').textContent = 
                new Date(data.lastUpdated).toLocaleString();
        }
    } catch (error) {
        console.error('Load consent summary error:', error);
        // Fallback to default values already in HTML
    }
}

// Initialize consent summary when governance step is shown
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'step-9' && mutation.target.classList.contains('active')) {
                loadConsentSummary();
            }
        });
    });
    
    const step9 = document.getElementById('step-9');
    if (step9) {
        observer.observe(step9, { attributes: true, attributeFilter: ['class'] });
    }
});
