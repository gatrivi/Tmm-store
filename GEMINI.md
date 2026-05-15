# Project Context: Trufi TMM

## 🚀 Current Status
- **Phase:** UX Demo Polish (**v1.2.0**)
- **Latest Feature:** QR Generator, Quick Actions & Visual Polish.
- **Branding:** Branch `magdalena` (Bakery/Artesanal).
- **Data Flow:** React Context -> LocalStorage -> Supabase (Upsert).

## 📂 Key File Map
- `src/context/MenuContext.tsx`: The heart of the app. Manages state, USD rates, and Supabase sync.
- `src/components/admin/AdminMenuEditor.tsx`: Main UI for adding/editing products.
- `src/data/magdalena.ts`: Seed data for the current branch.
- `src/pages/Storefront.tsx`: Primary customer view (Card-based).
- `src/components/SimplifiedMenu.tsx`: The "Laconic UX" list view (integrated in `MenuList.tsx`).

## ⚙️ Environment Variables (Vercel)
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: Data persistence.
- `VITE_WHATSAPP_NUMBER`: Order destination.
- `VITE_ADMIN_PASS_HASH`: SHA-256 hash for admin login.
- `VITE_BANK_ALIAS`: Transfer payment destination.

## 🛠 Tech Stack
- React 19 + Vite 6 + Tailwind CSS v4.
- Framer Motion for animations.
- MercadoPago Checkout Pro integration.

## 📝 Resuming Work
To resume, check if `MenuContext.tsx` needs further scaling (e.g., real-time Supabase subscriptions) or if the `SimplifiedMenu` needs to be toggled as the primary view on `/`.
