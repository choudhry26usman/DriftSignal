# Engineering Log: Replit Agent Prompt History

The following prompts document the development process using the Replit AI Agent. They demonstrate the iterative construction of DriftSignal, starting from the React framework setup through to complex AI integrations with Grok 4.1.

## Phase 1: Project Initialization & UI Architecture
**Goal:** Setup the React environment and "Glass-morphic" Design System.

**Prompts:**
> "Set up a React 18 frontend with Vite and TypeScript. Use Tailwind CSS for styling and Shadcn/ui for component primitives. Configure wouter for client-side routing."

> "Create a glass-morphic design theme with a dark blue-to-purple gradient background, frosted glass cards with backdrop blur, and vibrant blue as the primary accent color. The design should be inspired by Linear and Notion."

> "Build a sidebar navigation layout with links to Dashboard, Workflow Management, Analytics, Settings, and Help & FAQ pages. Include user profile display in the sidebar footer."

> "Add Replit Auth using OpenID Connect for user authentication. Create login/logout routes and protect all API endpoints so users can only see their own data."

## Phase 2: Database Schema & Storage
**Goal:** Implement persistent storage with Neon Postgres and Drizzle ORM.

**Prompts:**
> "Create a PostgreSQL database schema using Drizzle ORM with the following tables: users, reviews (userId, marketplace, sentiment, category, severity), products, and sessions."

> "Add a storage layer (DBStorage class) that implements CRUD operations for reviews and products. All queries must be scoped by userId for data isolation. Include duplicate detection using externalReviewId."

> "Create API routes for: GET /api/reviews/imported (fetch all with filtering), PATCH /api/reviews/:id (update status), and POST /api/products/refresh (fetch latest reviews)."

## Phase 3: External API Integrations
**Goal:** Connect to Amazon, Walmart, and Outlook via specialized proxies.

**Prompts:**
> **Amazon:** "Integrate with Axesso Amazon Data Service API via RapidAPI to fetch product reviews. Extract review text, rating, reviewer name, date, and title. Handle the response format and map it to our review schema."

> **Walmart US:** "Integrate with SerpApi for Walmart US product reviews. Use the walmart_product and walmart_product_reviews engines. Parse the product URL to extract the product ID and fetch up to 5 pages of reviews."

> **Walmart Canada:** "Add support for Walmart Canada (walmart.ca) using Apify's web_wanderer/walmart-reviews-scraper actor. Detect .ca URLs and route them to Apify instead of SerpApi. Handle the sync API call which may take 30-60 seconds."

> **Outlook Email:** "Integrate Microsoft Graph API for Outlook email sync. Fetch emails from the user's inbox, classify them as reviews/complaints using AI, extract product information, and import as reviews."

> **Optimization:** "Optimize email sync with parallel batch processing - process 5 emails simultaneously instead of sequentially. Pre-filter duplicates before making AI calls."

## Phase 4: AI Intelligence (Grok 4.1)
**Goal:** Implement Sentiment Analysis, RAG, and Chatbot capabilities.

**Prompts:**
> **Review Analysis:** "Create an AI service using Grok 4.1 Fast via OpenRouter. Implement analyzeReview() that takes review text and returns: sentiment (positive/neutral/negative), category (Product Quality, Shipping, etc.), and severity (low/medium/high/critical)."

> **Reply Generation:** "Implement generateReply() that creates professional customer service responses based on the review content, sentiment, and severity. Responses should be empathetic and address specific concerns. Never promise refunds without human approval."

> **Smart Email Processing:** "Create processEmailComplete() - a single optimized AI call that combines classification, product extraction, sentiment analysis, and reply generation into one JSON response to minimize API overhead."

> **AI Chatbot:** "Add an AI chatbot assistant that answers user questions about the platform. It should help with navigation, explain features, and provide usage tips. Display as a floating button in the bottom-right corner."

## Phase 5: Advanced UI Features
**Goal:** Build the interactive tools for the MVP.

**Prompts:**
> **Kanban Board:** "Build a Kanban-style Workflow Board with drag-and-drop using @hello-pangea/dnd. Group reviews into product swimlanes that are collapsible. Add a quick search bar to filter by customer name."

> **Analytics:** "Create an Analytics dashboard with Recharts visualizations: Sentiment trend line chart (weekly), Category distribution pie chart, and Severity-status matrix heatmap."

> **Onboarding:** "Add a guided tour using Shepherd.js that walks new users through all major features: Dashboard, Workflow, Analytics, Settings, and the AI Chatbot."
