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
    if (existing) clearTimeout(existing.timer);

    const timer = setTimeout(async () => {
      this.pending.delete(id);
      await this.onFlush(message);
    }, this.delay);

    this.pending.set(id, { timer, message });
  }

  clear(conversationId) {
    const pending = this.pending.get(conversationId);
    if (!pending) return;
    clearTimeout(pending.timer);
    this.pending.delete(conversationId);
  }
}
