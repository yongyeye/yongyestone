import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const interpretArtwork = async (title: string, desc: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "The slab is disconnected from the ethereal plane (Missing API Key).";

  try {
    const prompt = `You are an ancient stone keeper. Interpret the artifact titled "${title}". Description: "${desc}". 
    Speak in a mysterious, slightly poetic, yet concise tone. Use Markdown. Limit to 100 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "The runes are illegible.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A crack in the stone prevents reading the inscription.";
  }
};

export const chatWithSlab = async (userMessage: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Silence... (Missing API Key)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: "You are an ancient, sentient stone slab. You have seen centuries pass. You speak slowly, with gravitas, often referencing erosion, time, pressure, and silence. Keep responses concise but profound."
      }
    });
    return response.text || "...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "...";
  }
};