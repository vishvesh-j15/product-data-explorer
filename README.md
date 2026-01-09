# Product Data Explorer - Full-Stack Assignment

## 🚀 Project Overview
This project is a production-minded product exploration platform that allows users to navigate categories and view product details from **World of Books**.

The system features a **live, on-demand scraping engine** powered by NestJS and Crawlee. When users browse, the backend intelligently checks for cached data in PostgreSQL. [span_1](start_span)[span_2](start_span)If data is missing or stale, it triggers a real-time background scrape using Playwright to fetch fresh content without blocking the user experience[span_1](end_span)[span_2](end_span).

## 🛠️ Tech Stack

### Frontend
* **[span_3](start_span)Framework:** React (Next.js 14 App Router)[span_3](end_span)
* **[span_4](start_span)Styling:** Tailwind CSS[span_4](end_span)
* **Language:** TypeScript
* **[span_5](start_span)State/Fetching:** SWR (Stale-While-Revalidate)[span_5](end_span)

### Backend
* **[span_6](start_span)Framework:** NestJS (Node.js + TypeScript)[span_6](end_span)
* **[span_7](start_span)Database:** PostgreSQL (via Prisma ORM)[span_7](end_span)
* **[span_8](start_span)Scraping:** Crawlee + Playwright (Headless Browser)[span_8](end_span)
* **[span_9](start_span)Queueing:** BullMQ (for background scrape jobs)[span_9](end_span)

---

## 🏗️ Architecture & Design Decisions

### 1. Database Choice: PostgreSQL
**Decision:** I chose PostgreSQL over MongoDB because the data structure (Categories -> Products -> Reviews) is highly relational.
**Reasoning:** Strict schemas ensure data integrity, especially when linking scraped reviews to specific products. [span_10](start_span)[span_11](start_span)We utilize specific unique constraints on `source_id` to prevent duplicate entries during repeated scrapes[span_10](end_span)[span_11](end_span).

### 2. Scraping Strategy (On-Demand + Caching)
**Decision:** Scrapes are triggered by user actions but decoupled from the HTTP response.
**Reasoning:**
1.  **Check Cache:** When a user requests a category, the API first checks the DB.
2.  **Stale-While-Revalidate:** If data exists, it is returned immediately.
3.  **Background Update:** If the data is "stale" (older than 24h), a job is added to the scraping queue to update the DB in the background. [span_12](start_span)[span_13](start_span)This prevents the user from waiting 30+ seconds for a scrape to finish[span_12](end_span)[span_13](end_span).

### 3. Ethical Scraping & Rate Limiting
**Decision:** Implemented strict delays and concurrency limits.
**Reasoning:** To respect World of Books' servers, the crawler is configured with `maxConcurrency: 1` and random delays between requests. [span_14](start_span)[span_15](start_span)This ensures we do not trigger IP bans or overload the target[span_14](end_span)[span_15](end_span).

---

## ⚙️ Setup & Installation

### Prerequisites
* Node.js (v18+)
* [span_16](start_span)Docker (for running PostgreSQL locally)[span_16](end_span)

### 1. Database Setup
Start a PostgreSQL instance using Docker:
```bash
docker run --name postgres-db -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
# product-data-explorer
