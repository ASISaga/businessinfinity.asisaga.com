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
