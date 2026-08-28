# Propuesta — La Inmaculada (verdulería · Ugarte y España)

**Fecha:** 2026-08-26 · Lead cálido (amigos). Demo viva verificada v1.27.3.
Benchmark competitivo + decisiones de diseño: [`../roadmap/inmaculada-site-plan.md`](../roadmap/inmaculada-site-plan.md)
Brief demo: [`../roadmap/demo-verduleria.md`](../roadmap/demo-verduleria.md)

## Links para enviar

| Uso | URL |
|-----|-----|
| Cliente (mostrar primero) | https://tmm.gatrivi.com/verduleria |
| Panel del local | https://tmm.gatrivi.com/verduleria/owner |
| Seguimiento pedido | se comparte al crear un pedido de prueba |

Todos los pedidos son simulaciones: no sale WhatsApp ni cobro real.

## Guion 60s (si lo muestro en persona)

1. **Problema (15s)** — "Hoy te mandan la lista por chat: 'tomate, banana y un bolsón'. Sin kilos, sin total, reconstruyéndola a mano."
2. **Cliente (30s)** — abrir `/verduleria` → elegir tomate 1 kg → banana ½ kg → bolsón → armar pedido → total estimado.
3. **Panel (30s)** — `/verduleria/owner` → aparece el pedido en bandeja → Nuevo → Preparando.
4. **Cierre (10s)** — "Esto mismo con tus precios, tus fotos y tu WhatsApp. En 48–72 hs está andando."

## Mensaje WhatsApp (copiar / adaptar)

```
Che, te armé algo para la verdulería 😄 Entrá acá:
https://tmm.gatrivi.com/verduleria

Es una demo: la fruta y los precios son de ejemplo. La idea es que
veas cómo queda el pedido online con el nombre de ustedes:

• El cliente arma la lista sola (por peso o unidad) → te llega ordenado, no por audio
• El total figura como ESTIMADO y vos confirmás antes de preparar → nadie discute el peso
• Y el bolsón semanal arriba de todo, que es lo que más margen deja

También podés ver el panel del local (donde ves los pedidos entrando):
https://tmm.gatrivi.com/verduleria/owner

Si te gusta, lo levanto con tus precios reales, fotos del mostrador y tu
WhatsApp en 48–72 hs. Cero comisión por venta. ¿Te muestro completo algún día
esta semana?
```

## Propuesta concreta (para el momento del sí)

| Ítem | Detalle |
|------|---------|
| Plan | **Pedidos** — $20.000/mes · **0% comisión por pedido** |
| Incluye | Carta/catálogo propio · carrito por peso/unidad · pedidos a su WhatsApp · bandeja de pedidos en celular · QR para mesa/vidriera · dominio propio opcional |
| Setup | 48–72 hs · primera carga de carta incluida |
| No incluye | MercadoPago online (puede activarse después como upgrade Premium) |

**Apertura para pilots (amigos):** si cargan precios reales y prueban 2–4 semanas con clientes fijos, arrancan con el primer mes sin cargo. Decidir esto ANTES de mandarlo — una vez dicho, no retractar.

## Lo que necesito de ellos (checklist carga)

- [ ] Lista de 8–12 productos con precios reales (½ kg / kg / unidad)
- [ ] Fotos: mostrador/general para hero + 1 foto por producto (sacadas con el celu alcanzan)
- [ ] Horarios del local
- [ ] Zona delivery (hasta dónde llega) o solo retiro
- [ ] WhatsApp del local
- [ ] Logo si tienen; si no, monograma "LI" ya generado

## Antipatrones evitados (por qué esta propuesta es distinta)

VerdePuro/Buenas Papas/La Barata (relevados hoy, mismo territorio VL): exigen crear cuenta, cortan pedidos a las 17 hs y muestran rangos de precio. El pitch de Inmaculada: pedir sin registro, total estimado con confirmación humana, barrio con entrega rápida.

## Próximos pasos

| Cuándo | Acción |
|--------|--------|
| Hoy | Mandar mensaje WSP + links |
| Si responde ≤48 h | Agendar 15 min y correr guion 60s en persona/celular |
| Al cierre | Seña → carga de contenido real (checklist) → go-live 48–72 hs → factura mes 1 |

Regla: nunca meter número real de teléfono ni alias en la demo — eso va solo en tenant de producción.

See also: [`propuesta-olivos-vl.md`](./propuesta-olivos-vl.md) · [`prospect-demo.md`](./prospect-demo.md)