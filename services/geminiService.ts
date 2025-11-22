import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API Client
// Note: process.env.API_KEY is guaranteed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const interpretArtwork = async (title: string, desc: string): Promise<string> => {
  if (!process.env.API_KEY) {
      // Simulated delay for aesthetic purposes if no key is actually present in dev (though env guarantees it)
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "API Key 缺失，无法连接到虚空。";
  }

  try {
    const prompt = `请以古老的石碑守护者的口吻解读"${title}"。描述："${desc}"。用中文，简洁，神秘。不要使用markdown格式。`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "沉默...";
  } catch (error) {
    console.error("Gemini interpretation error:", error);
    return "石板上的文字模糊不清...";
  }
};

export const chatWithStone = async (userInput: string): Promise<string> => {
  if (!process.env.API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "虚空没有回应 (API Key Missing)。";
  }

  try {
    const prompt = `用户对一块古老的石板说："${userInput}"。请以石板的口吻回答，沧桑、缓慢、简洁。不要使用markdown格式。`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "沉默...";
  } catch (error) {
    console.error("Gemini chat error:", error);
    return "回声消散了...";
  }
};