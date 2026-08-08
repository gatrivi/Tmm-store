# Exportable assets — copiar al nuevo repo

## Docs (copiar subset)

```text
docs/crm-handoff/          # este paquete
docs/ops/leads-rings-routine.md
docs/ops/propuesta-olivos-vl.md
docs/ops/sales-playbook-zn.md
docs/ops/prospect-demo.md
docs/ops/onboarding.md
docs/ops/sales-readiness.md
docs/ops/site-map.md
```

## Scripts

| File | Uso | Requiere |
|------|-----|----------|
| `scripts/leads-scan.mjs` | Scan Places → markdown tabla | `GOOGLE_PLACES_API_KEY` |
| `npm run leads:scan` | wrapper package.json | |

Output esperado: `docs/ops/leads-data.md` (generado; no en repo si nunca corriste scan).

## Código (referencia, no fork UI)

| File | Por qué |
|------|---------|
| `src/utils/salesContact.ts` | wa.me / mailto builders |
| `src/utils/demoIntake.ts` | Tally + UTM + reserva |
| `src/utils/prospectDemo.ts` | URL demo personalizada |
| `src/utils/demoRegistry.ts` | map path → tenant demo |
| `src/config/plans.ts` | precios y gates |
| `src/config/demoExpress.ts` | flag Express público |

## Datos estáticos leads (manual hoy)

Tablas T0–T2 en [`leads-rings-routine.md`](../ops/leads-rings-routine.md) — importar a CRM como seed.

Shortlist priorizado: [`propuesta-olivos-vl.md`](../ops/propuesta-olivos-vl.md).

## Assets visuales (opcional CRM)

Screenshots demos para emails — capturar de live:

- `/demo/pizzeria`, `/demo/mamabel`, `/demo/canavesi`
- `/demos` galería

Fotos producto: `public/demos/**` (no necesario en CRM; solo links).

## Env vars CRM debe conocer (solo lectura)

| Var | Valor típico |
|-----|--------------|
| `VITE_SALES_WHATSAPP_NUMBER` | ventas WSP |
| `VITE_DEMO_INTAKE_URL` | Tally |
| `VITE_DEMO_PRICE_LABEL` | `$65.000` |
| Product base URL | `https://tmm.gatrivi.com` |

## No exportar

- `api/*` MP/webhook
- `src/pages/*` storefront/admin
- Firebase rules / tenant Firestore schema (usar super-admin UI)
