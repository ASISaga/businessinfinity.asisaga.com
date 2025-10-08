// Trust Center JavaScript

// Load dynamic compliance data
async function loadComplianceData() {
  try {
    // Load retention policy details
    const retentionResponse = await fetch('/api/compliance/retention-policy');
    if (retentionResponse.ok) {
      const retentionData = await retentionResponse.json();
      const retentionElement = document.getElementById('retentionPolicyDetails');
      if (retentionElement && retentionData.policies) {
        // Keep existing static content and add dynamic details
        const dynamicInfo = document.createElement('div');
        dynamicInfo.className = 'dynamic-policy-info';
        dynamicInfo.innerHTML = `
          <p class="muted small">
            <strong>Policy Version:</strong> ${retentionData.version || 'N/A'} | 
            <strong>Last Updated:</strong> ${retentionData.lastUpdated ? new Date(retentionData.lastUpdated).toLocaleDateString() : 'N/A'} | 
            <strong>Next Review:</strong> ${retentionData.nextReview ? new Date(retentionData.nextReview).toLocaleDateString() : 'N/A'}
          </p>
        `;
        retentionElement.appendChild(dynamicInfo);
      }
    }

    // Load compliance status
    const statusResponse = await fetch('/api/compliance/status');
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      const statusElement = document.getElementById('complianceStatus');
      if (statusElement && statusData.certifications) {
        statusElement.innerHTML = `
          <div class="status-indicators">
            ${statusData.certifications.map(cert => `
              <div class="cert-status ${cert.status || 'unknown'}">
                <span class="cert-name">${cert.name}</span>
                <span class="cert-badge">${cert.status === 'active' ? '✅' : '⚠️'}</span>
                <small>Valid until: ${cert.validUntil ? new Date(cert.validUntil).toLocaleDateString() : 'Unknown'}</small>
              </div>
            `).join('')}
          </div>
        `;
      }

      // Update certification metric
      const certMetric = document.getElementById('certMetric');
      if (certMetric) {
        const activeCerts = statusData.certifications.filter(c => c.status === 'active').length;
        certMetric.textContent = activeCerts;
      }
    }

    // Load incident contact info
    const contactResponse = await fetch('/api/compliance/incident-contact');
    if (contactResponse.ok) {
      const contactData = await contactResponse.json();
      const contactElement = document.getElementById('incidentContact');
      if (contactElement) {
        contactElement.innerHTML = `
          <div class="contact-info">
            <h4>🚨 Security Incident Contact</h4>
            <p><strong>Primary:</strong> <a href="mailto:${contactData.primary?.email || 'security@businessinfinity.asisaga.com'}">${contactData.primary?.email || 'security@businessinfinity.asisaga.com'}</a></p>
            ${contactData.primary?.phone ? `<p><strong>Phone:</strong> ${contactData.primary.phone}</p>` : ''}
            <p><strong>Average Response Time:</strong> ${contactData.averageResponseTime || '4 hours'}</p>
            ${contactData.backup?.email ? `<p><strong>Backup Contact:</strong> <a href="mailto:${contactData.backup.email}">${contactData.backup.email}</a></p>` : ''}
          </div>
        `;
      }
    }

    // Load metrics (uptime, response time, security incidents)
    await loadMetrics();

  } catch (error) {
    console.error('Error loading compliance data:', error);
    // Fallback to static content - remove loading messages
    const statusElement = document.getElementById('complianceStatus');
    if (statusElement) {
      statusElement.innerHTML = '<p class="muted">Real-time compliance data currently unavailable. Please contact us for the latest certification status.</p>';
    }
    
    const contactElement = document.getElementById('incidentContact');
    if (contactElement) {
      contactElement.innerHTML = `
        <div class="contact-info">
          <h4>🚨 Security Incident Contact</h4>
          <p><strong>Email:</strong> <a href="mailto:security@businessinfinity.asisaga.com">security@businessinfinity.asisaga.com</a></p>
          <p><strong>Response Time:</strong> Within 4 hours</p>
          <p><strong>Availability:</strong> 24/7</p>
        </div>
      `;
    }
  }
}

// Load trust metrics
async function loadMetrics() {
  try {
    // Load uptime metric
    const uptimeResponse = await fetch('/api/metrics/sla/uptime');
    if (uptimeResponse.ok) {
      const uptimeData = await uptimeResponse.json();
      const uptimeElement = document.getElementById('uptimeMetric');
      if (uptimeElement && uptimeData.currentMonth) {
        uptimeElement.textContent = `${uptimeData.currentMonth.uptime}%`;
      }
    } else {
      document.getElementById('uptimeMetric').textContent = '99.9%*';
    }

    // Load response time metric
    const responseResponse = await fetch('/api/metrics/sla/performance');
    if (responseResponse.ok) {
      const responseData = await responseResponse.json();
      const responseElement = document.getElementById('responseMetric');
      if (responseElement && responseData.averageResponseTime) {
        responseElement.textContent = responseData.averageResponseTime;
      }
    } else {
      document.getElementById('responseMetric').textContent = '< 4h*';
    }

    // Load security incidents metric
    const securityResponse = await fetch('/api/security/status');
    if (securityResponse.ok) {
      const securityData = await securityResponse.json();
      const securityElement = document.getElementById('securityMetric');
      if (securityElement && securityData.vulnerabilities) {
        const critical = securityData.vulnerabilities.critical || 0;
        const high = securityData.vulnerabilities.high || 0;
        securityElement.textContent = critical + high;
      }
    }

  } catch (error) {
    console.error('Error loading metrics:', error);
    // Keep placeholder values with asterisk to indicate they're static
    document.getElementById('uptimeMetric').textContent = '99.9%*';
    document.getElementById('responseMetric').textContent = '< 4h*';
    document.getElementById('certMetric').textContent = '5+*';
  }
}

// Export user data
async function exportMyData() {
  if (!confirm('This will generate a complete export of your data. You will receive a download link via email within 24 hours. Continue?')) {
    return;
  }

  try {
    const response = await fetch('/api/compliance/export-data', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ userId: getCurrentUserId() || 'current' })
    });
    
    if (response.ok) {
      const result = await response.json();
      alert('Data export request submitted successfully. You will receive a download link via email within 24 hours.');
    } else {
      throw new Error('Export request failed');
    }
  } catch (error) {
    console.error('Export data error:', error);
    alert('Unable to process export request. Please contact privacy@businessinfinity.asisaga.com for assistance.');
  }
}

// Request data deletion
async function requestDataDeletion() {
  if (!confirm('Are you sure you want to request deletion of your data? This action cannot be undone and will result in permanent loss of your business insights and boardroom configuration.\n\nYou will receive a verification email before the deletion is processed.')) {
    return;
  }

  try {
    const response = await fetch('/api/compliance/request-deletion', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ 
        userId: getCurrentUserId() || 'current',
        reason: 'User requested deletion from Trust Center'
      })
    });
    
    if (response.ok) {
      alert('Data deletion request submitted. You will receive a verification email. Please confirm to proceed with the deletion, which will be completed within 48 hours of confirmation.');
    } else {
      throw new Error('Deletion request failed');
    }
  } catch (error) {
    console.error('Request deletion error:', error);
    alert('Unable to process deletion request. Please contact privacy@businessinfinity.asisaga.com directly.');
  }
}

// Helper function to get auth headers
function getAuthHeaders() {
  // This should be implemented based on your authentication system
  // For now, return empty object if not authenticated
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

// Helper function to get current user ID
function getCurrentUserId() {
  // This should be implemented based on your authentication system
  return localStorage.getItem('userId') || sessionStorage.getItem('userId') || null;
}

// Scroll reveal for sections
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Load compliance data
  loadComplianceData();
  
  // Set up scroll reveal
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
  
  // Add reveal animation styles
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
});
