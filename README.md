# Hermes Mission Control

> Local demo dashboard for visualizing a *mock* Hermes agent swarm.

This is an open-source Next.js UI that renders agents, skills, tasks, memory,
and a live-looking activity feed. **All data is generated in-process**
(`src/lib/mock-data.ts`). It does not connect to a running Hermes instance.

Use it to explore the information architecture and graph views. A real Hermes
adapter is future work, not this release.

## What works today

- Dashboard, agent / skill / task / memory pages
- Mock REST API under `/api/*`
- SSE activity stream from the in-memory store
- Unauthenticated `POST /api/goals` that injects a demo event (local only)

## What this is not

- Not a production control plane
- Not authenticated
- Not wired to Hermes sockets, skills on disk, or real memory stores

## Quick Start

```bash
git clone https://github.com/smfworks/hermes-mission-control.git
cd hermes-mission-control
npm ci
npm test
npm run dev
# http://localhost:3000
```

Production-style local run:

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/              # Mock REST + SSE routes
│   ├── agents/
│   ├── skills/
│   ├── tasks/
│   ├── memory/
│   └── page.tsx
├── lib/
│   ├── types.ts
│   ├── mock-data.ts
│   ├── goals.ts          # goal-injection validation
│   └── components/
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) and [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
