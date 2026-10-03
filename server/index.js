import "dotenv/config";
import express from "express";

import { createNinaModel } from "../gemini/client.js";
import { NinaCore } from "../nina/core.js";
import { normalizeTikTokMessage } from "../tiktok/message.js";
import { MessageDebouncer } from "../nina/debounce.js";

const app = express();
app.use(express.json());

let nina = null;
let startupError = null;

function ensureNina() {
  if (nina) return nina;

  try {
    const model = createNinaModel();
    nina = new NinaCore({ model });
    startupError = null;
    console.log("[NINA] Gemini model initialized.");
    return nina;
  } catch (error) {
    startupError = error.message;
    throw error;
  }
}

const debouncer = new MessageDebouncer(2000, async (messages) => {
  const latest = messages[messages.length - 1];

  try {
    const bot = ensureNina();

    // Keep every message from the 2-second burst in memory,
    // while using the latest message as the one Nina answers.
    for (const message of messages) {
      bot.addMessage(message);
    }

    const reply = await bot.generateReply(latest, { alreadyAdded: true });

    console.log(`[NINA] -> ${latest.senderName}: ${reply}`);
  } catch (error) {
    console.error("[NINA ERROR]", error);
  }
});

app.get("/", (_req, res) => {
  res.json({
    name: "Nina AI — にな",
    status: "online",
    version: "0.2.1"
  });
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    nina: Boolean(nina),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    error: startupError
  });
});

app.post("/message", (req, res) => {
  try {
    const message = normalizeTikTokMessage(req.body);
    debouncer.push(message);

    res.json({
      ok: true,
      queued: true,
      debounceMs: 2000
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message
    });
  }
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Nina AI listening on port ${port}`);
});
