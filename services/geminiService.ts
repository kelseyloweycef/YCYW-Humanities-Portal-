
import { GoogleGenAI } from "@google/genai";

export const getLessonIdea = async (topic: string, yearGroup: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 50-minute Humanities lesson plan for "${topic}" at ${yearGroup} level.`,
    });
    return response.text;
  } catch (error) {
    console.error(error);
    return "AI Assistant currently unavailable.";
  }
};

export const searchSocialStudiesEvents = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find recent events related to "${query}" suitable for a Social Studies curriculum.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error(error);
    return { text: "Search failed.", sources: [] };
  }
};
