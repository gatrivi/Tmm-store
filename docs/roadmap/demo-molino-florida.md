# Demo — Molino Florida

Fecha: 2026-08-25 · Vertical: molino / mayorista insumos · prospect real (cooperativa Munro, Vicente López).

## La marca hoy (investigación 2026-08)

- **Cooperativa de Trabajo Molino Florida** — ex Molino Florida S.A. (fundado c. 1900, edificios de 1890, landmark en Munro). Cierre y quiebra 2017 → recuperada por sus trabajadores, cooperativa desde junio 2018; hoy +80 familias, 33 socios.
- Productos: harina 000 panadera, 0000 "Maravilla", integrales (trigo fina/mediana/superfina, centeno), maíz, garbanzo, arroz, sarraceno, semolín, salvado, afrechillo; más acopio dietético (frutos secos, legumbres, granolas, semillas, especias).
- Venta actual: **TiendaNube** (`molinoflorida.mitiendanube.com`) — catálogo enorme (~30 categorías), muchos productos **sin foto**, checkout genérico con envío por correo, sin canal mayorista diferenciado. B2B tradicional por teléfono.

## 3 referentes investigados

| Referente | Qué hace | Dolor explotable |
|-----------|----------|------------------|
| **Nueces Mecohue** (San Martín, mayorista frutos secos) | Tienda PXW "Sistema de Pedidos Por WhatsApp" — catálogo con precio por kg/caja, carrito que arma el texto de WhatsApp | Ya validó el modelo que vendemos: pedido estructurado → WSP. Le falta bandeja dueño. |
| **De Frutas Secas** (Colegiales, TiendaNube) | Mayorista dietéticas/panaderías: mínimo 25 kg mezclando productos, pago contra entrega, "consultá listado de precios por WhatsApp a Tomas" | Precios fuera del sitio = ida y vuelta eterna. Nosotros mostramos total estimado al instante. |
| **Molino Harinero General Paz** | Web institucional WordPress con fichas técnicas (000 fuerza panadera, 0000 tapas de empanadas, semolín) pero **sin precios ni pedido online** | Vende industria pero el cliente no puede pedir solo. Catálogo con formato visible + consulta prearmada cierra ese hueco. |

Pitch: **"Tu tienda online te obliga a calcular envío por correo y tus clientes B2B igual te llaman. Acá arman la reposición con formatos reales (1/5/25 kg) y te llega ordenada."**

## Producto funcional (lo que se presentó)

- Página propia `/molino-florida` (identidad conceptual verde/grano, logo MF) + **flujo completo Gatrivi**: catálogo → carrito → checkout → bandeja `/molino-florida/owner`.
- Tenant `demo-molino-florida` en registry: 9 ítems del preset `molino-mayorista` (harinas 000/integral/centeno, avena, semillas, frutos secos, legumbres, insumos, levadura) con fotos.
- Copy orientado reposición: "Reponé harina y granos sin ordenar por audio", chips Bolsa/Bulto + Reposición, total estimado, retiro/reparto.
- Guardrails demo: `whatsappNumber: ''`, precios ilustrativos, ribbon DEMO.

## Momento demo (60s)

1. `/molino-florida` → hero "Todo para amasar, cocinar y producir."
2. Sumar 4× Harina 000 (25 kg) + levadura → total estimado al toque ($156.400 seed-like).
3. Enviar pedido de prueba → pantalla éxito.
4. `/molino-florida/owner` → bandeja: pedido Nuevo → Preparando → Listo ("Panadería Norte, reposición semanal").

## Wiring

- Página custom: `src/pages/MolinoFloridaDemoPage.tsx` (catálogo visual + WSP consulta)
- Tenant: `src/data/demos/molinoFlorida.ts` (`MOLINO_FLORIDA_DEMO`, preset `molino-mayorista`)
- Rutas: `/molino-florida[/order/:id]` · `/demo/molino-florida[/order/:id]` (CommerceApp) · owner ×2 (App.tsx)
- Short link `{ id: 'molino-florida', shortPath: '/molino-florida' }` · card en galería
