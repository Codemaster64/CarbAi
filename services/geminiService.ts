
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      foodName: {
        type: Type.STRING,
        description: 'Name of the food item.',
      },
      size: {
        type: Type.STRING,
        description: 'Estimated size or portion of the food item (e.g., "1 medium apple", "1 cup of rice").',
      },
      carbohydrates: {
        type: Type.NUMBER,
        description: 'Estimated carbohydrates in grams.',
      },
      protein: {
        type: Type.NUMBER,
        description: 'Estimated protein in grams.',
      },
      fat: {
        type: Type.NUMBER,
        description: 'Estimated fat in grams.',
      },
      calories: {
        type: Type.NUMBER,
        description: 'Estimated total calories.',
      },
    },
    required: ["foodName", "size", "carbohydrates", "protein", "fat", "calories"],
  },
};

export const analyzeFoodImage = async (base64Image: string): Promise<AnalysisResult[]> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = {
      text: `Analyze the food in this image. Identify each distinct food item, estimate its portion size, and calculate the estimated grams of carbohydrates, protein, fat, and total calories for each item. Respond in a JSON array format. Each object in the array should represent a food item and have six keys: "foodName", "size", "carbohydrates", "protein", "fat", and "calories". If no food is identifiable, return an empty array.`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      }
    });
    
    const jsonText = response.text.trim();
    if (!jsonText) {
        return [];
    }
    const parsedResult = JSON.parse(jsonText);
    return parsedResult as AnalysisResult[];

  } catch (error) {
    console.error("Error analyzing food image:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during image analysis.');
  }
};
