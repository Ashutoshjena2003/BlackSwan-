# AlphaSignal — AI Investment Intelligence Platform

A full-stack investment analysis app powered by a multi-agent AI system (Fundamental, Sentiment, Risk, Black Swan agents) with live market data.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI | Anthropic Claude API (with web search) |
| Market Data | Yahoo Finance (yfinance via Python) / Alpha Vantage |
| Styling | Plain CSS (no framework needed) |

---

## Folder Structure

```
alphasignal/
├── README.md
├── frontend/                  # React app (Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── SearchBar.jsx
│       │   ├── MarketDataRow.jsx
│       │   ├── AgentCard.jsx
│       │   ├── AgentsGrid.jsx
│       │   ├── DecisionPanel.jsx
│       │   ├── BlackSwanBanner.jsx
│       │   ├── AnalysisGrid.jsx
│       │   └── LoadingSkeleton.jsx
│       ├── hooks/
│       │   └── useAnalysis.js
│       ├── services/
│       │   └── api.js
│       └── utils/
│           └── formatters.js
└── backend/                   # Node.js + Express API
    ├── package.json
    ├── .env.example
    ├── server.js
    ├── middleware/
    │   └── errorHandler.js
    ├── routes/
    │   └── analysis.js
    └── services/
        ├── marketData.js
        ├── fundamentalAgent.js
        ├── sentimentAgent.js
        ├── riskAgent.js
        ├── blackSwanAgent.js
        └── cioAgent.js
```

---

## Setup Instructions

### Step 1 — Get API Keys

1. **Anthropic API Key** → https://console.anthropic.com
   - Create account → API Keys → Create key
   - Copy it (starts with `sk-ant-...`)

2. **Alpha Vantage API Key** (free) → https://www.alphavantage.co/support/#api-key
   - Enter email → get free key instantly
   - Free tier: 25 requests/day (enough for dev)

### Step 2 — Backend Setup

```bash
cd alphasignal/backend
npm install
cp .env.example .env
# Edit .env and add your API keys
npm run dev
```

Backend runs on http://localhost:3001

### Step 3 — Frontend Setup

```bash
cd alphasignal/frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### Step 4 — Open the app

Visit http://localhost:5173 in your browser.
Type any company name (Apple, Tesla, NVIDIA) and click Analyze.

---

## Environment Variables (backend/.env)

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
ALPHA_VANTAGE_KEY=your-alpha-vantage-key
PORT=3001
```

---

## How the Agents Work

```
User Input (company name)
        ↓
  Market Data Service  ←── Alpha Vantage API (price, financials)
        ↓
  ┌─────────────────────────────────────┐
  │  Fundamental Agent  (P/E, revenue)  │
  │  Sentiment Agent    (news, social)  │  ← All call Claude API with web search
  │  Risk Agent         (risk factors)  │
  └─────────────────────────────────────┘
        ↓
  Black Swan Detector  (anomaly check)
        ↓
  CIO Ensemble Agent   (final decision)
        ↓
  BUY / HOLD / SELL + confidence + target price
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/analyze | Full analysis (all agents) |
| GET | /api/market/:ticker | Raw market data only |
| GET | /api/health | Health check |
