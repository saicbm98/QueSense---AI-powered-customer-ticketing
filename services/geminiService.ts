import { GoogleGenAI, Type } from "@google/genai";
import { Ticket, AIAnalysisResult, AppConfig } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Model Constants
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Analyzes a ticket to provide summary, sentiment, priority, and tags.
 */
export const analyzeTicket = async (ticket: Ticket): Promise<AIAnalysisResult | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini.");
    return null;
  }

  const prompt = `
    Analyze the following customer support ticket.
    
    Subject: ${ticket.subject}
    Body: ${ticket.body}
    Customer Plan: ${ticket.customer.plan}
    Current Priority: ${ticket.priority}

    Provide a JSON response with:
    - summary: A 1-2 sentence summary of the issue.
    - suggestedPriority: Suggested priority level (Low, Medium, High, Critical).
    - sentiment: Customer sentiment (Positive, Neutral, Negative, Urgent).
    - tags: A list of 1-3 relevant short tags (e.g., "billing", "bug", "feature-request").
    - confidenceScore: A number between 0 and 1 indicating confidence in this analysis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestedPriority: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.NUMBER },
          },
          required: ["summary", "suggestedPriority", "sentiment", "tags", "confidenceScore"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    
    return JSON.parse(jsonText) as AIAnalysisResult;
  } catch (error) {
    console.error("Error analyzing ticket:", error);
    return null;
  }
};

/**
 * Generates a reply draft based on the ticket and configuration.
 */
export const generateReplyDraft = async (
  ticket: Ticket,
  config: AppConfig,
  instructionOverride?: string
): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini.");
    return "API Key missing. Cannot generate reply.";
  }

  const systemInstruction = `
    You are an expert customer support agent for a B2B SaaS company called QueueSense.
    Your goal is to draft a helpful, accurate, and professional reply to the customer.
    
    Brand Tone: ${config.brandTone}
    Tone Description: ${config.toneDescription}
    
    Knowledge Base Context:
    ${config.knowledgeContext}
    
    Important Rules:
    - Do not invent facts. If the Knowledge Base Context doesn't have the answer, state that you will investigate further.
    - Be concise but polite.
    - Address the customer by name if known (${ticket.customer.name}).
  `;

  let prompt = `
    Ticket Details:
    Customer: ${ticket.customer.name} (${ticket.customer.company})
    Subject: ${ticket.subject}
    Message: "${ticket.body}"
    
    Draft a reply.
  `;

  if (instructionOverride) {
    prompt += `\nAdditional Instruction: ${instructionOverride}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Could not generate reply.";
  } catch (error) {
    console.error("Error generating reply:", error);
    return "Error generating reply. Please try again.";
  }
};
