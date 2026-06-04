# Trufi — Pedidos online para negocios de comida

White-label ordering app (estilo PedidoDirecto): menú digital, carrito, checkout multi-paso, WhatsApp, MercadoPago y panel de administración con branding.

**Demo en vivo:** ver [DEMO.md](./DEMO.md) · Detalle técnico: [PORTFOLIO.md](./PORTFOLIO.md)

---

## Stack

| Tecnología | Versión |
|------------|---------|
| React | 19 |
| Vite | 6 |
| TypeScript | JSX/TSX |
| Tailwind CSS | 4 |
| Deploy | Vercel (+ serverless MP) |

---

## Instalación

```bash
git clone https://github.com/gatrivi/Tmm-store.git
cd Tmm-store
npm install
cp .env.example .env   # opcional: admin, WhatsApp, MP
npm run dev
```

- **Tienda:** `http://localhost:5173/`
- **Admin:** `http://localhost:5173/admin`

---

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Desarrollo con HMR |
| `npm run build` | Build en `/dist` |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint |

---

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `VITE_ADMIN_USER_HASH` | Hash SHA-256 del usuario admin |
| `VITE_ADMIN_PASS_HASH` | Hash SHA-256 de la contraseña admin |
| `VITE_WHATSAPP_NUMBER` | Número para pedidos (sin +) |
| `VITE_BANK_ALIAS` | Alias de transferencia por defecto |
| `MP_ACCESS_TOKEN` | MercadoPago (solo serverless en Vercel) |

---

## Estructura

```
├── api/                 # Vercel Functions (MercadoPago)
├── public/              # Imágenes, hero, favicon
├── src/
│   ├── components/      # UI tienda + admin
│   ├── context/         # Menú, idioma, auth
│   ├── data/menu.ts     # Menú seed (editable desde admin)
│   └── pages/           # Storefront, Admin, 404
├── DEMO.md              # Guía para mostrar el demo
└── PORTFOLIO.md         # Narrativa portfolio
```

---

## Notas

- Menú y settings del admin persisten en **localStorage** (por navegador).
- MercadoPago requiere deploy en Vercel con `MP_ACCESS_TOKEN`.
- El dashboard admin incluye **Modo Demo** con métricas sintéticas para presentaciones.

---

Desarrollado por **DevSalz** · Hecho con pragmatismo.
