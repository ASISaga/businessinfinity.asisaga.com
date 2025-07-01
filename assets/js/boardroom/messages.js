import TemplateUtils from './template-utils.js';

class MessagesRenderer {
  constructor(chatMessagesId) {
    this.chatMessages = document.getElementById(chatMessagesId);
  }

  async render(messages, members) {
    if (!this.chatMessages) return;
    this.chatMessages.innerHTML = '';
    const template = await TemplateUtils.loadTemplate('/templates/boardroom/message-item.html');
    for (const msg of messages) {
      const isReceived = msg.direction === 'received';
      const sender = members.find(m => m.id === msg.senderId) || {};
      const senderName = sender.name || 'Unknown';
      const senderAvatar = sender.avatar || '';
      const senderRole = sender.role || '';
      // Set rowClass for alignment: flex-row-reverse for sent, blank for received
      const rowClass = isReceived ? '' : 'flex-row-reverse';
      const textClass = isReceived ? 'bg-white text-dark' : 'bg-primary text-white';
      const metaClass = isReceived ? 'boardroom-message-meta-received' : 'boardroom-message-meta-sent';
      const html = TemplateUtils.renderLogicBlocks(template, {
        isReceived,
        avatar: senderAvatar,
        name: senderName,
        role: senderRole,
        rowClass,
        textClass,
        metaClass,
        text: msg.text,
        timestamp: msg.timestamp
      });
      this.chatMessages.innerHTML += TemplateUtils.renderTemplate(html, {
        avatar: senderAvatar,
        name: senderName,
        role: senderRole,
        text: msg.text,
        timestamp: msg.timestamp,
        rowClass,
        textClass,
        metaClass
      });
    }
  }
}

export default MessagesRenderer;
