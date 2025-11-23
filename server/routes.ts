import type { Express } from "express";
import { getUncachableAgentMailClient } from "./integrations/agentmail";
import { getUncachableOutlookClient } from "./integrations/outlook";

export function registerRoutes(app: Express) {
  // Fetch emails from AgentMail
  app.get("/api/emails", async (req, res) => {
    try {
      const agentMail = await getUncachableAgentMailClient();
      const emails = await agentMail.emails.list();
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  // Send email via Outlook
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, body } = req.body;
      
      if (!to || !subject || !body) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const outlookClient = await getUncachableOutlookClient();
      
      const sendMail = {
        message: {
          subject: subject,
          body: {
            contentType: "Text",
            content: body
          },
          toRecipients: [
            {
              emailAddress: {
                address: to
              }
            }
          ]
        }
      };

      await outlookClient.api('/me/sendMail').post(sendMail);
      
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Generate AI reply using OpenRouter
  app.post("/api/generate-reply", async (req, res) => {
    try {
      const { reviewContent, sentiment, category } = req.body;

      if (!reviewContent) {
        return res.status(400).json({ error: "Review content is required" });
      }

      const prompt = `You are a professional customer service representative. Generate a professional, empathetic response to the following customer review.

Review: ${reviewContent}
Sentiment: ${sentiment}
Category: ${category}

Generate a professional response that:
1. Acknowledges the customer's concern
2. Shows empathy and understanding
3. Offers a solution or next steps
4. Maintains a professional and helpful tone
5. Is concise (2-3 paragraphs maximum)

Response:`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.REPLIT_DEPLOYMENT_URL || "http://localhost:5000",
        },
        body: JSON.stringify({
          model: "x-ai/grok-2-1212",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || "Unable to generate response";

      res.json({ reply });
    } catch (error) {
      console.error("Error generating AI reply:", error);
      res.status(500).json({ error: "Failed to generate AI reply" });
    }
  });
}
