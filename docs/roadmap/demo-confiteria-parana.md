# Demo prospect — Confitería Paraná (Olivos · Paraná 3374)

**Estado: demo v1** · `/demo/confiteria-parana` (short `/confiteria-parana`)

## Prospect

| Campo | Valor (público / no inventar) |
|-------|-------------------------------|
| Marca | **Confitería Paraná** |
| Local | Paraná 3374 (también listado 3370), Olivos — misma calle que Unicenter (Paraná 3745), ~400 m |
| Reseñas | **Google 4.6★ con 746 reseñas** (restaurantguru, snapshot 2026-08-21) |
| Web propia | **No tiene** — solo agregadores y listados |
| Delivery | Rappi y PedidosYa (ángulo comisión) |
| Pagos local | Efectivo, Mastercard/Visa, débito |
| Ambiente | Mesas afuera, accesible; café confitería de barrio |
| Contacto | Warm lead — amigos de la familia del dueño |

## Oferta documentada (fuente: agregadores)

Facturas (medialunas manteca/grasa, surtidas, membrillo, crema pastelera), bolas de fraile, vigilantes, cañoncitos, mignons, empanadas, sándwiches, chipa, bizcochitos de grasa, cremonas, pan dulce, café con leche con medialunas, tortas (Balcarce, lemon pie, cheesecake, frutillas).

## Por qué fit

- Pasa el filtro de la rutina de anillos: **100+ reseñas sin web propia**, con creces.
- Ya vende por Rappi/PedidosYa → conoce el dolor de comisión.
- Warm lead: entrada directa por familia. Pitch = "tu confitería en un link, sin comisión".

## Rutas / técnica

- Tenant: `demo-confiteria-parana` · storage `trufi_demo_orders_v2` (vía registry)
- UI: **Storefront genérico** (mismo patrón que pizzería/Zimba Pet) — plan switch incluido
- Config: `src/data/demos/confiteriaParana.ts` · precios ilustrativos
- Fotos: reuso de assets genéricos panadería/pizzería ya en repo — **pendiente sesión de fotos propias**

## Guardrails

- `demoMode`: no WSP real ni cobro (`whatsappNumber: ''` hasta permiso)
- Precios ilustrativos (ribbon DEMO)
- No afirmar nada no documentado (horarios, delivery propio, historia)

## Gaps / qué pedirles (visita o WSP)

- [ ] Nombre de quien decide + WhatsApp comercial canónico
- [ ] Permiso para usar marca "Confitería Paraná" en demo pública
- [ ] Lista corta de lo que quieren vender online (no todo el mostrador)
- [ ] Presentaciones reales (unidad/¼/docena/kg) + precios vigentes
- [ ] Horarios de horneada/retiro
- [ ] ¿Delivery propio o solo apps? zona/costo/mínimo
- [ ] Logo/foto de vidriera para hero
- [ ] ¿Quieren migrar pedidos de Rappi/PedidosYa a WSP propio o sumar canal?

## Pitch 30s

1. `/confiteria-parana` en su celu → facturas + café con leche → Encargar
2. Barra "Vista demo": mostrar los 3 modos (catálogo / WSP / MP)
3. Panel owner → el pedido está en la bandeja
4. "Rappi te cobra por pedido; esto no. Y es tuyo."
