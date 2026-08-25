# Demo — Pollería del barrio

Fecha: 2026-08-24 · Vertical: pollería/rotisería (★★★☆☆, fila 5 de [`vertical-demos-plan.md`](./vertical-demos-plan.md)).

## Problema (referencias reales, investigación 2026-08)

| Referente | Dolor |
|-----------|-------|
| Clara - Olivos (Guillermo Marconi 1483) | Solo vende por Rappi: pollo entero $28.000 + comisión a la app, sin web propia. |
| Baires Chicken (Tres de Febrero) | Carta viva en dominio de tercero (QueRestó); pedidos caen a wa.me suelto. Combos $32.000–$88.000. |
| Tío Alberto (tioalberto.online) | Pedir online exige crear cuenta + verificar email y después confirmar por WhatsApp igual. |

Pitch en una línea: **"Tu competencia te hace crear cuenta o le paga comisión a Rappi; acá el pedido queda armado y te llega ordenado por WhatsApp."**

## Momento demo (60s)

1. `/polleria` → tocar "Pollo al spiedo" (badge Más pedido).
2. Sumar papas grandes → carrito con total claro.
3. Retiro 13:30 en notas → Enviar → pantalla de éxito.
4. `/demo/polleria/owner` → bandeja: Nuevo → Preparando → Listo.

## Wiring

- Config: `src/data/demos/polleriaDelBarrio.ts` (`POLLERIA_DEL_BARRIO_DEMO`, tenant `demo-polleria-del-barrio`)
- Rutas: `/polleria` · `/polleria/order/:id` · `/demo/polleria[/order/:id]` (CommerceApp) · `/polleria/owner` ×2 (App.tsx)
- Short link: `{ id: 'polleria-del-barrio', shortPath: '/polleria', legacyPath: '/demo/polleria' }`
- Fotos: copia local de `public/demos/presets/polleria/*.jpg` (7 fotos, ≥48KB c/u)
- Gallery: card al final de `DEMOS` en `DemosGalleryPageV2.tsx`

## Menú (8 ítems · precios ilustrativos, escala referentes)

Pollo: entero $9.500 / medio $5.200 · spiedo $9.800.
Combos: ¼+papas $9.900 · pollo+papas+gaseosa $15.900 · familiar $22.900.
Extras: papas ch/gr $3.500/$5.400 · ensalada $4.200 · gaseosa lata/1.5L $1.900/$3.600.

## Guardrails demo

`demoMode: true` · `whatsappNumber: ''` · `bankAlias: ''` · `mpEnabled: false` · ribbon DEMO precios ilustrativos · CTA sin WSP real cae a Gatrivi ventas.
