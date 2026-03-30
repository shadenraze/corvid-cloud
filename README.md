# Corvid Cloud

Virtual pet engine — runs entirely on Cloudflare. No server, no daemon, no setup.

## What This Is

A Cloudflare Worker + Durable Object that runs the [Corvid](https://github.com/shadenraze/corvid) biochemistry engine in the cloud. Your pet ticks every 5 minutes whether you're looking at it or not.

**Features:**
- 🧬 14-chemical biochemistry engine (Creatures-inspired)
- 🧠 Neural network brain with REINFORCE learning
- 🪹 Collection system (shiny words, found objects, sparkle decay)
- ⏰ Automatic ticking via Durable Object alarms
- 📊 REST API for dashboard + MCP integration

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/pet/:id/init` | POST | Create/init pet `{ name, speciesId? }` |
| `/pet/:id/status` | GET | Full pet state |
| `/pet/:id/interact` | POST | Interact `{ action }` (feed/play/talk/pet/poke) |
| `/pet/:id/play` | POST | Play `{ type }` (chase/puzzle/tug/hide/wrestle) |
| `/pet/:id/gift` | POST | Give a gift `{ content, giver? }` |
| `/pet/:id/trade` | POST | Propose trade `{ offering }` |
| `/pet/:id/collection` | GET | List collected items |
| `/pet/:id/tick` | POST | Force a tick |

## Setup

```bash
npm install
npx wrangler dev          # local development
npx wrangler deploy       # deploy to Cloudflare
```

Set `SHARED_SECRET` in wrangler.toml or via dashboard for API auth.

## Dashboard

The `dashboard/` folder is a static HTML/JS frontend. Deploy to Cloudflare Pages or serve locally.

Update `API_URL` and `PET_ID` in `index.html` to point to your worker.

## Architecture

```
Durable Object (Pet)
├── BiochemSystem    — 14 chemicals, 9 reactions, circadian rhythm
├── CrowBrain        — 14→16→8 neural network, REINFORCE learning
├── Collection       — hoarding system, sparkle decay, treasured items
└── SQLite storage   — persistent state across ticks
```

Each pet is a Durable Object instance. The alarm API triggers ticks every 5 minutes. State persists in DO SQLite.

## Species (Planned)

The engine supports species overrides (starting chemistry, word pools, personality voices). Currently defaults to crow behavior. Custom species support coming with the MCP layer.

## MCP Server (Planned)

A lightweight MCP server that wraps this API, so any companion (Claude, OpenClaw, etc.) can interact with your pet.

## Based On

[Corvid](https://github.com/shadenraze/corvid) — Python virtual pet daemon by Raze NotGreg.
Ported to TypeScript for Cloudflare Durable Objects.
