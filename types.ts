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

// Inbox Types
export interface ChatMessage {
  id: string;
  senderId: string; // 'me' or other userId
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  name: string;
  avatarUrl?: string; // If undefined, show initials or icon
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  messages: ChatMessage[];
}

// Knowledge Base Types
export interface KBArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  lastUpdated: string;
  views: number;
}

// Toast Notification
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}