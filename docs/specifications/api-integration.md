---
layout: docs
title: API Integration Specification
description: Backend API integration and communication patterns
search: true
breadcrumbs:
  - title: Docs
    url: /docs/
  - title: Specifications
    url: /docs/specifications/
prev:
  title: JavaScript & Components
  url: /docs/specifications/javascript-components
next:
  title: Data Structures
  url: /docs/specifications/data-structures
---

## Overview

Business Infinity integrates with a serverless backend hosted on Azure Functions. The API follows RESTful principles with OpenAPI 3.0 specification and Azure AD authentication.

## Backend Architecture

### Host Configuration
- **Production**: `https://cloud.businessinfinity.asisaga.com`
- **Development**: Localhost or staging environment
- **Protocol**: HTTPS only (enforced)
- **CORS**: Configured for `businessinfinity.asisaga.com` domain

### OpenAPI Specification

#### Specification Location
- **Runtime**: `GET /openapi.json` from backend
- **Cache**: `/assets/data/openapi.json` (frontend cache)
- **Version**: OpenAPI 3.0.3
- **Format**: JSON

#### Specification Structure
```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Business Infinity API",
    "version": "1.0.0",
    "description": "Backend API for Business Infinity platform"
  },
  "servers": [
    {
      "url": "https://cloud.businessinfinity.asisaga.com",
      "description": "Production server"
    }
  ],
  "paths": {
    "/messages": {
      "get": {
        "operationId": "getConversationMessages",
        "summary": "Get conversation messages",
        "parameters": [...],
        "responses": {...}
      }
    }
  },
  "components": {
    "schemas": {...},
    "securitySchemes": {...}
  }
}
```

## API Operations

### Message Operations

#### Get Conversation Messages
**Operation ID**: `getConversationMessages`  
**Method**: `GET`  
**Path**: `/messages`

**Query Parameters**:
```javascript
{
  boardroomId: string,     // Required: Boardroom identifier
  conversationId: string,  // Required: Conversation identifier
  since: string            // Optional: Last message key for incremental fetch
}
```

**Response**:
```json
{
  "messages": [
    {
      "messageId": "msg-123",
      "senderAgentId": "agent-founder",
      "timestamp": 1704067200,
      "payload": {
        "type": "text",
        "content": "Message content"
      }
    }
  ],
  "nextKey": "1704067200000-msg-123"
}
```

**Example**:
```javascript
const url = new URL('/messages', API_BASE);
url.searchParams.set('boardroomId', 'business-infinity');
url.searchParams.set('conversationId', 'default');
url.searchParams.set('since', lastMessageKey);

const response = await fetch(url, {
  headers: authHeader()
});
const data = await response.json();
```

#### Post Conversation Message
**Operation ID**: `postConversationMessage`  
**Method**: `POST`  
**Path**: `/messages`

**Request Body**:
```json
{
  "boardroomId": "business-infinity",
  "conversationId": "default",
  "senderAgentId": "user-123",
  "payload": {
    "type": "text",
    "content": "User message"
  }
}
```

**Response**:
```json
{
  "messageId": "msg-124",
  "timestamp": 1704067260,
  "status": "sent"
}
```

### Agent Operations

#### Get Agents
**Operation ID**: `getAgents`  
**Method**: `GET`  
**Path**: `/agents`

**Query Parameters**:
```javascript
{
  boardroomId: string,  // Required: Boardroom identifier
  role: string          // Optional: Filter by role
}
```

**Response**:
```json
{
  "agents": [
    {
      "agentId": "agent-founder",
      "name": "Founder Agent",
      "role": "Founder",
      "avatar": "https://example.com/avatar.png",
      "status": "online"
    }
  ]
}
```

#### Start Conversation
**Operation ID**: `startConversation`  
**Method**: `POST`  
**Path**: `/conversations`

**Request Body**:
```json
{
  "boardroomId": "business-infinity",
  "agentDomain": "founder",
  "initialMessage": "Let's discuss the roadmap"
}
```

**Response**:
```json
{
  "conversationId": "conv-456",
  "status": "active",
  "participants": ["agent-founder", "user-123"]
}
```

### Dashboard Operations

#### Get Dashboard
**Operation ID**: `getDashboard`  
**Method**: `GET`  
**Path**: `/dashboard`

**Query Parameters**:
```javascript
{
  role: string,   // Required: User role (CMO, CEO, CTO)
  scope: string   // Required: Scope (local, global)
}
```

**Response**:
```json
{
  "uiSchema": {
    "panels": [
      {
        "title": "Marketing Panel",
        "actions": [
          {
            "id": "create-campaign",
            "label": "Create Campaign",
            "agentId": "agent-cmo",
            "argsSchema": {
              "name": { "type": "string" },
              "budget": { "type": "number" },
              "platform": { 
                "type": "string",
                "enum": ["Google", "Facebook", "LinkedIn"]
              }
            }
          }
        ]
      }
    ]
  }
}
```

#### Post Dashboard Action
**Operation ID**: `postDashboardAction`  
**Method**: `POST`  
**Path**: `/action`

**Request Body**:
```json
{
  "boardroomId": "business-infinity",
  "conversationId": "default",
  "agentId": "agent-cmo",
  "action": "create-campaign",
  "args": {
    "name": "Q1 Campaign",
    "budget": 10000,
    "platform": "LinkedIn"
  },
  "scope": "local"
}
```

**Response**:
```json
{
  "actionId": "action-789",
  "status": "queued",
  "queuedAt": 1704067320
}
```

## Authentication & Authorization

### Azure AD OAuth 2.0

#### Authentication Flow
1. **User Login**: Redirect to Azure AD login page
2. **Consent**: User grants permissions
3. **Token Exchange**: Authorization code exchanged for access token
4. **Token Storage**: Access token stored in sessionStorage
5. **API Calls**: Token included in Authorization header

#### Token Management
```javascript
// Store token after login
function storeToken(token, expiresIn) {
  sessionStorage.setItem('azure_ad_token', token);
  sessionStorage.setItem('token_expiry', Date.now() + (expiresIn * 1000));
}

// Retrieve token for API calls
function getToken() {
  const token = sessionStorage.getItem('azure_ad_token');
  const expiry = sessionStorage.getItem('token_expiry');
  
  if (!token || Date.now() > parseInt(expiry)) {
    // Token expired, redirect to login
    redirectToLogin();
    return null;
  }
  
  return token;
}

// Build authorization header
export function authHeader() {
  const token = getToken();
  
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`
  };
}
```

#### Token Refresh
```javascript
async function refreshToken() {
  const refreshToken = sessionStorage.getItem('refresh_token');
  
  const response = await fetch('https://login.microsoftonline.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID
    })
  });
  
  const data = await response.json();
  storeToken(data.access_token, data.expires_in);
  
  return data.access_token;
}
```

### Role-Based Access Control (RBAC)

#### User Roles
- **Founder**: Full access, can modify covenants
- **Investor**: Read-only access to financials, can approve/reject proposals
- **CEO**: Executive operations, strategic decisions
- **CTO**: Technical decisions, architecture
- **CMO**: Marketing operations
- **CFO**: Financial operations
- **COO**: Operational decisions

#### Permission Checks
```javascript
// Backend validates user role against operation
// Frontend shows/hides UI based on role

function hasPermission(userRole, requiredRole) {
  const roleHierarchy = {
    'Founder': 100,
    'CEO': 80,
    'CTO': 70,
    'CMO': 70,
    'CFO': 70,
    'COO': 70,
    'Investor': 50
  };
  
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}
```

## Request/Response Patterns

### Standard Headers
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...authHeader()
};
```

### Error Responses
All API errors follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: boardroomId",
    "details": {
      "parameter": "boardroomId",
      "location": "query"
    }
  }
}
```

**Error Codes**:
- `INVALID_REQUEST`: Malformed request
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

### Error Handling Pattern
```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.error.code,
        errorData.error.message,
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API error
      console.error('API Error:', error.code, error.message);
      
      if (error.code === 'UNAUTHORIZED') {
        redirectToLogin();
      }
    } else {
      // Handle network error
      console.error('Network Error:', error);
    }
    
    throw error;
  }
}

class ApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'ApiError';
  }
}
```

## Rate Limiting

### Client-Side Rate Limiting
```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  async checkLimit() {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      
      throw new Error(`Rate limit exceeded. Retry in ${waitTime}ms`);
    }
    
    this.requests.push(now);
  }
}

// Usage
const limiter = new RateLimiter(100, 60000); // 100 requests per minute

async function rateLimitedFetch(url, options) {
  await limiter.checkLimit();
  return await fetch(url, options);
}
```

## Caching Strategy

### Response Caching
```javascript
class ApiCache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
}

// Usage
const cache = new ApiCache(300000); // 5 minute TTL

async function cachedFetch(url, options = {}) {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // Fetch and cache
  const data = await apiCall(url, options);
  cache.set(cacheKey, data);
  
  return data;
}
```

### Cache Invalidation
```javascript
// Invalidate cache on mutations
async function postMessage(message) {
  const response = await apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify(message)
  });
  
  // Invalidate messages cache
  cache.clear();
  
  return response;
}
```

## Polling Pattern

### Message Polling
```javascript
class MessagePoller {
  constructor(fetchFunction, interval = 5000) {
    this.fetchFunction = fetchFunction;
    this.interval = interval;
    this.timerId = null;
    this.lastKey = null;
  }
  
  start() {
    if (this.timerId) return;
    
    // Initial fetch
    this.poll();
    
    // Set up polling
    this.timerId = setInterval(() => {
      this.poll().catch(error => {
        console.error('Polling error:', error);
      });
    }, this.interval);
  }
  
  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
  
  async poll() {
    const params = {};
    if (this.lastKey) {
      params.since = this.lastKey;
    }
    
    const data = await this.fetchFunction(params);
    
    if (data.messages && data.messages.length > 0) {
      this.lastKey = data.nextKey;
      this.onNewMessages(data.messages);
    }
  }
  
  onNewMessages(messages) {
    // Override in subclass or set as callback
    console.log('New messages:', messages);
  }
}

// Usage
const poller = new MessagePoller(
  async (params) => {
    const url = buildUrl('/messages', {
      boardroomId: 'business-infinity',
      conversationId: 'default',
      ...params
    });
    return await apiCall(url);
  },
  5000
);

poller.onNewMessages = (messages) => {
  messages.forEach(msg => renderMessage(msg));
};

poller.start();

// Clean up when component unmounts
// poller.stop();
```

## Retry Logic

### Exponential Backoff
```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait before retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

## WebSocket Support (Future)

### WebSocket Connection Pattern
```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    setTimeout(() => {
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
      this.connect();
    }, delay);
  }
  
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected');
    }
  }
  
  handleMessage(data) {
    // Override in subclass
    console.log('Received:', data);
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

## API Testing

### Mock API Responses
```javascript
// For testing and development
export class MockApiClient {
  async getMessages(params) {
    // Return mock data
    return {
      messages: [
        {
          messageId: 'mock-1',
          senderAgentId: 'agent-founder',
          timestamp: Date.now() / 1000,
          payload: {
            type: 'text',
            content: 'Mock message'
          }
        }
      ],
      nextKey: 'mock-key'
    };
  }
  
  async postMessage(message) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      messageId: 'mock-' + Date.now(),
      timestamp: Date.now() / 1000,
      status: 'sent'
    };
  }
}
```

### API Integration Tests
```javascript
// Test API endpoints are accessible
async function testApiHealth() {
  const tests = [
    { name: 'OpenAPI Spec', url: '/openapi.json' },
    { name: 'Agents List', url: '/agents?boardroomId=test' },
    { name: 'Messages', url: '/messages?boardroomId=test&conversationId=test' }
  ];
  
  for (const test of tests) {
    try {
      const response = await fetch(API_BASE + test.url);
      console.log(`✓ ${test.name}: ${response.status}`);
    } catch (error) {
      console.error(`✗ ${test.name}:`, error);
    }
  }
}
```

## Best Practices

### Request Optimization
- Use query parameters for filtering, not multiple requests
- Batch operations when possible
- Implement pagination for large datasets
- Cache responses appropriately

### Security
- Always use HTTPS
- Include CSRF tokens for mutations
- Validate all inputs client-side and server-side
- Sanitize user-generated content
- Never expose API keys or secrets in frontend code

### Error Handling
- Handle all possible error states
- Provide meaningful error messages to users
- Log errors for debugging
- Implement fallback behavior

### Performance
- Minimize API calls
- Use polling efficiently (appropriate intervals)
- Implement request debouncing for user inputs
- Cache static data
- Use incremental loading for lists
