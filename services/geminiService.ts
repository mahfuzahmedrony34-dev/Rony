import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION_BASE, PERSONALITY_PROMPTS, CREATOR_IDENTITY } from '../constants';
import { Personality, Language } from '../types';

let genAI: GoogleGenAI | null = null;

// Initialize the API client
if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateLegalResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[],
  personality: Personality,
  language: Language
): Promise<string> => {
  
  // STRICT IDENTITY CHECK
  if (prompt.trim() === "Who created you?") {
    return CREATOR_IDENTITY;
  }

  if (!genAI) {
    return "API Key not configured. Please check environment variables.";
  }

  const model = "gemini-2.5-flash"; // Using flash for speed/cost balance in a high-usage app

  // Construct System Instruction
  const personalityInstruction = PERSONALITY_PROMPTS[personality];
  const langInstruction = language === Language.BANGLA 
    ? "Output primarily in Bangla unless requested otherwise." 
    : "Output primarily in English unless requested otherwise.";
  
  const fullSystemInstruction = `${SYSTEM_INSTRUCTION_BASE}\n\nMODE: ${personalityInstruction}\nLANGUAGE: ${langInstruction}`;

  try {
    const chatSession = genAI.chats.create({
      model: model,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.3, // Low temperature for legal accuracy
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: prompt
    });

    return result.text || "I apologize, I could not generate a legal response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to JurisPro legal core. Please try again.";
  }
};