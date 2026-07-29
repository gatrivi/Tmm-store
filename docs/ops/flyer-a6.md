# Flyers A6 (recorrida)

**Printable:** [`/print/flyer-a6.html`](../../public/print/flyer-a6.html) → live `https://gatrivi.com/print/flyer-a6.html`

- 4× A6 (105×148 mm) por hoja A4
- QR: `public/print/qr-recorrida.png`
- Destino: `https://gatrivi.com/?utm_source=recorrida&utm_medium=qr&utm_campaign=zona_norte&utm_content=petshop`
- Paleta: [`takeshi-palette.css`](../../public/print/takeshi-palette.css)
- Marca **Gatrivi.com · ZengaSoft**
- No mezclar con volante del perro

## Takeshi palette

| Token | Hex |
|-------|-----|
| `--takeshi-night` | `#24152F` |
| `--takeshi-plum` | `#542653` |
| `--takeshi-fuchsia` | `#C72F73` |
| `--takeshi-orange` | `#F06A35` |
| `--takeshi-sun` | `#F4C44E` |
| `--takeshi-paper` | `#FFF9EF` |

Regenerar QR:

```bash
npx tsx scripts/gen-flyer-qr.mjs
```

Imprimir: abrir HTML → Ctrl+P → A4 · escala 100% · **imprimir fondos** · márgenes mínimos · cortar.
