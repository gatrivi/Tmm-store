# Menu onboarding (photo import)

Purpose: upload printed menu photo, AI extract, review, import (included in paid implementation).

Paths: `AdminMenuOnboarding.tsx`, `api/parse-menu.ts`, `utils/menuImport.ts`, `MenuCategoryNav.tsx`

## Flow

1. Admin → **Importar menú**
2. Upload JPG/PNG (camera ok on mobile)
3. `POST /api/parse-menu` — OpenAI vision (`OPENAI_API_KEY`)
4. Review table — edit category, name, price, variants (`Vainilla / Caramel`)
5. Import → `menuCategories` + `menuItems` → Firestore sync

## Storefront

- Sticky category chips (horizontal scroll)
- Sections with headers mirroring printed menu
- No photo → compact text header on card

## Env

| Variable | Required |
|----------|----------|
| OPENAI_API_KEY | Yes (server) |

Local: run `vercel dev` so `/api/parse-menu` is available.

## Example

Café menu (Anitta-style): ~10 sections — CAFETERÍA, DESAYUNOS, CROISSANTS, etc.

See also: [ops/onboarding.md](../ops/onboarding.md), [orders-admin.md](./orders-admin.md)
