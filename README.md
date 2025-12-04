# DriftSignal: AI-Powered Customer Intelligence Platform

![Status](https://img.shields.io/badge/status-live-success) ![Stack](https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20Grok%20AI-blue) ![License](https://img.shields.io/badge/license-MIT-green)

**DriftSignal** is an enterprise-grade SaaS platform designed to centralize, categorize, and automate customer review management for small ecommerce businesses. Built as a capstone project for the **Haskayne MBA program**, it leverages **Generative AI (Grok 4.1)** to solve the operational chaos of multi-channel selling.

> **Note on Technical Evolution:**
> As detailed in our project blog post, we initially prototyped this application using **Python/Flask** (Phase 1). However, during the final sprint, we refactored the codebase to **React/Node.js** to leverage Replit's "Glass-Morphic" UI capabilities and the superior speed of Grok 4.1. This repository contains the **Final Production Build**.

---

## The Business Problem: "Death by a Thousand Tabs"
The ecommerce landscape has shifted. Small merchants (generating $50k-$500k/yr) must sell everywhere to survive, but managing feedback across disparate channels creates a massive operational tax.

* **The Time Tax:** Sellers spend 5-10 hours/week just logging into Amazon Seller Central, Walmart Partner Center, and Outlook to check for complaints.
* **The "Silent" Killer:** A scathing 1-star review on Walmart.ca can sit unnoticed for weeks, degrading the algorithm ranking before the seller even knows it exists.
* **The Intelligence Gap:** Generic tools (Birdeye, Podium) cost $300+/month and don't support specialized channels like Walmart Canada or Outlook email parsing.

---

## The Solution: Unified Intelligence
DriftSignal functions as a **"Single Pane of Glass"** that consolidates this fragmented workflow into one intelligent dashboard.

### Feature 1: Multi-Channel Aggregation (Headless)
DriftSignal ingests unstructured text data from live sources and normalizes it into a standard schema:
* **Amazon:** via Axesso Data Service (RapidAPI).
* **Walmart US:** via SerpApi.
* **Walmart Canada:** via Apify (Web Wanderer Actor).
* **Outlook Email:** via Microsoft Graph API (Two-way sync).

### Feature 2: AI Triage & Chatbot
We utilize **Grok 4.1 Fast** to act as a Tier-1 Support Agent.
* **Root Cause Analysis:** Analyzes sentiment velocity to flag "Shipping" vs. "Product" issues.
* **AI Chatbot:** A floating assistant answers natural language queries (e.g., *"Show me all shipping complaints from Canada"*).
* **Smart Drafts:** Uses RAG (Retrieval-Augmented Generation) to draft professional responses instantly.

### Feature 3: Advanced Workflow Management
* **Kanban Board:** Drag-and-drop reviews between statuses (Open → In Progress → Resolved).
* **Swimlanes:** Group reviews by Product to identify defect clusters.
* **Batch Processing:** Parallel processing for email sync to handle high-volume inboxes without timeout.
* **Guided Tour:** Integrated `Shepherd.js` walkthrough for new user onboarding.

---

## Technical Stack (Production Build)

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + Vite** | TypeScript, TanStack Query, Wouter (Routing). |
| **Backend** | **Express.js** | RESTful API with custom logging. |
| **Database** | **PostgreSQL** | Serverless (Neon) managed via **Drizzle ORM**. |
| **AI Model** | **Grok 4.1 Fast** | Integrated via OpenRouter for high-speed analysis. |
| **Auth** | **Replit Auth** | OpenID Connect for secure multi-user session management. |
| **Email Sync** | **Microsoft Graph API** | Real-time Outlook sync with AI classification. |

---

## Integration Status

| Source | Status | Method |
| :--- | :--- | :--- |
| **Amazon** | 🟢 Live | Axesso Data Service |
| **Walmart US** | 🟢 Live | SerpApi |
| **Walmart Canada** | 🟢 Live | Apify (Web Wanderer) |
| **Outlook Email** | 🟢 Live | Microsoft Graph API |
| **Shopify** | 🟡 Partial | CSV/File Import Only (API Planned) |
| **eBay** | 🔴 Roadmap | Planned for V2 |

---

## Quick Start

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/choudhry26usman/DriftSignal.git](https://github.com/choudhry26usman/DriftSignal.git)
    ```

2.  **Environment Setup**
    Configure the `.env` with your provider keys:
    ```env
    DATABASE_URL=postgresql://neondb_...
    AI_INTEGRATIONS_OPENROUTER_API_KEY=sk-...
    AXESSO_API_KEY=...
    RAPIDAPI_KEY=...
    MICROSOFT_GRAPH_CLIENT_ID=...
    ```

3.  **Install & Run**
    ```bash
    npm install
    npm run dev
    ```



---


## Contributors
* **Sam:** Product Strategy & Market Analysis
* **Reid:** Lead Engineering & AI Integration
* **Usman:** DevOps, Architecture & Documentation
* **Mark:** Business Analysis & Pricing Strategy
* **Mike:** QA Testing & User Experience

---

*Licensed under the [MIT License](LICENSE).*
