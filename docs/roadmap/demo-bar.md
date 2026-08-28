# Demo prospect — Bar / bodegón de barrio (ilustrativo)

**Estado: demo v1** · `/bar` (short) · `/demo/bar` (legacy) · owner `/bar/owner`

## Qué es
Demo de **bar de barrio / bodegón** para pitch de venta. Marca ilustrativa **"Bar La Esquina"** — no corresponde a un prospect real todavía (misma lógica que Pizza G / La Magdalena).

## Por qué bar
- **Product fit alto:** pedido recurrente por WSP desordenado (picadas/tragos/café para llevar), dueño atiende la barra, sin comisión de apps. Encaja con el filtro de compra de [`vertical-demos-plan.md`](./vertical-demos-plan.md).
- **Gap real:** no teníamos demo de bar/bodegón (Café Roca es café; su "Barra" son 3 líneas de bebida). El plan de verticales lo listaba como pendiente.
- Pizza ya tiene Fit A + varios leads → el **bar** suma rango sin clonar pizzería.

## Menú (11 ítems ilustrativos)
Picada del bar (para 1/2/4) · hamburguesa · milanesa napolitana · papas fritas · empanadas al horno · cerveza tirada (chopp/pinta) · fernet con coca · gaseosa/agua · café con leche · cortado · medialunas.

Categorías: Picadas · Cocina · Tragos · Café & mesa.

## Rutas / técnica
- Tenant: `bar-bar` · storage `trufi_demo_orders_v2:bar`
- Forma: **Storefront genérico** (`src/pages/Storefront.tsx`) — config `src/data/demos/bar.ts` + registry `demoRegistry.ts` + short link `bar`
- 3 pedidos semilla (B1B2 nueva, BJ8K preparando, B5Q4 lista)
- Monograma propio: `public/demos/bar/monogram.svg`
- Fotos: reuso de assets de parrilla/cocina/pizzeria (patrón documentado) — **pendiente sesión propia** si el prospect avanza

## Guardrails
- `demoMode`: sin WSP real ni cobro (`whatsappNumber`/`bankAlias` vacíos, `mpEnabled: false`)
- Precios ilustrativos (ribbon DEMO); marca de fantasía, no afirmar datos de un local real
- No se llama a un lead sin demo asignada: `/bar` cubre el rubro bar/bodegón para futuros prospect

## Pitch 60s
1. `/bar` en el celu → elegís una picada + 2 chopps → "Encargar"
2. Marcás retiro o delivery, sin audios ni fotos sueltas
3. Panel owner → pedido en bandeja (Nuevo → Preparando → Listo)
4. "Tus pedidos dejan de perderse en el chat y no pagás comisión de apps."

## Gaps / qué pedirle a un prospect real
- [ ] Nombre de quien decide + WhatsApp comercial
- [ ] Permiso de marca
- [ ] Carta corta online (picadas/tragos que sí venden)
- [ ] Presentaciones/porciones y precios vigentes
- [ ] Background cocina (+ opcional foto real para hero)
