# Demo Olivos — boutique indumentaria (v1.30.0)

`/demo/olivos` · corto `/olivos` · **BoutiqueStore engine** (progressive disclosure) · **demo ficticia** (sin comercio real detrás).

## Pitch (IG/WSP seller)
Vendedora de indumentaria que vende por Instagram/WhatsApp. Dolor: "¿queda talle M?" se contesta tarde, pedidos entran desordenados, fotos del feed sin precio/talle. Demo muestra: foto → talles claros → carrito → pedido ordenado (prenda + talle + total).

## Engine (v1.29.0)
`src/pages/BoutiqueStore.tsx` — storefront de ropa data-driven, reutilizable (Manacar hoy; Inmaculada/futuras prendas solo cambian demo config):

```
BoutiqueStore
 ├─ StoreHeader (logo + carrito chip)
 ├─ CategoryRail (scroll horizontal, sin scrollbar visible)
 ├─ ProductGrid (2 col mobile / 3-4 desktop, cards 4:5 = foto+nombre+precio)
 ├─ ProductSheet (full-screen mobile / modal desktop: galería swipe + talles + Agregar)
 ├─ CartBar (CTA fijo bottom tras primer add)
 └─ CheckoutModal (demo persist, WhatsApp-first)
```

Reglas del brief (architecture-template): sin descripción ni precios por talle en el catálogo; talles solo dentro del producto; "Sin stock" chip en card si todos los talles agotados, talle tachado disabled en sheet; badge "Últimos talles" dentro del sheet con hint WSP.

## Config
- `src/data/demos/olivos.ts` · tenant `demo-olivos` · plan `pedidos`
- Marca: **Manacar Indumentaria** (ficticia, Mitre 1200 Olivos "demo"). Sin WSP real (guardrail).
- 16 productos · 6 categorías. Variantes = `options`: talles S/M/L o 36/38/40, colores. Banda $8.999–$66.399 (ref Juvia).
- Galería: Blazer Candela y Camisa Domo con 2 fotos (swipe en sheet).
- Fotos: Pexels descargadas a `public/demos/olivos/` (16 jpg + monogram.svg).

## Cambios de plataforma (compartidos)
- `src/pages/Storefront.tsx`: opciones `available:false` ya no se filtran → chip "No disponible" (storefront genérico); hover-gallery "+N fotos" en grid.
- `src/components/DemoRibbon.tsx`: fix `setDemoPlanOverride` sin destructurar (ReferenceError en cada click de pill).
- `src/CommerceApp.tsx`: rutas `/olivos` + `/demo/olivos` → `BoutiqueStore` (order/owner siguen igual).

## QA (390×844, real clicks)
Grid por categoría (3-4 prendas) → sheet (nombre/precio/talles, M disabled en Blusa Coach) → Agregar S $22.799 → CartBar → drawer → checkout → success demo → owner ve pedido (QA Tester $22.799). Plan menu: sin cart, CTA sheet = "Consultar por WhatsApp". `check:demo` 7/7 · build ok · lint 0 en archivos nuevos.

## Diseño (v1.30.0, SKILL.md frontend-design)
Anti-default: NO cream+terracotta (calibration cluster 1). Tokens del mundo Olivos/etiqueta:

| Token | Valor | Uso |
|-------|-------|-----|
| oliva | `#575D4E` | brand/accent (botones, activo) |
| cemento | `#E9E7E0` | fondo página |
| tinta | `#23261F` | texto |
| etiqueta | `#F8F6F1` | superficies cards/sheet/drawer |
| arena | `#D8D2C4` | bordes, placeholders |
| alfiler | `#B5453C` | único uso: punto sin-stock |

- Type: display = Georgia SOLO hero + nombres producto; body/UI = system-ui; precios tabular-nums.
- **Hero-tesis**: collage de 3 fotos reales del catálogo (la mercadería es el héroe), título corto debajo. Riesgo justificado: la clienta de IG ya vino por la foto.
- **Firma**: talles = etiquetas de cartón colgadas — hilo SVG conecta el título "Talle" con el grupo, cada tag con "ojo" perforado (rojo alfiler si sin stock), el elegido rota -3°.
- Copy 1:1 de vendedora: "Llevás {n} — {total}", "¿Dudas con el talle? Te lo confirmamos por WhatsApp.", vacío = invitación.
- QA visual: DOM-audit desktop sheet (2 col, 3 tags con ojo, seleccionado rotado bg oliva, CTA correcto) + screenshots 390/1280 + flow completo re-corrido (cart bar → success).
- Galería `/demos`: card "Manacar Indumentaria" (kind Tienda, tags Talles claros / Ficha por prenda / Sin comisión) + ilustración `public/demos/olivos/card.svg` estilo etiqueta colgada. Verificado: render, filtro Tienda, click-through a `/olivos`.
