# DriftSignal: User Manual & Testing Guide

## 1. Quick Access
* **Live App URL:** https://replit.com/join/mwzovmgwyg-reiddm1
* **GitHub Repository:** https://github.com/choudhry26usman/DriftSignal

---

## 2. Authentication & Security
The system utilizes **Replit Auth (OpenID Connect)** for secure, session-based access.

**How to Login:**
1.  Click the **"Login with Replit"** button.
2.  The system will automatically authenticate you using your existing browser session.
3.  **Note:** No username/password is required. User data is isolated by your unique Replit User ID.

---

## 3. Core Feature Walkthrough

### A. The "Glass-Morphic" Dashboard
Upon logging in, you will see the **Unified Command Center**.
* **Visual Style:** Notice the translucent "frosted glass" cards and vibrant blue-to-purple gradient background (inspired by Linear/Notion).
* **The Feed:** This list aggregates live feedback from Amazon, Walmart (US & Canada), Shopify, and Email (Outlook).
* **Filtering:** Use the **Advanced Filters** panel to sort by:
    * **Marketplace:** Amazon, Walmart, Shopify, or Mailbox
    * **Sentiment:** Positive, Neutral, or Negative
    * **Severity:** Low, Medium, High, or Critical
    * **Status:** Open, In Progress, or Resolved
* **Export:** Download filtered reviews as CSV from the Dashboard or Analytics page.

### B. Kanban Workflow Management
DriftSignal uses a **drag-and-drop workflow** with **product swimlanes** to track issue resolution.
1.  **Navigate:** Go to the Workflow page from the sidebar.
2.  **Product Swimlanes:** Reviews are grouped by product in collapsible sections—expand or collapse to manage large volumes.
3.  **Drag-and-Drop:** Click and drag a card from "Open" to "In Progress" or "Resolved."
4.  **Verification:** The status updates immediately and persists in the PostgreSQL database.

### C. AI Intelligence (Powered by Grok 4.1)
We utilize xAI's **Grok 4.1 Fast** model for sentiment analysis, categorization, and response generation.

**AI Chatbot Assistant:**
* Click the **Chat Icon** (bottom right corner with sparkle).
* Ask questions like: *"How do I import reviews?"* or *"How does sentiment analysis work?"*
* The AI provides instant guidance on platform navigation.

**AI-Powered Review Analysis:**
* Every imported review is automatically analyzed for **sentiment, severity, and category**.
* AI generates **suggested professional replies** that you can copy or send via Outlook.

### D. Data Import Options
* **Marketplace Imports:** Click "Import" to add products by URL (Amazon ASIN or Walmart URL).
* **File Imports:** Upload CSV or JSON files. The AI automatically processes each row for sentiment/severity.
* **Email Imports:** Sync your **Outlook inbox** to import customer emails as reviews. The AI extracts product info and generates draft replies.

### E. Data Integrations
Navigate to **Settings > Integrations** to view the status of API connections.
* **AI:** Grok via OpenRouter (Powers analysis).
* **Amazon:** Connected via Axesso Data Service (RapidAPI).
* **Walmart US:** Connected via SerpApi.
* **Walmart Canada:** Connected via Apify.
* **Email:** Connected via Microsoft Graph (Outlook).
* *Note: Green checkmarks confirm the API keys are active.*

### F. Help & Guided Tour
* Navigate to **Help & FAQ** from the sidebar.
* Click **"Start Guided Tour"** for an interactive walkthrough of the entire platform.

---

## 4. Troubleshooting Guide

### Issue: "Database Error" or Infinite Loading
* **Cause:** The Neon Serverless Postgres instance may enter "Sleep Mode" after inactivity.
* **Fix:** Refresh the browser page and wait 10-15 seconds for the cold start to complete.

### Issue: AI Chat Not Responding
* **Cause:** The OpenRouter API rate limit may be exceeded.
* **Fix:** Wait 30 seconds and try again. A toast notification will appear if the API fails.

### Issue: Drag-and-Drop Not Saving
* **Cause:** Network connectivity issue.
* **Fix:** Check your internet connection. A toast notification will display if the database write fails.

### Issue: Email Sync Taking Too Long
* **Cause:** Large inbox with many emails to process.
* **Fix:** Use **"Quick Sync"** (last 24 hours) instead of "Full Sync" for faster results. Emails are processed in parallel batches of 5.

---

## 5. System Requirements
* **Browser:** Chrome v90+ or Edge (required for glass-morphism CSS blur effects).
* **Device:** Desktop recommended for Kanban management; Mobile view is supported for read-only access.
