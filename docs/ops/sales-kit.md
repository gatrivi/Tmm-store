# Kit de venta — demos + briefs imprimibles

Fecha verificación referencias: **2026-08-27** · Público: comercios de **Olivos / Vicente López** · Idioma: castellano rioplatense.

## Qué es

Kit listo para vender hoy. Por cada rubro clave:

1. **Demo cliente** → `https://tmm.gatrivi.com/demo/{slug}` (+ panel `/demo/{slug}/owner`)
2. **2–3 referencias verificadas** (jugadores significativos del rubro con presencia digital) para sostener el "tu demo alcanza ese nivel"
3. **Pitch copiable** para WhatsApp / llamada (`public/kit/index.html`)
4. **Brief A6 imprimible** con la cuenta de costo/ganancia + QR al demo (`public/print/briefs/brief-{slug}.html`)

El pitch base (la pregunta que siempre aparece): *"¿qué productos tienen?"* → antes: lista escrita por chat; ahora: un link con fotos.

## Rubros cubiertos

| Rubro | Demo | Referencias verificadas | Brief |
|-------|------|-------------------------|-------|
| Pizzería | [/demo/pizzeria](https://tmm.gatrivi.com/demo/pizzeria) | Güerrín ([guerrin.com.ar](https://www.guerrin.com.ar)), El Cuartito ([elcuartito.com.ar](https://www.elcuartito.com.ar)) | [brief-pizzeria.html](../../public/print/briefs/brief-pizzeria.html) |
| Panadería | [/demo/panaderia](https://tmm.gatrivi.com/demo/panaderia) | Havanna ([havanna.com.ar](https://www.havanna.com.ar)), Coto Digital ([cotodigital3.com.ar](https://www.cotodigital3.com.ar)) | [brief-panaderia.html](../../public/print/briefs/brief-panaderia.html) |
| Carnicería | [/demo/carniceria](https://tmm.gatrivi.com/demo/carniceria) | Arrebeef ([arrebeef.com](https://arrebeef.com)), Coto Digital, DIA Online ([diaonline.supermercadosdia.com.ar](https://diaonline.supermercadosdia.com.ar)) | [brief-carniceria.html](../../public/print/briefs/brief-carniceria.html) |
| Verdulería | [/demo/verduleria](https://tmm.gatrivi.com/demo/verduleria) | DIA Online, Coto Digital | [brief-verduleria.html](../../public/print/briefs/brief-verduleria.html) |
| Ferretería | [/demo/ferreteria](https://tmm.gatrivi.com/demo/ferreteria) | Sodimac ([sodimac.com.ar](https://www.sodimac.com.ar)), Coto Digital | [brief-ferreteria.html](../../public/print/briefs/brief-ferreteria.html) |

## Archivos y scripts

```
public/kit/index.html           ← kit en pantalla: pitch copiable + links (todo lo de arriba)
public/print/briefs/
  brief-{slug}.html             ← brief A6 imprimible (Ctrl+P, tamaño A6, sin márgenes)
  qr-{slug}.png                 ← QR al demo (generado)
scripts/gen-brief-qrs.mjs       ← genera los QR (paquete `qrcode`)
scripts/gen-briefs-pdf.mjs      ← renderiza los briefs a PDF A6 (playwright-core)
npm run briefs                  ← corre ambos y deja gatrivi_brief_{slug}_A6.pdf en la raíz
```

## Workflow de hoy

1. Abrir `outreach-hoy.html` o la recorrida habitual → elegir local del rubro.
2. Pegar el pitch del rubro (kit) con el link del demo.
3. Si responde → agendar demo 10 min (guion: [`prospect-demo.md`](./prospect-demo.md)).
4. Cierre: "muestra gratis con tus productos, lista en 24 h" → `/demo/armar`.
5. Sin cierre → dejar brief A6 impreso (lleva QR).

## Notas

- Los porcentajes citados (25–35% de las apps) están presentados como referencia ilustrativa, no como dato contractual.
- Si cambia un precio de plan o se agrega un rubro, editar el `.html` correspondiente y correr `npm run briefs`.
- QRs apuntan al dominio público `tmm.gatrivi.com` — para pruebas locales regenerar con otra URL editando `gen-brief-qrs.mjs`.
