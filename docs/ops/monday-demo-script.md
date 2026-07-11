# Monday demo script (10 min)

Purpose: close pilot or paid Pedidos ($20k/mes) in one sitting.

Prereq: prod URL live — [monday-deploy-checklist.md](./monday-deploy-checklist.md).

## Before you walk in (2 min)

- [ ] Phone on prod URL storefront
- [ ] Admin logged in on second device or same phone
- [ ] Popups allowed for print test
- [ ] Know pilot slug + admin credentials (not defaults)

## Pitch (30 sec)

Sin comisión por pedido. Tus clientes piden por la web, vos ves todo en el celular, imprimís cocina y respondés WSP con un toque. Armamos todo sin cargo. Menos que PedidoDirecto.

## Demo flow

### 1. Customer view (3 min)

1. Show menu with categories (sticky chips)
2. Add 2 items → cart
3. Checkout → transferencia or efectivo
4. WSP opens with formatted order + `#pedido`

**Say:** *“El cliente sigue usando WhatsApp — pero el mensaje ya viene ordenado.”*

### 2. Admin view (4 min)

1. New order in **Pedidos** inbox
2. Sound (if on)
3. **Recibido** template → one tap WSP
4. Print 58mm ticket
5. Change status → show `/order/:id` link

**Say:** *“Desde el celular en cocina — no hace falta PC.”*

### 3. Cloud + armado (2 min)

1. Point to **Nube** badge
2. Edit price on phone → refresh PC
3. Mention **Armado**: *“Te dejamos la tablet y cargás el menú vos, o lo armamos nosotros.”*
4. Show QR on Armado step 5 (counter sticker)

### 4. Close (1 min)

| Offer | Detail |
|-------|--------|
| Plan | Pedidos — $20.000/mes |
| Setup | Armado sin cargo |
| Pilot | 3 meses gratis optional → [pilot-program-zn.md](./pilot-program-zn.md) |
| Go-live | Monday if menu ready |

**Ask:** *“¿Arrancamos esta semana? Te dejo el QR hoy.”*

## Objections (quick)

| They say | You say |
|----------|---------|
| "Ya uso PedidoDirecto" | "¿Cuánto pagás fijo? Nosotros $20k + 0 comisión." |
| "Mis clientes no piden online" | "Siguen por WSP — nosotros ordenamos el mensaje." |
| "No quiero pagar ahora" | "Probá 1 mes gratis si nos referís otro local." |

## After yes

1. Fill [pilot-shop-a.md](./pilot-shop-a.md)
2. Run [tablet-armado.md](./tablet-armado.md) or do armado for them
3. Change admin password in Configuración
4. Print QR from Armado step 5

See also: [sales-playbook-zn.md](./sales-playbook-zn.md)
