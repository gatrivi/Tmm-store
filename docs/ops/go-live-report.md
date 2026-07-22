# Go-live report — tmm.gatrivi.com (Jul 2026)

Purpose: what changed overnight, how to deploy, how to run the Menu product for real.

**Live URL:** https://tmm.gatrivi.com  
**Repo state:** v1.8.0 · Production promoted 2026-07-22 (`vercel promote` → commit `a544c10`)

**Sales routes (live):** `/` · `/demo` · `/demo/owner` · `/demo/armar` · **`/demo/carniceria`** · **`/demo/carniceria/owner`**  
**Shop storefront:** `/s/:slug` (root is no longer El Puestito)

Note: Git pushes to `trabajo` were only creating **Preview**. Prod did not move for ~63d until a manual promote. Fix in Vercel: Production Branch = `trabajo` + auto-promote, or run `vercel --prod` / `vercel promote <preview-url>`.

---

## 1. What we built (last 24h)

### Menu product (affordable tier)

| Feature | Where |
|---------|--------|
| Customer menu | `/` or `/s/:slug` → `Storefront.tsx` |
| 4 layouts | Grilla, Lista, Destacado, Minimal → admin **Apariencia** |
| 3 color palettes | **Apariencia** or Armado step 1 |
| Armado wizard | `/admin` → 5 steps (~10 min) |
| Edit items, prices, ingredients | **Menú** (no advanced mode on Menu plan) |
| Photos | **Fotos** or Armado step 4 |

### Sale-ready hardening

- Production tenants **no longer seed** demo choripán menu
- White-label HTML/PWA (Trufi, not El Puestito)
- Footer copyright uses **shop name**
- Empty menu → CTA **Configurar menú** → `/admin`
- Admin banner if default password still active
- Checkout blocks without WhatsApp configured
- Footer link **Administrar** → `/admin`
- Share QR uses correct path (not just domain root)

---

## 2. Production deploy (don't trust push alone)

`git push origin trabajo` → **Preview only** (as of Jul 2026). Domain stays on last **Production** alias.

```bash
# Prefer: promote a Ready preview
npx vercel promote <preview-url> --yes

# Or rebuild prod from cwd
npx vercel --prod --yes
```

Stamp bottom-left must match `package.json` (currently **v1.8.0**).

---

## 3. Vercel env (Production)

Copy from `.env.example`. Minimum for Menu pilot:

| Variable | Example |
|----------|---------|
| `VITE_PLAN` | `menu` |
| `VITE_TENANT_ID` | `gatrivi` |
| `VITE_WHATSAPP_NUMBER` | `54911...` (no +) |
| `VITE_ADMIN_USER_HASH` | `npm run hash:admin` |
| `VITE_ADMIN_PASS_HASH` | same |
| `VITE_FIREBASE_*` | all 6 from Firebase console |

Pedidos tier adds: `MP_ACCESS_TOKEN`, server `TENANT_ID`, etc. → [env-vars.md](./env-vars.md)

Validate locally (when CPU ok):

```bash
npm run check:env -- --strict
```

---

## 4. First-time owner flow (10 min)

1. https://tmm.gatrivi.com/admin
2. Login → change password via env hashes before giving tablet to client
3. **Armado** → check **Empezar menú vacío**
4. Negocio: name, WhatsApp, palette, layout
5. Categorías → Productos (+ ingredientes opcional) → Fotos (skip ok)
6. **Ver mi tienda** + QR

Ongoing edits: **Menú**, **Fotos**, **Apariencia** in sidebar (Menu plan).

---

## 5. Product map (3 tiers)

| Tier | Price | Customer gets | Admin gets |
|------|-------|---------------|------------|
| **Menu** | $10k/mes | Digital menu + WSP CTA | Armado, Menú, Fotos, Apariencia |
| **Pedidos** | $20k/mes | Cart + checkout | + Pedidos, promos, dashboard |
| **Premium** | $45k/mes | + AI chat | + AI |

Set per deploy: `VITE_PLAN=menu|pedidos|premium`

---

## 6. Smoke test (browser only)

After deploy:

- [ ] Stamp = v1.4.6
- [ ] `/admin` → no amber banner (hashes set)
- [ ] Badge **Nube** if Firebase ok
- [ ] Armado → empty menu → add product → storefront updates
- [ ] Footer **Administrar** works
- [ ] Share modal QR opens correct URL

Full checklist: [smoke-test.md](./smoke-test.md)

---

## 7. Known gaps (defer)

| Item | Risk | Mitigation |
|------|------|------------|
| Firestore rules open | Anyone can read/write tenant | Pilot only; tighten P3 |
| Default admin if no env | Public guess | Set hashes day 1 |
| No in-app password change | Must use Vercel env | `hash:admin` script |
| Bundle >500kb | Slow first load | Code-split later |

---

## 8. File index (new/changed)

```
src/components/admin/MenuAppearanceSettings.tsx  # palettes + layout
src/utils/menuLayouts.ts
src/utils/adminSecurity.ts                       # default cred detection
src/utils/adminPath.ts
src/components/admin/AdminSecurityBanner.tsx
docs/ops/go-live-report.md                       # this file
```

---

## 9. Next when you wake up

1. `git push` → wait Vercel build
2. Set Vercel env if missing
3. `/admin` → Armado with empty menu
4. Optional: `npm run deploy:rules` for Firebase
5. Send QR link to test on phone

See also: [tablet-armado.md](./tablet-armado.md), [monday-deploy-checklist.md](./monday-deploy-checklist.md)
