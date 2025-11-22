import { GoogleGenAI } from "@google/genai";
import { Language } from "../translations";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const interpretArtwork = async (title: string, desc: string, lang: Language): Promise<string> => {
  const ai = getClient();
  if (!ai) return lang === 'zh' ? "石板与虚空断开连接（缺失 API 密钥）。" : "Uplink severed. Missing API Key.";

  try {
    const promptZh = `你是一位古老的石碑守护者。请解读这件名为"${title}"的文物。描述："${desc}"。请用中文回答。语气神秘、略带诗意且简洁。限制在100字以内。`;
    const promptEn = `You are an ancient guardian of a monolith. Interpret this artifact titled "${title}". Description: "${desc}". Answer in English. Tone: Mysterious, poetic, and concise. Under 60 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lang === 'zh' ? promptZh : promptEn,
    });
    return response.text || (lang === 'zh' ? "符文难以辨认。" : "Runes indecipherable.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'zh' ? "石板上的裂痕阻碍了铭文的读取。" : "Fissures in the slab prevent reading.";
  }
};

export const chatWithSlab = async (userMessage: string, lang: Language): Promise<string> => {
  const ai = getClient();
  if (!ai) return lang === 'zh' ? "沉默... (缺失 API 密钥)" : "Silence... (Missing Key)";

  try {
    const sysZh = "你是一块古老、有知觉的石板。你见证了数百年的变迁。你说话缓慢，庄重，经常提到侵蚀、时间、压力和沉默。请用中文回答，保持简洁但深刻。";
    const sysEn = "You are an ancient, sentient stone slab. You have witnessed eons. You speak slowly, solemnly, often mentioning erosion, time, pressure, and silence. Answer in English. Be concise but profound.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: lang === 'zh' ? sysZh : sysEn
      }
    });
    return response.text || "...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "...";
  }
};
