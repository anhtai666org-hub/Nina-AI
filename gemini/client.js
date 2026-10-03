import { GoogleGenerativeAI } from "@google/generative-ai";

export function createNinaModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const client = new GoogleGenerativeAI(apiKey);

  return client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"
  });
}

export async function generateNinaReply(model, prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
