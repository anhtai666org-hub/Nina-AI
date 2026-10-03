# TikTok connector

This module is the only layer that should know how TikTok messages are received and sent.

## Responsibilities

1. Connect using an authorized integration.
2. Detect private vs group conversations.
3. Extract conversation ID.
4. Extract sender ID/name.
5. Extract message text and timestamp.
6. Pass normalized messages to Nina.
7. Send Nina's response back to the correct conversation.

## Canonical message

```
{
  conversationId,
  chatType: "private" | "group",
  senderId,
  senderName,
  text,
  timestamp,
  replyTo
}
```

## Security

TikTok session cookies/tokens are secrets. Store them only in Render environment variables or another secret store.

Do not commit credentials to GitHub.

The connector must use an authorized, terms-compliant integration. CAPTCHA, anti-bot, rate-limit, or access-control bypasses are not part of this project.
