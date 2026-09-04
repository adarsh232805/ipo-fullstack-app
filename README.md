# 🚀 IPO Pulse — Comprehensive Real-Time Indian IPO Intelligence Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TailwindCSS-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MongoDB-green.svg)](https://nodejs.org/)
[![Scraper](https://img.shields.io/badge/Live%20Sync-Groww%20%7C%20NSE%20%7C%20BSE%20%7C%20IPOWatch%20%7C%20IPOGyani-orange.svg)](https://groww.in/ipo)
[![AI Powered](https://img.shields.io/badge/AI%20Prospectus%20Auditor-Groq%20LLaMA%203-purple.svg)](https://groq.com/)

**IPO Pulse** is a high-performance, full-stack platform providing real-time tracking, live Grey Market Premium (GMP), automated bidding subscriptions, audited balance sheet financials, and AI-powered prospectus audits for Mainboard and SME Initial Public Offerings (IPOs) across the Indian stock market (NSE & BSE).

---

## 🌟 Key Highlights & Real-Time Features

- **🌐 Multi-Source Real-Time Crawler & Sync Engine:**
  - **Groww IPO Live Integration:** Synchronizes live subscription rates (QIB, NII, Retail), official issue details, and multi-year audited financials.
  - **BSE & NSE Exchange Scrapers:** Automatically fetches trading identification symbols, scrip codes, official categories, and lot sizes.
  - **IPOWatch Real-Time GMP Crawler:** Live Grey Market Premium, expected listing price, day-by-day historical quotations, and price bands.
  - **IPOGyani AI Predictions:** AI-estimated listing gain percentages and projected profit per lot.
  - **Automated Cron Jobs:** Resilient background scheduler runs automated syncs every 5 minutes with zero UI freezing or rate-limiting traps.

- **📊 Audited Financials & DRHP Analytics:**
  - Company-specific, multi-year audited financial tables (Total Revenue, Profit After Tax (PAT), Total Assets) extracted from official SEBI DRHP/RHP prospectuses and verified filing data.
  - Automatic isolation logic to filter out generic website sidebar templates and display authentic company numbers.

- **🤖 Groq AI Prospectus Auditor & Red Flag Sentinel:**
  - Instant automated balance sheet stress-testing powered by Groq and LLaMA 3.
  - Automatic detection of promoter share pledging, debt-to-equity leverage ratios, litigation disclosures, and lock-in expirations.
  - Actionable consensus verdicts (*Subscribe for Listing Gains*, *Long-Term Compounder*, or *Avoid*).

- **🔔 Comprehensive Investor Toolkit:**
  - **Live Subscription Breakdown:** Visualized progress bars for QIB, NII, and Retail quotas.
  - **GMP Trends & Price Calculator:** Instant calculations for total profit per application lot.
  - **Allotment Checker & Registrar Links:** Direct deep-links to official registrars (Link Intime, KFintech, Bigshare, Skyline, Purva Sharegiri, Cameo).
  - **Watchlist & Price Alerts:** Instant user alerts for GMP movements and allotment declarations.
  - **Market Indices & Trends:** Real-time Indian benchmark trackers (Nifty 50, Sensex, India VIX, SME Index).

- **🛡️ Modern Admin Panel & Content Management:**
  - Dedicated administrative dashboard to manage IPO listings, override live GMP feeds, analyze user engagement, and moderate reviews.

---

## 🏗️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                                │
├───────────────────────────────────┬────────────────────────────────────┤
│         React 18 + Vite           │         Admin Panel (Vite)         │
│   Tailwind CSS + Lucide Icons     │      Live IPO Management & Logs    │
│    Chart.js + Responsive UI       │       User Analytics Dashboard     │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              BACKEND API                                │
│                   Node.js + Express.js + Mongoose                      │
├────────────────────────────────────────────────────────────────────────┤
│ • Automated Scraper Engine (Cheerio, resilient HTTP agents, regex)     │
│ • Scheduled Sync Cron (node-cron every 5 mins)                         │
│ • Groq AI Integration (Prospectus & SEBI DRHP Auditor)                 │
│ • Cloudinary SDK (Document/image asset pipeline)                       │
│ • Nodemailer (Automated email alerts)                                  │
│ • JWT + bcrypt Authentication & RBAC                                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                │
│  MongoDB Atlas (with resilient fallback to verified seed data)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
ipo-fullstack-app/
├── admin-panel/              # Dedicated administrative portal
│   ├── src/                  # Admin UI components, routing & tables
│   ├── package.json
│   └── vite.config.js
├── backend/                  # REST API & live data crawling services
│   ├── admin/                # Admin auth, user management & analytics routes
│   ├── cron/                 # Real-time background sync & alert jobs
│   │   ├── marketDataSyncCron.js  # 5-minute automated live market sync
│   │   └── gmpAlertJob.js         # Push notification & email alerts
│   ├── data/                 # 22+ Seed IPOs with audited DRHP financials
│   │   └── iposData.js
│   ├── models/               # Mongoose schemas (IPO, User, Alert, News)
│   ├── routes/               # API endpoints (IPOs, AI, GMP, Allotments, News)
│   ├── services/             # Core multi-source web crawlers & AI engine
│   │   ├── scraperService.js      # Groww + NSE/BSE + IPOWatch + IPOGyani
│   │   ├── marketTrendService.js  # Live index feeds (Nifty, Sensex, VIX)
│   │   └── emailService.js
│   ├── .env.example          # Environment variable template
│   ├── server.js             # Main server entry point
│   └── package.json
├── frontend/                 # Customer-facing IPO tracking web app
│   ├── src/
│   │   ├── components/       # Reusable cards, calculators, modals & headers
│   │   ├── context/          # Global Auth & Watchlist contexts
│   │   ├── pages/            # Home, IPO Details, GMP Tracker, Allotment, AI Audit
│   │   └── services/         # Axios API clients
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore                # Production git exclusion rules
└── README.md                 # Complete platform documentation
```

---

## ⚙️ Quick Start & Installation

### 1. Prerequisites
- **Node.js** >= 18.x
- **npm** or **yarn**
- **MongoDB** (Local instance or free MongoDB Atlas URI)

### 2. Clone the Repository
```bash
git clone https://github.com/adarsh232805/ipo-fullstack-app.git
cd ipo-fullstack-app
```

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory by copying `.env.example`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ipoapp
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```
Start the backend server:
```bash
node server.js
```
*The server will start on [http://localhost:5000](http://localhost:5000) and automatically trigger an initial multi-source sync.*

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The customer web app will be live at [http://localhost:3000](http://localhost:3000).*

### 5. Admin Panel Setup (Optional)
Open a third terminal window:
```bash
cd admin-panel
npm install
npm run dev
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ipos` | Returns all active, upcoming, and closed IPOs with live GMP and financials |
| `GET` | `/api/ipos/:id` | Returns detailed IPO record including subscription breakdown and timeline |
| `POST` | `/api/ipos/sync` | Manually triggers an immediate multi-source live sync across all web feeds |
| `GET` | `/api/market-trends` | Fetches live market trends and benchmark indices (Nifty, Sensex, VIX) |
| `POST` | `/api/ai/audit` | Executes Groq AI Prospectus Auditor on a given company's filings |
| `GET` | `/api/allotment` | Returns official registrar allotment lookup links and status |
| `GET` | `/api/news` | Real-time curated IPO market news and press releases |

---

## 🛡️ License

This project is licensed under the **MIT License**.

---

## 👤 Author & Maintainer

**Adarsh Singh**  
- GitHub: [@adarsh232805](https://github.com/adarsh232805)
