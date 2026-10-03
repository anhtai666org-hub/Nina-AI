const MAX_MESSAGES = 10;

export class ConversationMemory {
  constructor(limit = MAX_MESSAGES) {
    this.limit = limit;
    this.conversations = new Map();
  }

  add(conversationId, message) {
    const list = this.conversations.get(conversationId) || [];
    list.push(message);
    while (list.length > this.limit) list.shift();
    this.conversations.set(conversationId, list);
    return [...list];
  }

  get(conversationId) {
    return [...(this.conversations.get(conversationId) || [])];
  }

  clear(conversationId) {
    this.conversations.delete(conversationId);
  }
}
