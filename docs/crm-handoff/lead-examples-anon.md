# Lead examples (anon / públicos Maps)

Seed para import CSV o fixtures. Tel/IG son **públicos** en Maps — CRM interno.

## T0 Olivos — prioridad

| shop | tier | fit | reviews | phone | demo_url | status |
|------|------|-----|---------|-------|----------|--------|
| Morelia Pizza | T0 | B | 3329 | 011 4799-7377 | `/demo/pizzeria` | nuevo |
| Pizzería San Antonio | T0 | A | 201 | 011 4794-5865 | `/demo?rubro=pizzeria&negocio=San%20Antonio&barrio=Olivos` | nuevo |
| Biblos Olivos | T0 | B | 2026 | 011 4834-0320 | `/demo/pizzeria` | nuevo |
| La Farola | T0 | B | 7421 | 011 4790-0207 | `/demo/pizzeria` | nuevo |
| Parrilla Nelly | T0 | B | 6284 | 011 5969-7774 | `/demo/pizzeria` | nuevo |

## T1 Vicente López

| shop | tier | fit | reviews | phone | demo_url | status |
|------|------|-----|---------|-------|----------|--------|
| La Malvada | T1 | B | 3207 | 011 3430-3565 | `/demo/pizzeria` | nuevo |
| La Nueva Esquina 7 | T1 | B | 764 | 011 4797-6516 | `/demo/pizzeria` | nuevo |
| La Nueva Cocinita | T1 | A | 293 | 011 5195-4350 | `/demo/pizzeria` | nuevo |
| Rincón del Bajo | T1 | A | 267 | 011 4797-4369 | `/demo/pizzeria` | perdido |
| Dale Vicente | T1 | A | 102 | 011 4797-9288 | `/demo/pizzeria` | contactado |
| Croxi Pizzeria | T1 | A | 110 | 011 4795-3368 | `/demo/pizzeria` | nuevo |

`Rincón del Bajo`: competitor `pedix` — pitch 0 comisión.

## T2 Florida

| shop | tier | fit | reviews | phone | demo_url | status |
|------|------|-----|---------|-------|----------|--------|
| Pizzería VÍCTOR | T2 | A | 2544 | 011 4796-9141 | `/demo/pizzeria` | nuevo |

## Prospect vertical (no pizza)

| shop | tier | fit | demo_url | notes |
|------|------|-----|----------|-------|
| Canavesi Carnes | T0 | — | `/demo/canavesi` | prospect Olivos, illustrative |
| La Inmaculada | T1 | — | `/demo/verduleria` | vertical shipped |
| Gabriel carnicería | — | — | `/demo/carniceria` | demo genérico |

## CSV header (import)

```csv
shop_name,tier,fit,status,phone,instagram,address,google_reviews,competitor,rubro,demo_url,next_action_text
```

Full URLs: prefix `https://tmm.gatrivi.com`.

Fuente tablas: [`leads-rings-routine.md`](../ops/leads-rings-routine.md), [`propuesta-olivos-vl.md`](../ops/propuesta-olivos-vl.md).
