# vintagedealers — migración Renová Tu Vestidor

## Objetivo

Crear una tienda propia para Gaia reutilizando su vestidor público actual, sin volver a cargar productos ni fotos a mano.

Fuente inicial:

- seller id: `1482248`
- handle: `vintagedealers`
- demo: `/demo/vintagedealers`
- owner: `/demo/vintagedealers/owner`

## Flujo de migración

1. Abrir el vestidor público de Gaia en un navegador normal.
2. Ejecutar `scripts/renova-export-browser.js` desde DevTools Console/Snippets.
   - auto-scroll del vestidor
   - descubre enlaces `/producto/`
   - lee cada ficha desde el mismo origen/sesión
   - exporta `renova-vintagedealers.json`
3. Desde el repo:

```bash
npm run import:renova -- ~/Downloads/renova-vintagedealers.json
```

4. El importador:
   - convierte producto → `MenuItemType`
   - detecta categoría y talle cuando están disponibles
   - conserva precio/descripción
   - copia hasta 6 imágenes por producto a `public/demos/vintagedealers/products/`
   - sólo deja URL remota como fallback si el CDN rechaza una descarga
   - genera `src/data/demos/vintagedealers.catalog.ts`
5. Validar:

```bash
npm run lint
npm run build
npm run check:demo
```

## Estado

- [x] tenant/demo y rutas
- [x] branding/copy base desde el perfil público
- [x] exportador browser-side para evitar bloqueo anti-bot server-side
- [x] importador de catálogo e imágenes
- [ ] ejecutar export sobre el vestidor real
- [ ] revisar 1 vez talles/precios/categorías detectados
- [ ] agregar contacto/pagos reales de Gaia
- [ ] promover de demo a tenant `/s/vintagedealers`

## Guardrail

No hotlinkear como estrategia final. Las fotos deben quedar copiadas a storage propio; el fallback remoto sólo evita que una descarga fallida rompa la migración.
