import { Ticket, AIAnalysisResult, AppConfig, ChatMessage } from '../types';

// n8n Webhook URLs - Replace with your own webhook URLs
const ANALYZE_TICKET_URL = 'https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/analyse-ticket';
const GENERATE_DRAFT_URL = 'https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/generate-draft';
const GENERATE_CHAT_REPLY_URL = 'https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/generate-chat-reply';

// Helper to unwrap n8n array responses
const unwrap = (data: any) => Array.isArray(data) ? data[0] : data;

/**
 * Analyzes a ticket to provide summary, sentiment, priority, and tags.
 */
export const analyzeTicket = async (ticket: Ticket): Promise<AIAnalysisResult | null> => {
  try {
    const response = await fetch(ANALYZE_TICKET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: ticket.subject,
        body: ticket.body,
        customerName: ticket.customer.name,
        customerCompany: ticket.customer.company,
        customerPlan: ticket.customer.plan,
        isHighValue: ticket.customer.isHighValue
      })
    });

    if (!response.ok) {
      console.error('Webhook error:', response.status);
      return null;
    }

    const data = await response.json();
    return unwrap(data) as AIAnalysisResult;
  } catch (error) {
    console.error('Error analyzing ticket:', error);
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
  try {
    const response = await fetch(GENERATE_DRAFT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: ticket.subject,
        body: ticket.body,
        customerName: ticket.customer.name,
        customerCompany: ticket.customer.company,
        brandTone: config.brandTone,
        toneDescription: config.toneDescription,
        knowledgeContext: config.knowledgeContext,
        instructionOverride: instructionOverride || null
      })
    });

    if (!response.ok) {
      console.error('Webhook error:', response.status);
      return 'Error generating reply. Please try again.';
    }

    const data = await response.json();
    return unwrap(data)?.draft || 'Could not generate reply.';
  } catch (error) {
    console.error('Error generating reply:', error);
    return 'Error generating reply. Please try again.';
  }
};

/**
 * Generates a chat reply for internal team messages.
 */
export const generateChatReply = async (
  messages: ChatMessage[],
  config: AppConfig
): Promise<string | null> => {
  try {
    const response = await fetch(GENERATE_CHAT_REPLY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(m => ({ senderId: m.senderId, text: m.text })),
        brandTone: config.brandTone,
        toneDescription: config.toneDescription
      })
    });

    if (!response.ok) {
      console.error('Webhook error:', response.status);
      return null;
    }

    const data = await response.json();
    return unwrap(data)?.reply || null;
  } catch (error) {
    console.error('Error generating chat reply:', error);
    return null;
  }
};
