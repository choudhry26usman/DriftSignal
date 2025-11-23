// Email types for AgentMail integration
export interface Email {
  id: string;
  from: {
    name?: string;
    email: string;
  };
  subject: string;
  body: string;
  receivedAt: string;
  read?: boolean;
}

export interface EmailListResponse {
  emails: Email[];
  total: number;
}

// Review types
export interface Review {
  id: string;
  marketplace: "Amazon" | "eBay" | "Shopify" | "PayPal" | "Alibaba" | "Website";
  title: string;
  content: string;
  customerName: string;
  customerEmail?: string;
  rating?: number;
  sentiment: "positive" | "negative" | "neutral";
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: string;
  createdAt: Date;
  aiSuggestedReply?: string;
}
