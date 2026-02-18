
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const processExamPaper = async (base64Image: string, mimeType: string): Promise<ExtractedData> => {
  const ai = getAI();
  
  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: mimeType,
    },
  };

  const prompt = `
    You are an expert academic assistant. Analyze this image of an exam guess paper (it may be in English, Hindi, or both).
    
    1. Extract all text accurately, preserving the structure (Question numbers, sections).
    2. Identify the primary language(s).
    3. Provide a brief summary of the paper's focus.
    4. List 3-5 key topics covered.
    5. Pick the most important 2-3 questions and provide concise, expert-level answers/explanations.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The full extracted text" },
          language: { type: Type.STRING, description: "Detected language(s)" },
          summary: { type: Type.STRING, description: "Brief summary of the paper" },
          keyTopics: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of main topics"
          },
          suggestedSolutions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          }
        },
        required: ["text", "language", "summary", "keyTopics", "suggestedSolutions"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as ExtractedData;
  } catch (e) {
    throw new Error("Failed to parse AI response. The image might be unclear.");
  }
};
