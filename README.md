# ⚡ IPO Pulse Pro — Real-Time IPO Tracker & Allotment Intelligence Platform

<div align="center">

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-black?style=for-the-badge&logo=vercel&logoColor=white)](https://ipo-fullstack-app.vercel.app)
[![React](https://img.shields.io/badge/React%2018-Vite%20%7C%20TailwindCSS-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js%2020-Express%20REST%20API-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2B%20Resilient%20Store-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

### [🌐 Visit Live Web Application](https://ipo-fullstack-app.vercel.app) &nbsp;•&nbsp; [🛡️ Admin Command Center](https://ipo-fullstack-app.vercel.app/admin) &nbsp;•&nbsp; [🎫 Multi-PAN Allotment Engine](https://ipo-fullstack-app.vercel.app/allotment)

**A high-performance, fullstack financial platform delivering real-time Indian stock market (NSE & BSE) IPO tracking, automated multi-PAN allotment verification without registrar redirection, live Grey Market Premium (GMP) forecasting, audited balance sheet analytics, and a powerful Admin Command Center.**

</div>

---

## 📑 Table of Contents
- [🌟 Live Deployments & Demo Access](#-live-deployments--demo-access)
- [✨ Key Platform Features](#-key-platform-features)
- [🏛️ System Architecture](#️-system-architecture)
- [📂 Repository Monorepo Structure](#-repository-monorepo-structure)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [📡 Complete REST API Documentation](#-complete-rest-api-documentation)
- [🔐 Environment Configuration](#-environment-configuration)
- [☁️ Vercel Cloud Deployment Configuration](#️-vercel-cloud-deployment-configuration)
- [👤 Author & Maintainer](#-author--maintainer)

---

## 🌟 Live Deployments & Demo Access

The platform is deployed live on Vercel's Global Edge Network with full cross-device compatibility (Mobile, Tablet, Desktop):

| Service / Portal | Production URL | Access Details |
|---|---|---|
| **🌐 Public Web App** | [https://ipo-fullstack-app.vercel.app](https://ipo-fullstack-app.vercel.app) | Real-time IPO intelligence, search, live GMP & category filters |
| **🛡️ Admin Command Center** | [https://ipo-fullstack-app.vercel.app/admin](https://ipo-fullstack-app.vercel.app/admin) | **Email:** `admin@ipo.com` &nbsp;•&nbsp; **Password:** `password123` |
| **🎫 Automated Allotment Engine** | [https://ipo-fullstack-app.vercel.app/allotment](https://ipo-fullstack-app.vercel.app/allotment) | Batch check multiple family PANs with 1 click |
| **📈 Live GMP Dashboard** | [https://ipo-fullstack-app.vercel.app/gmp](https://ipo-fullstack-app.vercel.app/gmp) | Real-time premium rates, trends & profit calculators |
| **⚖️ Head-to-Head Comparison** | [https://ipo-fullstack-app.vercel.app/compare](https://ipo-fullstack-app.vercel.app/compare) | Compare 2+ IPOs across valuation, subscription & GMP |

---

## ✨ Key Platform Features

### 1. 🎫 Direct Multi-PAN Allotment Verification Engine
- **Check All Family PANs at Once:** Add multiple PAN cards (family members, clients, or investor groups) and verify allotment across all of them in a single batch request.
- **Zero Redirect Hassle:** Directly connects with official registrar registries (Link Intime, KFintech, Bigshare, Skyline, Purva Sharegiri, Cameo Corporate) without external redirects or CAPTCHAs.
- **Granular Allotment Telemetry:** Computes lots allotted, shares credited, mandate debit status (`DEBIT_COMPLETED` vs `UNBLOCK_INITIATED`), refund amount, and net estimated listing day profit.

### 2. 📈 Live Grey Market Premium (GMP) & Financial Intelligence
- **Multi-Source Scraping Engine:** Crawls real-time GMP quotes, expected listing gains, and cost-of-funding rates from Groww, NSE, BSE, IPOWatch, and IPOGyani.
- **Inline Profit Calculator:** Dynamic sliders to calculate expected profit based on lot size, cut-off issue price, and current GMP.
- **Audited DRHP Financials:** Multi-year financial tables (Total Revenue, Profit After Tax, Total Assets) extracted from official SEBI DRHP/RHP filings.

### 3. 🛡️ Modern Admin Command Center
Accessible at `/admin` with dedicated administrative capabilities:
- **Tab 1: Overview & Analytics:** KPI dashboard showing Active Offerings, Closed Issues, System Telemetry, and a high-performance **Recharts Top GMP Gainers** bar chart.
- **Tab 2: IPO Catalog Management:** Full 22+ IPO database manager with real-time status toggles (`upcoming`, `open`, `closed`), instant search, and board filters (Mainboard vs SME).
- **Tab 3: GMP Editor & Historical Trends:** Edit any IPO's live GMP in real-time, view daily historical trend charts, and compute expected listing gains on the fly.
- **Tab 4: Users Directory & KYC:** Manage registered user accounts, toggle KYC status (`VERIFIED` / `PENDING`), and inspect user activity.
- **Tab 5: Market Scrapers Telemetry:** Real-time health monitoring of external data feeds (Groww, NSE, IPOWatch, InvestorGain) with a one-click **"Trigger Live Sync"** button.

### 4. 📱 100% Mobile & Cross-Device Optimized
- Fully responsive Tailwind CSS layout with touch-friendly drawer navigation, ambient dark-mode UI, and zero 404 errors on deep subroutes or page reloads.

---

## 🏛️ System Architecture

```mermaid
graph TD
    User([📱 Mobile / 💻 Desktop Browser]) -->|HTTPS| CloudflareEdge[Vercel Global Edge Network]
    
    subgraph Vercel_Multi_Service [Vercel Multi-Service Microservices]
        CloudflareEdge -->|/(.*) SPA Catch-All| FrontendService[Frontend Service: Vite + React 18 SPA]
        CloudflareEdge -->|/api/(.*)| BackendService[Backend Service: Express.js REST API]
    end
    
    subgraph Data_Intelligence_Layer [Backend & Data Engine]
        BackendService --> AuthMiddleware[JWT Auth & RBAC Sentinel]
        BackendService --> ScraperEngine[Multi-Source Scraper Engine]
        BackendService --> CronJobs[node-cron: 5-Min Scheduled Sync]
        BackendService --> AllotmentEngine[Direct Multi-PAN Allotment Evaluator]
        
        ScraperEngine --> ExternalFeeds[Groww / NSE / BSE / IPOWatch / IPOGyani]
        BackendService --> Database[(MongoDB Atlas / In-Memory Resilient Store)]
    end
```

---

## 📂 Repository Monorepo Structure

```
ipo-fullstack-app/
├── backend/                        # High-performance Express.js REST API
│   ├── admin/                      # Admin routes, controllers & models
│   │   ├── controllers/            # Admin analytics, IPO & user management
│   │   ├── models/Admin.js         # Admin schema
│   │   └── routes/                 # /api/admin/* endpoints
│   ├── cron/                       # Automated background sync tasks
│   │   ├── marketDataSyncCron.js   # 5-minute automated live market sync
│   │   └── gmpAlertJob.js          # GMP movement notifications & email alerts
│   ├── data/                       # Verified seed IPOs with DRHP balance sheets
│   │   └── iposData.js             # 22+ Pre-populated verified IPO records
│   ├── middleware/                 # JWT protection & role-based access control
│   │   └── authMiddleware.js       # Admin / User authentication guard
│   ├── models/                     # Mongoose database models
│   │   ├── Ipo.js                  # Comprehensive IPO schema with GMP & subscription
│   │   └── User.js                 # User profiles, KYC status & watchlists
│   ├── routes/                     # REST API endpoints
│   │   ├── ipoRoutes.js            # Public IPO data & filtering
│   │   ├── authRoutes.js           # Signup, Login, Profile & JWT generation
│   │   ├── allotmentRoutes.js      # Multi-PAN batch allotment checker
│   │   ├── marketSyncRoutes.js     # Live market trends & scraper trigger
│   │   └── news.js                 # Curated IPO financial news feed
│   ├── services/                   # Web crawlers & financial engines
│   │   ├── scraperService.js       # Cheerio crawlers (Groww, NSE, IPOWatch)
│   │   ├── marketTrendService.js   # Live Nifty 50, Sensex, VIX indices
│   │   └── emailService.js         # Transactional & alert emails
│   ├── utils/                      # Memory fallback & resilient stores
│   │   └── inMemoryStore.js        # High-availability offline store
│   ├── .env.example                # Sample backend environment variables
│   ├── server.js                   # Unified Express application server
│   └── package.json
│
├── frontend/                       # Client-side React 18 + Vite SPA
│   ├── public/                     # Static assets & icons
│   ├── src/
│   │   ├── api/                    # Axios interceptors & base config
│   │   ├── components/             # Reusable UI components & modals
│   │   │   ├── Navbar.jsx          # Desktop & mobile responsive header
│   │   │   ├── Footer.jsx          # Modern footer with quick links
│   │   │   ├── Sidebar.jsx         # User dashboard navigation drawer
│   │   │   └── ProtectedRoute.jsx  # Client-side authentication gatekeeper
│   │   ├── context/                # React Context providers
│   │   │   ├── AuthContext.jsx     # User session, login, signup & logout state
│   │   │   └── WatchlistContext.jsx# Real-time portfolio & saved IPOs
│   │   ├── layouts/                # Dashboard & Admin layouts
│   │   ├── pages/                  # Page views
│   │   │   ├── Home.jsx            # Dynamic homepage with live tickers & cards
│   │   │   ├── IpoListing.jsx      # Comprehensive searchable IPO directory
│   │   │   ├── IpoDetail.jsx       # Deep-dive IPO page with DRHP balance sheets
│   │   │   ├── GmpPage.jsx         # Live GMP tracker & profit estimator
│   │   │   ├── Allotment.jsx       # Multi-PAN automated allotment checker
│   │   │   ├── CompareIpos.jsx     # Side-by-side comparison matrix
│   │   │   ├── Login.jsx           # Modern auth login page
│   │   │   ├── Signup.jsx          # New user registration
│   │   │   └── admin/              # Admin Command Center
│   │   │       ├── AdminDashboard.jsx # 5-tab admin control center
│   │   │       ├── AdminIpos.jsx      # IPO table with inline status toggling
│   │   │       ├── AddIpo.jsx         # New IPO creator form
│   │   │       └── EditIpo.jsx        # Detailed IPO editor
│   │   ├── services/               # API caller modules
│   │   ├── utils/
│   │   │   └── apiConfig.js        # Dynamic origin resolver for local vs Vercel
│   │   ├── App.jsx                 # Route definitions & router tree
│   │   └── main.jsx                # Application bootstrap
│   ├── index.html                  # HTML5 entry point
│   ├── package.json
│   ├── tailwind.config.js          # Custom theme & color palette
│   └── vite.config.js              # Vite build setup
│
├── vercel.json                     # Vercel Multi-Service production routing
├── .gitignore                      # Git exclusion rules
└── README.md                       # Comprehensive platform documentation
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** >= 18.x
- **npm** or **yarn**
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/adarsh232805/ipo-fullstack-app.git
cd ipo-fullstack-app
```

### 3. Setup and Run Backend
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` (or use the built-in defaults):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ipoapp
JWT_SECRET=super_secret_jwt_key_2026
```
Start the backend server:
```bash
node server.js
```
> **Note:** The backend automatically boots in **Resilient Fallback Mode** with 22+ verified IPO records even if MongoDB is not locally running.

### 4. Setup and Run Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The application will launch at [http://localhost:3000](http://localhost:3000).

---

## 📡 Complete REST API Documentation

### Public & Market APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/ipos` | Fetch all IPOs with status, GMP, and financials |
| `GET` | `/api/ipos/:id` | Fetch full details of a specific IPO |
| `GET` | `/api/market-trends` | Live NIFTY 50, SENSEX, and INDIA VIX index feeds |
| `GET` | `/api/market-sync/status` | Health status of Groww, NSE, IPOWatch crawlers |
| `POST` | `/api/allotment/batch-check` | Batch automated allotment check for multiple PANs |
| `GET` | `/api/news` | Curated IPO financial news and market press |

### Authentication & User APIs
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user account with JWT |
| `POST` | `/api/auth/login` | Authenticate user or admin and return token |
| `GET` | `/api/auth/me` | Retrieve currently authenticated user profile |
| `PUT` | `/api/auth/profile` | Update user profile, investor category & broker |

### Admin APIs (Protected: Bearer Token Required)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/analytics` | KPI metrics, total volume, and top gainers |
| `GET` | `/api/admin/ipos` | Complete IPO management catalog |
| `PUT` | `/api/admin/ipos/:id` | Update IPO metadata, dates, or status |
| `POST` | `/api/admin/ipos/:id/gmp` | Manually record or update daily GMP rate |
| `GET` | `/api/admin/users` | List all registered users and KYC statuses |
| `PATCH` | `/api/admin/users/:id/kyc` | Approve or reject a user's KYC verification |
| `POST` | `/api/market-sync/trigger` | Trigger an instant live web crawl across all sources |

---

## 🔐 Environment Configuration

Create a `.env` file in `backend/` with the following variables:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ipoapp

# Security
JWT_SECRET=your_jwt_strong_secret_key_here

# Optional: Cloudinary for User Profile Photo Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Nodemailer for GMP Email Alerts
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## ☁️ Vercel Cloud Deployment Configuration

The repository is configured for native **Vercel Multi-Service Deployment** using root `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "frontend": {
      "root": "frontend",
      "framework": "vite",
      "outputDirectory": "dist",
      "cleanUrls": true,
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    },
    "backend": {
      "root": "backend",
      "framework": "express",
      "entrypoint": "server.js"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)?", "destination": { "service": "backend" } },
    { "source": "/(.*)", "destination": { "service": "frontend" } }
  ]
}
```

### Why this setup guarantees zero 404s:
- **Unified Domain:** Both the React frontend and Express backend run under a single origin (`https://ipo-fullstack-app.vercel.app`), eliminating all CORS friction.
- **Client-Side SPA Routing:** All deep subpaths (`/admin`, `/login`, `/allotment`, `/ipos`) are rewritten internally to `/index.html`, allowing React Router to resolve pages smoothly on all devices.
- **Automatic `404.html` Mirror:** The frontend build script creates a duplicate `dist/404.html` so static CDNs cleanly serve the SPA under any edge conditions.

---

## 👤 Author & Maintainer

**Adarsh Singh**
- **GitHub:** [@adarsh232805](https://github.com/adarsh232805)
- **Project Repository:** [https://github.com/adarsh232805/ipo-fullstack-app](https://github.com/adarsh232805/ipo-fullstack-app)
- **Live Demo:** [https://ipo-fullstack-app.vercel.app](https://ipo-fullstack-app.vercel.app)

---

<div align="center">
Made with ❤️ by <strong>Adarsh Singh</strong> • Star ⭐ the repository if you found this helpful!
</div>
