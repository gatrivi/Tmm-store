# Flagship — Las Tortas de Mamá Mabel

**Estado: shipped** (v1.10.0) · empresa familiar

## Qué se pudo sacar de FB/IG

| Fuente | Resultado |
|--------|-----------|
| **Brave CDP (logueado)** | 40 thumbs + 14+ fotos red vía network + flyers/curso/tortas reales |
| FB page pública | Logo Graph, WSP, mail |
| IG | 0 posts — probablemente sin sesión IG en ese Brave; re-correr scrape logueado |

Scripts: `scripts/scrape-mamabel-brave.ts`, `…-hires.ts`, `…-network.ts`  
Puerto: Brave con `--remote-debugging-port=9222`

Drop zone: `content/mamabel/incoming/`

## Live

| Uso | URL |
|-----|-----|
| Cliente | https://tmm.gatrivi.com/demo/mamabel |
| Panel | https://tmm.gatrivi.com/demo/mamabel/owner |
| FB | https://www.facebook.com/lastortasdemamamabel/ |
| IG | https://www.instagram.com/lastortasdemamamabel/ |

## Producto demo

- Plan **premium** (chat AI + pedidos)
- UI dedicada (`MamabelDemoPage`) teal/rosa del logo
- Tortas por ½ / 1 / 1½ kg + mesa dulce
- Notas: fecha, dedicatoria, alergias
- Assets: logo FB + hero/tortas generados (reemplazar con fotos reales del curso)

## Próximo cuando tires material

1. Pegá fotos/fuentes/lista de precios en `content/mamabel/incoming/`
2. Pedile al agente: “wire mamabel assets”

See also: [`prospect-demo.md`](../ops/prospect-demo.md)
