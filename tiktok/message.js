export function normalizeTikTokMessage(input) {
  if (!input?.conversationId) {
    throw new Error("TikTok message requires conversationId.");
  }

  return {
    conversationId: String(input.conversationId),
    chatType: input.chatType === "group" ? "group" : "private",
    senderId: input.senderId ? String(input.senderId) : null,
    senderName: input.senderName || "Unknown",
    text: String(input.text || ""),
    timestamp: input.timestamp || Date.now(),
    replyTo: input.replyTo || null
  };
}
