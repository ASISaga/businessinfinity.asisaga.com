import TemplateUtils from './template-utils.js';

class MembersRenderer {
  constructor(membersListId) {
    this.membersList = document.getElementById(membersListId);
  }

  async render(members, lastMessages, unreadCounts, messages) {
    if (!this.membersList) return;
    this.membersList.innerHTML = '';
    const template = await TemplateUtils.loadTemplate('/assets/templates/boardroom-member-item.html');
    for (const member of members) {
      const lastMsgObj = lastMessages.find(lm => lm.memberId === member.id) || {};
      const unreadObj = unreadCounts.find(u => u.memberId === member.id) || {};
      let lastMessageText = '';
      if (lastMsgObj.lastMessageId) {
        const msg = messages.find(m => m.id === lastMsgObj.lastMessageId);
        lastMessageText = msg ? msg.text : '';
      }
      const badgeClass = member.status === 'online' ? 'boardroom-member-badge-success' :
        member.status === 'away' ? 'boardroom-member-badge-warning' : 'boardroom-member-badge-danger';
      const badgeLabel = member.status === 'online' ? 'Online' : member.status === 'away' ? 'Away' : 'Offline';
      const unreadHtml = unreadObj.unread > 0 ? `<span class="boardroom-member-unread">${unreadObj.unread}</span>` : '';
      const html = TemplateUtils.renderTemplate(template, {
        avatar: member.avatar,
        name: member.name,
        role: member.role || '',
        lastMessageText,
        badgeClass,
        badgeLabel,
        lastSeen: lastMsgObj.lastSeen || '',
        unreadHtml
      });
      this.membersList.innerHTML += html;
    }
  }
}

export default MembersRenderer;
