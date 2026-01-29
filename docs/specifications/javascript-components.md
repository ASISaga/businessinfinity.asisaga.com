---
layout: docs
title: JavaScript & Web Components Specification
description: JavaScript modules, web components, and API integration patterns
search: true
breadcrumbs:
  - title: Docs
    url: /docs/
  - title: Specifications
    url: /docs/specifications/
prev:
  title: SCSS & Styling
  url: /docs/specifications/scss-styling
next:
  title: API Integration
  url: /docs/specifications/api-integration
---

## Overview

Business Infinity uses modern ES6+ JavaScript with a modular architecture. Web Components provide encapsulated, reusable UI elements with Shadow DOM isolation.

## JavaScript Architecture

### Module System
- **ES6 Modules**: `import`/`export` syntax
- **No Bundler**: Native browser module support
- **Type**: `type="module"` in script tags

### Entry Points

#### Main Application Entry
**File**: `/assets/js/script.js`

Imports theme common scripts, then subdomain-specific modules:
```javascript
// Theme common scripts loaded first
import '/theme/assets/js/common.js';

// Subdomain-specific modules
import './boardroom/boardroom.js';
import './dashboard/dashboard.js';
import './mentor/mentor.js';
```

#### Page-Specific Scripts
Individual pages may load specific modules:
```html
<script type="module" src="/assets/js/boardroom/boardroom.js"></script>
```

### Directory Structure

```
assets/js/
├── script.js                   # Main entry point
├── config.js                   # Configuration constants
├── apiRoutes.js               # API routing helpers
├── openapi-loader.js          # OpenAPI spec loader
├── boardroom/                 # Boardroom modules
│   ├── boardroom.js           # Main boardroom logic
│   ├── BoardroomApp.js        # Boardroom app component
│   ├── chat.js                # Chat functionality
│   ├── messages.js            # Message rendering
│   ├── members.js             # Member list rendering
│   ├── profiles.js            # Profile management
│   ├── boardroomApi.js        # Boardroom API calls
│   ├── sidebar-element.js     # Sidebar web component
│   ├── sidebar-toggle.js      # Sidebar toggle logic
│   ├── template-utils.js      # Template utilities
│   ├── ui-enhancements.js     # UI improvements
│   ├── ChatMessage.js         # Chat message component
│   ├── AgentProfileCard.js    # Agent profile card
│   └── AgentListItem.js       # Agent list item
├── dashboard/                 # Dashboard modules
│   └── dashboard.js           # Dashboard logic
├── mentor/                    # Mentor modules
│   └── mentor.js              # Mentor mode logic
├── network/                   # Network modules
│   └── api.js                 # Network API
├── framework/                 # Decision framework
│   └── app.js                 # Framework logic
└── vendor/                    # Third-party libraries
```

## Web Components

### Component Architecture

#### Base Structure
```javascript
class CustomComponent extends HTMLElement {
  constructor() {
    super();
    // Initialize properties
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    // Called when element added to DOM
    this.render();
    this.attachEventListeners();
  }
  
  disconnectedCallback() {
    // Called when element removed from DOM
    this.cleanup();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    // Called when observed attributes change
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  static get observedAttributes() {
    return ['attr1', 'attr2'];
  }
  
  render() {
    // Render component
    this.shadowRoot.innerHTML = `
      <style>
        /* Scoped styles */
      </style>
      <div class="container">
        <!-- Component content -->
      </div>
    `;
  }
  
  attachEventListeners() {
    // Add event listeners
  }
  
  cleanup() {
    // Remove event listeners, clear intervals
  }
}

// Register component
customElements.define('custom-component', CustomComponent);
```

### Registered Components

#### BoardroomChat
**File**: `/client/BoardroomChat.js`

Real-time chat component with message polling.

```javascript
class BoardroomChat extends HTMLElement {
  constructor() {
    super();
    this.interval = null;
    this.lastKey = null;
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
    this.startPolling();
  }
  
  disconnectedCallback() {
    clearInterval(this.interval);
  }
  
  async poll() {
    // Fetch new messages from API
    // Update DOM with new messages
    // Track last message key for incremental updates
  }
  
  startPolling() {
    this.interval = setInterval(() => this.poll().catch(() => {}), 5000);
    this.poll();
  }
}

customElements.define('boardroom-chat', BoardroomChat);
```

**Attributes**:
- `boardroom-id`: Boardroom identifier
- `conversation-id`: Conversation identifier
- `api-host`: Backend API host URL

**Features**:
- 5-second polling interval
- Incremental message loading with `since` parameter
- HTML escaping for XSS prevention
- Shadow DOM style encapsulation

#### McpDashboard
**File**: `/client/McpDashboard.js`

Role-based dashboard with dynamic form rendering.

```javascript
class McpDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  async connectedCallback() {
    const role = this.getAttribute('role') || 'CMO';
    const scope = this.getAttribute('scope') || 'local';
    
    // Fetch UI schema from backend
    const res = await fetch(`${HOST}/dashboard?role=${role}&scope=${scope}`);
    const { uiSchema } = await res.json();
    
    this.render(uiSchema);
  }
  
  render(schema) {
    // Render panels and forms from schema
  }
  
  async submit(event) {
    // Handle form submission
    // Send action to backend API
  }
}

customElements.define('mcp-dashboard', McpDashboard);
```

**Attributes**:
- `role`: User role (CMO, CEO, CTO, etc.)
- `scope`: Operation scope (local, global)

**Features**:
- Dynamic UI from backend schema
- Form generation from JSON schema
- Action submission to backend
- Loading states and error handling

#### AmlDemo
**File**: `/client/AmlDemo.js`

Azure Machine Learning integration demo.

```javascript
class AmlDemo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }
  
  async handleInference(event) {
    // Send inference request to Azure ML
  }
  
  async handleTraining(event) {
    // Start training job
  }
}

customElements.define('aml-demo', AmlDemo);
```

#### BoardroomApp
**File**: `/assets/js/boardroom/BoardroomApp.js`

Main boardroom application container.

```javascript
class BoardroomApp extends HTMLElement {
  constructor() {
    super();
    // Initialize without Shadow DOM for layout integration
  }
  
  connectedCallback() {
    this.initializeApp();
  }
  
  initializeApp() {
    // Initialize boardroom features
    // Set up event listeners
    // Load initial data
  }
}

customElements.define('boardroom-app', BoardroomApp);
```

**Attributes**:
- `title`: Application title
- `show-avatar`: Show user avatars
- `show-toolbar`: Show toolbar
- `show-typing-indicator`: Show typing indicator
- `auto-refresh`: Enable auto-refresh
- `refresh-interval`: Refresh interval in ms

#### Sidebar Element
**File**: `/assets/js/boardroom/sidebar-element.js`

Collapsible sidebar navigation.

```javascript
class SidebarElement extends HTMLElement {
  constructor() {
    super();
    this.collapsed = false;
  }
  
  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }
  
  toggle() {
    this.collapsed = !this.collapsed;
    this.updateVisibility();
  }
}

customElements.define('sidebar-element', SidebarElement);
```

### Component Templates

#### Template Loading Pattern
Components load HTML templates from `/components/` directory:

```javascript
async loadTemplate(templatePath) {
  const response = await fetch(templatePath);
  const html = await response.text();
  return html;
}

async connectedCallback() {
  const template = await this.loadTemplate('/components/my-component.html');
  this.shadowRoot.innerHTML = template;
}
```

### Shadow DOM Encapsulation

#### Style Isolation
```javascript
render() {
  this.shadowRoot.innerHTML = `
    <style>
      /* These styles only apply within this component */
      :host {
        display: block;
        padding: 1rem;
      }
      
      .container {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
      }
      
      /* Style slotted content */
      ::slotted(*) {
        margin: 0;
      }
    </style>
    
    <div class="container">
      <slot></slot>
    </div>
  `;
}
```

#### Event Handling in Shadow DOM
```javascript
attachEventListeners() {
  // Events inside Shadow DOM
  this.shadowRoot.querySelector('.button').addEventListener('click', (e) => {
    this.handleClick(e);
  });
  
  // Dispatch custom events to host
  this.dispatchEvent(new CustomEvent('action', {
    detail: { type: 'submit', data: this.formData },
    bubbles: true,
    composed: true  // Crosses Shadow DOM boundary
  }));
}
```

## API Integration

### Configuration
**File**: `/assets/js/config.js`

```javascript
export const API_CONFIG = {
  baseUrl: 'https://cloud.businessinfinity.asisaga.com',
  boardroomId: 'business-infinity',
  conversationId: 'default',
  timeout: 30000,
  retryAttempts: 3
};
```

### OpenAPI Specification Loading
**File**: `/assets/js/openapi-loader.js`

```javascript
let cachedSpec = null;

export async function getOpenApiSpec() {
  if (cachedSpec) return cachedSpec;
  
  try {
    const response = await fetch('/assets/data/openapi.json');
    cachedSpec = await response.json();
    return cachedSpec;
  } catch (error) {
    console.error('Failed to load OpenAPI spec:', error);
    return null;
  }
}

export async function getOperation(operationId) {
  const spec = await getOpenApiSpec();
  if (!spec) return null;
  
  // Find operation by operationId in spec
  for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (operation.operationId === operationId) {
        return { path, method, operation };
      }
    }
  }
  
  return null;
}
```

### API Routes Helper
**File**: `/assets/js/apiRoutes.js`

```javascript
import { getOperation } from './openapi-loader.js';
import { API_CONFIG } from './config.js';

export function buildApiUrl(path, params = {}) {
  const url = new URL(path, API_CONFIG.baseUrl);
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  
  return url.toString();
}

export async function getApiPath(operationId, params = {}) {
  const operation = await getOperation(operationId);
  if (!operation) {
    throw new Error(`Operation ${operationId} not found in spec`);
  }
  
  let path = operation.path;
  
  // Replace path parameters
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`{${key}}`, encodeURIComponent(value));
  }
  
  return buildApiUrl(path);
}

export function authHeader() {
  // Get Azure AD token from session/local storage
  const token = sessionStorage.getItem('azure_ad_token');
  
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`
  };
}
```

### API Call Pattern
```javascript
import { getApiPath, authHeader } from './apiRoutes.js';

async function fetchMessages(boardroomId, conversationId, since = null) {
  const params = { boardroomId, conversationId };
  if (since) params.since = since;
  
  const url = await getApiPath('getConversationMessages', params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}
```

## Boardroom-Specific Logic

### Chat Functionality
**File**: `/assets/js/boardroom/chat.js`

```javascript
export class ChatManager {
  constructor(messageContainer) {
    this.container = messageContainer;
    this.messages = [];
  }
  
  async loadMessages() {
    // Fetch messages from API
    const data = await fetchMessages();
    this.messages = data.messages;
    this.render();
  }
  
  render() {
    // Render messages with proper escaping
    this.container.innerHTML = this.messages
      .map(msg => this.renderMessage(msg))
      .join('');
  }
  
  renderMessage(message) {
    const escapedContent = this.escapeHtml(message.content);
    return `
      <div class="message" data-id="${message.id}">
        <div class="message-meta">
          <span class="sender">${this.escapeHtml(message.sender)}</span>
          <span class="timestamp">${this.formatTimestamp(message.timestamp)}</span>
        </div>
        <div class="message-content">${escapedContent}</div>
      </div>
    `;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  formatTimestamp(timestamp) {
    return new Date(timestamp * 1000).toLocaleString();
  }
}
```

### Members Rendering
**File**: `/assets/js/boardroom/members.js`

```javascript
export default class MembersRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }
  
  async render(members, lastMessages, unreadCounts, allMessages) {
    if (!this.container) return;
    
    const html = members.map(member => 
      this.renderMember(member, lastMessages, unreadCounts)
    ).join('');
    
    this.container.innerHTML = html;
  }
  
  renderMember(member, lastMessages, unreadCounts) {
    const lastMsg = lastMessages[member.id] || null;
    const unread = unreadCounts[member.id] || 0;
    
    return `
      <div class="member-item" data-member-id="${member.id}">
        <img src="${member.avatar}" alt="${member.name} avatar">
        <div class="member-info">
          <h4>${member.name}</h4>
          <p>${lastMsg ? lastMsg.preview : 'No messages'}</p>
        </div>
        ${unread > 0 ? `<span class="badge">${unread}</span>` : ''}
      </div>
    `;
  }
}
```

### UI Enhancements
**File**: `/assets/js/boardroom/ui-enhancements.js`

```javascript
// Toast notifications
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Loading overlay
export function showLoading() {
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(overlay);
}

export function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.remove();
}
```

## Idempotent Initialization

### Guard Pattern
```javascript
// Prevent duplicate initialization
let initialized = false;

export function init() {
  if (initialized) {
    console.warn('Already initialized');
    return;
  }
  
  initialized = true;
  
  // Initialization logic
  setupEventListeners();
  loadInitialData();
}

// Reset for testing/HMR
export function reset() {
  initialized = false;
  cleanup();
}
```

### Event Listener Management
```javascript
class ComponentManager {
  constructor() {
    this.listeners = [];
  }
  
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }
  
  removeAllListeners() {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }
}
```

## Security Patterns

### HTML Escaping
```javascript
// Always escape user-generated content
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Usage
const userInput = '<script>alert("XSS")</script>';
element.textContent = userInput;  // Safe (text node)
element.innerHTML = escapeHtml(userInput);  // Safe (escaped)
```

### Input Validation
```javascript
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function sanitizeInput(input, maxLength = 1000) {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '');  // Remove potential HTML
}
```

### Safe DOM Manipulation
```javascript
// ✓ Preferred: Create elements programmatically
const div = document.createElement('div');
div.className = 'container';
div.textContent = userInput;  // Safe

// ✓ Acceptable: Template literals with escaping
const html = `<div class="container">${escapeHtml(userInput)}</div>`;

// ❌ Never: Raw innerHTML with user input
// element.innerHTML = `<div>${userInput}</div>`;
```

## Forbidden Patterns

### ❌ HTML-in-JS
```javascript
// ❌ DON'T: Raw HTML strings assigned to innerHTML
element.innerHTML = '<div>' + userInput + '</div>';

// ❌ DON'T: Template literals with HTML tags and user input
element.innerHTML = `
  <div class="message">
    ${userData.message}
  </div>
`;

// ✓ DO: Use textContent or escaped content
element.textContent = userInput;

// ✓ DO: Create DOM elements
const div = document.createElement('div');
div.className = 'message';
div.textContent = userData.message;
element.appendChild(div);

// ✓ DO: Escape before using innerHTML
element.innerHTML = `
  <div class="message">
    ${escapeHtml(userData.message)}
  </div>
`;
```

### ❌ Inline Event Handlers
```javascript
// ❌ DON'T: Inline event handlers in HTML strings
element.innerHTML = '<button onclick="handleClick()">Click</button>';

// ✓ DO: Attach event listeners programmatically
const button = document.createElement('button');
button.textContent = 'Click';
button.addEventListener('click', handleClick);
```

### ❌ Global Pollution
```javascript
// ❌ DON'T: Pollute global scope
window.myFunction = function() { };
var globalVar = 'value';

// ✓ DO: Use modules and const/let
export function myFunction() { }
const localVar = 'value';
```

## Vendor Libraries

### Vendor Directory
**Location**: `/assets/js/vendor/`

Place third-party JavaScript libraries here.

### Vendor Preparation
```bash
# Download and prepare vendor files locally
# Commit to repository for GitHub Pages compatibility
```

### Vendor Documentation
```javascript
/**
 * Library Name v1.2.3
 * Source: https://example.com/library
 * License: MIT
 * Last Updated: 2024-01-15
 * 
 * Purpose: Brief description of why we use this library
 */
```

### Vendor Import
```javascript
// Import vendor library
import '/assets/js/vendor/library.js';

// Use library
LibraryNamespace.init();
```

## Performance Optimization

### Lazy Loading
```javascript
// Load heavy modules only when needed
async function loadDashboard() {
  const { Dashboard } = await import('./dashboard/dashboard.js');
  return new Dashboard();
}

// Usage
document.querySelector('#dashboard-trigger').addEventListener('click', async () => {
  const dashboard = await loadDashboard();
  dashboard.init();
});
```

### Debouncing & Throttling
```javascript
// Debounce: Wait until user stops typing
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle: Limit execution rate
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debounce(handleSearch, 300));

window.addEventListener('scroll', throttle(handleScroll, 100));
```

### Resource Management
```javascript
class ResourceManager {
  constructor() {
    this.intervals = [];
    this.timeouts = [];
  }
  
  setInterval(callback, delay) {
    const id = setInterval(callback, delay);
    this.intervals.push(id);
    return id;
  }
  
  setTimeout(callback, delay) {
    const id = setTimeout(callback, delay);
    this.timeouts.push(id);
    return id;
  }
  
  cleanup() {
    this.intervals.forEach(clearInterval);
    this.timeouts.forEach(clearTimeout);
    this.intervals = [];
    this.timeouts = [];
  }
}
```

## Error Handling

### Try-Catch Pattern
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    
    // Fallback behavior
    return { data: [], error: error.message };
  }
}
```

### Global Error Handler
```javascript
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Log to monitoring service
  // Show user-friendly error message
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Log to monitoring service
});
```

## Testing Considerations

### Testable Code
```javascript
// Export functions for testing
export function add(a, b) {
  return a + b;
}

export function processData(data) {
  // Pure function - easy to test
  return data.map(item => ({
    ...item,
    processed: true
  }));
}
```

### Mock-Friendly API Calls
```javascript
// Dependency injection for testing
export class ApiClient {
  constructor(fetcher = fetch) {
    this.fetcher = fetcher;
  }
  
  async getData(url) {
    const response = await this.fetcher(url);
    return await response.json();
  }
}

// In tests, inject mock fetcher
const mockFetch = () => Promise.resolve({
  json: () => Promise.resolve({ data: [] })
});
const client = new ApiClient(mockFetch);
```

## Documentation

### JSDoc Comments
```javascript
/**
 * Fetches conversation messages from the API
 * 
 * @param {string} boardroomId - The boardroom identifier
 * @param {string} conversationId - The conversation identifier
 * @param {string|null} since - Last message key for incremental fetch
 * @returns {Promise<Object>} The API response with messages
 * @throws {Error} If the API request fails
 * 
 * @example
 * const messages = await fetchMessages('board-1', 'conv-1');
 * console.log(messages.messages);
 */
async function fetchMessages(boardroomId, conversationId, since = null) {
  // Implementation
}
```

### Module Headers
```javascript
/**
 * Boardroom Chat Manager
 * 
 * Handles real-time chat functionality including:
 * - Message polling (5-second intervals)
 * - Message rendering with XSS protection
 * - Member list updates
 * - Unread count tracking
 * 
 * @module boardroom/chat
 * @since 1.0.0
 */
```
