declare global {
  var importedReviews: Array<{
    id: string;
    marketplace: "Amazon" | "eBay" | "Shopify" | "PayPal" | "Alibaba" | "Website" | "Walmart";
    title: string;
    content: string;
    customerName: string;
    customerEmail: string;
    rating?: number;
    sentiment: "positive" | "negative" | "neutral";
    category: string;
    severity: "low" | "medium" | "high" | "critical";
    status: string;
    createdAt: Date;
    aiSuggestedReply: string;
    verified?: boolean;
    asin?: string;
  }> | undefined;

  var trackedProducts: Array<{
    id: string;
    platform: "Amazon" | "eBay" | "Shopify" | "PayPal" | "Alibaba" | "Website" | "Walmart";
    productId: string;
    productName: string;
    reviewCount: number;
    lastImported: Date;
  }> | undefined;
}

export {};
