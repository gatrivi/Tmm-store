# Integración CRM ↔ Gatrivi.com

## Base URL

Production: `https://tmm.gatrivi.com`

## Demo URLs (enviar al lead)

### Default pitch (Fit A)

| Rol | URL |
|-----|-----|
| Cliente | `/demo/pizzeria` |
| Owner | `/demo/pizzeria/owner` |
| Seguimiento | `/demo/pizzeria/order/:id` |

### Flagship marca

`/demo/mamabel` (+ `/owner`, `/order/:id`)

### Verticales pulidas (con fotos)

| Rubro | Path |
|-------|------|
| Carnicería | `/demo/carniceria` |
| Canavesi (prospect) | `/demo/canavesi` |
| Verdulería | `/demo/verduleria` |
| Panadería | `/demo/panaderia` |
| Aguacats | `/demo/aguacats` |

Galería: `/demos`

### Express con preset (si `DEMO_EXPRESS_PUBLIC=true`)

`/demo?rubro=<id>&negocio=Nombre&barrio=Zona&color=verde`

Rubros con fotos: `cafeteria`, `libreria`, `petshop`, `polleria`, `grafica`, `distribuidora-lacteos`, `molino-mayorista`.

Builder (si público): `/demo/armar` — genera query string vía `buildProspectDemoSearch()`.

**OFF por defecto:** `/demo`, `/demo/armar` → redirect `/demos`. Ver `src/config/demoExpress.ts`.

### Personalizar demo URL (sin tenant)

```text
https://tmm.gatrivi.com/demo?rubro=pizzeria&negocio=Pizzería%20San%20Antonio&barrio=Olivos&color=coral
```

Params: `negocio`, `barrio`, `rubro`, `color` (`carbon|coral|verde|azul|violeta`).  
Código: `src/utils/prospectDemo.ts`.

## Post-depósito (tenant real)

1. Firebase + `VITE_SUPER_ADMIN_KEY` en Production
2. Abrir `/super-admin` → crear slug + plan
3. Armado menú en `/s/:slug/admin` ([`onboarding.md`](../ops/onboarding.md))
4. Entregar: `https://tmm.gatrivi.com/s/{slug}`

**No** clonar app por lead. **No** poner teléfonos reales en URLs demo.

## Reserva / CTA comercial

| Mecanismo | Config | Código |
|-----------|--------|--------|
| WhatsApp | `VITE_SALES_WHATSAPP_NUMBER` (default `5491156199363`) | `buildSalesContactHref(source)` |
| Email fallback | `VITE_SALES_EMAIL` | mismo |
| Tally / form | `VITE_DEMO_INTAKE_URL` | `buildReserveHref({ demoUrl, rubro, businessName })` |
| Precio label | `VITE_DEMO_PRICE_LABEL` (default `$65.000`) | `getDemoPriceLabel()` |

UTM: `captureAttribution()` guarda en `sessionStorage` key `trufi_attr_v1`; `withAttribution()` append a intake URL.

Hidden fields Tally sugeridos: `demo_url`, `rubro_demo`, `negocio`, utm_*.

## Pitch copy (30s)

Sin comisión. Catálogo → carrito → WSP ordenado + bandeja celular. Armado 48–72h. ~$15–18k/mes plan Pedidos vs PD.

## Planes (facturación CRM)

| Plan | ARS/mes | Features clave |
|------|---------|----------------|
| menu | 10.000 | carta + WSP, sin carrito |
| pedidos | 20.000 | carrito, MP, panel, promos |
| premium | 45.000 | + AI |

Fuente: `src/config/plans.ts`.

## Gates venta (no prometer en CRM)

| Gate | Vendible |
|------|----------|
| A | Tienda online + demos + reserva |
| B | Pedidos reales multi-dispositivo |
| C | MP integrado por comercio |

Ref: [`sales-readiness.md`](../ops/sales-readiness.md).
