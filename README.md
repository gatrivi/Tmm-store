# 🍕 Pizzería Trufi — Menú SPA

Aplicación web estática para visualizar el menú de una pizzería, armar un carrito y generar un pedido vía WhatsApp con alias de transferencia.

---

## 🚀 Stack Tecnológico

| Tecnología | Versión |
|------------|---------|
| React      | 19      |
| Vite       | 6       |
| TypeScript | JSX/TSX |
| Tailwind CSS | 4     |

---

## 📦 Instalación Local

### Requisitos previos

- **Node.js** >= 18
- **npm** >= 9 (incluido con Node.js)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/gatrivi/Tmm-store.git
cd Tmm-store

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🛠️ Scripts disponibles

| Script        | Descripción                              |
|---------------|------------------------------------------|
| `npm run dev` | Servidor de desarrollo con HMR           |
| `npm run build` | Build de producción en `/dist`         |
| `npm run preview` | Previsualiza el build de producción    |
| `npm run lint` | Ejecuta ESLint sobre el proyecto        |

---

## 🎨 Favicon

El favicon se encuentra en:

```
public/favicon.jpg
```

Referenciado en `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.jpg" />
```

Para cambiarlo, reemplazá el archivo en `public/` y actualizá el `href` si es necesario.

---

## 📁 Estructura del proyecto

```
├── public/
│   └── favicon.jpg
├── src/
│   ├── components/
│   ├── App.tsx          ← Lógica principal y UI
│   ├── menu.json        ← Datos estáticos del menú
│   ├── main.jsx         ← Punto de entrada
│   └── index.css        ← Tailwind directives
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 📝 Notas

- Los datos del menú son **100% estáticos** (`src/menu.json`). No requiere backend ni APIs externas.
- El estado del carrito se maneja con `useState` de React.
- El diseño utiliza **Tailwind CSS** en modo oscuro y minimalista.
- El botón de WhatsApp genera un enlace `wa.me` con el resumen del pedido y el total en ARS.

---

Hecho con ❤️ y pragmatismo.
