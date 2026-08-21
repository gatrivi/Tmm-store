# AGENT STATUS — Soluciones Web Gatrivi.com (TMM Store)

**Léeme primero.** Snapshot preciso del producto para agentes cloud / Cursor.

| Campo | Valor |
|-------|--------|
| **Fecha snapshot** | 2026-08-21 |
| **Versión** | `1.24.0` (`package.json` → stamp UI) |
| **Rama** | `trabajo` (tracks `origin/trabajo`) |
| **Cambio actual** | Demo Express público OFF — solo demos pulidas |
| **Live** | https://tmm.gatrivi.com |
| **Repo** | https://github.com/gatrivi/Tmm-store |
| **Índice docs** | [`docs/README.md`](./README.md) |

Si este archivo y el stamp on-screen no coinciden → deploy/HMR desfasado.

**Política de marca pública:** mostrar siempre **Gatrivi.com · de ZengaSoft**. `Trufi`, `TMM` y nombres `trufi:*` quedan sólo como identificadores técnicos heredados; no exponerlos en copy, títulos ni metadatos.

---

## 1. Qué es el producto

**Gatrivi.com** = tienda online white-label para comercios barriales (AR / Zona Norte).

Flujo core:

1. Cliente ve carta / catálogo  
2. Arma carrito → checkout  
3. Pedido se persiste  
4. Handoff WhatsApp estructurado y/o Mercado Pago  
5. Dueño gestiona en panel (nuevo → preparando → listo → …)

**No es** marketplace. **Sin comisión por pedido.** Competidores de referencia: PedidoDirecto, Pedix, Rappi (ángulo precio/comisión).

Tres tiers (`VITE_PLAN`):

| Plan | Carrito/pedido | MP | AI | Panel pedidos | Promos/reportes |
|------|----------------|----|----|---------------|-----------------|
| `menu` | no (solo carta + CTA WSP) | no | no | no | no |
| `pedidos` | sí | sí | no | sí | sí |
| `premium` | sí | sí | sí | sí | sí |

Default local: `pedidos`. Plan por deploy hoy; tenant Firebase puede override.

---

## 2. Stack y layout del repo

| Capa | Tech / path |
|------|-------------|
| UI | React 19, Vite 6, TS, Tailwind 4 → `src/pages/`, `src/components/` |
| State | Context → `src/context/` (Menu, Plan, Language, …) |
| Persistencia | localStorage default; Firestore si `VITE_FIREBASE_*` |
| Serverless | `api/` en Vercel: MP, webhook, AI chat, parse-menu |
| Demos | `src/data/demos/`, `src/utils/demoRegistry.ts`, sessionStorage aislado |
| Docs | **todo** bajo `docs/` — no crear MD en raíz del repo |

---

## 3. Rutas (fuente: `App.tsx` + `CommerceApp.tsx`)

| Ruta | Uso |
|------|-----|
| `/` | Landing de ventas |
| `/#planes` | Precios (redirect desde `/pricing`) |
| `/demo` | Legacy Express — **público OFF** → `/demos` |
| `/demo/owner` | Legacy Express panel — **público OFF** → `/demos` |
| `/demo/armar` | Demo Express builder — **público OFF** → `/demos` |
| `/demo/pizzeria` | **Fit A** pizzería/empanadas (cliente) |
| `/demo/pizzeria/owner` | Panel pizzería |
| `/demo/pizzeria/order/:id` | Seguimiento pizzería |
| `/demo/mamabel` | **Flagship** Las Tortas de Mamá Mabel |
| `/demo/mamabel/owner` | Panel familia |
| `/demo/mamabel/order/:id` | Seguimiento |
| `/demo/panaderia` | **La Magdalena** panadería (cliente) |
| `/demo/panaderia/owner` | Panel panadería |
| `/demo/panaderia/order/:id` | Seguimiento panadería |
| `/demo/carniceria` | Vertical carnicería (cliente) |
| `/demo/carniceria/owner` | Panel Gabriel |
| `/demo/carniceria/order/:id` | Seguimiento |
| `/demo/canavesi` | **Canavesi Carnes** Olivos Borges |
| `/demo/canavesi/owner` | Panel Canavesi |
| `/demo/canavesi/order/:id` | Seguimiento |
| `/demo/aguacats` | **Aguacats** despensa/fresco (ex Refcurcum) |
| `/demo/aguacats/owner` | Panel Aguacats |
| `/demo/aguacats/order/:id` | Seguimiento |
| `/demo/confiteria-parana` | **Confitería Paraná** (cliente) — warm lead |
| `/demo/confiteria-parana/owner` | Panel confitería |
| `/demo/confiteria-parana/order/:id` | Seguimiento |
| `/demo/verduleria` | **La Inmaculada** verdulería (cliente) |
| `/demo/verduleria/owner` | Panel Inmaculada |
| `/demo/verduleria/order/:id` | Seguimiento |
| `/s/:slug` | Storefront tenant |
| `/s/:slug/admin` · `/admin` | Admin dueño |
| `/order/:orderId` | Seguimiento pedido real/tenant |
| `/super-admin` | Provisioning tenants |

Live sales URLs: `/` · `/demos` · `/demo/mamabel` · `/demo/pizzeria` (+ owner) · `/demo/panaderia` · `/demo/carniceria` · `/demo/canavesi` · `/demo/verduleria` · `/demo/aguacats` · `/demo/confiteria-parana`.

---

## 4. Estado de features (shipped vs no)

### Shipped y usable

- Landing + planes + CTAs ventas (`VITE_SALES_WHATSAPP_NUMBER` / email fallback)
- Storefront multi-layout (grilla/lista/destacado/minimal) + branding admin
- Cart → CheckoutModal → WSP / MP (plan gating)
- Admin: menú, fotos, apariencia, pedidos, promos, reportes (según plan)
- Armado wizard (~10 min) en admin
- Multi-tenant URL `/s/:slug` + SuperAdmin
- **Orders v2 Hito 1:** demo coherente, una acción primaria, store demo compartido cliente/owner/seguimiento
- **Demo Express presets:** código vivo; **público OFF** (v1.22.0) — no linkear desde landing/`/demos`; flag `src/config/demoExpress.ts`
- **Demo plan switch (v1.23.0):** barra "Vista demo" (Catálogo / Tienda WSP / Tienda MP) en demos con plan gating real: verticals Storefront (pizzería, Zimba Pet, Express), WeightedCatalog (carnicería/Canavesi/verdulería), Aguacats, Ferretería. Override en sessionStorage `trufi_demo_plan_override` (sticky por sesión, sólo demos). Pendiente switch en páginas bespoke: Mamabel, Panadería, MolinoFlorida, Heladería, CafeRoca.
- **Demo Confitería Paraná (v1.24.0):** warm lead (amigos de familia), Paraná 3374 Olivos, **746 reseñas Google 4.6★ sin web propia**, vende por Rappi/PedidosYa. Storefront genérico + plan switch. Config `src/data/demos/confiteriaParana.ts` · doc [`roadmap/demo-confiteria-parana.md`](./roadmap/demo-confiteria-parana.md). Sin WSP del comercio hasta permiso; fotos reutilizadas (pendiente sesión propia).
- **Demo Mamá Mabel flagship (v1.11–1.13.4):** portada marca · portfolio likes · encargo WA · cursos honestos · hero/portfolio black-bg studio picks (EXIF/glare/tilt/center)
- **Demo pizzería Fit A:** carta pizza/empanadas, tenant `demo-pizzeria`, storage aislado
- **Demo panadería La Magdalena (v1.9.3):** tenant `demo-panaderia`, storage `trufi_demo_orders_v2:panaderia`
- **Demo Aguacats (v1.16.0):** tenant `demo-aguacats`, IG @aguacats21, storage `trufi_demo_orders_v2:aguacats`
- **Demo carnicería Hito 1:** peso/packs, total estimado, tenant `demo-carniceria`
- **Advertising Hito A (v1.9.0):** OG carnicería + rewrite Vercel; E2E Playwright
- Self-check: `npm run check:demo`
- Leads ZN docs + script `npm run leads:scan`

### Parcial / no listo para tráfico frío “sistema listo”

| Área | Estado |
|------|--------|
| Orders v2 Hito 2–5 | Spec only — config checkout real, backend seguro, MP harden, migración |
| Mercado Pago prod | Existe API; **no** afirmar smoke prod pasado hasta verificar |
| Firebase como default producción | Opcional; sin Firebase = localStorage por browser |
| WhatsApp Business API | Roadmap P3 — hoy handoff wa.me / mensaje estructurado |
| Gaucho mode / Premium CX desk | Spec only |
| Pedidos reales de cliente pagando | Hito B advertising — **no** hasta auth dueño en Firestore |
| Vertical verdulería | Shipped → [`roadmap/demo-verduleria.md`](./roadmap/demo-verduleria.md) · `/demo/verduleria` |

### Guardrails demos

- Demo **nunca** abre WSP real ni cobra (excepto demos prospect con tel explícito en doc — Mamabel/Magdalena)
- No inventar datos de comercios reales fuera de demos documentados
- `sessionStorage` aislado por vertical; no mezclar con tenant Firebase

---

## 5. Persistencia de pedidos (importante)

| Contexto | Dónde vive |
|----------|------------|
| Tenant real sin Firebase | `localStorage` `trufi_orders_{tenantId}` |
| Tenant real con Firebase | Firestore |
| Demo gastronomía | `sessionStorage` `trufi_demo_orders_v2` |
| Demo pizzería | `sessionStorage` `trufi_demo_orders_v2:pizzeria` |
| Demo mamabel | `sessionStorage` `trufi_demo_orders_v2:mamabel` |
| Demo panadería | `sessionStorage` `trufi_demo_orders_v2:panaderia` |
| Demo aguacats | `sessionStorage` `trufi_demo_orders_v2:aguacats` |
| Demo verdulería | `sessionStorage` `trufi_demo_orders_v2:verduleria` |
| Demo carnicería | `sessionStorage` `trufi_demo_orders_v2:carniceria` |
| Demo Canavesi | `sessionStorage` `trufi_demo_orders_v2:canavesi` |

Resolución path→tenant: `src/utils/demoRegistry.ts` (prefijos largos ganan).

---

## 6. Deploy / ops (gotchas reales)

- Dominio live: `tmm.gatrivi.com` vía Vercel. Apex `gatrivi.com` diferido hasta resolver DNS/branch.
- Histórico: push a `trabajo` creaba solo **Preview**; Production necesitaba `vercel promote` / `--prod`. Verificar branch Production en Vercel antes de asumir que un push actualizó live.
- Stamp bottom-left = `package.json` version (oculto en UI pública demo post-Hito A; admin/DEV/`?debug=1` puede mostrarlo)
- Env: `.env.example` + [`ops/env-vars.md`](./ops/env-vars.md)
- MP solo en deploy Vercel (no en `vite` puro)
- Comandos calidad demo: `npm run lint` · `build` · `check:demo` · `test:e2e:demo`

---

## 7. Ventas — foco actual

**Listo para vender:** Tienda online (Gate A). Ver [`ops/sales-readiness.md`](./ops/sales-readiness.md).

**Foco 2026-08-21:** vender Gate A ya; CRM `gatrivi` y BPM estacionados hasta primer tenant pagante — [`ops/strategy-focus-2026-08-21.md`](./ops/strategy-focus-2026-08-21.md).

**No vender aún:** Pedidos reales multi-dispositivo (Gate B), MP integrado (Gate C).

**Perfil que compra:** pizza / empanadas / roti / food truck — dueño cocina, alto WSP, sin web propia, odia comisión. + pastelería/panadería como flagship demo.

**Zona:** Olivos → Vicente López (anillos) — [`ops/leads-rings-routine.md`](./ops/leads-rings-routine.md), shortlist [`ops/propuesta-olivos-vl.md`](./ops/propuesta-olivos-vl.md).

**Pitch 30s:** sin comisión; carta web → carrito → WSP ordenado + bandeja celular; armado 48–72h; ~$15–18k/mes vs PD.

**Demos a mostrar:**

1. **Flagship** → `/demo/mamabel` ([`roadmap/demo-mamabel.md`](./roadmap/demo-mamabel.md))
2. **Default Fit A** → `/demo/pizzeria` + owner ([`ops/prospect-demo.md`](./ops/prospect-demo.md))
3. Panadería → `/demo/panaderia`
4. Aguacats (prospect amigo) → `/demo/aguacats` ([`roadmap/demo-aguacats.md`](./roadmap/demo-aguacats.md))
5. Galería → `/demos` (solo demos pulidas)
6. Vertical Canavesi → `/demo/canavesi` ([`roadmap/demo-canavesi.md`](./roadmap/demo-canavesi.md))
7. Vertical carnicería → `/demo/carniceria`
8. **Verdulería La Inmaculada** → `/demo/verduleria` ([`roadmap/demo-verduleria.md`](./roadmap/demo-verduleria.md))
9. Post-depósito → tenant real `/s/<slug>` (no clonar app)

**No mostrar:** `/demo/armar`, `/demo?rubro=*`, legacy `/demo` (Express off).

**Próxima vertical recomendada:** pollería/heladería solo con lead; verdulería shipped.

**Fuera de foco:** zapatería, ropa, café solo mesa, resto fino/sushi (fit C).

Publicitar “busco pilotos” o vender Tienda online: **Gate A OK** (verificar `VITE_SALES_WHATSAPP_NUMBER` o `VITE_DEMO_INTAKE_URL` en Production). Tráfico frío prometiendo pedidos reales: **no** (falta Gate B).

---

## 8. Roadmap activo (prioridad)

| Prioridad | Doc | Estado |
|-----------|-----|--------|
| 1 | [`order-processing-v2.md`](./roadmap/order-processing-v2.md) | Hito 1 done; 2–5 pending |
| 2 | [`advertising-readiness.md`](./roadmap/advertising-readiness.md) | Hito A done; Hito B (auth Firestore) pending |
| 3 | [`demo-mamabel.md`](./roadmap/demo-mamabel.md) | Flagship shipped v1.13.x; polish fotos ongoing |
| 4 | [`vertical-demos-plan.md`](./roadmap/vertical-demos-plan.md) · [`demo-verduleria.md`](./roadmap/demo-verduleria.md) | Verdulería shipped v1.21.0 |
| — | competitive-parity, print-tickets, wsp-cx, gaucho, premium-cx | Spec / diferido |

Índice: [`roadmap/README.md`](./roadmap/README.md).

---

## 9. Mapa rápido de código

| Necesidad | Path |
|-----------|------|
| Rutas shell | `src/App.tsx`, `src/CommerceApp.tsx` |
| Storefront | `src/pages/Storefront.tsx` |
| Checkout | `src/components/CheckoutModal.tsx` |
| Órdenes admin | componentes admin + `orderService` |
| Máquina estados | `src/services/orderStateMachine` (vía services) |
| Demo registry | `src/utils/demoRegistry.ts` |
| Config Mamabel | `src/data/demos/mamabel.ts` · página `MamabelDemoPage` |
| Config panadería | `src/data/demos/panaderia.ts` |
| Config aguacats | `src/data/demos/aguacats.ts` |
| Config verdulería | `src/data/demos/verduleria.ts` |
| Config carnicería | `src/data/demos/carniceria.ts` |
| Config Canavesi | `src/data/demos/canavesi.ts` |
| Página peso (carnicería/Canavesi/verdulería) | `src/pages/WeightedCatalogDemoPage.tsx` |
| Demo plan switch | `src/components/DemoPlanSwitch.tsx` + override en `src/context/PlanContext.tsx` |
| Config confitería | `src/data/demos/confiteriaParana.ts` → Storefront genérico |
| Página carnicería | re-export → WeightedCatalogDemoPage |
| Planes | `src/config/plans.ts` |
| Versión inyectada | `src/config/version.ts` ← vite |
| API MP | `api/create-preference.ts`, `api/mp-webhook.ts` |

---

## 10. Reglas de trabajo para agentes

1. Leer este archivo → luego **un** doc de `docs/features/` o `docs/roadmap/` — no barrer el repo.
2. Diffs chicos; no reescribir arquitectura.
3. No crear MD en raíz; actualizar docs existentes o `docs/**`.
4. Tras feature visible: bump `package.json` version + actualizar stamp en respuestas humanas (`— Gatrivi.com vX.Y.Z`).
5. Commit/push solo si el humano lo pide (salvo regla explícita del usuario).
6. Demos: no Firebase, no inventar datos de comercios reales; WSP/MP reales solo donde el doc del demo lo permite.
7. Laconic: bullets > párrafos.

---

## 11. Estado git al snapshot

- Branch `trabajo` al día con `origin/trabajo`
- HEAD = demo Aguacats v1.16.x
- WIP local sin track (no mergear): `.playwright-mcp/*.yml`, `public/demos/mamabel/scraped/ig-ranked.json`

---

## 12. Cómo verificar en 2 minutos

```bash
npm run check:demo
# opcional: npm run test:e2e:demo
```

Abrir:

- https://tmm.gatrivi.com/demo/mamabel
- https://tmm.gatrivi.com/demo/pizzeria
- https://tmm.gatrivi.com/demo/pizzeria/owner
- https://tmm.gatrivi.com/demo/panaderia
- https://tmm.gatrivi.com/demo/carniceria
- https://tmm.gatrivi.com/demo/canavesi
- https://tmm.gatrivi.com/demo/verduleria
- https://tmm.gatrivi.com/demo/aguacats
- Stamp / `package.json` = **1.22.0**

---

**Actualizar este archivo** cuando cambie versión mayor/menor, se shippee un hito, o cambie el foco de ventas.
