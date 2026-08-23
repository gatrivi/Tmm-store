# Demos

Purpose: vertical demo tenants (sessionStorage-isolated) with memorable short paths.

Paths: `src/utils/demoRegistry.ts`, `config/demoShortLinks`, `src/data/demos/*`

Mechanics (shared): sessionStorage key per tenant (`trufi_demo_orders_v2:<tenant>`), owner/customer routes mirror real app, prospect orders highlighted, `npm run check:demo` validates registry + flow. See [orders-admin.md](./orders-admin.md).

| Demo | Path | Vertical |
|---|---|---|
| El Mirasol de La Recova | `/el-mirasol` | Parrilla clásica de Recoleta; carta muerta con su dominio — "Tu URL era tu carta y murió" |
| Confitería del Paraná | `/confiteria-parana` | Confitería |
| Carnicería Gabriel | `/carniceria` | Carnicería |
| Verdulería | `/verduleria` | Verdulería |
| Pizzería | `/pizzeria` | Pizzería |
| Panadería | `/panaderia` | Panadería |
| Ferretería | `/ferreteria` | Ferretería |
| Mamabel | `/mamabel` | — |
| Aguacats | `/aguacats` | — |
| Zimba Pet | `/zimba-pet` | — |
| Canavesi | `/canavesi` | — |

Gotchas:

- Legacy `/demo/<id>` resolves to the same tenant as short path.
- Each demo isolated in its own storage namespace.
