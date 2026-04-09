import { GoogleGenAI } from "@google/genai";

export const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "") {
    throw new Error("GEMINI_API_KEY is missing. Please set it in the Settings menu.");
  }
  return new GoogleGenAI({ apiKey });
};

export const cleanJson = (text: string) => {
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Original text:", text);
    throw new Error("Failed to parse AI response. Please try again.");
  }
};
