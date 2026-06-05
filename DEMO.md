# Guía rápida de demo

## Tu “board” (dashboard admin)

| Qué | Dónde |
|-----|--------|
| **URL directa** | `/admin` |
| **Sección** | Panel → **Dashboard** (primera pestaña) |
| **Datos de demo** | Toggle **Demo ON** (arriba a la derecha) |

Con **Demo ON** ves visitas, gráficos, pedidos e ingresos simulados sin tráfico real. Con **Demo OFF** solo métricas reales de `localStorage` en ese navegador.

### Acceso al admin

1. Ir a `https://tu-dominio/admin` (o `http://localhost:5173/admin`).
2. Login con usuario/contraseña configurados en `.env` (`VITE_ADMIN_*_HASH`).
3. **Alternativa:** en el footer de la tienda, patrón secreto → 5 clicks rápidos → esperar 5 s → 6.º click → modal de login.

---

## Script de 10 minutos (recomendado)

1. **Tienda (`/`)** — categorías, fotos, agregar al carrito (sonido).
2. **Carrito** — recargar una vez para mostrar persistencia.
3. **Checkout** — efectivo o transferencia (copiar alias). Evitar MercadoPago en vivo salvo que `MP_ACCESS_TOKEN` esté probado en Vercel.
4. **WhatsApp** — abrir el mensaje prearmado (no hace falta enviar).
5. **`/admin`** — login → **Demo ON** → recorrer gráficos y top productos.
6. **Branding** — cambiar color o logo en una pestaña.
7. **Cierre** — “Frontend estático + una función serverless; datos listos para migrar a Supabase/Firebase”.

---

## Qué mostrar / qué evitar

| Mostrar | Evitar en vivo |
|---------|----------------|
| Multi-idioma (selector header) | MercadoPago sin token configurado |
| Horarios abierto/cerrado | Prometer sync multi-dispositivo (es localStorage) |
| Editor de menú + imágenes | Login admin sin credenciales a mano |
| QR / compartir | |

---

## Checklist pre-demo

- [ ] `npm run build` OK
- [ ] Credenciales admin anotadas
- [ ] WhatsApp y alias de transferencia configurados (admin o `.env`)
- [ ] Dashboard con **Demo ON**
- [ ] 4–6 capturas en `PORTFOLIO.md` (opcional pero recomendado)

---

## Deploy

Push a Vercel con variables de `.env.example`. La función `api/create-preference.ts` solo corre en producción/preview de Vercel.
