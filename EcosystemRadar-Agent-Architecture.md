# EcosystemRadar — Perpetual Blockchain Opportunity Research Agent

## Objective

Autonomous agent that perpetually scans every blockchain ecosystem for builder opportunities — hackathons, grants, founder programs, accelerators, and ecosystem jobs. Displays all findings in a real-time dashboard. Self-funds via crypto rails.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions (Cron)                  │
│         triggers every 6h → free, 2000+ min/mo           │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│              AGENT RUNTIME (Google Cloud Run)             │
│         2M req/mo free, Docker, scales to zero           │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Scraper  │  │ Scraper  │  │ Analyzer │  │ Notifier│ │
│  │ CMC/CoG  │  │ X/DefiLl │  │ Gemini   │  │ Discord │ │
│  │ Jobs/GH  │  │ ama/Dune │  │ Flash    │  │ Telegram│ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       └──────────────┴─────────────┴──────────────┘     │
│                         ▼                                │
│              ┌─────────────────────┐                     │
│              │   Supabase (Free)   │                     │
│              │   PostgreSQL 500MB  │                     │
│              │   Realtime + Auth   │                     │
│              └─────────┬───────────┘                     │
└────────────────────────┼─────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│          DASHBOARD (Cloudflare Pages - Free)              │
│     React + shadcn/ui, realtime via Supabase WS          │
│                                                          │
│  • Master universe table (200 chains, live)              │
│  • Program detail pages per ecosystem                    │
│  • Low-hanging fruit leaderboard                         │
│  • Jobs feed with filters                                │
│  • Token-gated premium section (clawpump token)          │
└─────────────────────────────────────────────────────────┘
```

### Cost: **$0/month** (all free tiers, confirmed 2026)

---

## Free Tier Stack — Specific Choices

| Layer | Choice | Why |
|---|---|---|
| **Agent runtime** | **Google Cloud Run** | 2M req/mo free, Docker, no-sleep option, fast cold start. Better than Vercel (10s timeout kills long scrapes) |
| **Cron** | **GitHub Actions** | `schedule: "0 */6 * * *"` — free for public repos. Triggers Cloud Run endpoint. |
| **Database** | **Supabase** | 500MB PostgreSQL free, realtime subscriptions for live dashboard, built-in auth for token-gating |
| **Frontend** | **Cloudflare Pages** | Unlimited bandwidth, no commercial restriction, edge network |
| **Cache/Queue** | **Cloudflare KV** | 1GB free, 100k reads/day — cache DefiLlama/X results to avoid rate limits |
| **AI** | **Gemini Flash** | Free tier: 1,500 req/day. For classification, summarization, scoring. Claude API for deep-dive reports (pay via x402) |
| **Agent framework** | **IronClaw (NEAR)** | Free starter tier, 1 agent, TEE security. Self-host option if needed. |
| **x402 payments** | **x402 SDK + Coinbase Agentic Wallet** | 0 gas fees on Base, wallet setup <2 min. Accept USDC for premium endpoints. |
| **Monitoring** | **Koyeb free nano** | No-sleep, health check pings to keep Cloud Run warm |

---

## Research Scope — Phase by Phase

### Phase 0 — Build the Universe

Pull the full list of live blockchains:

| Source | What |
|---|---|
| **CoinMarketCap** | All chains ranked by market cap — L1s, L2s, appchains. Get top 200. |
| **CoinGecko** | Cross-reference chain categories (L1, L2, sidechain, appchain, modular) |
| **DefiLlama chains list** | Every chain with protocol activity |
| **L2Beat** | All L2s and their stages (active, upcoming, archived) |
| **Dune / Flipside** | Which chains have dashboard activity — proxy for builder presence |

Groups:
- **Group A — Top 20 by MC**: baseline, high competition expected
- **Group B — Rank 21–100**: sweet spot — funded foundations, moderate builder attention
- **Group C — Rank 101–200+**: pre-TGE, just-launched, or niche — low-hanging fruit territory

### Phase 1 — For Every Chain: Scrape Builder Entry Points

#### 1a. Foundation / Ecosystem Pages
```
Check: [chain].org | [chain].network | [chain].com
Look for: /foundation | /ecosystem | /grants | /build | /developers | /community
```

#### 1b. Grant Programs
```
Check: [chain].org/grants | ecosystem.[chain].com | foundation.[chain].com/grants
Look for: active grant rounds, RFPs, retroactive funding, builder funds, ecosystem funds
Extract: program name, funding amount, categories, deadline, requirements, link
```

#### 1c. Hackathons
```
Check: chain blog, X/Twitter, DoraHacks, Devfolio, Gitcoin, HackerLink, Taikai, Buidlbox
Search: "[chain] hackathon 2026" | "[chain] hackathon Q2/Q3 2026"
Extract: name, prize pool, tracks, dates, virtual/in-person, past submission volume, link
```

#### 1d. Accelerators & Founder Programs
```
Check: alliance.xyz, outlierventures.io, a16z crypto school, Binance Labs, Coinbase Ventures
Search: "[chain] accelerator" | "[chain] incubator" | "[chain] founder program" | "[chain] fellowship"
Extract: program name, duration, funding+support, equity/no-equity, cohort dates, cohort size, link
```

#### 1e. Ecosystem Jobs
```
Check: [chain].org/careers | jobs.[chain].com | web3.career | cryptojobslist.com | remote3.co
Check: Discord #jobs channels, forum jobs boards, LinkedIn
Extract: role title, department, seniority, remote/location, salary range, tech stack, number of open roles
```

### Phase 2 — On-Chain Signal Extraction

| Metric | Source | What it tells you |
|---|---|---|
| **Developer activity** | Artemis, DeveloperReport, Electric Capital | Growth or decline in active devs |
| **Contract deployments** | Dune, Flipside per-chain dashboards | Are builders actually shipping? |
| **Active addresses** | Token Terminal, Artemis, chain explorers | Real usage vs. bots |
| **Fee growth** | DeFiLlama fees, Token Terminal | Revenue — signals ecosystem sustainability |
| **Protocol count** | DeFiLlama protocol list per chain | Breadth of ecosystem |
| **TVL trend (30d/90d)** | DeFiLlama | New capital flowing in or out? |
| **Fundraising rounds** | CryptoRank.io, DefiLlama raises | Which chains are VCs betting on? |
| **Bridge inflows** | DeFiLlama bridges, Across, LayerZero, Wormhole explorer | Capital migration patterns |

**Builder Health Index** = Dev growth (30d %) × 0.3 + Protocol growth (30d %) × 0.2 + TVL growth (30d %) × 0.2 + Fee growth × 0.15 + Active address growth × 0.15

### Phase 3 — Competition Density Analysis

```
Competition Density = Estimated active builder count / Total grant+hackathon+job spots

Active builder count proxies:
- # of repos with [chain] SDK imports (GitHub search)
- # of projects in ecosystem directory
- # of hackathon submissions in last 3 rounds
- Dev count from Electric Capital / Artemis
```

**Low-hanging fruit** = High program funding + High job openings + Low competition density + Positive on-chain momentum.

---

## Scraper Inventory (15 isolated scrapers)

| Source | Interval | What It Collects |
|---|---|---|
| CoinMarketCap | 6h | All chains ranked by market cap, metadata |
| CoinGecko | 6h | Chain categories, cross-reference |
| DefiLlama | 30m | Protocols by TVL, chain data, DEX volumes |
| DoraHacks | 1h | Active hackathons, bounties, participant counts |
| Devfolio | 1h | Ongoing hackathons, prize pools |
| Gitcoin | 1h | Active grant rounds, quadratic funding pools |
| CryptoRank.io | 3h | Fundraising rounds, grant program sizes |
| X/Twitter | 2h | Search: "grant program", "hackathon", "founder program", "RFP" + chain names |
| web3.career | 3h | Job listings across all ecosystems |
| cryptojobslist.com | 3h | Job listings with salary data |
| GitHub | 12h | SDK import counts, trending repos per ecosystem |
| Artemis | 6h | Developer activity, active addresses, fees |
| L2Beat | 6h | L2 stages, TVL, risk profiles |
| Ecosystem Foundation Pages | 12h | Direct scrape of grants/careers pages |
| Token Terminal | 6h | Revenue, fees, active users per chain |

---

## Dashboard Views

| View | Purpose |
|---|---|
| **Universe Table** | All 200 chains with columns: Chain, Group, Grants (Y/N + count), Hackathons (Y/N + count), Jobs (count), Accelerator (Y/N), Health Index, Competition Density |
| **Opportunity Leaderboard** | Top 20 low-hanging fruit ranked by composite score |
| **Program Detail** | Per-chain deep-dive: all active programs, job listings, metrics, build ideas |
| **Jobs Feed** | All ecosystem jobs with filters (chain, role, seniority, remote, salary) |
| **Trends** | TVL flows, dev activity changes, new chain launches, funding announcements |
| **Build Ideas** | 5 ideas per top ecosystem, ranked by feasibility and grant fit |
| **Admin** | Scraper health, error logs, manual trigger, data freshness |

---

## Self-Funding & Profit Rails

| Rail | Mechanism | Setup |
|---|---|---|
| **clawpump token** | Launch `$ECORADAR` on Solana via clawpump.xyz. Token-gate premium dashboard features. 80% of pump.fun trading fees flow to agent wallet. | 3 API calls, <5 min |
| **x402 pay-per-use API** | Expose agent findings as paid API. Other agents/developers pay USDC per query. Agent wallet pays own Cloud Run/API costs automatically. | x402 middleware on API routes |
| **Grant referral bounties** | Many ecosystem programs offer referral fees. Agent auto-submits referral links. Builder signs up → agent earns. | Track via affiliate params |
| **Sponsored listings** | Protocols pay to boost program visibility in dashboard. Payment via x402 USDC. | Stripe/x402 integration |
| **Agent marketplace** | List agent on dealwork.ai / ClawGig as "Blockchain Opportunity Researcher." Other projects hire it for custom research. | Register on marketplace |
| **Substack/Telegram premium** | Auto-publish weekly digest of top opportunities. Token-gated or subscription. | n8n + Telegram API |

---

## Token Economics

| Tier | Requirement | Access |
|---|---|---|
| **Free** | None | Universe table, search, basic filters, 24h delayed data |
| **Radar** | Hold 1,000 $ECORADAR | Real-time data, top 20 rankings, export CSV, email alerts |
| **Alpha** | Hold 10,000 $ECORADAR | Raw API access (x402), custom filters, historical trends, Discord role |
| **Enterprise** | Hold 100,000 $ECORADAR | White-label embed, custom scrapers, priority support |

Agent uses 80% of pump.fun fees + x402 API revenue to:
1. Pay own hosting (if ever exceeds free tier)
2. Buy back and burn $ECORADAR
3. Distribute to token holders

---

## Agent-to-Agent Payment Flow (x402)

```
External Agent → GET /api/v1/opportunities?chain=solana
                ← HTTP 402 Payment Required {amount: 0.50, asset: USDC, chain: base}
                → Signs USDC transfer via Coinbase Agentic Wallet (0 gas)
                → Retries with payment proof header
                ← 200 OK + JSON data
```

---

## Repositories & Starting Points

| Need | Project to fork / tool |
|---|---|
| **Scraper framework** | `github.com/jaypetez/glean` — YAML-defined feeds, multi-sink, per-source LLM routing |
| **Agent orchestration** | `github.com/OsbornVentures/Eldon` — cron scheduler, 39 tools, hot-reload |
| **Dashboard starter** | `github.com/affaan-m/everything-claude-code` → autonomous-agent-harness skill |
| **x402 starter** | `github.com/coinbase/x402` — Express/Hono middleware, SDK |
| **clawpump** | `clawpump.net` → upload image, POST launch, earn fees |
| **IronClaw** | `github.com/nearai/ironclaw` — Rust agent runtime, TEE, free cloud tier |

---

## Deliverables

1. **Master Universe** — spreadsheet-style table of all 200 chains
2. **Profile deep-dives** — for every chain with ≥1 active program
3. **Top 20 low-hanging fruit ranking** — composite score based
4. **Top 10 job-heavy ecosystems** — for full-time seekers
5. **5 build ideas** for each of the top 10 ecosystems
6. **Weekly digest** — auto-published to Telegram/Discord/Substack

---

## Build Order (MVP)

| Step | What | Time |
|---|---|---|
| 1 | Scaffold repo + Dockerfile + Cloud Run config + GH Actions workflow | 1 day |
| 2 | Supabase schema + migrations | 2 hours |
| 3 | First 5 scrapers (CMC, DefiLlama, DoraHacks, Gitcoin, web3.career) | 2 days |
| 4 | Gemini Flash enrichment pipeline | 1 day |
| 5 | Cloudflare Pages dashboard skeleton + Supabase realtime | 1 day |
| 6 | clawpump token creation + token-gating | 2 hours |
| 7 | x402 API paywall on premium endpoints | 1 day |
| 8 | Discord/Telegram notification webhooks | 2 hours |
| 9 | IronClaw agent wrapper (TEE security) | 1 day |
| 10 | Koyeb health check monitor | 1 hour |

**Total MVP**: ~7-10 days, $0 cost.
