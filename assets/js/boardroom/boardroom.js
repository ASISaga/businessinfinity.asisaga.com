import './ui-enhancements.js';
import TemplateUtils from './template-utils.js';
import MembersRenderer from './members.js';
import MessagesRenderer from './messages.js';
import SidebarToggle from './sidebar-toggle.js';

class Boardroom {
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

export default Boardroom;
