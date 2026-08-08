# CRM / BPM handoff — Gatrivi.com → nuevo repo

**Objetivo:** repo separado para high-ticket ventas (leads ZN → demo → depósito → tenant). Este producto **no** es CRM; exportar lo reusable y linkear por URL.

| Campo | Valor |
|-------|--------|
| Producto live | https://tmm.gatrivi.com |
| Repo producto | https://github.com/gatrivi/Tmm-store |
| WSP ventas default | `5491156199363` |
| Email ventas | `devtrivi@zengasoft.com` |
| Precio promo demo | `$65.000` (`VITE_DEMO_PRICE_LABEL`) |
| Planes ARS/mes | Menu $10k · Pedidos $20k · Premium $45k |

## Índice

| Doc | Uso |
|-----|-----|
| [mvp-scope.md](./mvp-scope.md) | Qué construir en CRM (thin) |
| [lead-schema.md](./lead-schema.md) | Entidad + etapas + campos |
| [integration.md](./integration.md) | URLs, env, CTAs, provisioning |
| [exportable-assets.md](./exportable-assets.md) | Archivos/scripts a copiar |
| [lead-examples-anon.md](./lead-examples-anon.md) | 7 leads de ejemplo (T0–T2) |

## One-page brief (pegar en prompt Composer del nuevo repo)

```
CRM/BPM interno para Gatrivi.com (tiendas online barriales AR).

Flujo: lead (Maps/outbound) → contacto → demo URL → reserva/depósito → tenant /s/:slug.

MVP:
- Tabla leads con etapas: nuevo | contactado | demo | piloto | deposito | activo | perdido
- Campos: shop, tier T0–T3, fit A/B/C, tel, IG, reviews, demo_url, tenant_slug, notas, next_action
- Botón abrir demo (link externo tmm.gatrivi.com) y tenant
- Sin duplicar storefront/checkout — solo orquestación ventas

Integración:
- Demo pulida: /demo/pizzeria (default), /demo/mamabel (flagship), verticales por rubro
- Post-depósito: crear tenant vía super-admin Firebase → /s/<slug>
- Reserva: Tally (VITE_DEMO_INTAKE_URL) o wa.me con origen
- Lead scan: scripts/leads-scan.mjs + GOOGLE_PLACES_API_KEY

No: MP webhook, pedidos reales, auth dueño — eso queda en Tmm-store.
Stack sugerido: lo mínimo (SQLite/Notion API o Supabase) + links externos.
```

## Fuentes en este repo

| Área | Path |
|------|------|
| CTAs venta | `src/utils/salesContact.ts`, `src/utils/demoIntake.ts` |
| Demos registry | `src/utils/demoRegistry.ts`, `src/data/demos/` |
| Prospect URL builder | `src/utils/prospectDemo.ts` |
| Lead scan | `scripts/leads-scan.mjs` |
| Ops ventas | `docs/ops/sales-readiness.md`, `leads-rings-routine.md`, `prospect-demo.md`, `onboarding.md` |
| Planes | `src/config/plans.ts` |
| Super-admin | `src/pages/SuperAdminPage.tsx` |

## Ver también

- [`AGENT_STATUS.md`](../AGENT_STATUS.md) §7 ventas
- [`ops/site-map.md`](../ops/site-map.md)
