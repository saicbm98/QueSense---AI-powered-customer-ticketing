export type TicketStatus = 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed' | 'Escalated';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Sentiment = 'Positive' | 'Neutral' | 'Negative' | 'Urgent';

export interface Customer {
  id: string;
  name: string;
  company: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  mrr: number;
  isHighValue: boolean;
  joinedAt: string;
  avatarUrl?: string;
}

export interface Agent {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Ticket {
  id: string;
  subject: string;
  body: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  customer: Customer;
  assignedAgent?: Agent;
  createdAt: string;
  updatedAt: string;
  aiSummary?: string; // Pre-computed or placeholder
}

export interface AIAnalysisResult {
  summary: string;
  suggestedPriority: TicketPriority;
  sentiment: Sentiment;
  tags: string[];
  confidenceScore: number; // 0-1
}

export interface AppConfig {
  brandTone: string;
  toneDescription: string;
  knowledgeContext: string;
}
