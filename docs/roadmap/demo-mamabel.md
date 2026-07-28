# Flagship — Las Tortas de Mamá Mabel

**Estado: shipped** (v1.11.2) · etapa 1 mobile fix

Plan: [`mamabel-cursor-auto-plan.md`](./mamabel-cursor-auto-plan.md) — una etapa por turno.

### Etapa 1
- `/demo/mamabel` sin query: portada + oficio, sin chrome TMM ni AI (`?trufi=1` tools)
- Logo legible (logo-large + script); sin ken-burns
- Caps: `mamabel-etapa1-390.png` · `mamabel-etapa1-1440.png`

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
- Page: `src/pages/MamabelDemoPage.tsx` (editorial: hero full-bleed, filas tipográficas)
- Config: `src/data/demos/mamabel.ts`
- Paleta (logo/flyer): cream `#FBF6F0` · pink CTA `#E87890` · teal `#70A8A0` · ink `#1C1714`
- Fonts: Cormorant Garamond + Great Vibes

## Assets

| Path | Notas |
|------|--------|
| `public/demos/mamabel/` | logo, canasta, top-01…18 (likes), ig-*, cursos |
| `public/demos/mamabel/scraped/` | dump scrape; `ig-graphql-ranked.json`, `ig-mabel-top.json` |
| `content/mamabel/incoming/` | drop zone user fonts/PDF — wire on request |

### Scripts (Brave CDP `:9222`, sesión logueada)

- `scripts/scrape-mamabel-ig-graphql.ts` — rank by `like_count` (filtrar Mabel; feed del user contamina)
- `scripts/scrape-mamabel-ig.ts` — grid download
- `scripts/crop-mamabel-frames.py` — crop marcos blancos IG
- FB: `scrape-mamabel-brave*.ts`, `scrape-mamabel-network.ts`

### Deploy gotcha

`npx vercel --prod` + **`npx vercel alias set <url> tmm.gatrivi.com`** (el dominio custom a menudo no sigue solo).

## Feedback abierto (usuario)

- Sitio mejoró (paleta + editorial) pero puede pedir más refinamiento visual
- Marcos blancos: la mayoría croppeados; fondos de mesa blancos ≠ pad (no forzar)
- IG rank: usar GraphQL + filtro caption “Mabel Vallejos”; no confiar en click `/p/`

## Contacto demo

- WSP `5491156196941` · mail `mabelvallejos.reposteria@hotmail.com`

See also: [`AGENT_STATUS.md`](../AGENT_STATUS.md) · [`prospect-demo.md`](../ops/prospect-demo.md)
