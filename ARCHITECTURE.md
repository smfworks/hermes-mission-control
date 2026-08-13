# Hermes Mission Control — Architecture

## Overview

Hermes Mission Control is a real-time visual command center for Hermes agent systems.
It provides operators with a cinematic, information-rich interface to monitor,
understand, and gently steer agent swarms in real time.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Graph Visualization:** React Flow v11 (`reactflow`)
- **Real-time:** Server-Sent Events / polling
- **Storage:** In-memory mock store for the demo. There is no SQLite in this release.

## Architecture

```
hermes-mission-control/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── state/route.ts    # Full system state
│   │   │   ├── agents/route.ts   # Agent list
│   │   │   ├── skills/route.ts   # Skill list
│   │   │   ├── tasks/route.ts    # Task list
│   │   │   ├── memory/route.ts   # Memory entries
│   │   │   └── events/route.ts   # System events
│   │   ├── agents/
│   │   │   └── page.tsx          # Agent list view
│   │   ├── skills/
│   │   │   └── page.tsx          # Skill list view
│   │   ├── tasks/
│   │   │   └── page.tsx          # Task list view
│   │   ├── memory/
│   │   │   └── page.tsx          # Memory explorer
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Dashboard home
│   ├── lib/
│   │   ├── types.ts              # Data models
│   │   ├── mock-data.ts          # Mock data generator
│   │   └── utils.ts              # Utilities
│   └── styles/
├── public/
├── ARCHITECTURE.md
├── README.md
└── package.json
```

## Data Flow

1. **API Routes** serve data from the mock data store (or real Hermes backend in production)
2. **Pages** fetch data from API routes on load
3. **Components** render the data with real-time updates via polling or SSE
4. **Mock Data Store** generates realistic data for development and demos

## Data Models

See `src/lib/types.ts` for the complete data model.

### Core Entities

- **Agent** — Represents a Hermes agent with status, type, skills, and current task
- **Skill** — Represents a skill with versions, performance metrics, and author
- **Task** — Represents a task with status, assignment, and result
- **MemoryEntry** — Represents a memory entry with key, value, tags, and attention status
- **SystemEvent** — Represents a system event for the activity feed

### Graph Model

- **GraphNode** — Agent or skill node in the graph
- **GraphEdge** — Communication, tool use, memory access, or skill inheritance edge

## Extending Mission Control

### Adding a New View

1. Create a new page in `src/app/<name>/page.tsx`
2. Add a navigation link in the header
3. Create an API route if needed in `src/app/api/<name>/route.ts`

### Connecting to Real Hermes Data

1. Replace the mock data store with a real data source
2. Implement the same API routes to serve real data
3. Add WebSocket/SSE support for real-time updates

### Adding New Visualizations

1. Install a visualization library (e.g., `npm install d3`)
2. Create a component in `src/lib/components/`
3. Use it in the appropriate page

## Performance Considerations

- Pages are statically generated where possible
- API routes are lightweight and cacheable
- Mock data is generated once and cached in memory
- Real-time updates use efficient polling or SSE

## Security Considerations

- No external dependencies that compromise privacy
- All data is local-first
- Demo API routes are unauthenticated. `POST /api/goals` writes to the in-memory store only. Do not expose this process on a public interface.
