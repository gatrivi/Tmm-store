# Plan de sitio — La Inmaculada (benchmark + estructura)

**Fecha:** 2026-08-26 · **Alcance:** investigación de 3 marcas comparables + plan de sitio para el lead real (Olivos · Ugarte y España).
Demo viva: [`demo-verduleria.md`](./demo-verduleria.md) → `/demo/verduleria`. Este doc define qué copiar, qué evitar y cómo diferenciar cuando pase de demo a sitio en producción.

## Benchmark — 3 marcas comparables

Verdulerías que ya venden online en el AMBA. Verificados en vivo 2026-08-26.

### 1. VerdePuro — verdepuro.com.ar · **competidor directo**

Es **exactamente el mismo territorio**: entregan en San Isidro, Martínez, Vicente López, Florida, Beccar, La Lucila, Acassuso, La Horqueta, Boulogne, Villa Adelina, Carapachay y Munro.

| Aspecto | Lo que hacen |
|---------|--------------|
| Modelo | WooCommerce propio (desarrollada por agencia mondey.co), carrito completo |
| Precio | Variantes por peso con **rango visible**: "Banana $2.100 – $4.200 (½ kg – 1 kg)" |
| Combos | Packs pre-armados: Familiar $52.000 · Duo $31.000 · Fruta $17.000 · Carbón $27.000 |
| Envío | Gratis sobre $20.000 · corte **17 hs** → entrega al día siguiente según barrio |
| Conversión | Ofertas permanentes (-15%) · WhatsApp y chat flotante · login/cuenta obligatoria |
| Secciones | Hero "De la quinta a tu casa" · zonas de entrega (página propia) · FAQs · contacto |

**Lectura:** es el estándar del rubro en Vicente López. Pero requiere cuenta, corta a las 17 y no hay señal de "verdulería de barrio" — se lee como e-commerce genérico.

### 2. Buenas Papas — buenaspapas.com · **operador grande, logística fuerte**

| Aspecto | Lo que hacen |
|---------|--------------|
| Modelo | Tienda carrito + pago directo (efectivo/QR/tarjeta) · SKUs de peso fijo (500 g, UD, kg) |
| Catálogo | Enorme: frutas, verduras, verdes, huevos, condimentos, frutos secos, legumbres/arroz, dietética |
| Precios | Oferta permanente ("Oferta!" tachando precio original) en ~40% de los SKUs |
| Envío | Bonificado · "Recibí mañana o retirá" · zonas de entrega propias como página clave |
| Trust | ⭐ 4,7/5 + "+12.000 pedidos" bien visibles · reseñas reales |

**Lectura:** gana por surtido y logística, no por cercanía. Un comercio barrial no lo va a superar ahí; puede superarlo en trato y confirmación humana.

### 3. La Barata — labarata.ar · **modelo bolsón/canasta puro**

| Aspecto | Lo que hacen |
|---------|--------------|
| Modelo | Online-first desde Palermo, todo gravita a **canastas armadas**: AHORRO $50.000 · Frutas Grande $54.000 · Promo "Quiero Todo" $98.000 |
| Pedido | Carrito + página **"Personalizá tu pedido"** · mínimo de compra $30.000 · envío gratis CABA diario |
| Contacto | WhatsApp `+54 9 11 4192-0076` fijo en header/footer |
| Secciones extra | Para Empresas · Mayorista · Recetas (contenido SEO suave) |

**Lectura:** demuestra que el bolsón/canasta es el motor de ticket alto. Ventaja para el local chico: el mercado ya está educado en comprar por canasta.

**Referencia secundaria:** Verdulería Lamadrid (TiendaNube pura, precios "SIN STOCK" honestos, combos) — útil solo para ver el piso del rubro.

## Qué significa para La Inmaculada

| Hallazgo del benchmark | Implicancia |
|------------------------|-------------|
| Los 3 exigen **crear cuenta** para pedir | Diferenciador #1: pedir sin registro, nombre + teléfono, listo |
| Nadie muestra "total estimado + confirmo yo" | Diferenciador #2: patrón peso/unidad → estimado → dueño ajusta al preparar (ya shipped en `/demo/verduleria`) |
| VerdePuro corta 17 hs y llega el otro día | Ser el barrio: mismo día / retiro coordinado en Ugarte |
| La Barata con canastas de $50k+; VerdePuro gratis desde $20k | Mantener **Bolsón semanal arriba**, con envío bonificado desde un umbral ($15–20k) si cobran delivery |
| Ofertas y badges en todos | Badges simples ("Hoy", "Del tonel") en carta — cero esfuerzo de diseño |
| Todos con foto por producto | Fotos reales del mostrador → la única foto que un competidor no puede imitar |

## Plan de sitio (cuando el lead pague depósito)

Plataforma: tenant Gatrivi plan `pedidos`, patrón `WeightedCatalogDemoPage`. Slug sugerido: `inmaculada` (`/s/inmaculada` + custom domain opcional).

### Estructura / IA

```
/                      Carta abierta (hero: Fresco para tu mesa, pedido claro)
 ├─ Verduras (por peso/unidad: pills ½ kg / kg / unidad)
 ├─ Frutas (ídem + pack x3 palta style)
 ├─ Bolsones y packs ("Sugerido": semanal, familiar)
 └─ Almacén ligero (huevos, maple — sin pasillo entero)
/pedido/:id            Seguimiento del pedido
/admin                 Panel dueños (Nuevo → Preparando → Listo)
Hero copy real: Nombre · ubicación Ugarte y España · horario · WSP
Franja confiable: Pedí sin crear cuenta — te confirmamos el peso antes de preparar
```

### Contenido pendiente (del doc demo, sin cambios)

- [ ] Foto hero + 1 foto por producto (mostrador del local)
- [ ] Precios reales
- [ ] Horarios + zona delivery concreta (hasta X cuadras / barrios límite tipo VerdePuro)
- [ ] WSP del local (en tenant sí es real; jamás en `/demo`)
- [ ] Logo o monograma final

### Diferenciadores a escribir en la home (vs benchmark)

1. **Sin cuenta, sin app** — "Pedí como le hablás por WhatsApp, pero ordenado."
2. **Total estimado, peso confirmado** — humano al otro lado, no rango de precios a lo VerdePuro.
3. **Barrio:** entrega misma zona día / retiro en Ugarte — los del área cortan 17 hs.
4. **Envío bonificado desde $X** si definen delivery (paridad mínima VerdePuro $20k).

### Antipatrones a no copiar

- ❌ Login/cuenta obligatoria (los 3 la sufren).
- ❌ Rangos de precio ambiguos en el grid — usar pill por medida con precio claro por opción.
- ❌ Surte mega catálogo (Buenas Papas): empezas con 6–10 SKUs representativos.
- ❌ Botones de suscripción/newsletter por encima del pedido.

See also: [`demo-verduleria.md`](./demo-verduleria.md) · [`vertical-demos-plan.md`](./vertical-demos-plan.md) · propuesta comercial lista para enviar: [`../ops/propuesta-inmaculada.md`](../ops/propuesta-inmaculada.md)