<p align="center">
  <a href="https://bitflow-three.vercel.app">
    <img src="./public/bitflow-hero.png" alt="BitFlow Intelligence Terminal" width="100%">
  </a>
</p>

# ⚡ BitFlow | Crypto Intelligence Terminal

<p align="center">
  <i>A high-performance, obsidian-grade dashboard for real-time asset tracking and market intelligence.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Maintained%3F-yes-06b6d4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Build-Success-emerald?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/salonyranjan/BitFlow?style=social" />
  <img src="https://img.shields.io/github/forks/salonyranjan/BitFlow?style=social" />
</p>

## 📋 Table of Contents

1. [🌌 The Intelligence Cockpit](#1-🌌-the-intelligence-cockpit)
2. [🏛️ System Architecture & Data Flow](#2-️-system-architecture--data-flow)
3. [🔄 Data Interaction Model](#3-🔄-data-interaction-model)
4. [🛠️ Tech Stack & Ecosystem](#4-️-tech-stack--ecosystem)
5. [📦 Installation & Setup](#5-📦-installation--setup)
6. [🚀 Deployment](#6-🚀-deployment)
7. [🤝 Contributing](#7-🤝-contributing)
8. [👤 Author](#8-👤-author)
9. [⭐️ Show your support](#9️-show-your-support)

---

## 1. 🌌 The Intelligence Cockpit

BitFlow is a premium cryptocurrency terminal designed for the "Obsidian Hours." It transforms complex market data into a clean, actionable visual experience through optimized glassmorphism and prioritized data hierarchy.

### ✨ Key Features

* **⚡ Real-Time Tracking**: Integrated with WebSockets for zero-latency trade streams and live "Pulse" indicators.
* **📈 Institutional Charting**: Custom TradingView-grade candlestick charts for deep historical price analysis.
* **📂 Sector Intelligence**: Macro views across Layer 1s, Smart Contract Platforms, and Stablecoin dominance.
* **🌓 Midnight Neon UX**: A specialized dark-mode interface using `backdrop-blur` and cyan neon accents to reduce eye strain.
* **📱 Precision Responsive**: A unified experience across ultra-wide monitors and mobile devices.

---

## 2. 🏛️ System Architecture & Data Flow

<p align="center">
  <img src="./public/architecture-flow.png" alt="BitFlow Technical Architecture Diagram" width="100%">
</p>

### 🏗 Component Mapping

```bash
BitFlow/
├── 🌑 app/                     # Next.js App Router (The Core Engine)
│   ├── 💎 coins/               # Market Directory & List Logic
│   │   └── 🚀 [id]/            # Dynamic Intelligence Terminals
│   ├── 📜 layout.tsx           # Global Root Layout & Providers
│   └── 🏠 page.tsx             # Home Dashboard Entry
│
├── 🎨 components/              # Atomic UI Modules (Neon & Glassmorphism)
│   ├── 🏠 home/                # Landing Page Intelligence
│   │   ├── 📊 Categories.tsx   # Sector Performance Mapping
│   │   ├── 📈 CoinOverview.tsx # Macro Market Snapshots
│   │   └── 🔥 TrendingCoins.tsx# Real-time Asset Radar
│   │
│   ├── 🔌 ui/                  # System-Wide UI Primitives (Shadcn/UI based)
│   │   ├── 🛡️ badge.tsx, button.tsx, input.tsx
│   │   ├── 🕯️ CandlestickChart # High-Density Visual Logic
│   │   ├── 🔄 Converter.tsx    # Instant Liquidity Bridging
│   │   └── 📡 LiveDataWrapper  # WebSocket Handshake & Streams
│   │
│   └── 📑 DataTable.tsx, Header.tsx, CoinsPagination.tsx
│
├── 🪝 hooks/                   # Custom Intelligence Hooks
│   └── 🔗 useCoinGeckoWS.ts    # Real-time WebSocket Logic
│
├── 🛠️ lib/                     # Back-End Pulse & Utilities
│   ├── ⚡ coingecko.actions.ts  # Server Actions & API Fetchers
│   └── 🧼 utils.ts              # Currency Formats & Style Merging
│
├── 📁 public/                  # Static Branding & Manifests
│   ├── 🖼️ bitflow-hero.png     # Terminal Preview Hero
│   ├── 🏷️ favicon-96x96.png    # High-DPI Brand Icon
│   └── 📜 site.webmanifest     # PWA & Web Metadata
│
└── ⚙️ Configuration & Metadata
    ├── 🟦 tailwind.config.ts    # Custom Neon Glow Tokens
    ├── 📦 components.json       # UI Component Registry
    └── 📜 LICENSE               # Project MIT Licensing
```

### 🏗 Project Architecture Mermaid Diagram

```mermaid
graph TD
    U[👤 USER] -->|1. Views/Interacts| APP
    APP[🌑 Next.js App Router]
    
    APP -->|Renders| P_HOME[🏠 HOME PAGE - app/page.tsx]
    APP -->|Renders| P_COINS[💎 COINS - app/coins/page.tsx]
    APP -->|Dynamic Route| P_ID[🚀 COIN ID - app/coins/id/page.tsx]

    SEC[🛠️ LIB - lib/coingecko.actions.ts]
    CG[🔌 COINGECKO DEMO API]
    
    P_HOME -.->|Fetch| SEC
    P_COINS -.->|Fetch| SEC
    P_ID -.->|Fetch| SEC
    SEC ==>|Secure Request| CG
    CG ==>|Response| SEC

    COMP[🎨 COMPONENTS]
    P_HOME -->|Utilizes| C_H[🏠 home sub-folder]
    C_H --> CTG[📊 Categories]
    C_H --> COV[📈 CoinOverview]
    C_H --> TRD[🔥 TrendingCoins]
    
    P_ID -->|Utilizes| C_UI[🔌 ui sub-folder]
    C_UI --> CSC[🕯️ CandlestickChart]
    C_UI --> CONV[🔄 Converter]
    C_UI --> LDW[📡 LiveDataWrapper]

    HOOKS[🪝 HOOKS]
    HOOKS ==>|Established| WS_UPLINK(Persistent WebSocket Link)
    CSC -->|Subscribes| HOOKS
    LDW -->|Subscribes| HOOKS
    HOOKS --> UCG[🔗 useCoinGeckoWS.ts]
    
    STYLE[🟦 TAILWIND CSS]
    COMP -.-> STYLE
    APP -.-> STYLE
    
    classDef main fill:#030303,stroke:#333,stroke-width:1px,color:#fff;
    classDef process fill:#111,stroke:#06b6d4,stroke-width:1.5px,color:#fff;
    classDef data fill:#111,stroke:#0f172a,stroke-width:1px,color:#666,stroke-dasharray: 5 5;
    classDef external fill:#111,stroke:#38b2ac,stroke-width:2px,color:#fff,stroke-dasharray: 5 5;
    
    class U main;
    class APP,P_HOME,P_COINS,P_ID,COMP,C_H,C_UI,HOOKS,CSC,CONV,LDW,CTG,COV,TRD,SEC process;
    class STYLE data;
    class CG external;
```

---

## 3. 🔄 Data Interaction Model

BitFlow employs a specialized **Dual-Sync** data architecture to ensure low-latency market intelligence without sacrificing server-side security.

### 🌓 The Hybrid Fetching Strategy

By splitting data acquisition between server and client, BitFlow achieves "Zero-Lag" perception while maintaining absolute security for API credentials.

### 🧩 Data Interaction Matrix

| Channel | Method | Primary Intelligence | Update Frequency |
|---------|--------|---------------------|------------------|
| **Server-Side** | `Next.js Server Actions` | Market Cap, Rank, & Global Metadata | 60s (Revalidation) |
| **REST Bridge** | `Axios / Fetch` | High-Density Historical Chart Data | On-Demand / Swap |
| **Live Uplink** | `WebSockets (WS)` | Instant Price Shifts & Trade Order Flows | Real-Time (<100ms) |

### 🛠 The Data Lifecycle (Sequence)

```mermaid
sequenceDiagram
    autonumber
    participant B as Client Browser
    participant S as Next.js Server
    participant API as CoinGecko API
    participant WS as WebSocket Feed

    Note over B, S: Phase 1: Security & Speed
    B->>S: Request /coins/[id]
    S->>API: Secure Fetch (Server-Side)
    API-->>S: Data Payload (Metadata)
    S-->>B: Rendered Page Shell (LCP)

    Note over B, WS: Phase 2: Live Hydration
    B->>WS: useCoinGeckoWS Handshake
    WS-->>B: Price & Order Stream
    B->>B: Neon Pulse UI Update
```

### 📊 Data Flow Diagram (DFD)

```mermaid
graph LR
    API((🔌 CoinGecko API))

    subgraph Server_Engine ["🌑 SERVER-SIDE (Next.js Actions)"]
        direction TB
        SEC[🛠️ lib/coingecko.actions]
        PROXY{🔐 Secure Proxy}
        PARSE[🧹 Data Sanitization]
    end

    subgraph Client_Terminal ["🎨 CLIENT-SIDE (React Hydration)"]
        direction TB
        UI[💻 Dashboard UI]
        HOOKS[🪝 useCoinGeckoWS]
        WS_STREAM(📡 WebSocket Stream)
    end

    API ==>|Raw Data| SEC
    SEC --> PROXY
    PROXY -->|Clean JSON| PARSE
    PARSE ==>|Initial Props| UI
    
    UI -->|Handshake| HOOKS
    WS_STREAM ==>|Live Tickers| HOOKS
    HOOKS ==>|Real-time Pulse| UI

    classDef api fill:#000,stroke:#38b2ac,stroke-width:4px,color:#fff;
    classDef server fill:#1e1b4b,stroke:#a855f7,stroke-width:2px,color:#fff;
    classDef client fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef flow fill:#111,stroke:#06b6d4,stroke-width:2px,color:#fff;

    class API api;
    class SEC,PROXY,PARSE server;
    class UI,HOOKS,WS_STREAM client;
    class Server_Engine flow;
    class Client_Terminal flow;
```

---

## 4. 🛠️ Tech Stack & Ecosystem

BitFlow is engineered with **Type-Safety**, **Real-Time Performance**, and **Obsidian Aesthetics**.

### 🌑 The Core Engine
<p align="left">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
</p>

### 📡 Data & Intelligence
* **External API**: [CoinGecko Terminal API](https://www.coingecko.com/en/api)
* **Real-Time Uplink**: Native **WebSockets** for zero-latency sync
* **Server Logic**: **Next.js Server Actions** for secure data fetching
* **State Management**: React **Hooks** (`useContext`, `useReducer`)

### 🎨 Design Language (Obsidian Neon)
* **Framework**: [Shadcn/UI](https://ui.shadcn.com/)
* **Animation**: [Lucide React](https://lucide.dev/)
* **Glassmorphism**: Custom **Tailwind CSS** extensions
* **Charts**: Optimized **Canvas/SVG** rendering

### ⚡ Ecosystem Capabilities

| Capability | Tech Implementation | Benefit |
|------------|-------------------|---------|
| **Type Integrity** | TypeScript Interfaces | Zero-runtime errors |
| **Performance** | Next.js Turbopack | **3.0s Production Builds** |
| **Security** | Environment Proxy | API keys server-side only |
| **Responsiveness** | Mobile-First Grid | 4K to mobile displays |

**System Status**: 🟢 Optimized for **Next.js 15** & **React 19**.

---

## 5. 📦 Installation & Setup

### 1️⃣ Prerequisites
* **Node.js 18.x** or higher
* **npm** or **pnpm**
* [CoinGecko API Key](https://www.coingecko.com/en/api/pricing)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/salonyranjan/BitFlow.git
cd BitFlow
```

### 3️⃣ Install Dependencies
```bash
npm install
# or
pnpm install
```

### 4️⃣ Environment Configuration
Create `.env.local`:
```env
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=your_secret_api_key_here
```

### 5️⃣ Launch Development Server
```bash
npm run dev
```
🚀 Open [http://localhost:3000](http://localhost:3000)

---

## 6. 🚀 Deployment

### ☁️ Vercel (Recommended)
1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### 🐳 Manual Production
```bash
npm run build
npm start
```

---

## 7. 🤝 Contributing

1. **Fork** the Project
2. **Create Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** (`git commit -m 'feat: Add AmazingFeature'`)
4. **Push** (`git push origin feature/AmazingFeature`)
5. **Pull Request**

### 🛠️ Development Areas
* **AI Integration**: Sentiment analysis for social feeds
* **UI/UX**: More neon glassmorphism variants
* **Performance**: WebSocket optimization

---

## 8. 👤 Author

**Salony Ranjan**  
*Full-Stack Developer & AI Engineer*

<p align="left">
  <a href="https://www.linkedin.com/in/salony-ranjan-b63200280/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://github.com/salonyranjan">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="mailto:salonyranjan@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>

---

## 9. ⭐️ Show your support

<p align="center">
  <img src="https://img.shields.io/badge/Designed%20With-⚡-06b6d4?style=for-the-badge" />
  <br>
  <i>"Building high-performance intelligence terminals for the decentralized future."</i>
</p>

---
