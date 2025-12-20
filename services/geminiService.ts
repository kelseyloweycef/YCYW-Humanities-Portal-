
import { GoogleGenAI } from "@google/genai";

// Fix: Per guidelines, initialize GoogleGenAI with process.env.API_KEY directly.
// We avoid using a factory function that adds default values like '|| ""'.

export const getLessonIdea = async (topic: string, yearGroup: string) => {
  // Fix: Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a brief lesson structure (objectives, starter, main, plenary) for a Humanities lesson on "${topic}" for ${yearGroup}. Keep it practical for a 50-minute class. Focus on geography, history, or sociology aspects where applicable.`,
    });
    // Fix: Access .text property directly (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't generate an idea at this moment.";
  }
};

export const searchSocialStudiesEvents = async (query: string) => {
  // Fix: Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find recent news or key facts related to "${query}" that would be relevant for a school Humanities curriculum (History, Geography, Economics, Sociology). Provide specific details and grounding if possible.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return {
      // Fix: Access .text property directly
      text: response.text,
      // Fix: Extract grounding chunks as per search grounding guidelines
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { text: "Search currently unavailable.", sources: [] };
  }
};
