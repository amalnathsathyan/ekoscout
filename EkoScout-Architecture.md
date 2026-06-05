# EkoScout — Perpetual Blockchain Opportunity Research Agent

## Objective

Autonomous AI agent that perpetually scans blockchain ecosystems for builder opportunities — hackathons, grants, accelerator programs, and ecosystem jobs. Displays all findings in a real-time dashboard. Token-gated premium tiers. Self-funds via crypto rails.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  GitHub Actions (Cron)                    │
│         triggers every 6h → free, 2000+ min/mo           │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│              AGENT RUNTIME (Render - Free)                │
│          https://ekoscout.onrender.com                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Scraper  │  │ Scraper  │  │ Analyzer │  │ Notifier│ │
│  │ CMC/Defi │  │ DoraHack │  │ Gemini   │  │ Telegram│ │
│  │ Llama/GC │  │ s/W3Career│  │ Flash    │  │         │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       └──────────────┴─────────────┴──────────────┘     │
│                         ▼                                │
│              ┌─────────────────────┐                     │
│              │   Supabase (Free)   │                     │
│              │   PostgreSQL 500MB  │   ← ⚠ scraper      │
│              │   Realtime + Auth   │     persistence     │
│              └─────────┬───────────┘     not yet wired   │
└────────────────────────┼─────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│          DASHBOARD (Render - Free)                        │
│     https://ekoscout-dashboard.onrender.com              │
│     React 19 + Vite 8 + Tailwind 4 + Supabase WS         │
│                                                          │
│  • Ecosystem universe table (12 demo chains)             │
│  • Featured opportunities horizontal feed                │
│  • Bento-grid live stats (chains, programs, jobs, TVL)   │
│  • Token-gated premium tiers ($EKO)                 │
│  • Solana wallet auth (Phantom)                          │
│  • Telegram community CTA                                │
└─────────────────────────────────────────────────────────┘
```

### Cost: **$0/month** (all free tiers)

---

## Stack — Actual (June 2026)

| Layer | Choice | Status |
|---|---|---|
| **Agent runtime** | **Render** (free web service) | Deployed: `ekoscout.onrender.com` |
| **Cron** | **GitHub Actions** | Configured — triggers `POST /run-scrapers` |
| **Database** | **Supabase** (500MB PostgreSQL) | Schema deployed, tables empty — scraper persistence not wired |
| **Frontend** | **Render** (free static site) | Deployed: `ekoscout-dashboard.onrender.com` |
| **AI** | **Gemini 1.5 Flash** | Free tier (1,500 req/day). Classification + scoring. |
| **x402 payments** | **x402 middleware** (mocked) | Endpoint exists, verification mocked |
| **Token launch** | **Bags.fm** (recommended) | Not yet integrated — see Token section below |
| **Monitoring** | Render native + health ping | `/health` endpoint |

### Stack Changes from Original Plan

| Original | Now | Reason |
|---|---|---|
| Google Cloud Run | Render | Avoid GCP billing; Render free tier sufficient |
| Cloudflare Pages | Render | Single platform for both services |
| clawpump.xyz | Bags.fm | clawpump docs/API inaccessible; Bags.fm has proven traction |
| Discord webhooks | Removed | Commit `5a29ecd` — Telegram only |
| IronClaw TEE | Deferred | IronClaw config exists but not deployed |

---

## Scraper Inventory

### Implemented (5/15)

| Source | Status | What It Collects |
|---|---|---|
| **CoinMarketCap** | Live | All chains ranked by market cap |
| **DefiLlama** | Live | Chain TVL, protocol data |
| **Gitcoin** | Live | Active grant rounds (GraphQL) |
| **DoraHacks** | Skeleton | Page is client-rendered — needs Puppeteer or API reverse-engineering |
| **web3.career** | Basic | Job titles + companies (h2/h3 extraction) |

### Planned (10/15)

| Source | What It Collects |
|---|---|
| CoinGecko | Chain categories, cross-reference |
| Devfolio | Ongoing hackathons, prize pools |
| CryptoRank.io | Fundraising rounds |
| X/Twitter | Grant/hackathon program announcements |
| cryptojobslist.com | Job listings with salary data |
| GitHub | SDK import counts, trending repos |
| Artemis | Developer activity, active addresses |
| L2Beat | L2 stages, TVL, risk profiles |
| Ecosystem Foundation Pages | Direct scrape of grants/careers pages |
| Token Terminal | Revenue, fees, active users |

---

## Critical Gap — Scraper → Supabase Persistence

**Problem:** `runAllScrapers()` in `src/scrapers/index.ts` scrapes data, enriches with Gemini, sends Telegram notifications — but never writes to Supabase. The `chains`, `programs`, and `jobs` tables are empty.

**Fix needed:** After enrichment, upsert chains into `chains` table, programs into `programs` table. This closes the loop:
```
Cron → Scraper → Gemini enrichment → Supabase INSERT → Dashboard realtime update
```

---

## Token Strategy — Bags.fm

### Why Not ClawPump

- `clawpump.tech/docs` is JS-rendered SPA — docs inaccessible
- `clawpump.xyz` domain appears dead
- API endpoints unverified (sourced from third-party descriptions, not official docs)
- No public traction data or success stories
- Unknown reliability for production use

### Why Bags.fm

- **#2 Solana launchpad** by volume (~33% market share, $293M daily)
- **$1B+ trading volume** in 30 days
- **AI agent native**: agent auth, fee-sharing, wallet creation launched Feb 2026
- **1% of trading volume** flows to creator forever (not just swap fees)
- **MCP server**: 16 tools for Claude — launch tokens, manage fees, trade via natural language
- **Gas-free launches**: BagsWorld pays ~0.03 SOL deployment cost
- **Proven earnings**: devs earned $100K-$300K from token trading activity

### $EKO Token Use Case

The token is NOT a meme. It serves concrete utility:

| Tier | Requirement | Access |
|---|---|---|
| **Free** | None | Ecosystem table, basic filters, 24h delayed data, Telegram alerts |
| **Radar** | Hold 1,000 $EKO | Real-time data, top 20 rankings, CSV export, priority Telegram alerts |
| **Alpha** | Hold 10,000 $EKO | Raw API access (x402), custom filters, historical trends, build ideas |
| **Enterprise** | Hold 100,000 $EKO | White-label embed, custom scrapers, priority support, governance vote |

### Revenue Flywheel

```
Scraper finds opportunities → Dashboard attracts builders →
  → Token demand grows (premium access) →
    → Bags.fm trading volume generates revenue →
      → Revenue buys back & burns $EKO →
        → Token value increase attracts more builders
```

Agent uses Bags.fm revenue + x402 API fees to:
1. Pay hosting costs (if ever exceeds free tier)
2. Buy back and burn $EKO
3. Distribute to long-term holders

---

## Token-Gating Implementation (Planned)

1. **Wallet connection**: Phantom wallet via `@solana/wallet-adapter` (already wired in `WalletProvider.tsx`)
2. **Balance check**: On dashboard load, query SPL token balance for connected wallet
3. **Tier mapping**: Balance ≥ 1,000 → Radar tier; ≥ 10,000 → Alpha tier
4. **Conditional rendering**: Premium sections hidden behind `hasToken` check
5. **Backend enforcement**: x402 middleware checks token balance for API access

---

## API Routes

| Route | Auth | Purpose |
|---|---|---|
| `GET /health` | None | Health check for Render + cron monitoring |
| `POST /run-scrapers` | Bearer `CRON_SECRET` | Trigger scraper run (GH Actions cron target) |
| `GET /api/v1/opportunities` | x402 (0.50 USDC) | Premium agent-to-agent API |
| `POST /launch-token` | Bearer `CRON_SECRET` | Launch $EKO via Bags.fm (manual trigger) |
| `GET /earnings` | Bearer `CRON_SECRET` | Query token earnings |

---

## Deployment

### Backend — Render
- **URL**: `https://ekoscout.onrender.com`
- **Build**: `npm run build` (TypeScript → `dist/`)
- **Start**: `npm start` (`node dist/index.js`)
- **Port**: 8080
- **Env vars**: All from `.env` (Render dashboard)

### Dashboard — Render
- **URL**: `https://ekoscout-dashboard.onrender.com`
- **Build**: `npm run build` (Vite → `dist/`)
- **Publish dir**: `dist/`
- **Root dir**: `dashboard/`
- **Env vars**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Cron — GitHub Actions
- **Schedule**: every 6 hours (`0 */6 * * *`)
- **Action**: `curl -X POST $BACKEND_URL/run-scrapers -H "Authorization: Bearer $CRON_SECRET"`
- **Secrets needed**: `BACKEND_URL`, `CRON_SECRET`

---

## Database Schema (Supabase)

Three tables, all with realtime publication enabled:

### `chains`
| Column | Type | Description |
|---|---|---|
| id | UUID PK | Auto-generated |
| name | TEXT UNIQUE | Chain name (e.g., "Solana") |
| category | TEXT | L1, L2, Sidechain, Appchain |
| market_cap_rank | INTEGER | Rank by market cap |
| health_index | NUMERIC | Builder Health Index (0-100) |
| competition_density | NUMERIC | Active builders / opportunity spots |
| tvl | NUMERIC | Total Value Locked in USD |
| dev_count | INTEGER | Estimated active developers |

### `programs`
| Column | Type | Description |
|---|---|---|
| id | UUID PK | Auto-generated |
| chain_id | UUID FK → chains | Parent ecosystem |
| name | TEXT | Program name |
| type | TEXT | grant / hackathon / accelerator |
| funding_amount | TEXT | e.g., "$50K", "Up to $1M" |
| prize_pool | TEXT | For hackathons |
| status | TEXT | active / upcoming / closed |
| deadline | TIMESTAMPTZ | Application deadline |
| link | TEXT | Program URL |

### `jobs`
| Column | Type | Description |
|---|---|---|
| id | UUID PK | Auto-generated |
| chain_id | UUID FK → chains | Parent ecosystem |
| title | TEXT | Job title |
| company | TEXT | Hiring company |
| role_type | TEXT | Engineering, Design, Marketing, etc. |
| salary_range | TEXT | e.g., "$120K-$180K" |
| is_remote | BOOLEAN | Remote-friendly? |
| link | TEXT | Job posting URL |

---

## Builder Health Index Formula

```
Health Index = Dev growth (30d %) × 0.3
             + Protocol growth (30d %) × 0.2
             + TVL growth (30d %) × 0.2
             + Fee growth × 0.15
             + Active address growth × 0.15
```

**Competition Density** = Estimated active builder count / Total grant+hackathon+job spots

**Low-hanging fruit** = High program funding + High job openings + Low competition density + Positive on-chain momentum

---

## Self-Funding Rails

| Rail | Mechanism | Status |
|---|---|---|
| **Bags.fm token** | Launch $EKO on Solana. 1% of trading volume to agent wallet. Token-gate premium features. | Integration planned |
| **x402 pay-per-use API** | Agents pay 0.50 USDC per query on Base. | Middleware built, verification mocked |
| **Grant referral bounties** | Auto-submit referral links to ecosystem programs. | Not built |
| **Sponsored listings** | Protocols pay USDC to boost visibility. | Not built |
| **Telegram premium** | Weekly digest of top opportunities. | Basic notifications live |

---

## Build Progress — MVP Steps

| Step | What | Status |
|---|---|---|
| 1 | Repo scaffold + Dockerfile + CI/CD | Done |
| 2 | Supabase schema + migrations | Done |
| 3 | First 5 scrapers | Done (2 skeleton) |
| 4 | Gemini Flash enrichment | Done |
| 5 | Dashboard with Supabase realtime | Done (demo data) |
| 6 | Token launch integration | Rebuilt for ClawPump → migrate to Bags.fm |
| 7 | x402 API paywall | Done (mocked verification) |
| 8 | Telegram notification webhooks | Done |
| 9 | IronClaw TEE config | Config exists, not deployed |
| 10 | Health check + keep-warm | Done |
| 11 | **Scraper → Supabase persistence** | **NOT DONE — critical gap** |
| 12 | Token-gating UI logic | Wallet connected, balance check missing |

---

## Immediate Next Steps (Priority Order)

1. **Wire scraper → Supabase** — `runAllScrapers()` must upsert chains/programs to DB
2. **Run scraper** — seed real data, replace demo fallback
3. **Migrate token launch** — replace ClawPump with Bags.fm MCP integration
4. **Token-gating logic** — check SPL balance, conditionally render premium UI
5. **Fix DoraHacks + Web3Career scrapers** — proper selectors or API calls
6. **Verify x402 payments** — real on-chain verification, not mock
