---
layout: docs
title: Data Structures Specification
description: Data formats, schemas, and state management for Business Infinity
search: true
breadcrumbs:
  - title: Docs
    url: /docs/
  - title: Specifications
    url: /docs/specifications/
prev:
  title: API Integration
  url: /docs/specifications/api-integration
next:
  title: Back to Index
  url: /docs/specifications/
---

## Overview

Business Infinity uses structured data formats for configuration, content, and API communication. This document defines the schema and format for all data structures.

## Configuration Data

### Jekyll Configuration
**File**: `_config.yml`

```yaml
title: ASI Saga
description: Genesis of Artificial Superintelligence
ignore_theme_config: true

sass:
  load_paths:
    - _sass
    - assets/css

plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-remote-theme

remote_theme: ASISaga/theme.asisaga.com

exclude:
  - docs/
  - LICENSE
  - README.md
  - website_structure.json
```

### Navigation Data
**File**: `_data/nav.json`

```json
{
  "navigation": [
    {
      "title": "Home",
      "url": "https://www.asisaga.com/"
    },
    {
      "title": "Business Infinity",
      "url": "https://businessinfinity.asisaga.com/",
      "subcategories": [
        {
          "title": "Features",
          "url": "https://businessinfinity.asisaga.com/features/"
        }
      ]
    }
  ],
  "footer_nav": [...],
  "social_links": [...]
}
```

**Schema**:
```typescript
interface Navigation {
  navigation: NavigationItem[];
  footer_nav: NavigationItem[];
  social_links: SocialLink[];
}

interface NavigationItem {
  title: string;
  url: string;
  subcategories?: NavigationItem[];
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  aria_label: string;
}
```

### Product Data
**File**: `_data/business_infinity.yml`

```yaml
title: "Business Infinity"
description: "AI-powered business platform"
page_title: "Business Infinity"

features:
  section_title: "Key Features"
  items:
    - title: "Comprehensive Business Analysis"
      icon: "business-icon-analysis"
      description: "AI-powered analytics"
    
use_cases:
  section_title: "Who Can Benefit"
  segments:
    - title: "Entrepreneurs"
      url: "/business-infinity/entrepreneur/"

testimonials:
  section_title: "What Our Users Say"
  items:
    - text: "Great product!"
      name: "John Doe"
      company: "CEO, Tech Startup Inc."

cta:
  title: "Ready to Transform Your Business?"
  description: "Get started today"
  button_text: "Contact Us"
  button_url: "linkedin"
```

**Schema**:
```typescript
interface ProductData {
  title: string;
  description: string;
  page_title: string;
  features: FeaturesSection;
  use_cases: UseCasesSection;
  testimonials: TestimonialsSection;
  cta: CallToAction;
}

interface FeaturesSection {
  section_title: string;
  items: Feature[];
}

interface Feature {
  title: string;
  icon: string;
  description: string;
}

interface UseCasesSection {
  section_title: string;
  segments: Segment[];
}

interface Segment {
  title: string;
  url: string;
}

interface TestimonialsSection {
  section_title: string;
  items: Testimonial[];
}

interface Testimonial {
  text: string;
  name: string;
  company: string;
}

interface CallToAction {
  title: string;
  description: string;
  button_text: string;
  button_url: string;
}
```

## Boardroom Data

### Members Data
**File**: `/assets/data/members.json`

```json
[
  {
    "id": "agent-founder",
    "name": "Founder Agent",
    "role": "Founder",
    "avatar": "/assets/images/avatars/founder.png",
    "status": "online",
    "lastSeen": 1704067200,
    "bio": "Guardian of the vision"
  },
  {
    "id": "agent-investor",
    "name": "Investor Agent",
    "role": "Investor",
    "avatar": "/assets/images/avatars/investor.png",
    "status": "away",
    "lastSeen": 1704063600,
    "bio": "Financial oversight"
  }
]
```

**Schema**:
```typescript
interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: number;  // Unix timestamp
  bio?: string;
}
```

### Conversation Data
**File**: `/assets/data/conversation.json`

```json
{
  "conversationId": "default",
  "boardroomId": "business-infinity",
  "participants": ["agent-founder", "agent-investor", "user-123"],
  "messages": [
    {
      "messageId": "msg-001",
      "senderAgentId": "agent-founder",
      "timestamp": 1704067200,
      "payload": {
        "type": "text",
        "content": "Welcome to the boardroom."
      },
      "metadata": {
        "speechAct": "greeting",
        "thread": null
      }
    }
  ]
}
```

**Schema**:
```typescript
interface Conversation {
  conversationId: string;
  boardroomId: string;
  participants: string[];
  messages: Message[];
  createdAt?: number;
  updatedAt?: number;
}

interface Message {
  messageId: string;
  senderAgentId: string;
  timestamp: number;
  payload: MessagePayload;
  metadata?: MessageMetadata;
}

interface MessagePayload {
  type: 'text' | 'proposal' | 'question' | 'resolution';
  content: string;
  attachments?: Attachment[];
}

interface MessageMetadata {
  speechAct?: 'greeting' | 'proposal' | 'question' | 'objection' | 'resolution';
  thread?: string;
  references?: string[];
  tags?: string[];
}

interface Attachment {
  type: string;
  url: string;
  name: string;
  size: number;
}
```

### Last Messages Data
**File**: `/assets/data/last_messages.json`

```json
{
  "agent-founder": {
    "messageId": "msg-100",
    "timestamp": 1704067200,
    "preview": "Let's discuss the roadmap"
  },
  "agent-investor": {
    "messageId": "msg-098",
    "timestamp": 1704063600,
    "preview": "What's the burn rate?"
  }
}
```

**Schema**:
```typescript
interface LastMessages {
  [agentId: string]: {
    messageId: string;
    timestamp: number;
    preview: string;
  };
}
```

### Unread Counts Data
**File**: `/assets/data/unread_counts.json`

```json
{
  "agent-founder": 3,
  "agent-investor": 0,
  "agent-ceo": 5
}
```

**Schema**:
```typescript
interface UnreadCounts {
  [agentId: string]: number;
}
```

## API Data Structures

### OpenAPI Specification
**File**: `/assets/data/openapi.json`

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Business Infinity API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://cloud.businessinfinity.asisaga.com"
    }
  ],
  "paths": {
    "/messages": {
      "get": {
        "operationId": "getConversationMessages",
        "parameters": [...],
        "responses": {...}
      },
      "post": {
        "operationId": "postConversationMessage",
        "requestBody": {...},
        "responses": {...}
      }
    }
  }
}
```

### Dashboard UI Schema
**API Response**: `GET /dashboard`

```json
{
  "uiSchema": {
    "version": "1.0",
    "role": "CMO",
    "scope": "local",
    "panels": [
      {
        "id": "panel-marketing",
        "title": "Marketing Operations",
        "description": "Manage marketing campaigns",
        "actions": [
          {
            "id": "create-campaign",
            "label": "Create Campaign",
            "agentId": "agent-cmo",
            "argsSchema": {
              "name": {
                "type": "string",
                "label": "Campaign Name",
                "required": true,
                "placeholder": "Q1 2024 Campaign"
              },
              "budget": {
                "type": "number",
                "label": "Budget ($)",
                "required": true,
                "min": 0,
                "max": 1000000
              },
              "platform": {
                "type": "string",
                "label": "Platform",
                "enum": ["Google", "Facebook", "LinkedIn"],
                "required": true
              },
              "startDate": {
                "type": "date",
                "label": "Start Date",
                "required": false
              }
            }
          }
        ]
      }
    ]
  }
}
```

**Schema**:
```typescript
interface DashboardUISchema {
  version: string;
  role: string;
  scope: string;
  panels: Panel[];
}

interface Panel {
  id: string;
  title: string;
  description?: string;
  actions: Action[];
}

interface Action {
  id: string;
  label: string;
  agentId: string;
  argsSchema: ArgsSchema;
  description?: string;
}

interface ArgsSchema {
  [fieldName: string]: FieldSchema;
}

interface FieldSchema {
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  label: string;
  required: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  enum?: string[];
  pattern?: string;
  default?: any;
}
```

## Page Front Matter

### Default Page
```yaml
---
layout: default
title: Page Title
description: Page description for SEO
keywords: keyword1, keyword2, keyword3
---
```

### Boardroom Page
```yaml
---
layout: app
title: "Boardroom | Business Infinity"
boardroom:
  api_base: "/api/boardroom"
  show_avatar: true
  show_toolbar: true
  show_typing_indicator: true
  auto_refresh: true
  refresh_interval: 3000
---
```

**Schema**:
```typescript
interface PageFrontMatter {
  layout: string;
  title: string;
  description?: string;
  keywords?: string;
  boardroom?: BoardroomConfig;
}

interface BoardroomConfig {
  api_base: string;
  show_avatar: boolean;
  show_toolbar: boolean;
  show_typing_indicator: boolean;
  show_connection_status: boolean;
  show_toggle_strip: boolean;
  show_members_sidebar: boolean;
  show_agent_profiles: boolean;
  enable_screen_share: boolean;
  enable_video_call: boolean;
  enable_file_attach: boolean;
  enable_formatting: boolean;
  auto_refresh: boolean;
  refresh_interval: number;
}
```

## Component Data Attributes

### Web Component Attributes

#### BoardroomChat
```html
<boardroom-chat
  boardroom-id="business-infinity"
  conversation-id="default"
  api-host="https://cloud.businessinfinity.asisaga.com"
  poll-interval="5000"
></boardroom-chat>
```

```typescript
interface BoardroomChatAttributes {
  'boardroom-id': string;
  'conversation-id': string;
  'api-host': string;
  'poll-interval'?: string;  // milliseconds
}
```

#### McpDashboard
```html
<mcp-dashboard
  role="CMO"
  scope="local"
></mcp-dashboard>
```

```typescript
interface McpDashboardAttributes {
  role: string;
  scope: 'local' | 'global';
}
```

## State Management

### Application State
```typescript
interface ApplicationState {
  user: UserState;
  boardroom: BoardroomState;
  dashboard: DashboardState;
  ui: UIState;
}

interface UserState {
  userId: string | null;
  name: string | null;
  role: string | null;
  avatar: string | null;
  authenticated: boolean;
  token: string | null;
  tokenExpiry: number | null;
}

interface BoardroomState {
  activeConversationId: string | null;
  messages: Message[];
  members: Member[];
  lastMessageKey: string | null;
  unreadCounts: UnreadCounts;
  isPolling: boolean;
}

interface DashboardState {
  role: string | null;
  scope: string | null;
  uiSchema: DashboardUISchema | null;
  loading: boolean;
  error: string | null;
}

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  modals: Modal[];
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
  read: boolean;
}

interface Modal {
  id: string;
  type: string;
  title: string;
  content: any;
  open: boolean;
}
```

## Local Storage Schema

### Storage Keys
```typescript
const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'azure_ad_token',
  TOKEN_EXPIRY: 'token_expiry',
  REFRESH_TOKEN: 'refresh_token',
  
  // User preferences
  THEME: 'user_theme',
  SIDEBAR_STATE: 'sidebar_collapsed',
  
  // Cache
  OPENAPI_SPEC: 'openapi_spec_cache',
  OPENAPI_SPEC_EXPIRY: 'openapi_spec_expiry',
  
  // Session data
  LAST_CONVERSATION: 'last_conversation_id',
  DRAFT_MESSAGE: 'draft_message'
};
```

### Storage Values
```typescript
// Auth token
localStorage.setItem('azure_ad_token', 'eyJ0eXAiOiJKV1QiLCJhbGc...');

// Token expiry (Unix timestamp)
localStorage.setItem('token_expiry', '1704153600');

// User preferences
localStorage.setItem('user_theme', 'dark');
localStorage.setItem('sidebar_collapsed', 'true');

// Cached data
localStorage.setItem('openapi_spec_cache', JSON.stringify(spec));
localStorage.setItem('openapi_spec_expiry', '1704153600');

// Session data
sessionStorage.setItem('last_conversation_id', 'conv-123');
sessionStorage.setItem('draft_message', 'Unfinished message...');
```

## API Request/Response Formats

### Standard API Request
```typescript
interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: {
    'Content-Type': 'application/json';
    'Authorization': 'Bearer <token>';
    [key: string]: string;
  };
  body?: string;  // JSON stringified
}
```

### Standard API Response
```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: number;
    requestId: string;
    version: string;
  };
}
```

### API Error Response
```typescript
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: {
      [key: string]: any;
    };
    timestamp: number;
  };
}
```

## Validation Schemas

### Form Validation
```typescript
interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'pattern' | 'min' | 'max' | 'minLength' | 'maxLength';
  value?: any;
  message: string;
}

interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

// Example
const campaignFormValidation: FieldValidation = {
  name: [
    { type: 'required', message: 'Campaign name is required' },
    { type: 'minLength', value: 3, message: 'Name must be at least 3 characters' },
    { type: 'maxLength', value: 100, message: 'Name must be less than 100 characters' }
  ],
  budget: [
    { type: 'required', message: 'Budget is required' },
    { type: 'min', value: 0, message: 'Budget must be positive' },
    { type: 'max', value: 1000000, message: 'Budget exceeds maximum' }
  ],
  email: [
    { type: 'email', message: 'Invalid email address' }
  ]
};
```

## Constants & Enumerations

### User Roles
```typescript
enum UserRole {
  FOUNDER = 'Founder',
  INVESTOR = 'Investor',
  CEO = 'CEO',
  CTO = 'CTO',
  CMO = 'CMO',
  CFO = 'CFO',
  COO = 'COO'
}
```

### Message Types
```typescript
enum MessageType {
  TEXT = 'text',
  PROPOSAL = 'proposal',
  QUESTION = 'question',
  OBJECTION = 'objection',
  RESOLUTION = 'resolution',
  NOTIFICATION = 'notification'
}
```

### Speech Acts
```typescript
enum SpeechAct {
  GREETING = 'greeting',
  PROPOSAL = 'proposal',
  QUESTION = 'question',
  ANSWER = 'answer',
  OBJECTION = 'objection',
  AFFIRMATION = 'affirmation',
  RESOLUTION = 'resolution',
  CLARIFICATION = 'clarification'
}
```

### Agent Status
```typescript
enum AgentStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline'
}
```

## Data Validation

### Runtime Type Checking
```typescript
function isMessage(obj: any): obj is Message {
  return (
    typeof obj === 'object' &&
    typeof obj.messageId === 'string' &&
    typeof obj.senderAgentId === 'string' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.payload === 'object'
  );
}

function isMember(obj: any): obj is Member {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.role === 'string' &&
    ['online', 'away', 'offline'].includes(obj.status)
  );
}
```

### Schema Validation
```typescript
function validateDashboardAction(action: any): boolean {
  if (!action.id || !action.label || !action.agentId) {
    return false;
  }
  
  if (action.argsSchema) {
    for (const [key, schema] of Object.entries(action.argsSchema)) {
      if (!validateFieldSchema(schema)) {
        return false;
      }
    }
  }
  
  return true;
}

function validateFieldSchema(schema: any): boolean {
  const validTypes = ['string', 'number', 'boolean', 'date', 'select'];
  
  return (
    typeof schema === 'object' &&
    validTypes.includes(schema.type) &&
    typeof schema.label === 'string' &&
    typeof schema.required === 'boolean'
  );
}
```

## Best Practices

### Data Consistency
- Use consistent field naming (camelCase for JSON, snake_case for YAML)
- Maintain type consistency across all data files
- Validate data structure at build time
- Document all data schemas

### Data Security
- Never store sensitive data in JSON files
- Sanitize all user inputs before storage
- Encrypt sensitive data in local storage
- Clear session data on logout

### Performance
- Minimize data file size
- Use pagination for large datasets
- Cache static data appropriately
- Lazy load optional data

### Maintainability
- Keep data files organized by feature
- Use TypeScript interfaces for type safety
- Version data schemas for compatibility
- Document data structure changes
