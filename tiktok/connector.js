import { normalizeTikTokMessage } from "./message.js";

export class TikTokConnector {
  constructor({ onMessage } = {}) {
    this.onMessage = onMessage;
    this.connected = false;
  }

  async connect() {
    throw new Error(
      "TikTokConnector.connect() is not configured yet. " +
      "Attach an authorized TikTok chat integration here."
    );
  }

  async disconnect() {
    this.connected = false;
  }

  async sendMessage({ conversationId, text }) {
    if (!conversationId) throw new Error("conversationId is required.");
    if (!text) throw new Error("text is required.");

    throw new Error(
      "TikTokConnector.sendMessage() is not configured yet."
    );
  }

  async handleIncoming(rawMessage) {
    const message = normalizeTikTokMessage(rawMessage);

    if (typeof this.onMessage === "function") {
      await this.onMessage(message);
    }

    return message;
  }
}
