# Trufi

White-label food ordering app (PedidoDirecto-style): digital menu, cart, checkout, WhatsApp, MercadoPago, admin panel, and three product tiers (Menu / Pedidos / Premium).

## Quick start

```bash
git clone https://github.com/gatrivi/Tmm-store.git
cd Tmm-store
npm install
cp .env.example .env
npm run dev
```

- Store: http://localhost:5173/
- Admin: http://localhost:5173/admin

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Environment

Copy `.env.example` to `.env`. Key variables:

| Variable | Purpose |
|----------|---------|
| `VITE_PLAN` | Product tier: `menu`, `pedidos`, `premium` |
| `VITE_ADMIN_*_HASH` | Admin login (SHA-256) |
| `VITE_WHATSAPP_NUMBER` | Order WhatsApp number |
| `MP_ACCESS_TOKEN` | MercadoPago (Vercel serverless only) |

Full reference: [docs/ops/env-vars.md](docs/ops/env-vars.md)

## Documentation

All project docs live under [`docs/`](docs/README.md):

- [Architecture](docs/architecture.md)
- [Demo script](docs/ops/demo.md)
- [Client onboarding](docs/ops/onboarding.md)
- [Portfolio (human)](docs/human/portfolio.md)

## Deploy

Push to Vercel. Set env vars in the project dashboard. Serverless functions in `api/` require a Vercel deployment.

---

Developed by **DevSalz**
