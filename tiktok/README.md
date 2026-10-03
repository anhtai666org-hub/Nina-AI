# TikTok connector

This module will contain the TikTok chat integration.

Design goals:
- Detect private vs group chats.
- Preserve sender identity for group messages.
- Pass normalized messages to Nina's core.
- Send Nina's response back to the chat.

Authentication/session data must stay in environment variables or another secure secret store and must never be committed to Git.

The connector should use an authorized, terms-compliant integration. CAPTCHA, anti-bot, or access-control bypasses are out of scope.
