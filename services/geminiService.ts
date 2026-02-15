import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const solveMathProblem = async (problem: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Using gemini-3-flash-preview for fast and logical responses
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert math tutor.
      Please solve the following math problem or explain the concept. 
      If the input is an equation, solve it step-by-step but provide the final result clearly at the end.
      If the user asks in Arabic, reply in Arabic. If in English, reply in English.
      Keep the formatting clean using Markdown.
      
      Problem: ${problem}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Minimize latency for simple math
        temperature: 0.1, // Low temperature for precise math
      }
    });

    return response.text || "Could not generate a solution.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to AI service. Please check your connection.";
  }
};
