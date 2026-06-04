# Trufi — Sistema de Pedidos para Negocios de Comida

**Stack:** React 19 · Vite 6 · Tailwind CSS v4 · TypeScript · Vercel

Aplicación white-label de pedidos online estilo PedidoDirecto. Permite a cualquier negocio de comida (restaurantes, food trucks, rotiserías) tener su propia tienda digital sin depender de marketplaces que cobran comisión por pedido.

---

## 🛒 Experiencia del Cliente

### Catálogo Digital Interactivo
- Menú organizado por categorías con tarjetas visuales
- Cada producto muestra imágenes (lazy loading), descripción, precio y variantes
- Badges personalizables (ej: "Más pedido", "Nuevo") editables desde el admin
- Toggle de disponibilidad por producto y por opción — los agotados se ocultan automáticamente

### Carrito Inteligente
- Añadir, quitar y modificar cantidades (+/-)
- Persistencia en localStorage (sobrevive recargas)
- Validación contra el menú actual (elimina items que ya no existen o están agotados)
- Feedback sonoro con Web Audio API al agregar al carrito

### Checkout Multi-Paso
- Paso 1: formulario de datos (nombre, teléfono, dirección, tipo de entrega)
- Paso 2: review completo del pedido con ID único de 4 caracteres
- 3 métodos de pago:
  - **Efectivo** (al retirar/delivery)
  - **Transferencia** (alias configurable desde admin, se copia automáticamente)
  - **MercadoPago** (Checkout Pro con redirección, monta exacto pre-cargado)
- Fallback ante pop-up blocker: copia el mensaje al portapapeles

### Pedido Finalizado vía WhatsApp
- Mensaje pre-formateado con escape de Markdown para WhatsApp
- Incluye ID de pedido, datos del cliente, detalle del carrito y método de pago
- Un clic abre WhatsApp con todo listo para enviar

---

## 💳 Integración de Pagos

### MercadoPago Checkout Pro
- Vercel Serverless Function (`api/create-preference.ts`) crea preferencias server-side
- El `ACCESS_TOKEN` nunca toca el frontend (seguridad total)
- En mobile, MercadoPago abre la app nativa automáticamente
- Al volver con `?status=approved`, la app muestra banner de confirmación y botón para avisar por WhatsApp

### Transferencia Bancaria
- Alias de pago configurable desde el admin (sin tocar código)
- Se copia automáticamente al portapapeles en el checkout

---

## 🎨 White-Label Branding

Cada negocio personaliza su identidad visual sin tocar código:

- **Nombre del negocio** — se refleja en header, footer y meta tags
- **Logo** — upload de PNG/JPG/SVG con compresión WebP automática (max 512px)
- **Paleta de colores** — 3 presets curados + customizador con pickers individuales
- **Datos de contacto** — dirección, Instagram, Google Maps URL
- **Footer dinámico** — oculta automáticamente IG/Maps si no están configurados
- **CSS variables** inyectadas en runtime (`--brand-color`, `--brand-dark`, etc.)

---

## 🌎 Multi-Idioma

- 5 idiomas completos: Español, English, Português, Русский, Deutsch
- Selector persistente en localStorage
- Menú editable en todos los idiomas desde el admin
- Analytics de idioma más usado en el dashboard

---

## 🔐 Panel de Administración

### Acceso Seguro
- Login con credenciales hasheadas en SHA-256
- Rate limiting: 5 intentos fallidos bloquean por 60 segundos
- Acceso oculto vía patrón de clicks en el footer (5 rápidos + espera + 1)

### Editor de Menú
- CRUD completo de productos y variantes
- Edición multi-idioma inline
- Control de disponibilidad por item y por opción
- Editor de imágenes: orden, visibilidad, posición/zoom por foto
- Administrador de archivos: upload Base64 con compresión canvas WebP (max 1024px)

### Dashboard con Analytics
- Visitas hoy, totales, tiempo de sesión, idioma top
- Gráfico SVG nativo (sin librerías externas) por hora/día/mes
- **Modo Demo** — toggle que inyecta datos sintéticos realistas (30 días, horarios pico, distribución de idiomas) para que el dashboard se aprecie sin tráfico real
- Métricas de demo: pedidos simulados, ingresos estimados, ranking de productos más vendidos

### Configuraciones
- Toggle de precios en USD con cotización automática (DolarAPI) o manual
- Horarios de atención con control de días, hora de apertura/cierre y cierre pasada la medianoche
- Estado Abierto/Cerrado en tiempo real con badge pulsante en la tienda
- Limpieza de analytics y reset de textos por idioma

---

## 📱 UX/UI & Detalles

- **Mobile-first responsive** — diseñado para pedidos desde el celular
- **Skeleton loaders** con animación pulse mientras carga el menú
- **Animaciones** con Framer Motion (transiciones, modales, drawer)
- **Share/QR** — modal con código QR y API de compartir nativa
- **Página 404** branded con enlace de retorno
- **Sonido** feedback al agregar al carrito
- **SEO/PWA** — meta tags dinámicos, Open Graph, Twitter Cards, manifest.json

---

## 🏗️ Arquitectura Técnica

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + TypeScript + Vite 6 |
| Estilos | Tailwind CSS v4 + variables CSS dinámicas |
| Estado | React Context + localStorage (zero backend para datos) |
| Animaciones | Framer Motion |
| Icons | Lucide React |
| Carruseles | Embla Carousel |
| Deploy | Vercel (auto-deploy en push) |
| Serverless | Vercel Functions (MercadoPago preference) |
| Auth | SHA-256 hashes en env vars |

### Decisiones técnicas destacadas
- **Sin backend de datos:** todo vive en localStorage. Cada admin maneja su propio menú en su dispositivo. Para multi-device se recomienda migrar a Supabase/Firebase.
- **Serverless mínimo:** solo 1 función para MP. El resto es puro frontend estático.
- **Bundle consciente:** ~593KB minified (~182KB gzip). Todo inline excepto MP SDK (que se carga solo si está activo).

---

## 🚀 Cómo funciona en producción

1. El dueño entra a `/admin`, configura su menú, logo, colores y horarios
2. Comparte el link de la tienda con sus clientes
3. El cliente arma el pedido, elige pago (efectivo/transferencia/MP) y confirma por WhatsApp
4. Si paga con MP, el dinero llega directo a la cuenta del negocio
5. El dueño recibe el pedido por WhatsApp con todo el detalle

---

## 📸 Screenshots

Capturas recomendadas para portfolio / README (guardar en `docs/screenshots/`):

| # | Vista | Archivo sugerido |
|---|--------|------------------|
| 1 | Menú / hero | `01-storefront.png` |
| 2 | Detalle producto + carrito | `02-cart.png` |
| 3 | Checkout (review) | `03-checkout.png` |
| 4 | Admin — editor de menú | `04-admin-menu.png` |
| 5 | Admin — dashboard (Demo ON) | `05-admin-dashboard.png` |
| 6 | Branding / paleta | `06-admin-branding.png` |

Guía de presentación en vivo: [DEMO.md](./DEMO.md)

---

**Desarrollado por DevSalz** © 2025
