# Nina-AI

**Nina AI — にな** is a modular AI chat bot designed for TikTok private and group chats.

## Current architecture

TikTok connector
→ message normalization
→ 2-second debounce
→ Nina Core
→ last 10 messages of context
→ Gemini
→ response
→ TikTok connector

## Modules

- `server/` — HTTP/Render entry point.
- `tiktok/` — TikTok integration boundary and message normalization.
- `nina/` — Nina persona, conversation orchestration and debounce.
- `memory/` — in-memory conversation history.
- `gemini/` — Gemini model adapter.
- `config/` — environment variable template.

## Message model

Every normalized message contains:
- `conversationId`
- `chatType`: `private` or `group`
- `senderId`
- `senderName`
- `text`
- `timestamp`
- optional `replyTo`

The core keeps the latest 10 messages per conversation. New messages reset a 2-second timer, so Nina responds after the conversation has been quiet for 2 seconds.

## Secrets

Never commit TikTok session data or API keys. Put them in Render environment variables.

## Status

The Nina core and message/debounce pipeline are scaffolded. The actual TikTok connector and production Gemini request flow are the next integration layer.
