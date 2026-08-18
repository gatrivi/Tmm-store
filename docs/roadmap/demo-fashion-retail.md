# Vertical moda / indumentaria

Caso piloto: **vintagedealers (Gaia)**.

La vertical debe servir sin forks para:

- indumentaria
- zapatería
- accesorios
- moda circular / segunda mano

## Modelo de producto

Cada producto puede usar las opciones existentes para representar variantes de talle, color o presentación. El catálogo se organiza en `ropa`, `calzado`, `accesorios` y `otros`.

## Migración Renová Tu Vestidor

El catálogo de Gaia se importa desde su vestidor mediante `scripts/renova-export-browser.js` + `npm run import:renova -- <export.json>`. Fotos y datos deben copiarse a assets propios; no hotlinkear en producción.

No inventar prendas ni precios mientras el catálogo real no haya sido exportado.

## Rutas

- `/demo/vintagedealers`
- `/demo/vintagedealers/owner`
- tarjeta pública en `/demos`
