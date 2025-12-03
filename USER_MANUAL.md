# DriftSignal: User Guide & Testing Instructions

## 1. Quick Start (For Graders)
* **Live App URL:** https://replit.com/join/mwzovmgwyg-reiddm1
* **GitHub Repository:** https://github.com/choudhry26usman/DriftSignal

## 2. Authentication (Demo Mode)
The system is pre-configured with a demo administrator account.
* **Username:** `admin`
* **Password:** `demo123`
*(Note: If the Replit container is cold, it may take 30-60 seconds to boot the Flask server).*

## 3. How to Test Core Features

### A. Populating Data (The "Simulation" Strategy)
Since live API keys for Amazon SP-API are restricted, we have enabled two manual ingestion methods for the MVP:
1.  **Manual Entry:** Click the **"Add Review"** button in the top navbar. Fill out the form to simulate a new incoming review from a customer.
2.  **CSV Import:** Navigate to **Settings > Import**. Upload the sample `amazon_export.csv` (provided in the repo) to batch-upload 50+ reviews at once.

### B. The Unified Dashboard
1.  Navigate to the **Dashboard**.
2.  **Filter:** Use the sidebar to filter by "Platform" (Amazon vs. Shopify) or "Sentiment" (Negative vs. Positive).
3.  **Observation:** Notice how the **Severity Score** (Critical/High/Low) dynamically adjusts based on the text intensity, not just the star rating.

### C. Testing AI Response Generation
1.  Find a review flagged as **"Critical"** (Red Badge).
2.  Click the blue **"Draft Reply"** button.
3.  **Wait 3-5 seconds:** The system is calling the OpenAI GPT-3.5 API.
4.  **Review the Draft:** The AI will generate a context-aware response that apologizes for the specific issue (e.g., shipping delay) without making unauthorized refund promises.

## 4. Troubleshooting
* **"Internal Server Error" on Import:** Ensure your CSV file matches the template headers exactly (`review_text`, `rating`, `source`).
* **AI Features Not Working:** If the response generation fails, it usually means the OpenAI API quota on the student account has been reached. Check the console logs for "Rate Limit" errors.

## 5. Known Limitations (MVP Scope)
* **Mobile View:** The dashboard is responsive but optimized for desktop viewing.
* **Email Sending:** The "Send" button simulates an SMTP handshake but does not actually dispatch emails to real customers to prevent spam flagging.
