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

## Express ON (fotos completas en `public/demos/presets/`)

`DEMO_EXPRESS_PUBLIC=true` · `/demo?rubro=<id>` · `/demo/armar` OFF

| Rubro | URL |
|-------|-----|
| Cafetería | `/demo?rubro=cafeteria` |
| Librería | `/demo?rubro=libreria` |
| Pet shop | `/demo?rubro=petshop` |
| Pollería | `/demo?rubro=polleria` |
| Gráfica | `/demo?rubro=grafica` |
| Lácteos | `/demo?rubro=distribuidora-lacteos` |
| Molino Florida | `/demo?rubro=molino-mayorista&negocio=Molino%20Florida` |

Verdulería preset duplicada → usar `/demo/verduleria`.

## Sin preset / sin fotos (no rehabilitar)

Rubros en `PROSPECT_CATEGORIES` sin preset: `gastronomia`, `rotiseria`, `almacen`, `dietetica`.  
`/demo` legacy choripán solo si Express legacy activo.


## Relacionado

- [`AGENT_STATUS.md`](../AGENT_STATUS.md)
- [`prospect-demo.md`](./prospect-demo.md)
- [`vertical-demos-plan.md`](../roadmap/vertical-demos-plan.md)
