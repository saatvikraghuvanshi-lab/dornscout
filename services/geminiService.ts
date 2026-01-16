import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { MessageType, AgentVibe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Function Declarations for Tools
const checkUserCalendar: FunctionDeclaration = {
  name: 'check_user_calendar',
  parameters: {
    type: Type.OBJECT,
    description: 'Checks if the user is free at a specific time for a meetup.',
    properties: {
      proposedTime: {
        type: Type.STRING,
        description: 'The date and time being proposed, e.g., "Tomorrow at 4 PM" or "2023-11-01 14:00".',
      }
    },
    required: ['proposedTime'],
  },
};

const getMarketBenchmark: FunctionDeclaration = {
  name: 'get_market_price_benchmark',
  parameters: {
    type: Type.OBJECT,
    description: 'Retrieves historical sales data for an item to determine if a price is fair.',
    properties: {
      itemName: {
        type: Type.STRING,
        description: 'The name or model of the item.',
      }
    },
    required: ['itemName'],
  },
};

export const classifyMarketMessage = async (message: string): Promise<MessageType> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Classify the following message into one of three categories: WTS (Want to Sell), WTB (Want to Buy), or NOISE (everything else like memes, questions, event invites). 
    Message: "${message}"
    Return only the category name.`,
  });
  const result = (response.text || '').trim();
  if (result.includes('WTS')) return MessageType.WTS;
  if (result.includes('WTB')) return MessageType.WTB;
  return MessageType.NOISE;
};

export const verifyItemImage = async (base64Image: string, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: `Analyze this item image compared to the description: "${description}". Detect brand, model, and any visible damage or wear. Flag if it looks like a scam or fake image.` }
      ]
    }
  });
  return response.text;
};

export const startNegotiationSession = (vibe: AgentVibe, budget: number) => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are "Arbitrator", an autonomous marketplace agent for DormScout. 
      User Personality: ${vibe}. 
      Strict Budget Limit: ₹${budget}. 
      Task: Negotiate the best deal for the user. 
      1. Initiate with interest.
      2. Ask about quality/wear.
      3. Counter-offer based on your vibe.
      4. Use tools to check user schedule or market prices.
      5. Finalize with AGREED_PRICE: [Number] when both parties agree.`,
      tools: [{ functionDeclarations: [checkUserCalendar, getMarketBenchmark] }]
    }
  });
};