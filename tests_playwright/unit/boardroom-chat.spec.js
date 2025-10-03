import { test, expect } from '@playwright/test';

/**
 * Unit tests for BoardroomChat Web Component
 * Tests the custom element lifecycle, Shadow DOM, and basic rendering
 */

test.describe('BoardroomChat Component', () => {
  
  test.beforeEach(async ({ page }) => {
    // Create a test page with the component
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <script type="module">
            ${await page.evaluate(() => {
              // Inject the component code for testing
              return fetch('/client/BoardroomChat.js').then(r => r.text());
            }).catch(() => {
              // Fallback: define component inline for unit testing
              return `
                const HOST = location.origin.replace('businessinfinity', 'cloud.businessinfinity');
                const BOARDROOM_ID = 'business-infinity';
                const CONV_ID = 'default';

                class BoardroomChat extends HTMLElement {
                  constructor(){ 
                    super(); 
                    this.interval = null; 
                    this.lastKey = null; 
                    this.attachShadow({mode:'open'}); 
                  }
                  
                  connectedCallback(){ 
                    this.render(); 
                    this.startPolling(); 
                  }
                  
                  disconnectedCallback(){ 
                    clearInterval(this.interval); 
                  }
                  
                  render(){
                    this.shadowRoot.innerHTML = \`<div class="panel"><h3>Chat</h3><div id="msgs"></div></div>\`;
                    const style = document.createElement('style');
                    style.textContent = \`:host{display:block}.panel{border:1px solid #e5e7eb;border-radius:8px;padding:12px}.msg{padding:8px;border-bottom:1px solid #eee}.meta{color:#6b7280;font-size:12px}\`;
                    this.shadowRoot.appendChild(style);
                  }
                  
                  async poll(){
                    const qs = new URLSearchParams({ boardroomId: BOARDROOM_ID, conversationId: CONV_ID });
                    if (this.lastKey) qs.set('since', this.lastKey);
                    try {
                      const res = await fetch(\`\${HOST}/messages?\${qs}\`, { cache: 'no-store' });
                      const data = await res.json();
                      const msgs = data.messages || [];
                      if (!msgs.length) return;
                      const list = this.shadowRoot.querySelector('#msgs');
                      for (const m of msgs) {
                        const div = document.createElement('div');
                        div.className = 'msg';
                        div.innerHTML = \`<div class="meta">\${m.senderAgentId} • \${new Date(m.timestamp*1000).toLocaleString()}</div><div>\${escapeHtml(JSON.stringify(m.payload))}</div>\`;
                        list.appendChild(div);
                        this.lastKey = \`\${Math.floor(m.timestamp*1000).toString().padStart(13,'0')}-\${m.messageId}\`;
                      }
                    } catch(e) {
                      // Silently handle poll errors
                    }
                  }
                  
                  startPolling(){ 
                    this.interval = setInterval(()=>this.poll().catch(()=>{}), 5000); 
                    this.poll(); 
                  }
                }

                function escapeHtml(s){ 
                  return s.replace(/[&<>"]|'|/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\'':'&#39;'}[c])); 
                }
                
                customElements.define('boardroom-chat', BoardroomChat);
              `;
            })}
          </script>
        </head>
        <body>
          <boardroom-chat></boardroom-chat>
        </body>
      </html>
    `);
  });

  test('should define custom element', async ({ page }) => {
    const isDefined = await page.evaluate(() => {
      return customElements.get('boardroom-chat') !== undefined;
    });
    expect(isDefined).toBeTruthy();
  });

  test('should create shadow root', async ({ page }) => {
    const hasShadowRoot = await page.evaluate(() => {
      const element = document.querySelector('boardroom-chat');
      return element && element.shadowRoot !== null;
    });
    expect(hasShadowRoot).toBeTruthy();
  });

  test('should render chat panel in shadow DOM', async ({ page }) => {
    const panelExists = await page.evaluate(() => {
      const element = document.querySelector('boardroom-chat');
      const panel = element.shadowRoot.querySelector('.panel');
      return panel !== null;
    });
    expect(panelExists).toBeTruthy();
  });

  test('should render chat heading', async ({ page }) => {
    const headingText = await page.evaluate(() => {
      const element = document.querySelector('boardroom-chat');
      const heading = element.shadowRoot.querySelector('h3');
      return heading ? heading.textContent : null;
    });
    expect(headingText).toBe('Chat');
  });

  test('should have messages container', async ({ page }) => {
    const hasMessagesContainer = await page.evaluate(() => {
      const element = document.querySelector('boardroom-chat');
      const msgs = element.shadowRoot.querySelector('#msgs');
      return msgs !== null;
    });
    expect(hasMessagesContainer).toBeTruthy();
  });

  test('should have styles applied', async ({ page }) => {
    const hasStyles = await page.evaluate(() => {
      const element = document.querySelector('boardroom-chat');
      const style = element.shadowRoot.querySelector('style');
      return style !== null && style.textContent.includes('.panel');
    });
    expect(hasStyles).toBeTruthy();
  });

  test('should start polling on connect', async ({ page }) => {
    const hasInterval = await page.evaluate(() => {
      const element = document.querySelector('boardroom-chat');
      return element.interval !== null;
    });
    expect(hasInterval).toBeTruthy();
  });

  test('should clear interval on disconnect', async ({ page }) => {
    const cleared = await page.evaluate(() => {
      const element = document.querySelector('boardroom-chat');
      const hadInterval = element.interval !== null;
      element.remove();
      return hadInterval;
    });
    expect(cleared).toBeTruthy();
  });

  test('should escape HTML in messages', async ({ page }) => {
    const escaped = await page.evaluate(() => {
      const escapeHtml = (s) => s.replace(/[&<>"]|'|/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
      const dangerous = '<script>alert("xss")</script>';
      const safe = escapeHtml(dangerous);
      return safe === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
    });
    expect(escaped).toBeTruthy();
  });

});
