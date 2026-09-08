# Site MVP — La Inmaculada (verdulería · Olivos)

**Estado: implementado y validado** (2026-08-28) · ruta `/inmaculada` · Fase 1 del [plan de sitio](./inmaculada-site-plan.md).

## Qué es

Site propio de verdulería, aislado de los demos: NO usa `WeightedCatalogDemoPage` ni componentes visuales viejos. Flujo MVP cerrado:

```
hero (foto real) → Hoy llegó (pizarra) → Bolsones → lista de mercado (~25 SKUs)
  → carrito sticky (total estimado) → checkout mínimo (nombre+teléfono+delivery/retiro)
  → WhatsApp con pedido armado → pantalla "Pedido enviado"
```

Sin tracking, sin `/pedido/:id`, sin persistencia de pedidos, sin cuenta. Tracking real queda para después con Supabase/Firebase.

## Archivos

| Archivo | Qué es |
|---------|--------|
| `src/sites/inmaculada/site.ts` | Única fuente de verdad: SITE (dirección, horarios, zona, WSP), HOY_LLEGO (pizarra), BOLSONES, CATALOG (~25 productos con opciones ½kg/kg/unidad/atado/docena), CATEGORIES, `fmt()` |
| `src/sites/inmaculada/InmaculadaSite.tsx` | Página única: catálogo, carrito en memoria, drawer, checkout, WhatsApp, pantalla enviada |
| `src/sites/inmaculada/inmaculada.css` | Estilos propios bajo `.inm-` — no hereda nada del shell. Tokens: tiza `#1E4D2B`, limón `#E8F16A` (sólo dinero/pizarra), kraft `#EDE6D6`, tinta `#141B14`, gis `#FAF7F0`; tipografía Anton + Work Sans |
| `src/CommerceApp.tsx` | Import + `<Route path="/inmaculada">` (llega por el catch-all `*` de `App.tsx`) |
| `src/components/DemoShareFooter.tsx` | No renderiza en `/inmaculada` (sin branding Gatrivi) |
| `src/components/AppVersionBadge.tsx` | Stamp de versión oculto en `/inmaculada` (también en dev) |
| `scripts/qa-inmaculada-mobile.cjs` | QA móvil Playwright (390×844): 5 screenshots en `shots/`, intercepta `window.open` para capturar el mensaje wa.me sin abrirlo |

## Diseño (según SKILL.md frontend-design)

Dirección "cartel de verdulería de barrio", evitando los 3 looks AI-default (el tema de la demo vieja era el default #1: crema+serif+terracota). **Signature: la pizarra "Hoy llegó"** — único elemento con textura de tiza, editado a mano en `site.ts`. Lista de mercado en vez de card-grid Shopify. Toda la osadía en pizarra + hero; carrito/checkout tranquilos.

## Validación hecha

- `npm run build` ✓ · `eslint` en archivos nuevos ✓
- QA móvil (script): hero/crop ✓, densidad de lista ✓, sticky sin wrap ✓ (fix `white-space: nowrap`), mensaje WhatsApp completo y bien formateado ✓, footer Gatrivi ausente ✓

## Pendientes para producción (bloquean mostrar al dueño como sitio real)

- [ ] **WhatsApp real del local** en `SITE.whatsapp` (hoy placeholder `5491100000000`)
- [ ] Precios reales (~25 SKUs en `CATALOG`)
- [ ] Foto hero del mostrador real (hoy usa `/demos/verduleria/hero.jpg`) + lista real "Hoy llegó"
- [ ] Horarios y zona de delivery confirmados por el dueño
- [ ] (Opcional) custom domain

## Fases siguientes (del plan)

- **Fase 2:** contenido real (arriba).
- **Fase 3:** tracking real de pedidos (Supabase/Firebase), `/pedido/:id`, reseñas, bolsones dinámicos.

See also: [`inmaculada-site-plan.md`](./inmaculada-site-plan.md) (benchmark VerdePuro/Buenas Papas/La Barata + diferenciadores) · [`demo-verduleria.md`](./demo-verduleria.md) (demo vieja, sigue viva en `/demo/verduleria`)
