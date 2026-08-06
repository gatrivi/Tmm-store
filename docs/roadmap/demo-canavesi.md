# Demo prospect — Canavesi Carnes (Olivos · Borges y Chacabuco)

**Estado: plan** (docs only) · build pendiente aprobación

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

## Decisión de build (lazy)

| Opción | Qué | Cuándo |
|--------|-----|--------|
| **A — recomendada** | Nueva ruta `/demo/canavesi` (patrón Aguacats) reusando motor carnicería | Lead caliente / visita |
| B | Solo rebrandear `/demo/carniceria` (Gabriel → Canavesi) | No: pierde vertical genérica |
| C | Solo `/demo/armar` | No: poco “quiero comprar” |

No tocar `/demo/carniceria` Gabriel. Clonar config + assets; UI = `CarniceriaDemoPage` o thin wrapper.

## Rutas (cuando se buildee)

| Uso | Path |
|-----|------|
| Cliente | `/demo/canavesi` |
| Panel | `/demo/canavesi/owner` |
| Seguimiento | `/demo/canavesi/order/:id` |

- Tenant: `demo-canavesi`
- Storage: `trufi_demo_orders_v2:canavesi`
- Config: `src/data/demos/canavesi.ts`
- Assets: `public/demos/canavesi/`

## Densidad “quieren comprar”

Mínimo vendible (vs Gabriel genérico):

1. Marca real + ribbon DEMO (precios ilustrativos hasta confirmar)
2. Dirección Olivos visible (pública) + chips Delivery / Retiro
3. Catálogo **10–14 ítems** densos: parrilla · diario · listos/vacío · combo
4. Foto por producto (stock demo OK; reemplazar con las de ellos)
5. Total estimado + copy peso variable
6. Checkout completo → panel coherente
7. CTA ventas Gatrivi en cinta/footer (no WSP de Canavesi hasta permiso)

Opcional post-v1: multi-sucursal selector, catering CTA, scrape IG como Aguacats.

## Catálogo semilla (ilustrativo — reemplazar)

Categorías: `Para la parrilla` · `Todos los días` · `Cortes al vacío` · `Listos / packs`

Ítems base (orden mag. ZN, no oficiales):

| Producto | Presentación | Nota copy |
|----------|--------------|-----------|
| Asado del medio | ½ / 1 kg aprox. | Parrilla |
| Vacío | ½ / 1 kg | Reviews destacan vacío |
| Entraña | ½ / 1 kg | |
| Bife de chorizo / ojo de bife | ½ / 1 kg | Belgrano reviews |
| Nalga milanesa | ½ / 1 kg | |
| Picada especial | ½ / 1 kg | |
| Matambre de cerdo | ½ / 1 kg | Mencionado reviews |
| Chorizos / morcilla | pack | |
| Pollo relleno | unidad | Mencionado Maps |
| Combo parrillero | pack 2–3 | Ticket alto |
| Hamburguesas | pack ×4 | |

Precios: copiar magnitud de `carniceria.ts` hasta lista real.

## Brand tokens (borrador — ajustar con logo)

| Token | Hex | Uso |
|-------|-----|-----|
| Hueso | `#F4EFE7` | fondo |
| Bordó | `#6B1A1F` | CTA |
| Carbón | `#1A1816` | texto |
| Papel | `#D4C4AE` | secundario |
| Salvia | `#5F6B52` | confianza |

Font: serif display (Georgia/proyecto) + sans UI. Evitar verde delivery genérico.

## Guardrails

- `demoMode`: no WSP real ni cobro
- No afirmar “mejor de ZN”, “faena propia”, “entrega mismo día” sin fuente
- Horarios/tel/email: solo si se muestran, citar “dato público · confirmar”
- Permiso de marca antes de mandar link a dueños
- No inventar CBU / alias / zonas

## Entregables build

- [ ] `src/data/demos/canavesi.ts`
- [ ] Registry + rutas
- [ ] Assets `public/demos/canavesi/`
- [ ] Gaps actualizados post-visita
- [ ] Link en `prospect-demo.md` + AGENT_STATUS
- [ ] `npm run check:demo` verde
- [ ] Bump versión

## Pitch 30s (en local)

1. Abrí `/demo/canavesi` en el celu
2. “Esto es Canavesi online: el cliente elige corte y kg”
3. Agregá vacío 1 kg + combo → Coordinar pedido
4. Panel: “así lo ven ustedes, sin Rappi ni comisión”
5. “La web de ustedes hoy tira error; esto vive en 48–72h con su lista”

## Fuentes investigación (2026-08-06)

- Anuncio Tribuna Abierta dic-2024 (sucursales + pedidos + mail + web)
- Wanderlog/Maps Borges 2376 (rating ~4.8, horarios, reviews vacío/atención)
- uverde listing Olivos
- Urbano CA Belgrano (servicios: delivery, retiro, catering)
- IG @canavesioficial (handle público; scrape pendiente)
- Web oficial: no usable (500)
