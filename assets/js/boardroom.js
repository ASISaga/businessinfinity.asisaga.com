// Refactored: Boardroom chatroom logic using classes and modules
import TemplateUtils from './chatroom/template-utils.js';
import MembersRenderer from './chatroom/members.js';
import MessagesRenderer from './chatroom/messages.js';
import SidebarToggle from './chatroom/sidebar-toggle.js';

class BoardroomApp {
  constructor() {
    this.membersRenderer = new MembersRenderer('membersListContainer');
    this.messagesRenderer = new MessagesRenderer('chatMessages');
    this.sidebarToggle = new SidebarToggle('toggleMembersBtn', 'sidebarContainer', 'sidebarToggleIcon');
  }

  async init() {
    const [members, lastMessages, unreadCounts, messages] = await Promise.all([
      fetch('/assets/data/members.json').then(res => res.json()),
      fetch('/assets/data/last_messages.json').then(res => res.json()),
      fetch('/assets/data/unread_counts.json').then(res => res.json()),
      fetch('/assets/data/conversation.json').then(res => res.json())
    ]);
    await this.membersRenderer.render(members, lastMessages, unreadCounts, messages);
    await this.messagesRenderer.render(messages, members);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const app = new BoardroomApp();
  app.init();
});
