// Enhanced boardroom UI interactions and functionality
class BoardroomUI {
  constructor() {
    this.init();
  }

  init() {
    this.setupMessageInput();
    this.setupSearch();
    this.setupFilters();
    this.setupTooltips();
    this.setupLoadingStates();
    this.setupTypingIndicator();
    this.setupNotifications();
    this.setupKeyboardShortcuts();
  }

  setupMessageInput() {
    const messageInput = document.getElementById('message-input-control');
    const charCount = document.getElementById('char-count');
    const sendBtn = document.querySelector('.boardroom-message-input-send-btn');
    
    if (messageInput) {
      // Auto-resize textarea
      messageInput.addEventListener('input', (e) => {
        const maxLength = 1000;
        const currentLength = e.target.value.length;
        
        // Update character count
        if (charCount) {
          charCount.textContent = `${currentLength}/${maxLength}`;
          charCount.classList.toggle('warning', currentLength > maxLength * 0.8);
          charCount.classList.toggle('error', currentLength >= maxLength);
        }
        
        // Enable/disable send button
        if (sendBtn) {
          sendBtn.disabled = currentLength === 0 || currentLength > maxLength;
        }
        
        // Auto-resize
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
        
        // Show/hide clear button for search
        if (e.target.classList.contains('boardroom-members-search-input')) {
          const clearBtn = document.getElementById('search-clear-btn');
          if (clearBtn) {
            clearBtn.classList.toggle('active', e.target.value.length > 0);
          }
        }
      });

      // Handle Enter key
      messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Handle focus/blur for toolbar visibility
      const toolbar = document.querySelector('.boardroom-message-input-toolbar');
      if (toolbar) {
        messageInput.addEventListener('focus', () => {
          toolbar.style.opacity = '1';
        });
        
        messageInput.addEventListener('blur', () => {
          setTimeout(() => {
            if (!messageInput.value.trim()) {
              toolbar.style.opacity = '0';
            }
          }, 200);
        });
      }
    }
  }

  setupSearch() {
    const searchInput = document.getElementById('members-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    
    if (searchInput) {
      // Search functionality
      searchInput.addEventListener('input', (e) => {
        this.filterMembers(e.target.value);
      });
      
      // Clear search
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchInput.focus();
          this.filterMembers('');
          clearBtn.classList.remove('active');
        });
      }
    }
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.boardroom-members-filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Filter members
        const filter = e.target.dataset.filter;
        this.filterMembersByStatus(filter);
      });
    });
  }

  setupTooltips() {
    // Add hover effects for better UX
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        // You can add a custom tooltip implementation here
        console.log('Tooltip:', e.target.title);
      });
    });
  }

  setupLoadingStates() {
    const loadingOverlay = document.getElementById('boardroom-loading');
    
    // Show loading initially
    if (loadingOverlay) {
      loadingOverlay.classList.add('active');
      
      // Hide loading after initialization
      setTimeout(() => {
        loadingOverlay.classList.remove('active');
      }, 2000);
    }
  }

  setupTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    
    if (typingIndicator) {
      // Simulate typing indicator
      this.showTypingIndicator = (username) => {
        const typingText = typingIndicator.querySelector('.boardroom-typing-text');
        if (typingText) {
          typingText.textContent = `${username} is typing...`;
          typingIndicator.classList.add('active');
        }
      };
      
      this.hideTypingIndicator = () => {
        typingIndicator.classList.remove('active');
      };
    }
  }

  setupNotifications() {
    const notificationBadge = document.getElementById('notification-badge');
    
    if (notificationBadge) {
      // Update notification count
      this.updateNotificationCount = (count) => {
        if (count > 0) {
          notificationBadge.textContent = count > 99 ? '99+' : count;
          notificationBadge.style.display = 'flex';
        } else {
          notificationBadge.style.display = 'none';
        }
      };
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('members-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape to close modals/overlays
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });
  }

  // Utility methods
  filterMembers(searchTerm) {
    const members = document.querySelectorAll('.boardroom-member-item');
    
    members.forEach(member => {
      const name = member.querySelector('.boardroom-member-name')?.textContent?.toLowerCase() || '';
      const role = member.querySelector('.boardroom-member-role')?.textContent?.toLowerCase() || '';
      
      const matches = name.includes(searchTerm.toLowerCase()) || 
                     role.includes(searchTerm.toLowerCase());
      
      member.style.display = matches ? 'flex' : 'none';
    });
  }

  filterMembersByStatus(status) {
    const members = document.querySelectorAll('.boardroom-member-item');
    
    members.forEach(member => {
      const memberStatus = member.dataset.status;
      
      if (status === 'all') {
        member.style.display = 'flex';
      } else {
        member.style.display = memberStatus === status ? 'flex' : 'none';
      }
    });
  }

  sendMessage() {
    const messageInput = document.getElementById('message-input-control');
    const message = messageInput?.value.trim();
    
    if (message) {
      // Add message to chat (this would normally send to server)
      console.log('Sending message:', message);
      
      // Clear input
      messageInput.value = '';
      messageInput.style.height = 'auto';
      
      // Update character count
      const charCount = document.getElementById('char-count');
      if (charCount) {
        charCount.textContent = '0/1000';
        charCount.classList.remove('warning', 'error');
      }
      
      // Hide toolbar
      const toolbar = document.querySelector('.boardroom-message-input-toolbar');
      if (toolbar) {
        toolbar.style.opacity = '0';
      }
      
      // Show success toast
      this.showToast('Message sent successfully!', 'success');
    }
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('boardroom-toasts');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `boardroom-toast ${type}`;
    toast.innerHTML = `
      <div class="boardroom-toast-header">
        <h6 class="boardroom-toast-title">${this.getToastTitle(type)}</h6>
        <button class="boardroom-toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="boardroom-toast-body">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto-remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  getToastTitle(type) {
    const titles = {
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error'
    };
    return titles[type] || 'Notification';
  }

  closeModals() {
    const loadingOverlay = document.getElementById('boardroom-loading');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('active');
    }
  }
}

// Initialize enhanced UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BoardroomUI();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BoardroomUI;
}
