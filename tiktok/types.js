/**
 * Canonical message shape used by Nina.
 *
 * {
 *   conversationId: string,
 *   chatType: "private" | "group",
 *   senderId: string | null,
 *   senderName: string,
 *   text: string,
 *   timestamp: number,
 *   replyTo: string | null
 * }
 */

export function isTikTokMessage(value) {
  return Boolean(
    value &&
    value.conversationId &&
    value.text !== undefined &&
    (value.chatType === "private" || value.chatType === "group")
  );
}
