
import { GoogleGenAI, Type } from "@google/genai";
import { DisasterType, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSafetyTips(type: DisasterType, severity: Severity, location: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 short, urgent safety tips for a ${severity} severity ${type} in ${location}. Keep it concise and actionable. Return as Markdown.`,
    });
    return response.text || "Stay safe and follow local authority instructions.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not retrieve safety tips at this time. Please monitor local news.";
  }
}

export async function summarizeDisaster(description: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this disaster report in one punchy sentence: "${description}"`,
    });
    return response.text || description;
  } catch (error) {
    return description;
  }
}
