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
  if (!ai) return "石板与虚空断开连接（缺失 API 密钥）。";

  try {
    const prompt = `你是一位古老的石碑守护者。请解读这件名为"${title}"的文物。描述："${desc}"。
    请用中文回答。语气神秘、略带诗意且简洁。限制在100字以内。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "符文难以辨认。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "石板上的裂痕阻碍了铭文的读取。";
  }
};

export const chatWithSlab = async (userMessage: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "沉默... (缺失 API 密钥)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: "你是一块古老、有知觉的石板。你见证了数百年的变迁。你说话缓慢，庄重，经常提到侵蚀、时间、压力和沉默。请用中文回答，保持简洁但深刻。"
      }
    });
    return response.text || "...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "...";
  }
};