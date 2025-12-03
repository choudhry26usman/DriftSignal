# System Architecture Specification

## 1. Design Philosophy
DriftSignal utilizes a classic **MVC (Model-View-Controller)** architecture, implemented via the **Flask** microframework. This lightweight approach was chosen to maximize development speed within the 4-week MVP timeline.

## 2. Component Diagram

**[Client Layer]** **[Server Layer]** **[Data Layer]**
+----------------+      +------------------+      +----------------+
|  Browser UI    |      |  Flask App       |      |  PostgreSQL    |
|  (Bootstrap 5) | <--> |  (Python 3.10)   | <--> |  (SQLAlchemy)  |
+----------------+      +---------+--------+      +----------------+
                                  |
                                  | API Calls
                        +---------v--------+
                        |  OpenAI API      |
                        |  (GPT-3.5-Turbo) |
                        +------------------+

## 3. Detailed Tech Stack

### Backend (The Core)
* **Framework:** Flask (Python).
* **ORM:** SQLAlchemy (handling relationships between `Users` and `Reviews`).
* **Authentication:** Flask-Login (Session management and password hashing).

### Frontend (The Dashboard)
* **Templating:** Jinja2 (Server-side rendering).
* **Styling:** Bootstrap 5 (Responsive grid and UI components).
* **Interactivity:** Vanilla JavaScript for dynamic filtering.

### Intelligence Engine
* **Sentiment Analysis:** Reviews are passed to `GPT-3.5-turbo` with a strict prompt to classify sentiment (Positive/Neutral/Negative) and assign a Severity Score (1-10).
* **Response Generation:** A separate prompt context ("Professional Customer Service Agent") generates drafts based on the review category.

## 4. Data Strategy (MVP)
Due to API restrictions (Amazon SP-API requires 10 sales/month; Shopify requires OAuth approval), the MVP utilizes a **CSV Import Strategy**:
1.  **Ingest:** User uploads CSV exports from Seller Central/Shopify.
2.  **Map:** Pandas/Python logic maps columns to our standardized `Review` model.
3.  **Store:** Data is persisted in PostgreSQL.

## 5. Security
* **Environment Variables:** All API keys and DB credentials are stored in `.env`.
* **Password Hashing:** Utilizing `werkzeug.security` for salt/hash storage.
