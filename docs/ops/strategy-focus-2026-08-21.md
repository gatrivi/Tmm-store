# Estrategia ingresos 2026-08-21 — decisión de foco

**Decisión:** prioridad absoluta = vender **Tmm-store Gate A** (tienda online). CRM (`gatrivi`) estacionado. BPM **no** se hace.

## Por qué (evidencia)

| Candidato | Estado | Primer peso |
|---|---|---|
| **Tmm-store** | Live `tmm.gatrivi.com` v1.22.0 · 8 demos pulidas · pitch/pricing/leads/onboarding ya escritos | **Ya** — ventas es outreach, no código |
| CRM `C:\zengatrivi\REACTJS\gatrivi` | Scaffold ~1 semana: un `App.tsx`, localStorage, login demo/demo | Semanas — faltan Fases B (auth SHA-256), C (Firestore), E (estados) + sitio de ventas |
| BPM desde admin views | No existe; comprador BPM = empresa, ciclo largo | Peor opción — descartado |

## Plan

1. **Vender ahora (Gate A):** antes de la primera propuesta verificar en Vercel **Production** `VITE_SALES_WHATSAPP_NUMBER` o `VITE_DEMO_INTAKE_URL` (push a `trabajo` históricamente creaba sólo Preview).
2. Outreach con [`leads-rings-routine.md`](./leads-rings-routine.md) + shortlist [`propuesta-olivos-vl.md`](./propuesta-olivos-vl.md). Demo script: [`prospect-demo.md`](./prospect-demo.md).
3. **Gates B/C** (Firestore auth dueño, MP prod harden) sólo cuando haya cliente pagante que los necesite.
4. **CRM gatrivi:** no tocar hasta primer ingreso. Después: terminar Fases B+C y ofrecerlo como módulo add-on / SKU separado (reusa patrones Tmm según su `01-foundation-prompt.md`).
5. **BPM:** shelved sin fecha.
6. **Trueque (opcional, paralelo):** 1 tenant cobrado en producto (Canavesi primero) como caso de venta — [`trueque-pilot.md`](./trueque-pilot.md). Mismo alcance Gate A; no sustituye la meta de primer pagante cash.

## Regla de foco

Ninguna hora de código en `gatrivi` ni BPM mientras Tmm-store no tenga al menos un tenant pagante (post-depósito, `/s/<slug>` real).
