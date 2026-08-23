# Demo prospect — El Mirasol de La Recova (Recoleta · Posadas 1032)

**Estado: demo v1** · `/demo/el-mirasol` (short `/el-mirasol`)

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
| Contacto | Cold lead — sin canal directo aún |

## Oferta documentada (fuente: agregadores + Wayback)

Picadas y tablas, parrilla (asado, vacío, matambre, entraña), achuras, combos para 2/4. Menú demo: 11 ítems ilustrativos en picadas/parrilla/achuras/combos.

## Por qué fit

- **100+ reseñas sin web viva** — pasa el filtro de anillos con creces.
- Ya vende por apps → dolor de comisión conocido.
- Pitch = "tu carta murió con tu dominio; acá vive en un link".

## Rutas / técnica

- Tenant: `demo-el-mirasol` · storage `trufi_demo_orders_v2` (vía registry)
- UI: Storefront genérico — plan `pedidos`, 3 pedidos semilla (M4R7 nueva, K8J2 preparando, T6W4 lista)
- Config: `src/data/demos/elMirasol.ts` · precios ilustrativos
- Fotos: reuso assets canavesi ya en repo — pendiente sesión propia
- Monograma propio: `public/demos/el-mirasol/monogram.svg`

## Guardrails

- `demoMode`: sin WSP real ni cobro (`whatsappNumber`/`bankAlias` vacíos, `mpEnabled: false`)
- Precios ilustrativos (ribbon DEMO); redes solo mencionadas en copy, sin links reales
- No afirmar horarios/historia no documentados

## Gaps / qué pedirles (visita o WSP)

- [ ] Nombre de quien decide + WhatsApp comercial
- [ ] Permiso para usar marca "El Mirasol de La Recova"
- [ ] Carta corta online (no toda la parrilla)
- [ ] Presentaciones reales (porción/tabla/kg) + precios vigentes
- [ ] ¿Recuperan el dominio o van directo a link Trufi?
- [] Foto de parrilla para hero

## Pitch 30s

1. `/el-mirasol` en su celu → tabla de picada → Encargar
2. Barra "Vista demo": catálogo / WSP / MP
3. Panel owner → pedido en bandeja
4. "Tu URL era tu carta y murió. Esto es un link que no se cae."
