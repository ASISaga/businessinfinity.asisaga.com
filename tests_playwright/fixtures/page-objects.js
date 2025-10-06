/**
 * Page Object Model for common page elements and actions
 * Provides reusable page interaction methods following best practices
 */

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL and wait for it to load
   */
  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector) {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Get all links on the page
   */
  async getAllLinks() {
    return await this.page.locator('a[href]').all();
  }

  /**
   * Check for broken images
   */
  async findBrokenImages() {
    return await this.page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter(img => !img.complete || img.naturalHeight === 0)
        .map(img => ({
          src: img.src,
          alt: img.alt
        }));
    });
  }
}

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/';
  }

  async navigate() {
    await this.goto(this.url);
  }

  get navbar() {
    return this.page.locator('nav, .navbar, [role="navigation"]').first();
  }

  get mainHeading() {
    return this.page.locator('h1').first();
  }

  get footer() {
    return this.page.locator('footer, [role="contentinfo"]').first();
  }

  async hasNavigation() {
    return await this.navbar.isVisible();
  }

  async hasHeading() {
    return await this.mainHeading.isVisible();
  }
}

export class BoardroomPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/boardroom/';
  }

  async navigate() {
    await this.goto(this.url);
  }

  get chatInterface() {
    return this.page.locator('boardroom-chat, #chat-interface').first();
  }

  get messageInput() {
    return this.page.locator('input[type="text"], textarea').first();
  }

  async hasChatInterface() {
    const count = await this.chatInterface.count();
    return count > 0;
  }

  async sendMessage(message) {
    if (await this.hasChatInterface()) {
      await this.messageInput.fill(message);
      await this.page.keyboard.press('Enter');
    }
  }
}

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/dashboard/';
  }

  async navigate() {
    await this.goto(this.url);
  }

  get mainContent() {
    return this.page.locator('main, [role="main"]').first();
  }

  async isLoaded() {
    return await this.mainContent.isVisible();
  }
}
