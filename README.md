# Soluciones Web Gatrivi.com

Tienda online white-label para comercios: catálogo, carrito, total, alias, comprobante por WhatsApp y panel de productos. Marca pública: **Gatrivi.com · de ZengaSoft**.

> **Agentes (Grok / Cursor / cloud):** leer primero  
> **[`docs/AGENT_STATUS.md`](docs/AGENT_STATUS.md)** — snapshot preciso del estado del producto (v1.15.1).

## Quick start

```bash
git clone https://github.com/gatrivi/Tmm-store.git
cd Tmm-store
npm install
cp .env.example .env
npm run dev
```

- Sales landing: http://localhost:5173/
- **Pizzería Fit A:** http://localhost:5173/demo/pizzeria · owner `/demo/pizzeria/owner`
- **Panadería La Magdalena:** http://localhost:5173/demo/panaderia · owner `/demo/panaderia/owner`
- Customer demo (legacy choripán): http://localhost:5173/demo
- Owner demo: http://localhost:5173/demo/owner
- **Carnicería vertical:** http://localhost:5173/demo/carniceria · owner `/demo/carniceria/owner`
- Tenant store: http://localhost:5173/s/demo-shop
- Admin: http://localhost:5173/admin

Public target: [gatrivi.com/demo/panaderia](https://gatrivi.com/demo/panaderia)

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run check:demo` | Registry self-check (carnicería routes/tenant) |

## Environment

Copy `.env.example` to `.env`. Key variables:

| Variable | Purpose |
|----------|---------|
| `VITE_PLAN` | Product tier: `menu`, `pedidos`, `premium` |
| `VITE_ADMIN_*_HASH` | Admin login (SHA-256) |
| `VITE_WHATSAPP_NUMBER` | Order WhatsApp number |
| `VITE_SALES_WHATSAPP_NUMBER` | Sales CTA WhatsApp number |
| `VITE_SALES_EMAIL` | Sales fallback email |
| `MP_ACCESS_TOKEN` | MercadoPago (Vercel serverless only) |

Full reference: [docs/ops/env-vars.md](docs/ops/env-vars.md)

## Documentation

All project docs live under [`docs/`](docs/README.md):

- **[AGENT_STATUS.md](docs/AGENT_STATUS.md)** — estado actual (para agentes)
- [Architecture](docs/architecture.md)
- [Prospect demo (3 min)](docs/ops/prospect-demo.md)
- [Demo pizzería Fit A](docs/roadmap/demo-pizzeria.md)
- [Demo carnicería Gabriel](docs/roadmap/demo-carniceria-gabriel.md)
- [Demo script](docs/ops/demo.md)
- [Client onboarding](docs/ops/onboarding.md)
- [Portfolio (human)](docs/human/portfolio.md)

## Deploy

Push to Vercel. Set env vars in the project dashboard. Serverless functions in `api/` require a Vercel deployment.

---

Developed by **ZengaSoft**
