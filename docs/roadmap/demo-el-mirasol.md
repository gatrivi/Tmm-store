# Demo prospect — El Mirasol de La Recova (Recoleta · Posadas 1032)

**Estado: demo construida y lista para enviar** · `/demo/el-mirasol` (short `/el-mirasol`) · **sin outreach iniciado**

## Prospect

| Campo | Valor (público / no inventar) |
|-------|-------------------------------|
| Marca | **El Mirasol de La Recova** |
| Local | Posadas 1032, Recoleta, CABA |
| Reseñas | Google ~4.4★ (~1.900 reseñas) |
| Web propia | **Muerta** — `elmirasol.com.ar` caído; solo Wayback (ángulo: *"tu URL era tu carta y murió"*) |
| Delivery | PedidosYa / Rappi (agregadores) |
| Pagos local | Efectivo, tarjeta |
| Ambiente | Parrilla clásica de bodega, tablas y picadas |
| Contacto | Sin canal directo todavía — primer contacto pendiente |

## Oferta documentada (fuente: agregadores + Wayback)

Picadas y tablas, parrilla (asado, vacío, matambre, entraña), achuras, combos para 2/4. Menú demo: 11 ítems ilustrativos en picadas/parrilla/achuras/combos.

## Por qué fit

- **100+ reseñas sin web viva** — pasa el filtro de anillos con creces.
- Ya vende por apps → dolor de comisión conocido.
- Pitch = "tu carta murió con tu dominio; acá vive en un link".

## Rutas / técnica

- Tenant: `demo-el-mirasol` · storage `trufi_demo_orders_v2` (vía registry)
- UI: página dedicada `src/pages/ElMirasolDemoPage.tsx` (dark, patrón Aguacats) — plan `pedidos`, 3 pedidos semilla (M4R7 nueva, K8J2 preparando, T6W4 lista)
- Config: `src/data/demos/elMirasol.ts` · precios ilustrativos
- Fotos: hero propio `public/demos/el-mirasol/hero.jpg` (foto genérica de cortes, no del local) + cortes reutilizados de canavesi — falta sesión propia
- Monograma propio: `public/demos/el-mirasol/monogram.svg`

## Guardrails

- `demoMode`: sin WSP real ni cobro (`whatsappNumber`/`bankAlias` vacíos, `mpEnabled: false`)
- Precios ilustrativos (ribbon DEMO); redes solo mencionadas en copy, sin links reales
- No afirmar horarios/historia no documentados

## Envío — qué sale

**Nada enviado todavía.** No hay contacto, llamada ni mensaje registrado con el local: el demo está construido y espera el primer toque.

Sale esto (todo verificado en el repo):

| Asset | Link / ruta | Dónde vive |
|-------|-------------|-----------|
| Demo cliente | `https://tmm.gatrivi.com/el-mirasol` (legacy `/demo/el-mirasol`) | `src/CommerceApp.tsx` · short link en `src/config/demoShortLinks.ts` |
| Panel dueño | `https://tmm.gatrivi.com/el-mirasol/owner` | `src/App.tsx` |
| Pitch 30s | sección de abajo | este doc |
| Guion de demo (3 min) | — | [`docs/ops/prospect-demo.md`](../ops/prospect-demo.md) |
| Flyer A6 genérico de recorrida (QR a `/demos`) | [`public/print/flyer-a6.html`](../../public/print/flyer-a6.html) → live `/print/flyer-a6.html` | [`docs/ops/flyer-a6.md`](../ops/flyer-a6.md) |
| Brief A6 propio (QR a `/demo/el-mirasol`) | [`public/print/briefs/brief-el-mirasol.html`](../../public/print/briefs/brief-el-mirasol.html) · QR `qr-el-mirasol.png` · PDF `gatrivi_brief_el-mirasol_A6.pdf` | `scripts/gen-brief-qrs.mjs` · `scripts/gen-briefs-pdf.mjs` |
| Pitch copiable en el kit | [`public/kit/index.html`](../../public/kit/index.html) — card "El Mirasol de La Recova" | `public/kit/index.html` |
| Preview social propio | `social-el-mirasol.html` (Open Graph y canonical a `/el-mirasol`) | `social-pages.mjs` · rewrite en `vercel.json` · imagen `public/og/demo-el-mirasol.png` |

Dos cosas para no prometer de más:

- **El brief no lleva referencias de competidores.** A diferencia de los briefs de rubro, acá no hay competidor documentado: en su lugar el bloque usa los datos públicos ya verificados del local (4.4★ con ~1.900 reseñas en Google, venta online por PedidosYa y Rappi). El QR del brief apunta al path legacy `/demo/el-mirasol`.
- **El dato de la web caída es de la investigación 2026-08.** Antes de imprimir o de mandar el pitch conviene revalidar que `elmirasol.com.ar` siga caído, porque es la primera frase del brief.

## Gaps / qué pedirles en el primer contacto

El demo ya está de nuestro lado; lo que falta es insumo del local:

- [ ] Nombre de quien decide + WhatsApp comercial
- [ ] Permiso para usar marca "El Mirasol de La Recova"
- [ ] Carta corta online (no toda la parrilla)
- [ ] Presentaciones reales (porción/tabla/kg) + precios vigentes
- [ ] ¿Recuperan el dominio o van directo a link Trufi?
- [ ] Fotos propias del local y de la parrilla (el hero actual es una foto genérica de cortes y el menú reusa fotos de Canavesi)

## Pitch 30s

1. `/el-mirasol` en su celu → tabla de picada → Encargar
2. Barra "Vista demo": catálogo / WSP / MP
3. Panel owner → pedido en bandeja
4. "Tu URL era tu carta y murió. Esto es un link que no se cae."
