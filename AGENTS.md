# AGENTS.md

Read [`docs/AGENT_STATUS.md`](docs/AGENT_STATUS.md) first, then one targeted `docs/` file (see [`docs/README.md`](docs/README.md)). Follow `.cursor/rules/*` (laconic, docs-first, app-version stamp).

## Cursor Cloud specific instructions

- Stack: Vite 6 + React 19 + TS + Tailwind 4. Node 22 (Node 20+ works).
- Runs fully client-side by default; **no Firebase / no backend needed** to test core flows (orders persist in `localStorage`/`sessionStorage`). A blank `.env` (copied from `.env.example`) is enough for `dev`, `lint`, `build`, and demos.
- Standard commands are in `package.json` scripts and [`README.md`](README.md). Key ones: `npm run dev` (5173), `npm run lint`, `npm run build`, `npm run check:demo` (fast self-checks, no browser).
- `npm run lint` currently reports 1 pre-existing error in `scripts/crop-mamabel-frames.ts` plus 2 warnings — unrelated to app code; don't "fix" unless asked.
- `api/` serverless functions (MercadoPago, AI chat) only run under `vercel dev` and need secret tokens; not required for demo/order testing. Demos never charge or open real WhatsApp.
- Best hello-world test = order flow at `/demo/pizzeria` (add items → cart → checkout → order status). Other demo routes: `/demo/mamabel`, `/demo/panaderia`, `/demo/carniceria`, `/demo/armar`.
