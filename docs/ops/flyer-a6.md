# Flyers A6 (recorrida)

**Printable:** [`/print/flyer-a6.html`](../../public/print/flyer-a6.html) → live `https://tmm.gatrivi.com/print/flyer-a6.html`

- 4× A6 (105×148 mm) por hoja A4
- QR: `public/print/qr-recorrida.png` → `tmm.gatrivi.com/demos?utm_source=recorrida&utm_medium=qr&utm_campaign=zn-0822`
- Copys (2026-08-22): hook "¿Pedidos perdidos en el chat?" — sin "tienda online" (leía como app cara)
- Paleta: [`takeshi-palette.css`](../../public/print/takeshi-palette.css)
- Marca **Gatrivi.com · ZengaSoft**
- Live URL: **tmm.gatrivi.com** (apex `gatrivi.com` diferido)
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
Regenerar todo (QR + PDFs frentes/reversos, saca screenshots frescos de demos):

```bash
npm run flyers
```

Salida: `gatrivi_4_frentes_A4.pdf` + `gatrivi_4_reversos_A4.pdf` (raíz, vector A4).

Imprimir los PDF directamente: A4 · escala 100% · **imprimir fondos** · cortar por las guías.
