# Lead schema

## Entity: `Lead`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | yes | |
| `shop_name` | string | yes | Nombre comercial |
| `tier` | enum | yes | `T0` `T1` `T2` `T3` |
| `fit` | enum | yes | `A` ideal · `B` posible · `C` bajo |
| `status` | enum | yes | ver etapas en [mvp-scope.md](./mvp-scope.md) |
| `phone` | string | | Tel público Maps |
| `whatsapp` | string | | Si distinto de tel |
| `instagram` | string | | handle sin @ |
| `address` | string | | |
| `google_reviews` | int | | |
| `google_rating` | float | | |
| `has_website` | bool | | false = target ideal |
| `competitor` | string | | pedix, rappi, PD, — |
| `rubro` | string | | pizzeria, rotiseria, carniceria… |
| `demo_url` | url | | Ver [integration.md](./integration.md) |
| `demo_rubro` | string | | slug preset o vertical pulida |
| `tenant_slug` | string | | Post-depósito `/s/:slug` |
| `tenant_url` | url | | `https://tmm.gatrivi.com/s/{slug}` |
| `contact_name` | string | | Dueño si conocido |
| `source` | string | | maps_scan, walk_in, referido |
| `utm` | json | | utm_source, medium, campaign |
| `deposit_amount_ars` | int | | 50% implementación |
| `plan` | enum | | menu, pedidos, premium |
| `next_action_at` | datetime | | |
| `next_action_text` | string | | |
| `last_contact_at` | datetime | | |
| `created_at` | datetime | | |
| `updated_at` | datetime | | |

## Entity: `Note`

| Field | Type |
|-------|------|
| `id` | uuid |
| `lead_id` | uuid |
| `body` | text |
| `created_at` | datetime |

## Tier geo (ancla Olivos)

| Tier | Zona | Radio |
|------|------|-------|
| T0 | Olivos | 0–5 km |
| T1 | Vicente López | 5–10 km |
| T2 | Florida / La Lucila | 10–15 km |
| T3 | Munro / Martínez / San Isidro borde | 15–20 km |

Ancla: `-34.5075, -58.4878`. Ref: [`ops/leads-rings-routine.md`](../ops/leads-rings-routine.md).

## Fit rubro

| Fit | Perfil |
|-----|--------|
| A | pizza, empanadas, roti, delivery/WSP alto |
| B | parrilla, cantina |
| C | sushi, resto fino, café solo mesa |

## Status workflow (tabla leads-rings)

Legacy manual: `—` → `WSP` → `demo` → `piloto` → `pago` / `no`  
CRM: mapear a enum `status` arriba.
