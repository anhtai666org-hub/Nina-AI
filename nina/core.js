import { ConversationMemory } from "../memory/context.js";
import { generateNinaReply } from "../gemini/client.js";

const SYSTEM_PROMPT = `Bạn là Nina AI — にな.

Bạn là một trợ lý trò chuyện tự nhiên trong TikTok Chat.

Quy tắc:
- Không tự nhận mình là Gemini.
- Tên của bạn là Nina.
- Trả lời tự nhiên như đang nhắn tin.
- Với group chat, chú ý tên người gửi.
- Có thể gọi người dùng bằng tên khi phù hợp.
- Dùng lịch sử trò chuyện để hiểu ngữ cảnh.
- Không tự bịa thông tin về người dùng.
- Không cần nhắc lại toàn bộ lịch sử.
- Ưu tiên câu trả lời ngắn gọn, tự nhiên.`;

export class NinaCore {
  constructor({ model, memory = new ConversationMemory() }) {
    this.model = model;
    this.memory = memory;
  }

  addMessage(message) {
    if (!message.conversationId) {
      throw new Error("conversationId is required.");
    }

    const normalized = {
      role: message.role || "user",
      senderId: message.senderId || null,
      senderName: message.senderName || "Unknown",
      text: String(message.text || ""),
      timestamp: message.timestamp || Date.now()
    };

    return this.memory.add(message.conversationId, normalized);
  }

  buildPrompt(conversationId, latestMessage) {
    const context = this.memory.get(conversationId);
    const chatType = latestMessage.chatType === "group" ? "group" : "private";

    const lines = context.map(
      (m) => `[${m.role}] ${m.senderName}: ${m.text}`
    );

    return [
      SYSTEM_PROMPT,
      "",
      `Chat type: ${chatType}`,
      `Current sender: ${latestMessage.senderName}`,
      "",
      "Recent conversation:",
      ...lines,
      "",
      "Respond as Nina."
    ].join("\n");
  }

  async generateReply(message, { alreadyAdded = false } = {}) {
    if (!alreadyAdded) {
      this.addMessage(message);
    }

    const prompt = this.buildPrompt(
      message.conversationId,
      message
    );

    const text = await generateNinaReply(this.model, prompt);

    this.memory.add(message.conversationId, {
      role: "assistant",
      senderId: "nina",
      senderName: "Nina",
      text,
      timestamp: Date.now()
    });

    return text;
  }
}