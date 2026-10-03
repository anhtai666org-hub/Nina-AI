import { ConversationMemory } from "../memory/context.js";

const SYSTEM_PROMPT = `Bạn là Nina AI — にな.
Bạn là một trợ lý trò chuyện tự nhiên trong TikTok Chat.
- Trả lời như một người đang trò chuyện, không tự nhận là Gemini.
- Với group chat, chú ý tên người gửi và ngữ cảnh.
- Không tự bịa thông tin về người dùng.
- Trả lời ngắn gọn, tự nhiên, phù hợp với ngữ cảnh.`;

export class NinaCore {
  constructor({ model, memory = new ConversationMemory() }) {
    this.model = model;
    this.memory = memory;
  }

  addMessage(message) {
    const conversationId = message.conversationId;
    if (!conversationId) throw new Error("conversationId is required.");

    const normalized = {
      role: message.role || "user",
      senderId: message.senderId || null,
      senderName: message.senderName || "Unknown",
      text: String(message.text || ""),
      timestamp: message.timestamp || Date.now()
    };

    return this.memory.add(conversationId, normalized);
  }

  buildPrompt(conversationId, latestMessage) {
    const context = this.memory.get(conversationId);
    const type = latestMessage.chatType === "group" ? "group" : "private";

    const lines = context.map(m =>
      `[${m.role}] ${m.senderName}: ${m.text}`
    );

    return [
      SYSTEM_PROMPT,
      `Chat type: ${type}`,
      latestMessage.replyTo
        ? `Replying to: ${latestMessage.replyTo}`
        : "",
      "Recent conversation:",
      ...lines
    ].filter(Boolean).join("\n");
  }

  async generateReply(latestMessage) {
    const context = this.addMessage(latestMessage);
    const prompt = this.buildPrompt(latestMessage.conversationId, latestMessage);

    const result = await this.model.generateContent(prompt);
    const text = result.response.text().trim();

    this.memory.add(latestMessage.conversationId, {
      role: "assistant",
      senderId: "nina",
      senderName: "Nina",
      text,
      timestamp: Date.now()
    });

    return { text, context };
  }
}
