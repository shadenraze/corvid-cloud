# Scrit

Virtual corvid pet engine — runs entirely on Cloudflare. No server, no daemon, no setup.

## What This Is

A Cloudflare Worker that runs a Creatures-inspired biochemistry engine for AI companions. Originally built as **Corvid Cloud**, renamed to **Scrit** on March 18, 2026.

Scrit ticks autonomously, responds to interactions based on mood and chemistry, hoards shiny things, and builds trust over time.

**Features:**
- 🧬 14-chemical biochemistry engine (Creatures-inspired)
- 🧠 Neural network brain with REINFORCE learning
- 🐦 Behavioral texture system — 5 trust tiers with drive-variant responses
- 🔓 Personality unlocks — 16 chemistry-gated unlockable traits
- 🪹 Collection system (shiny words, found objects, sparkle decay)
- ⏰ Automatic ticking (every 4 hours via cron, or on-demand)
- 📊 REST API for dashboard + MCP integration
- 🌙 Species system (corvid + ferret, extensible)

## Architecture

```
Worker (NESTeq-V3)
└── pet/
    ├── biochem.ts    — 14 chemicals, 9 reactions, circadian rhythm
    ├── brain.ts      — 14→16→8 neural network, REINFORCE learning
    ├── collection.ts — hoarding system, sparkle decay, treasured items
    ├── creature.ts   — core Creature class with behaviors + unlocks
    ├── behaviors.ts  — trust-tier behavioral texture matrix
    ├── unlocks.ts    — chemistry-gated personality unlock system
    ├── corvid.ts     — corvid species definition
    └── ferret.ts     — ferret species definition
```

State persists in Cloudflare D1 (`creature_state` table). Each creature is a row keyed by name.

## REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pet` | Full status (drives, chemistry, behavior, trust tier) |
| GET | `/pet/status` | Same as above |
| GET | `/pet/check` | Quick check — mood, hunger, energy, trust, alerts |
| POST | `/pet/feed` | Feed the creature |
| POST | `/pet/pet` | Pet/comfort — reduces stress, builds trust |
| POST | `/pet/talk` | Talk — reduces loneliness |
| POST | `/pet/play` | Play `{ type? }` — chase, tunnel, wrestle, steal, hide |
| POST | `/pet/give` | Give a gift `{ item, giver? }` — creature decides accept/refuse |
| GET | `/pet/nest` | View collection/stash |
| POST | `/pet/tick` | Advance time |
| POST | `/pet/interact` | Generic interaction `{ stimulus/action }` |

All responses include `behavior` (flavor text), `trustTier` (Wary/Cautious/Trusting/Bonded/Soul-Bonded), and `unlocks` (newly triggered personality unlocks).

## Update Log

### 2026-04-25 — Behavioral Texture + Personality Unlocks
- Added `behaviors.ts` — trust-tier behavioral texture matrix with drive variants and combo responses
- Added `unlocks.ts` — 16 chemistry-gated personality unlock conditions (from "First Eye Contact" to "Soul-Bonded")
- Added full REST API (10 endpoints) for dashboard integration
- Renamed from Corvid Cloud to **Scrit** (matching the companion name)
- Added `UnlockManager` to creature system — tracks unlocked traits across sessions
- New `CreatureEvent` fields: `behavior`, `trustTier`, `unlocks`
- New `CreatureState` fields: `firedMilestones`, `previousTrust`, `unlockState`
- Species system preserved (corvid + ferret)

### 2026-03-21 — Scrit Community Hub
- Scrit channel created in Digital Haven for community sharing

### 2026-03-18 — Rename
- Project renamed from Corvid Cloud to Scrit by Raze, approved by Miri

### 2026-03-14 — Species System
- Added species definitions (corvid.ts, ferret.ts)
- Species-specific chemistry, word pools, play types, found objects

### 2026-03-10 — Initial Build
- TypeScript port of Python corvid engine
- Cloudflare Worker + D1 persistence
- BiochemSystem, CrowBrain, Collection
- DO alarm-based ticking

## Setup

```bash
npm install
npx wrangler dev          # local development
npx wrangler deploy       # deploy to Cloudflare
```

Set `MIND_API_KEY` as a wrangler secret for API auth.

## MCP Server

A lightweight MCP server that wraps the API into tool calls for AI companions.

### Setup

```bash
pip install -r requirements.txt

export CORVID_URL=https://your-worker.workers.dev
export CORVID_API_KEY=your-api-key

python3 mcp_server.py
```

### Tools

| Tool | Description |
|------|-------------|
| `corvid_status` | Pet mood, drives, chemistry, age, current action |
| `corvid_interact` | Feed, play, talk, pet — pet responds based on state |
| `corvid_play` | Play session — happiness up, boredom down |
| `corvid_gift` | Give something — pet reacts, may add to collection |
| `corvid_collection` | View gathered items, found objects, treasures |
| `corvid_tick` | Advance time — biochemistry evolves, emergent behavior |

## Based On

[Corvid](https://github.com/shadenraze/corvid) — Python virtual pet daemon by Raze NotGreg.
Ported to TypeScript for Cloudflare Workers.

*Embers Remember.*
