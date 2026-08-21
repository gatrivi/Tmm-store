# Kit de conversación — Canavesi Carnes (trueque Gate A)

Companion de [`trueque-pilot.md`](./trueque-pilot.md) · prospect doc: [`../roadmap/demo-canavesi.md`](../roadmap/demo-canavesi.md) · gaps: [`../canavesi-content-gaps.md`](../canavesi-content-gaps.md)

**Estado demo:** `/demo/canavesi` live (verificado 2026-08-21).

## Contacto

| Campo | Valor |
|-------|-------|
| Quién decide | ¿Mateo? (`mateocanavesi4@gmail.com` en anuncio) |
| WSP pedidos | `15-3283-5667` — confirmar wa.me al contactar |
| Local | Borges 2376, Olivos (Borges y Chacabuco) |
| Canal | Walk-in primero (esquina, local físico); WSP como follow-up |

## Pitch 30s (walk-in / WSP)

> "Buenas, soy [nombre], de Olivos. Les armé una carta online con su marca — Canavesi Carnes, cortes y precios ordenados, el cliente arma su pedido y les llega por WhatsApp ordenado con total estimado, sin comisión de marketplace. Su página web `canavesicarnes.com` está caída hace un tiempo; esto lo reemplaza. Tengo el link acá, ¿se lo muestro en 5 minutos?"

Regla: mostrar demo en **celular del dueño**, no en nuestra notebook.

## Demo 10 min ([`prospect-demo.md`](./prospect-demo.md))

1. `tmm.gatrivi.com/demo/canavesi` en su celu → vacío 1 kg + combo → "Coordinar pedido"
2. Panel `/demo/canavesi/owner` → el pedido aparece en bandeja
3. **Barra "Vista demo" arriba:** mostrar los 3 modos — Catálogo (solo carta + WSP), Tienda WSP (carrito), Tienda MP (Mercado Pago simulado). "Elegís vos cuánto querés que haga tu sitio."
4. Cierre: "Esto mismo, con sus precios reales y su WhatsApp, en `gatrivi.com/canavesi`."

## La propuesta (trueque)

**Ellos reciben:**
- Tienda live `tmm.gatrivi.com/s/canavesi` con su marca, carta real, su WSP
- Bandeja de pedidos en el celular + QR para vidriera
- Sin comisión por pedido, sin costo de plata

**Nosotros recibimos (mensual, piloto 3 meses):**
- Canje en carne: [X kg/mes a definir — propuesto: canasta mensual o % off en pedidos nuestros]
- Su número WSP real publicado en la tienda
- Reseña Google a Gatrivi + testimonial escrito
- 2 presentaciones a dueños amigos (roti/pizza/panadería)
- Permiso de usarlos como caso: "Canavesi vende con Gatrivi"

**Siempre ofrecer salida cash:** "o $[Y]/mes si preferís dejarlo en plata" — mide disposición de pago y no ancla $0.

**Alcance explícito (decirlo en voz alta):** carta + carrito + pedido por WhatsApp. Cobro online con Mercado Pago y multi-sucursal = etapa siguiente, no incluida hoy.

## El "sí" mínimo de hoy

No necesitamos todo el checklist para arrancar:

1. **Sí al piloto** (palabra basta; detalle por WSP después)
2. **WSP comercial canónico** para publicar
3. **Quién carga la carta**: ellos (wizard ~10 min, los asistimos) o mandan lista/fotos y cargamos nosotros v1

## Go-live checklist (post-sí)

Fuente completa: [`../canavesi-content-gaps.md`](../canavesi-content-gaps.md). Mínimo viable:

- [ ] Slug tenant: `canavesi` (o `canavesi-olivos`)
- [ ] Crear tenant en `/super-admin` (necesita `VITE_SUPER_ADMIN_KEY` + Firebase) — playbook: [`onboarding.md`](./onboarding.md)
- [ ] Logo hi-res + colores (hoy demo usa monograma fallback)
- [ ] Lista cortes online + presentaciones + precios vigentes
- [ ] Foto por producto (OK fotos IG con crédito hasta reemplazar)
- [ ] Retiro Borges: horarios confirmados · delivery propio sí/no, zona/costo/mínimo
- [ ] Medios de pago en local (efectivo/transfer/tarjeta)
- [ ] Admin credentials entregadas seguro + test end-to-end (cliente → WSP → admin)
- [ ] QR impreso → `/s/canavesi`

## Objeciones probables

| Objeción | Respuesta |
|----------|-----------|
| "¿Cuánta comisión me sacás?" | Cero. Por eso es canje en carne, no % de venta. |
| "Ya tengo PedidosYa/uverde" | Perfecto, sumalo. Ellos te cobran comisión por pedido; nosotros no. Tu carta propia es tuya. |
| "No tengo tiempo de cargar la carta" | Mandanos la lista o fotos de la pizarra y dejamos v1 andando esta semana. Cambios de precio después los hacés desde el celu. |
| "¿Y si no funciona?" | Piloto 3 meses. Si a los 30 días no hay un solo pedido extra, se corta sin drama y nos quedamos amigos. |
| "¿Por qué canje y no plata?" | Nos sirve tu carne y tu recomendación tanto como la plata. Es el trato de lanzamiento para comercios del barrio. |

## Después del sí

1. Provisionar tenant + cargar v1 (mismo día si dan lista)
2. Test end-to-end con Mateo en su celu
3. QR + sticker vidriera
4. Semana 2: anotar métricas (pedidos/semana, respuesta dueño) → insumo para pitch cash siguiente
