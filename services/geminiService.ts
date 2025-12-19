
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { ClothingItem, ClothingCategory, Season, ResaleListing, PackingListResult } from "../types";

const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || '' });

// Helper to strip code blocks if the model adds them
const cleanJSON = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const analyzeImage = async (base64Image: string): Promise<Partial<ClothingItem>> => {
  try {
    // Schema for the expected response
    const analysisSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "A short, descriptive name for the item (e.g., 'Navy Blue Wool Blazer')" },
        category: { type: Type.STRING, description: "The category of the item", enum: Object.values(ClothingCategory) },
        color: { type: Type.STRING, description: "Dominant color" },
        brand: { type: Type.STRING, description: "Estimated brand or 'Unknown'" },
        season: { type: Type.STRING, description: "Best season for this item", enum: Object.values(Season) },
        resaleValue: { type: Type.NUMBER, description: "Estimated resale value in USD based on visual condition and brand" },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 descriptive tags" }
      },
      required: ["name", "category", "color", "season", "resaleValue", "tags"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using the multimodal capable 2.5 flash model
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, can adjust based on input
              data: base64Image
            }
          },
          {
            text: "Analyze this clothing item for a digital closet app. Provide a structured analysis."
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(cleanJSON(text));
    return data;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const generateStylistAdvice = async (
  query: string,
  closetContext: ClothingItem[],
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    // Prepare context about the closet
    const closetDescription = closetContext.map(item => 
      `- ${item.name} (${item.color} ${item.category}, ID: ${item.id})`
    ).join('\n');

    // Format previous conversation history for context
    const conversationContext = history.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Stylist'}: ${msg.text}`
    ).join('\n');

    const prompt = `
    You are a professional personal stylist for the 'ClosetClear' app.
    
    User's Closet Inventory:
    ${closetDescription}

    Conversation History:
    ${conversationContext}

    User's New Query: ${query}
    
    Instructions:
    - Provide a helpful, fashion-forward response.
    - If suggesting an outfit, explicitly mention the item names from the closet inventory provided above.
    - If the user refers to previous messages (e.g. "what shoes go with that?"), use the Conversation History to understand the context.
    - Be concise and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful fashion assistant. Use the provided closet inventory to answer questions.",
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple queries
      }
    });

    return response.text || "I couldn't generate a suggestion right now.";

  } catch (error) {
    console.error("Error generating advice:", error);
    return "Sorry, I'm having trouble connecting to the fashion mainframe right now.";
  }
};

export const generatePackingList = async (
  destination: string,
  duration: string,
  type: string,
  closetContext: ClothingItem[]
): Promise<PackingListResult> => {
  try {
    // Include full details (tags, brand, color) to help AI make better style decisions
    const closetJson = JSON.stringify(closetContext.map(i => ({ 
      id: i.id, 
      name: i.name, 
      category: i.category, 
      season: i.season,
      brand: i.brand,
      color: i.color,
      tags: i.tags
    })));
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Act as a professional travel stylist. Plan a packing list for the following trip:
        - Destination: ${destination}
        - Duration: ${duration}
        - Trip Type: ${type}
        
        Instructions:
        1. Infer the typical weather for this destination (assume current time of year).
        2. Select the most appropriate items from the User's Closet Inventory below.
           - If Trip Type is 'Business': Prioritize blazers, button-downs, trousers, formal shoes. Avoid distressed denim or graphic tees unless appropriate.
           - If Trip Type is 'Leisure': Prioritize comfort, weather appropriateness, and versatility.
           - Ensure the items can form cohesive outfits.
        3. Provide a brief weather summary and specific styling advice for this trip.

        User's Closet Inventory: 
        ${closetJson}
      `,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of ID strings for the selected items" },
            weatherForecast: { type: Type.STRING, description: "Inferred weather conditions e.g. 'Rainy and cool, approx 12°C'" },
            tripAdvice: { type: Type.STRING, description: "Styling or packing advice for this specific trip" }
          },
          required: ["itemIds", "weatherForecast", "tripAdvice"]
        }
      }
    });

    const data = JSON.parse(cleanJSON(response.text || '{}'));
    return data as PackingListResult;
  } catch (error) {
    console.error("Error generating packing list:", error);
    // Return empty fallback
    return { itemIds: [], weatherForecast: "Unavailable", tripAdvice: "Could not generate list." };
  }
};

export const generateListingContent = async (item: ClothingItem): Promise<ResaleListing> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a high-converting resale listing for this item: ${JSON.stringify(item)}.
      Determine the best marketplace (Poshmark, Depop, The RealReal, etc) based on brand and style.
      Write a catchy title, a SEO-optimized description with measurements disclaimer, and 10 relevant hashtags.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            marketplaces: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(cleanJSON(response.text || '{}')) as ResaleListing;
  } catch (error) {
    console.error("Error generating listing:", error);
    throw error;
  }
};
