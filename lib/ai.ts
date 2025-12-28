import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export const generateDynamicMessage = async (prompt: string, intent: string): Promise<string> => {
    if (!apiKey) return `${prompt} ${intent}`;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const finalPrompt = `
      Act as a helpful WhatsApp sales support agent.
      Context/Offer: "${prompt}"
      User Intent Payload: "${intent}"
      
      Task: Generate a single friendly, short opening message (under 20 words) that I (the user) would send to the business. 
      Do NOT include "Here is a message" or quotes. Just the raw message text ready to send.
    `;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        // Fallback
        return `${prompt} ${intent}`;
    }
};
