interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const OPENROUTER_BASE_URL = process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const OPENROUTER_API_KEY = process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY;

async function callOpenRouter(request: OpenRouterRequest): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key not configured");
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://driftsignal.replit.app",
      "X-Title": "DriftSignal Review Manager",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || "";
}

export interface ReviewAnalysis {
  sentiment: "positive" | "negative" | "neutral";
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  reasoning: string;
}

export async function analyzeReview(
  reviewContent: string,
  customerName: string,
  marketplace: string
): Promise<ReviewAnalysis> {
  const systemPrompt = `You are an AI assistant analyzing customer reviews and complaints for an e-commerce business. 
Analyze the sentiment, severity, and category of each review.

Sentiment options: positive, negative, neutral
Severity options: low (minor issue or praise), medium (moderate concern), high (serious problem), critical (urgent issue requiring immediate attention)
Category: A brief 1-2 word category like "shipping", "quality", "service", "pricing", etc.

Respond in JSON format with: sentiment, severity, category, and a brief reasoning.`;

  const userPrompt = `Analyze this review from ${customerName} on ${marketplace}:

"${reviewContent}"

Provide your analysis in JSON format.`;

  const response = await callOpenRouter({
    model: "x-ai/grok-4.1-fast",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      sentiment: parsed.sentiment || "neutral",
      severity: parsed.severity || "medium",
      category: parsed.category || "general",
      reasoning: parsed.reasoning || "",
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      sentiment: "neutral",
      severity: "medium",
      category: "general",
      reasoning: "Failed to analyze review",
    };
  }
}

export async function generateReply(
  reviewContent: string,
  customerName: string,
  marketplace: string,
  sentiment: string,
  severity: string
): Promise<string> {
  const systemPrompt = `You are a professional customer service representative writing responses to customer reviews and complaints.
Your tone should be:
- Empathetic and understanding
- Professional and courteous
- Solution-oriented
- Personalized to the customer and their specific concern

For positive reviews: Express gratitude and encourage continued engagement
For negative reviews: Acknowledge the issue, apologize sincerely, and offer a concrete solution or next step
For neutral reviews: Thank them for feedback and address any concerns mentioned`;

  const userPrompt = `Write a professional response to this ${sentiment} review (severity: ${severity}) from ${customerName} on ${marketplace}:

"${reviewContent}"

Write a response that addresses their concern directly and professionally. Keep it concise (2-4 sentences).`;

  const response = await callOpenRouter({
    model: "x-ai/grok-4.1-fast",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return response.trim();
}

export interface EmailClassification {
  isReviewOrComplaint: boolean;
  confidence: number;
  reasoning: string;
  suggestedAction: "import" | "ignore";
}

export async function classifyEmail(
  emailSubject: string,
  emailBody: string,
  senderName: string
): Promise<EmailClassification> {
  const systemPrompt = `You are an AI assistant that classifies incoming emails to determine if they are customer reviews, complaints, or feedback about products/services.

Reviews and complaints typically:
- Mention product quality, shipping, customer service experiences
- Express satisfaction or dissatisfaction with a purchase
- Request refunds, replacements, or support
- Describe specific issues or praise specific features
- Include ratings or evaluations

NOT reviews/complaints:
- Newsletter subscriptions/unsubscriptions
- Marketing emails
- Order confirmations
- Shipping notifications
- Password resets
- Spam or promotional content

Respond in JSON format with: isReviewOrComplaint (boolean), confidence (0-100), reasoning (brief explanation), and suggestedAction ("import" or "ignore").`;

  const userPrompt = `Classify this email from ${senderName}:

Subject: "${emailSubject}"
Body: "${emailBody.substring(0, 500)}"

Is this a customer review or complaint that should be imported into our review management system?`;

  const response = await callOpenRouter({
    model: "x-ai/grok-4.1-fast",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 300,
  });

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      isReviewOrComplaint: parsed.isReviewOrComplaint || false,
      confidence: parsed.confidence || 0,
      reasoning: parsed.reasoning || "",
      suggestedAction: parsed.suggestedAction || "ignore",
    };
  } catch (error) {
    console.error("Failed to parse AI classification response:", error);
    return {
      isReviewOrComplaint: false,
      confidence: 0,
      reasoning: "Failed to classify email",
      suggestedAction: "ignore",
    };
  }
}
