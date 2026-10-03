export class MessageDebouncer {
  constructor(delay = 2000, onFlush) {
    this.delay = delay;
    this.onFlush = onFlush;
    this.pending = new Map();
  }

  push(message) {
    const id = message.conversationId;
    if (!id) throw new Error("conversationId is required.");

    const existing = this.pending.get(id);
    if (existing) {
      clearTimeout(existing.timer);
      existing.messages.push(message);
    } else {
      this.pending.set(id, { messages: [message], timer: null });
    }

    const pending = this.pending.get(id);

    pending.timer = setTimeout(async () => {
      this.pending.delete(id);

      try {
        await this.onFlush([...pending.messages]);
      } catch (error) {
        console.error("[DEBOUNCE ERROR]", error);
      }
    }, this.delay);
  }

  clear(conversationId) {
    const pending = this.pending.get(conversationId);
    if (!pending) return;

    clearTimeout(pending.timer);
    this.pending.delete(conversationId);
  }
}
