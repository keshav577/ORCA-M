# ORCA Marine Intelligence

Responsive marine intelligence workspace for fishermen and coastal operators, combining safety advisories, collaborative AI reasoning, ocean conditions, maps, routes, and alerts.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/orca-marine-intelligence` — the runnable React + Vite ORCA web app
- `artifacts/api-server` — shared API server scaffold
- `artifacts/mockup-sandbox` — reusable component preview workspace
- `attached_assets` — source briefs for the ORCA SIH problem statement and UI direction

## Architecture decisions

- The first release is a frontend-only product prototype using clearly labeled local preview fixtures.
- The app keeps safety verdicts presentation-only; no browser-side rules infer GO, CAUTION, or NO-GO.
- The responsive shell uses a desktop sidebar and mobile bottom navigation so the same product feels intentional on both form factors.

## Product

ORCA answers the operational question “Can I go?” with a prominent safety verdict, evidence freshness, marine and weather conditions, alerts, a PFZ map workspace, route safety planning, and a conversational assistant that explains a collaborative agent trace in plain language. The interface includes English, Hindi, and Telugu affordances and distinguishes live, cached, stale, and unavailable readings.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
