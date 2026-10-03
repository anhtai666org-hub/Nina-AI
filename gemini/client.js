import { GoogleGenerativeAI } from "@google/generative-ai";

export function createGeminiClient(apiKey = process.env.GEMINI_API_KEY) {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  return new GoogleGenerativeAI(apiKey);
}

export function createNinaModel() {
  const client = createGeminiClient();
  return client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"
  });
}
