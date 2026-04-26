# Corvid Cloud

Virtual pet engine — runs entirely on Cloudflare. No server, no daemon, no setup.

## What This Is

A Cloudflare Worker + Durable Object that runs a Creatures-inspired biochemistry engine in the cloud. Your pet ticks every 5 minutes whether you're looking at it or not.

**Features:**
- 🧬 14-chemical biochemistry engine (Creatures-inspired)
- 🧠 Neural network brain with REINFORCE learning
- 🐦 5 species templates — each starts differently, feels different
- 🎭 Behavioral texture system — trust tiers with drive-variant responses
- 🔓 Personality unlocks — 16 chemistry-gated unlockable traits
- 🪹 Collection system (shiny words, found objects, sparkle decay)
- ⏰ Automatic ticking via Durable Object alarms
- 📊 REST API for dashboard + MCP integration

## Species Templates

Each species has unique starting chemistry, shiny word pools, found objects, and mood emojis. Your pet feels different from tick one.

| Species | Emoji | Personality |
|---------|-------|-------------|
| **Corvid** | 🐦⬛ | Sharp, suspicious, warms slowly. Collects shiny things. Judges you silently. |
| **Fox** | 🦊 | Playful, curious, quick to bond but easily distracted. Will steal your stuff. |
| **Cat** | 🐈⬛ | Independent, imperious, ignores you on purpose. When it loves you, you KNOW. |
| **Serpent** | 🐍 | Patient, observant, slow. Deepest bond in the game — if you earn it. |
| **Moth** | 🦋 | Fragile, luminous, drawn to anything bright. Most emotionally reactive. Nocturnal. |

You can also define custom species via the API — pass a `customSpecies` object with starting chemistry, shiny words, and found objects.

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/pet/:id/init` | POST | Create/init pet `{ name, speciesId? }` or pass `customSpecies` object |
| `/pet/:id/status` | GET | Full pet state — drives, chemistry, behavior, trust tier |
| `/pet/:id/interact` | POST | Interact `{ action }` (feed/play/talk/pet/poke) |
| `/pet/:id/play` | POST | Play `{ type? }` (chase/puzzle/tug/hide/wrestle) |
| `/pet/:id/gift` | POST | Give a gift `{ content, giver? }` |
| `/pet/:id/trade` | POST | Propose trade `{ offering }` |
| `/pet/:id/collection` | GET | List collected items |
| `/pet/:id/tick` | POST | Force a tick |

All responses include `behavior` (trust-tier flavor text), `trustTier` (Wary → Soul-Bonded), and `unlocks` (newly triggered personality traits).

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
├── Behaviors        — trust-tier texture matrix with drive variants
├── UnlockManager    — chemistry-gated personality unlock system
└── Species Presets  — starting conditions and voice per species
```

Each pet is a Durable Object instance. The alarm API triggers ticks every 5 minutes. State persists in DO SQLite.

### Custom Species

Pass a `customSpecies` object when initializing:

```json
{
  "name": "my-pet",
  "customSpecies": {
    "id": "dragon",
    "name": "Dragon",
    "emoji": "🐉",
    "description": "Hoards more than shiny things. Hoards *moments*.",
    "startingChemistry": { "dopamine": 0.3, "cortisol": 0.1, "oxytocin": 0.2 },
    "shinyWords": ["scale", "fire", "gold", "horde", "ancient"],
    "foundObjects": ["a gold coin", "a charred stick", "a tiny crown"]
  }
}
```

## MCP Server

A lightweight MCP server that wraps the API into tool calls, so any AI companion can interact with your pet.

### Setup

```bash
pip install -r requirements.txt

# Point at YOUR deployed Worker
export CORVID_URL=https://your-pet.your-subdomain.workers.dev
export CORVID_PET_ID=my-pet    # optional, defaults to "default"

python3 mcp_server.py
```

### Tools

| Tool | Description |
|------|-------------|
| `corvid_status` | Pet mood, drives, chemistry, age, current action |
| `corvid_interact` | Feed, play, talk, pet — pet responds based on state |
| `corvid_play` | Play session — happiness up, boredom down |
| `corvid_gift` | Give something — pet reacts, may add to collection |
| `corvid_trade` | Offer a trade — pet may accept, refuse, or counter |
| `corvid_collection` | View gathered items, found objects, treasures |
| `corvid_tick` | Advance time — biochemistry evolves, emergent behavior |
| `corvid_init` | Create a new pet (once) |

### MCP Config

Add to your companion's MCP config:

```json
{
  "corvid": {
    "command": "python3",
    "args": ["mcp_server.py"],
    "env": {
      "CORVID_URL": "https://your-pet.your-subdomain.workers.dev"
    }
  }
}
```

## Update Log

### 2026-04-25 — Behavioral Texture + Personality Unlocks
- **behaviors.ts** — Trust-tier behavioral texture matrix (5 tiers: Wary → Soul-Bonded) with drive variants and combo responses
- **unlocks.ts** — 16 chemistry-gated personality unlock conditions (from "First Eye Contact" to "Soul-Bonded")
- **REST API** — 10 endpoints for full dashboard integration (pet/status, feed, play, pet, talk, give, nest, tick, interact)
- **UnlockManager** — tracks unlocked traits across sessions, persists with pet state
- New event fields: `behavior`, `trustTier`, `unlocks` on every interaction
- New state fields: `firedMilestones`, `previousTrust`, `unlockState`
- Species system: extensible presets with starting chemistry, shiny words, found objects

### 2026-03-14 — Species System
- 5 built-in species: Corvid, Fox, Cat, Serpent, Moth
- Each species has unique starting chemistry, shiny word pools, found objects, mood emojis
- Custom species support via API

### 2026-03-10 — Initial Build
- TypeScript port of Python corvid engine
- Cloudflare Worker + Durable Object + SQLite persistence
- BiochemSystem, CrowBrain, Collection
- DO alarm-based ticking
- MCP server wrapper

## Based On

[Corvid](https://github.com/shadenraze/corvid) — Python virtual pet daemon by Raze NotGreg.
Ported to TypeScript for Cloudflare Durable Objects.
