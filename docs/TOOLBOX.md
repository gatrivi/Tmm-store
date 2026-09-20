# Toolbox — reusable assets from trufi-tmm

**Purpose:** most new client sites will be built bespoke *outside* this repo. This doc catalogs what was already built here so nobody re-derives it from scratch (e.g. re-reading WhatsApp/MercadoPago docs on every project). Enter → find the tool → copy the file or the knowledge → exit.

**Not enforcement.** Case-by-case: take what fits, ignore the rest. Snapshot: v1.30.0, 2026-09-13.

Portability legend: **[DROP-IN]** = copy file, no refactor · **[ADAPT]** = copy + light config/rename · **[PATTERN]** = re-implement following this, the value is the knowledge/shape.

---

## Quick index

| I need… | Go to |
|---|---|
| Order / contact via WhatsApp | §1 WhatsApp handoff |
| Take payments in Argentina | §2 Mercado Pago stack |
| Catalog / store UI | §3 Store engines + config contract |
| Save & track orders | §4 Orders: persistence + state machine |
| Owner panel / login / plan tiers | §5 Admin stack + plan gating |
| AI chat / menu parsing | §6 AI stack |
| OG images / SEO on static hosting | §7.1–7.2 social pipeline |
| QRs, print PDFs, promo videos | §7.3–7.4 |
| Photos from client's IG/Facebook | §7.5 scrapers |
| Find prospects without a website | §7.6 leads-scan |
| Small utils (images, USD rate, hours, sounds…) | §8 grab-bag |
| How to make the design not look templated | §9 Design methodology |
| Check a claim against reality | §10 Not here / lifting checklist |

---

## 1. WhatsApp order handoff (no Business API)

Every WhatsApp flow in this repo is a **`wa.me` deep link**, not the WhatsApp Business API:

```
https://wa.me/<phone>?text=<encodeURIComponent(message)>
```

- Phone format: digits only, with country code (AR mobile: `54911…`). Normalize with `phone.replace(/\D/g, '')`.
- No token, no API account, works on any static site. Free tier forever.

**Files:**

| File | What | Portability |
|---|---|---|
| `src/utils/whatsappMessage.ts` | `sanitizeWaText()` — replaces WhatsApp markdown chars (`* _ ` ~`) in user content so they can't break message formatting; `buildWhatsAppMessage()` — structured order message (client, delivery/pickup, payment method, item lines, es-AR total, discount, bank alias, notes) | [DROP-IN] |
| `src/utils/whatsappTemplates.ts` | Status templates (`received / preparing / ready`) + `openWhatsAppChat(phone, msg)` normalize-and-open helper + status→template mapping (admin "notify customer" flow) | [DROP-IN] |
| `src/utils/salesContact.ts` | Contact fallback chain: WhatsApp if number configured, else `mailto:`; message embeds origin for attribution. Env: `VITE_SALES_WHATSAPP_NUMBER`, `VITE_SALES_EMAIL` | [DROP-IN] |
| `src/utils/mamabelEncargo.ts` (+ `.selfcheck.ts`) | Pattern: custom order form (cake encargo) → validated structured WA message | [ADAPT] |
| `src/components/CheckoutModal.tsx` (WSP path) | Handoff UX: `window.open` on user gesture + **popup-blocked fallback with copy-message buttons** | [ADAPT] |

**Gotchas learned here:**
- Only open `wa.me` from a real user gesture, and always offer "copy message" — popup blockers eat programmatic opens.
- WhatsApp *does* render markdown (`*bold* _italic_ ~strike~`), which is why user-supplied text needs `sanitizeWaText` first.
- Status updates are manual: owner taps the template in the admin inbox (`openWhatsAppForOrder`) — there is no outbound automation here.

## 2. Mercado Pago stack (Vercel serverless)

Dep: `mercadopago` npm SDK. Files in `api/`, handlers on `@vercel/node`.

| File | What |
|---|---|
| `api/create-preference.ts` | Checkout Pro preference from cart `{items[{title,quantity,unit_price}], payer?, external_reference?}` → `{id, init_point}`. `currency_id: 'ARS'`, prices as plain integers. `back_urls` append `?mp_status=approved\|failure\|pending&mp_ref=<external_reference>`; `auto_return: 'approved'` |
| `api/mp-webhook.ts` | IPN receiver. **MP webhooks only carry `data.id`** — the handler back-fills via `Payment.get()` server-side (never trust webhook payload amounts) and maps `approved / rejected\|cancelled / else→pending` into the order. Firestore optional (returns 200 without it) |
| `api/create-sales-deposit.ts` | Fixed-amount deposit preference (`external_reference = SALE-{PLAN}-{ts}`, `metadata.kind`) — template for "charge a set amount" flows |
| `api/verify-sales-deposit.ts` | The missing half of the loop: on the return URL (client-side, spoofable), **re-verify `status==='approved'` AND `transaction_amount` AND `currency_id` server-side** by payment id |

**Env:** `MP_ACCESS_TOKEN` (server). Webhook Firestore write: `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `TENANT_ID`.

**Gotchas:**
- MP functions only work on Vercel deploy (`vercel dev` ok, plain `vite` no).
- Client keeps the pending order in sessionStorage (`elpuestito_mp_pending`) and matches it against `?mp_status&mp_ref` on return, then cleans the URL.
- `external_reference` = our order id — this is the whole tracking contract.
- **No HMAC signature validation yet** — the server-side re-fetch pattern is the compensating control. If you lift this for a real store, add it.

## 3. Store engines + the config contract

The biggest architectural idea here: **typed config file per client → shared engine renders it.** A new client = one TS file, not a new app.

- Contract: `DemoDefinition` in `src/data/demos/types.ts` — menu items, categories, site settings, ~30 copy override strings, theme tokens, seed orders, editorial content pages. One file per client in `src/data/demos/`.
- Real bespoke site (own look, no demo chrome): `src/sites/inmaculada/` — dedicated site component + own CSS + `site.ts` config. This is the pattern for "bespoke but inside this repo".

**Engines:**

| Engine | Vertical | Mechanics |
|---|---|---|
| `src/pages/Storefront.tsx` | gastronomy (default) | 4 menu layouts (`grid/list/magazine/compact` via `src/utils/menuLayouts.ts`); plan-aware (catalog-only vs cart vs MP); hero parallax; MP return handling; cart revalidated against menu on every menu change (drops sold-out) |
| `src/pages/BoutiqueStore.tsx` | clothing | Progressive disclosure: clean grid (photo+name+price) → full-screen product sheet (gallery swipe + **sizes modeled as item `options[]`, sold-out via `available:false`**) → fixed CartBar → WhatsApp-first checkout. Money via `Intl.NumberFormat('es-AR',{currency:'ARS'})` |
| `src/pages/WeightedCatalogDemoPage.tsx` | butcher / greengrocer | Weight options (`kilo`/`half` ids) → `$X/kg` display, qty steppers, "**Total estimado**" wording for estimated weights |
| `src/components/CheckoutModal.tsx` | all | 3-step (form → confirm → success); cash/transfer/MP; promo codes; 4-char order ids from no-ambiguous charset `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` |

Portability: engines read `MenuContext` + `PlanContext`, so **[ADAPT]** — either copy engine + contexts together, or keep only the config-contract idea and rebuild thin. The `DemoCopy` "all strings overridable from config" trick is worth copying everywhere.

## 4. Orders: persistence + state machine

| Piece | File | Notes |
|---|---|---|
| State machine (pure, self-checked) | `src/utils/orderStateMachine.ts` | `new → preparing → ready → (out_for_delivery \| completed)`; cancel rules; es-AR CTA labels; inbox buckets. Zero deps — [DROP-IN] |
| Repository (Firestore **or** localStorage) | `src/services/orderService.ts` | `tenants/{tenantId}/orders` if Firebase configured, else `trufi_orders_{tenantId}`; `subscribeOrders` = `onSnapshot` or **5 s poll fallback** (cross-tab via storage events) |
| Demo repository | `src/services/demoOrderRepository.ts` | sessionStorage bucket per vertical (`trufi_demo_orders_v2:<id>`), cross-tab sync (storage event **+ CustomEvent** — storage event alone doesn't fire same-tab), double-submit guard, seed orders, metrics |

## 5. Admin stack + plan gating

- **Login** `src/context/AdminContext.tsx`: SHA-256 compare vs env hashes (`VITE_ADMIN_USER_HASH` / `VITE_ADMIN_PASS_HASH`), `js-sha256` fallback for plain-HTTP LAN testing, 5 attempts → 60 s lockout. Generate hashes: `node scripts/hash-admin.mjs <user> <pass>`. *Client-side gate only — fine for single-owner demos, not real security.* **[ADAPT]**
- **Panel** `src/components/admin/` (~15 components, nav in `AdminPanel.tsx` with plan-filtered sections): onboarding wizard "armado", dashboard, **OCR menu import**, menu editor (dnd-kit, 5-language fields), image editor (pan/center per photo), file manager (Base64 + localStorage quota probe), orders inbox (state machine buckets + WSP templates + ticket print), promotions, quick stock toggle, branding/appearance, cloud-sync status panel.
- **Plan tiers** `src/config/plans.ts` + `src/context/PlanContext.tsx`: feature matrix (`canOrder, canUseMercadoPago, canUseAI, canManageOrders, canUsePromotions…`) over `menu | pedidos | premium`. Demo override: sessionStorage `trufi_demo_plan_override` surfaced by pills in `src/components/DemoRibbon.tsx` (`PlanSwitchInline`). **[PATTERN]** for tier-gated anything.

## 6. AI stack

| File | What |
|---|---|
| `api/ai-chat.ts` | Multi-provider chat, raw fetch no SDKs: `AI_PROVIDER = openai \| anthropic \| gemini` (`OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY`, model overrides). Key design: **deterministic catalog match runs FIRST** so small menus never hit the LLM; cart actions encoded as inline tags `[ADD_CART:itemId:optionId:qty]`, regex-parsed and stripped from visible reply; fallback chain LLM → catalog → hardcoded |
| `api/menuMatch.ts` | `findBestMenuMatch(query, items)`: accent-stripping normalize, score threshold ≥50, Spanish qty words (`dos`, `tres`, cap 20). Usable without any LLM |
| `api/parse-menu.ts` | Menu photo → structured menu via OpenAI vision (`gpt-4o-mini`, temp 0.1), AR-prices prompt, fence-stripping + validation. Bridge to editable rows: `src/utils/menuImport.ts` |

## 7. Content & asset pipelines (`scripts/`)

**7.1 OG images without dependencies** — `scripts/generate-og-images.mjs` **[ADAPT]**: hand-rolled PNG encoder (`node:zlib` + CRC32 + a 5×7 bitmap font). 1200×630 branded cards → `public/og/*.png`, runs inside `npm run build`. Rebrand = edit one color map + card functions. No satori/puppeteer needed.

**7.2 Per-route social meta on static hosting** — `social-pages.mjs` (repo root) + `vite.config.js` + `vercel.json` **[PATTERN]**: the SSR-less-SSR trick.
- `findSocialPage(pathname)` + `injectSocialMetadata(html, meta)` rewrite `<title>`/canonical and inject full OG + Twitter set.
- Vite dev middleware injects meta live; **post-build writes `dist/social-{id}.html` static shells**; `vercel.json` rewrites each route (35 mappings) to its shell; catch-all → SPA.
- Regression net: `e2e/og-*.spec.ts` asserts built shells contain per-route OG and *not* the generic image. Copy all four pieces together.

**7.3 QR + print PDFs** **[ADAPT]**: `gen-flyer-qr.mjs` / `gen-brief-qrs.mjs` (`qrcode` lib → 1024 px PNGs, UTM-tagged) + `gen-flyers-pdf.mjs` / `gen-briefs-pdf.mjs` (`playwright-core` screenshots of live pages + `page.pdf()` from local HTML, A4 2×2 A6 grids). In-app: `src/utils/printTicket.ts` (58 mm thermal or A4 ticket via `window.print`, no deps), `src/utils/storeQr.ts`.

**7.4 Promo videos** — `scripts/record-demo-promo.mjs` **[ADAPT]**: Playwright `recordVideo` (390×844) scripted scroll/click flow → `ffmpeg` webm→mp4 (crf 21, yuv420p) + end-card concat. Requires ffmpeg on PATH.

**7.5 Scraping client photos (IG/Facebook)** — `scripts/scrape-*.ts` **[PATTERN]**: launch the real browser with `--remote-debugging-port=9222`, attach via `chromium.connectOverCDP('http://127.0.0.1:9222')` to **reuse the logged-in session**, then DOM scrape / GraphQL-response sniff / network capture (filter `scontent|fbcdn`, ≥40 KB). Hi-res trick: strip `/s\d+x\d+/` and `_n.` from URLs. Download with UA/Referer headers + byte-size sanity checks. One-shot scripts but the technique is the asset.

**7.6 Prospecting** — `scripts/leads-scan.mjs` **[ADAPT]**: Google Places API (New) `places:searchNearby` with `X-Goog-FieldMask`; filters **≥100 reviews + no real website** (excludes facebook/instagram/linktree/google-sites URIs); haversine ring tiers. Env `GOOGLE_PLACES_API_KEY`. Output: `docs/ops/leads-data.{json,md}`.

**7.7 Env & ops** — `scripts/check-env.mjs` (grouped env validation + mini dotenv parser, `--strict`) **[DROP-IN]**; `scripts/hash-admin.mjs`; `scripts/crop-mamabel-frames.ts` (white-border crop, sharp/PIL).

## 8. Utilities grab-bag (≈ zero coupling, all [DROP-IN])

| File | One-liner |
|---|---|
| `src/utils/imageCompress.ts` | File → canvas resize → WebP data URL (max 1024/0.8) |
| `src/utils/clipboard.ts` | Copy with `execCommand` fallback |
| `src/utils/sounds.ts` | WebAudio beeps (add-to-cart, new order) — no audio files |
| `src/utils/analyticsTracker.ts` | localStorage page-view analytics + **synthetic demo traffic generator** for screenshots |
| `src/utils/dollarRate.ts` | USD blue from `dolarapi.com`, 24 h cache |
| `src/utils/businessHours.ts` + `src/hooks/useBusinessHours.ts` | Open/closed incl. overnight windows, live-updating hook, next-opening text |
| `src/lib/firebase.ts` | **Optional Firestore in 8 lines**: `isFirebaseConfigured()` → `getFirestoreDb() \| null`; every consumer branches to localStorage |
| `src/context/ThemeContext.tsx` | Dark/light with sync body background (no mobile flash) |
| `src/i18n/translations.ts` | 5 languages (es/en/pt/ru/de), nested sections; per-item `nameEn/namePt/…` on data |
| `src/utils/menuLayouts.ts`, `palettes.ts`, `landingPalettes.ts` | Layout descriptors; palette sets as CSS-var maps |
| `src/components/MotionEffects.tsx` + `src/motion.css` | Scroll/entrance reveals, respects `prefers-reduced-motion` + `pointer: fine` |
| `src/utils/orderBuilder.ts` | Cart+checkout → persisted `OrderRecord` (pure) |
| `playwright.config.ts` + `e2e/` | Mobile-first E2E: 390×844, `isMobile/hasTouch`, webServer = build+preview, trace on retry; journey specs + the OG regression specs |

## 9. Design methodology (not code — arguably the most reused asset)

`SKILL.md` (root, `frontend-design`): how to make a site that doesn't read as AI-templated.

- Ground every choice in the **subject's world** (materials, artifacts, vernacular).
- Hero = thesis; typography carries personality; structure encodes information.
- Token plan first: 4–6 named hex, 2+ typefaces, layout concept + ASCII wireframes, **one signature element**.
- Anti-default calibration: the three current AI-looks (cream+serif+terracotta, black+acid-green, broadsheet hairlines) — spend freedom elsewhere unless the brief asks.
- Build → self-critique with screenshots → remove one accessory.
- Live results: `/demo/olivos` (boutique, cardboard size-tags signature), `/demo/mamabel` (flagship), `/inmaculada` (real bespoke client site).

## 10. Not here (don't look) + lifting checklist

**Deliberately absent — do not search this repo for:**
- WhatsApp Business/Cloud API (roadmap P3 only) — everything is `wa.me` deep links.
- Real auth (Firebase Auth) — client-side hash gate only.
- MP webhook HMAC validation.
- SSR/Next/Astro — the static-shell OG trick is the substitute.
- Stripe or non-MP PSPs.

**When lifting code into a new project, strip:**
- Brand strings: `Gatrivi.com`, `ZengaSoft`, `Soluciones Web Gatrivi.com`, demo default copy.
- Storage key prefixes: `trufi_*`, `elpuestito_*`, `gtrv-*` (rename per project).
- Defaults: sales WhatsApp `5491156199363`, sales email, `DEPOSIT_AMOUNT 65000` in `api/create-sales-deposit.ts`.
- Env var names are `VITE_*`-convention — keep or rename consistently.
- Deps each tool pulls: `mercadopago` (§2), `qrcode` (§7.3), `firebase` (§4/§8, optional), `playwright-core` + `ffmpeg` (§7.3/7.4), `js-sha256` (§5).

---

*Update this file when a new reusable tool ships here. One row in the quick index + one subsection, nothing more.*
