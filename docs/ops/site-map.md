# Mapa sitio — Gatrivi.com

Fecha: 2026-08-06 · v1.22.x · live `https://tmm.gatrivi.com`

## Árbol

```mermaid
flowchart TB
  subgraph public [Ventas]
    L["/ Landing"]
    G["/demos Galería"]
    L -->|nav Muestras| G
    L --> Lsec["#soluciones #muestras #probar #planes #reserva"]
  end

  subgraph demos [Demos pulidas — cliente / owner / order]
    MB["/demo/mamabel"]
    CV["/demo/canavesi"]
    CR["/demo/carniceria"]
    VR["/demo/verduleria"]
    PN["/demo/panaderia"]
    PZ["/demo/pizzeria"]
    AG["/demo/aguacats"]
  end

  G --> MB & CV & CR & VR & PN & PZ & AG
  L -->|CTAs| MB & CV & PZ & VR & AG

  subgraph tenant [Producto real]
    S["/s/:slug storefront"]
    SA["/s/:slug/admin"]
    A["/admin"]
    O["/order/:orderId"]
    SUP["/super-admin"]
  end

  subgraph off [Express OFF → redirect /demos]
    EX["/demo · /demo/armar · /demo/owner"]
  end
  EX --> G
```

## Landing `/`

| Ancla | Qué |
|-------|-----|
| `#hero` | Hero + fotos fondo |
| `#soluciones` | Catálogo → Canavesi · Landing → Mabel · Tienda → Pizza |
| `#muestras` | Links demos |
| `#probar` | CTA → `/demos` |
| `#planes` · `#reserva` | Precios / contacto |

`/pricing` → `/#planes`

## Demos pulidas

Cada una: cliente · `/owner` · `/order/:id`

| Marca | Path |
|-------|------|
| Mamá Mabel | `/demo/mamabel` |
| Canavesi | `/demo/canavesi` |
| Gabriel | `/demo/carniceria` |
| La Inmaculada | `/demo/verduleria` |
| La Magdalena | `/demo/panaderia` |
| Pizzería | `/demo/pizzeria` |
| Aguacats | `/demo/aguacats` |

Alias: `/demo/mamamabel` → mamabel

## Tenants reales

`/s/:slug` · `/s/:slug/admin` · `/admin` · `/order/:id` · `/super-admin`

## Express OFF (código vivo, no público)

Flag: `src/config/demoExpress.ts` → `DEMO_EXPRESS_PUBLIC=false`

`/demo` · `/demo?rubro=*` · `/demo/armar` · `/demo/owner` → `/demos`

Presets con assets (incl. café): `public/demos/presets/<rubro>/` · data `src/data/demoPresets.ts`

| Preset | Assets |
|--------|--------|
| `cafeteria` | espresso, café leche, capuccino, medialuna, tostado, desayuno, jugo, agua |
| `molino-mayorista` | Molino Florida |
| `petshop` · `libreria` · `polleria` · `grafica` · `distribuidora-lacteos` · … | idem |

**Hueco demos pulidas:** cafetería / café takeaway (assets Express listos; falta vertical `/demo/cafe` si hay lead).

## Relacionado

- [`AGENT_STATUS.md`](../AGENT_STATUS.md)
- [`prospect-demo.md`](./prospect-demo.md)
- [`vertical-demos-plan.md`](../roadmap/vertical-demos-plan.md)
