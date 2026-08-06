# Demo prospect — Canavesi Carnes (Olivos · Borges y Chacabuco)

**Estado: shipped** (v1.21.0) · `/demo/canavesi`

## Prospect

| Campo | Valor (público / no inventar) |
|-------|-------------------------------|
| Marca | **Canavesi Carnes** |
| Local demo | Francisco Borges 2376, Olivos (esquina zona Chacabuco) |
| Otras sucursales (anuncio 2024) | VL Melgar 775 · La Lucila Anchorena 725 · Belgrano Arribeños 2596 |
| Pedidos (anuncio) | `15-3283-5667` · `mateocanavesi4@gmail.com` |
| Web | `canavesicarnes.com.ar` / `.com` — **caída (HTTP 500)** al investigar |
| IG | [@canavesioficial](https://www.instagram.com/canavesioficial/) |
| Horario Olivos (Maps/Wanderlog) | Mar–Vie 10:30–19 · Sáb 9:30–14 · Dom/Lun cerrado |
| Ángulo | Cadena ZN · venta menor + resto · cortes al vacío · atención personalizada |
| Competidor ya listado | [uverde.com/canavesi-carnes](https://uverde.com/canavesi-carnes) (delivery) |

Gaps / qué pedir: [`canavesi-content-gaps.md`](../canavesi-content-gaps.md)

## Problema (60s)

> Hoy piden por WSP/tel “2 kg asado” sin corte, peso ni total. Tienen web caída y ya aparecen en marketplaces. Demo = carta propia → carrito → total **estimado** → bandeja dueño, **sin comisión**.

## Rutas

| Uso | Path |
|-----|------|
| Cliente | `/demo/canavesi` |
| Panel | `/demo/canavesi/owner` |
| Seguimiento | `/demo/canavesi/order/:id` |
| Live | https://tmm.gatrivi.com/demo/canavesi |

- Tenant: `demo-canavesi`
- Storage: `trufi_demo_orders_v2:canavesi`
- Config: `src/data/demos/canavesi.ts`
- UI: `CarniceriaDemoPage` (reuso)
- Assets: `public/demos/canavesi/`
- Check: `npm run check:demo`

## Guardrails

- `demoMode`: no WSP real ni cobro
- Precios ilustrativos (ribbon DEMO)
- No afirmar “mejor”, “faena propia”, “mismo día” sin fuente
- WSP Canavesi vacío hasta permiso (CTA = Gatrivi sales)

## Pitch 30s

1. `/demo/canavesi` en celu
2. Vacío 1 kg + combo → Coordinar pedido
3. Panel `/demo/canavesi/owner`
4. “Web de ustedes caída; esto sin comisión vs marketplace”

## Fuentes (2026-08-06)

- Tribuna Abierta dic-2024 · Maps/Wanderlog Borges · uverde · IG @canavesioficial
