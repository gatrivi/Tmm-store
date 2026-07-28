# Flagship — Las Tortas de Mamá Mabel

**Estado: shipped** (v1.12.0) · etapa 2 portfolio + encargo

Plan: [`mamabel-cursor-auto-plan.md`](./mamabel-cursor-auto-plan.md) — una etapa por turno.

### Etapa 1 ✅
- `/demo/mamabel` sin query: portada + oficio, sin chrome TMM ni AI (`?trufi=1` tools)
- Logo legible; sin ken-burns
- Caps: `mamabel-etapa1-390.png` · `mamabel-etapa1-1440.png`

### Etapa 2 ✅
- `Trabajos` = portfolio (assets reales, sin Agregar/pesos)
- `Encargar` = form → `wa.me/5491156196941` (fecha + porciones obligatorias)
- Sticky móvil: `Encargar por WhatsApp`
- Precios cliente: Cotizar (`MAMABEL_PRICES_NOTE` ilustrativo en data)
- Check: `mamabelEncargo.selfcheck` · e2e `demo-mamabel.spec.ts`

## Live

| Uso | URL |
|-----|-----|
| Cliente | https://tmm.gatrivi.com/demo/mamabel |
| Alias typo | `/demo/mamamabel` → `/demo/mamabel` |
| Panel | https://tmm.gatrivi.com/demo/mamabel/owner |
| FB | https://www.facebook.com/lastortasdemamamabel/ |
| IG | https://www.instagram.com/lastortasdemamamabel/ |

## Producto

- Tenant `demo-mamabel` · plan **premium** · WSP `5491156196941`
- Page: `src/pages/MamabelDemoPage.tsx`
- Encargo msg: `src/utils/mamabelEncargo.ts`
- Config: `src/data/demos/mamabel.ts`
- Paleta: cream `#FBF6F0` · pink `#E87890` · teal `#70A8A0` · ink `#1C1714`
- Fonts: Cormorant Garamond + Great Vibes

## Assets

| Path | Notas |
|------|--------|
| `public/demos/mamabel/` | logo, canasta, top-01…18, ig-*, cursos |
| `public/demos/mamabel/scraped/` | dump scrape |
| `content/mamabel/incoming/` | drop zone |

### Deploy gotcha

`npx vercel --prod` + **`npx vercel alias set <url> tmm.gatrivi.com`**

## Contacto demo

- WSP `5491156196941` · mail `mabelvallejos.reposteria@hotmail.com`

See also: [`AGENT_STATUS.md`](../AGENT_STATUS.md)
