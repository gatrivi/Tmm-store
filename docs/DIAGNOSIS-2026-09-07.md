# Diagnóstico completo de la aplicación — trufi-tmm (2026-09-07)

> Auditoría de solo lectura. No se modificó código. Rama `trabajo`, versión 1.30.0.

## 1. Qué es la aplicación

**Gatrivi** (antes "El Puestito del Tío" / trufi-tmm): SPA React 19 + Vite 6 + Tailwind 4 + Firebase (Firestore, sin Auth) + MercadoPago, desplegada en Vercel como `gatrivi.com` / `tmm.gatrivi.com`. Tiene dos capas en un solo bundle:

1. **Sitio de ventas (marketing)** — `src/App.tsx`: landing, precios, propuestas, flyers, demos gallery, seña/reserva.
2. **App de comercio** — `src/CommerceApp.tsx` (montada como ruta catch-all `*`): 15 demos de verticales, tiendas reales multi-tenant (`/s/:slug`), admin por tenant, super-admin, y el sitio real de La Inmaculada (`/inmaculada`).

### Modelo de despliegue
- Vercel: SPA + funciones serverless en `/api` (`vercel.json:9`), shells HTML estáticos por página social generados en build (`vite.config.js` plugin `socialHtmlShells`).
- Firebase: solo Firestore (`tenants/{id}` y `tenants/{id}/orders/{orderId}`). Sin Firebase Auth en todo el código.

## 2. Mapa de rutas (resumen)

**App.tsx (primer match gana):** `/` Landing · `/oferta|/empezar|/web|/sitio|/tienda|/catalogo` FlyerFunnel · `/propuesta(/:rubro)` · `/para-duenos|/que-hacemos` · `/demos` (V2) · `/precios` (+redirects `/pricing`, `/planes`) · `/soporte|/mantenimiento` · `/reservar` · `/panaderia` y `/heladeria`, `/cafe-roca` (páginas propias) · ~30 rutas `/:demo/owner` · `*` → CommerceApp.

**CommerceApp.tsx:** `/demo` Storefront genérico · `/pizzeria`, `/bar`, `/zimba-pet`, `/confiteria-parana`, `/polleria` → Storefront · `/olivos` → BoutiqueStore · `/el-mirasol`, `/aguacats`, `/mamabel`, `/ferreteria`, `/molino-florida` → páginas dedicadas · `/carniceria`, `/canavesi`, `/verduleria` → WeightedCatalogDemoPage · `/inmaculada` → sitio aparte · `/s/:slug(/admin)` tiendas reales · `/admin` · `/super-admin` · `/order/:orderId` · `*` NotFound.

Cada demo tiene rutas duales (`/foo` y `/demo/foo`) + `/owner` + `/order/:id`.

## 3. Arquitectura de datos y servicios

- **Registro de demos**: `src/utils/demoRegistry.ts` — 15 demos definidos en `src/data/demos/*.ts` (tipo `DemoDefinition` en `demos/types.ts:70-96`). Resolución de tenant por path (`resolveTenantIdFromPath`, línea 72).
- **Órdenes demo**: `src/services/demoOrderRepository.ts` — persistidas en **sessionStorage** por bucket (`trufi_demo_orders_v2[:demoId]`), con guard anti doble-submit, eventos cross-tab y métricas.
- **Órdenes reales**: `src/services/orderService.ts` — Firestore con fallback a localStorage (`trufi_orders_<tenant>`); `getOrdersForReports` (línea 141) lee solo localStorage aunque Firestore esté configurado (inconsistencia).
- **API serverless** (`/api`): `create-preference` (MP checkout), `mp-webhook`, `create-sales-deposit` / `verify-sales-deposit` (seña fija $65.000 ARS), `ai-chat` (con fallback determinista `menuMatch`), `parse-menu`, `test-mp`.
- **Selfchecks** (`npm run check:demo` / `check:ai`): 8 suites tsx que validan registro de demos, flujo de órdenes, presets, fotos, contacto de ventas, matcher de menú. Buen hábito, bien mantenido.
- **Scripts raíz** (`scripts/`): check-env, hash-admin, leads-scan (Google Places), generadores de flyers/briefs PDF con QR, OG images, grabación de promos con Playwright+ffmpeg, QA móvil Inmaculada, y ~7 experimentos de scraping IG one-shot.

## 4. Problemas de seguridad (los más serios)

| # | Severidad | Problema | Ubicación |
|---|---|---|---|
| S1 | **Crítica** | Reglas de Firestore totalmente abiertas (`allow read/write: if true`): cualquiera con el project id puede leer/escribir menús, settings y números de WhatsApp de todos los tenants, y forjar órdenes | `firestore.rules:5-12` |
| S2 | **Alta** | Webhook de MercadoPago **sin verificación de firma** (`x-signature`): quien sepa un order id puede marcar órdenes como pagadas con un POST falso | `api/mp-webhook.ts:49-78` |
| S3 | **Alta** | "Admin" es solo client-side: hashes SHA-256 en vars `VITE_*` (visibles en el bundle), con default `admin/admin123` detectable pero no impedido | `src/utils/adminSecurity.ts:3-14`, `src/context/AdminContext.tsx` |
| S4 | Media | CORS `Access-Control-Allow-Origin: *` en endpoints de pago (`create-preference`, `parse-menu`) | `api/create-preference.ts:26` |
| S5 | Media | `api/mp-webhook.ts` reusa vars client (`VITE_FIREBASE_*`) como pseudo-admin SDK (solo funciona porque las reglas están abiertas) y escribe solo al tenant único `VITE_TENANT_ID` | `api/mp-webhook.ts:7-16,54` |
| S6 | Baja | `VITE_SUPER_ADMIN_KEY` (provisioning de tenants) vive en el cliente | `src/pages/SuperAdminPage.tsx` |

## 5. Código muerto y duplicación

**Rutas muertas / sombreadas**
- `CommerceApp.tsx:76-79`: `/panaderia` y `/demo/panaderia` → `PanaderiaDemoPage` nunca renderiza (App.tsx:114-115 las captura primero). Los `/panaderia/order/:id` sí funcionan.
- `App.tsx:135` y `147`: `/demo/olivos/owner` declarada dos veces (inofensivo).
- `/demo/armar` y `/demo/owner` + `ProspectDemoBuilderPage`/`DemoOwnerPage`: feature apagada (`DEMO_EXPRESS_PUBLIC=false` en `src/config/demoExpress.ts`) pero el código se sigue shippeando.

**Archivos huérfanos (0 importadores)**
- Páginas: `AboutPage.tsx`, `DemosGalleryPage.tsx` (V1, reemplazada por V2), `CanavesiDemoPage.tsx` y `CarniceriaDemoPage.tsx` (shims deprecados de 0-2 líneas).
- Componentes: `MainScreen.tsx`, `SimplifiedMenu.tsx`, `MenuList.tsx`, `MenuItemCard.tsx`, `Layout.tsx` (~620 líneas muertas; solo referencias en comentarios viejos de `MenuContext.tsx:37,53`).
- Assets: `src/assets/react.svg`, `src/assets/tmm.png`.
- Datos: `src/data/demos/heladeriaBraco.ts`, `simba.ts`, `ferreteriaSanLorenzo.ts`, `inmaculada.ts` exportados pero fuera del registro.

**Duplicación estructural**
- No hay motor de demo compartido: cada página demo es copy-adaptada. 6 archivos definen el mismo `type CartLine` (Aguacats, Ferreteria, WeightedCatalog, ElMirasol, BoutiqueStore, InmaculadaSite); cada uno re-implementa formato de dinero (`Intl.NumberFormat es-AR`), add-to-cart, sonido y wiring de CheckoutModal.
- Las tablas de rutas de App.tsx (167 líneas) y CommerceApp.tsx (157) son listas casi duplicadas de ~40 pares `/foo/owner` que podrían generarse desde `demoRegistry`.
- `Storefront.tsx` (922 líneas) y `CheckoutModal.tsx` (841) son los componentes más grandes; candidates a partición.

**Inconsistencias menores**
- Short links `heladeria` y `cafe-roca` en `demoShortLinks.ts:16-17` apuntan a ids que no están registrados en `DEMOS` (esas demos se manejan por páginas propias en App).
- `/heladeria/order/:orderId` no existe en ningún router.
- Redirects duplicados SPA + edge (`/pricing`, `/planes`, `/demo/mamamabel` en App.tsx y vercel.json) — consistentes pero redundantes.
- Imports `import React from 'react'` innecesarios en AdminPage/OrderStatusPage/SuperAdminPage/Storefront.
- `mercadopago` SDK en `dependencies` aunque solo lo usan funciones serverless.

## 6. Restos de rebranding y placeholders

- Claves de storage con marca vieja: `elpuentito…` → `elpuestito_language` (`LanguageContext.tsx:13`), `elpuestito_admin_menu` (MenuContext). Tema: `gatrivi_theme_v2` borra `gatrivi_theme`/`trufi_theme` (bien).
- Traducciones (`src/i18n/translations.ts`, 5 idiomas) llenas de copy "El Puestito del Tío" con dirección Dorrego 4045 Palermo — incoherente con la marca Gatrivi. Además LanguageProvider solo envuelve CommerceApp, no las páginas de ventas.
- **TODO único del repo**: `src/sites/inmaculada/site.ts:17` — WhatsApp placeholder `5491100000000` en el sitio real de La Inmaculada.
- `src/sites/inmaculada` (sitio real) está deliberadamente aislado del sistema de demos/MenuContext/PlanContext.

## 7. Estado del repositorio e higiene

**Trabajo en progreso no commiteado (riesgo de pérdida)**
- 13 archivos modificados + código nuevo **untracked**: `src/sites/` (sitio Inmaculada completo), `src/pages/BoutiqueStore.tsx`, `src/pages/CanavesiDemoPage.tsx`, `scripts/qa-inmaculada-mobile.cjs`, `public/demos/olivos/card.svg`, docs de roadmap/ops. Tema del WIP: demo Olivos + sitio Inmaculada + playbook de demos.

**Basura en la raíz**
- ~20 imágenes en raíz (~25 MB) que duplican copias en `public/` — el código referencia las de `public/`; las de raíz ya están en la historia de git.
- Notas scratch trackeadas: `plan.txt`, `kimi.md`, `elmirasol..txt`, `empero.txt`, `sobrenosotros.txt`, `_noop3`, `restore_log.txt`.
- Notas scratch untracked que son solo URLs: `awesome-design.md`, `scroll-world.md`, `motiondesign.md`, `leadmapsvdemo.txt`, `architecture-template.txt`.
- Salidas de build versionadas en raíz: 10 PDFs (con `_A4`, `_v2`, `_v3`, `.pdf.new` duplicados) y 6 MP4s de promos.
- `.tmp-thumbs/` a medias en git (JPGs trackeados que duplican `public/demos/olivos/`, PNGs nuevos untracked). `shots/` sin decidir (track or ignore).
- `.gitignore` con gaps: faltan `desktop.ini`, `.tmp*`, `.vite/`, `.playwright-mcp/`, `.commandcode/`, `.cursor/`, `shots/`.

**Lo bueno**: `docs/` es un punto fuerte — índice curado, `AGENT_STATUS.md` vivo, ~25 planes de roadmap y ~30 runbooks de ops. Los selfchecks y los redirects edge/SPA consistentes también.

## 8. Cobertura de tests

- Playwright: 6 specs (carnicería, mamabel, verdulería, landing, 2 OG), solo viewport móvil 390×844, con build completo antes de cada corrida.
- **Sin cobertura e2e** para: pizzeria, panaderia, canavesi, el-mirasol, olivos/boutique, bar, polleria, molino-florida, aguacats, heladeria, cafe-roca — y nada de flujos de checkout real/admin/super-admin.
- Sin tests unitarios; los selfchecks tsx cubren parcialmente esa función.

## 9. Priorización sugerida (cuando se decida modificar)

1. **Seguridad**: cerrar `firestore.rules` (S1), verificar firma del webhook MP (S2), mover auth de admin a servidor (S3).
2. **Proteger el WIP**: commitear `src/sites/`, `BoutiqueStore.tsx` y docs antes de cualquier refactor.
3. **Higiene**: limpiar raíz, completar `.gitignore`, decidir `shots/` y `.tmp-thumbs/`, purgar código muerto (páginas/componentes huérfanos, rutas sombreadas).
4. **Refactor estructural**: motor de demo compartido (CartLine/carrito/dinero), rutas generadas desde `demoRegistry`, particionar `Storefront` y `CheckoutModal`.
5. **Detalles**: TODO del WhatsApp de Inmaculada, short links huérfanos, `/heladeria/order/:id` faltante, unificar `getOrdersForReports` con Firestore, revisar copy de traducciones con marca vieja.
