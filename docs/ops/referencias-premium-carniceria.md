# Referencias premium — carnicerías grass-fed para elevar Canavesi

Fecha: 2026-08-24 · Objetivo: que `/demo/canavesi` no parezca template. Canavesi vende **novillo a pastura / campo** — el demo tiene que transmitir eso antes que cualquier feature.

## Por qué las referencias son estas

Tres DTC de carne premium que viven de vender online sin marketplace, mismo pitch que Canavesi ("sin comisión", corte + peso + entrega). Nada de Squarespace: todas convierten.

| Marca | URL | Tier | Qué hace mejor |
|-------|-----|------|----------------|
| Porter Road | porterroad.com | Pasture-raised Nashville, dry-aged | Precio por unidad con `~ $44/LB` (tilde = estimado), copy con voz, "Not just a piece of meat" |
| Force of Nature | forceofnature.com | Regenerativa, blends ancestrales | Taxonomía por animal + misión en cada card; bundles claros |
| White Oak Pastures | whiteoakpastures.com | Regenerativa certificada, granja 1866 | Certificaciones visibles (Certified Humane, EOV) + historia de granja en el footer de cada producto |

[OBSERVED] de HTML/CSS live salvo indicado.

## Porter Road — patrón clave: precio honesto por peso

- Card muestra `$33` grande + debajo `~ $44/LB` chico ([OBSERVED]: clases `price_per_pound_tilde`, `upperlink upperlink--large color--red`).
- El `~` resuelve EXACTAMENTE nuestro problema del peso variable: precio del bife varía, el /kg es fijo. Nosotros ya tenemos eso (`kgOptions`, totalHint "confirmamos peso") pero está enterrado en texto gris.
- Copy de producto: nombre corto (`Bone-In Ribeye`) + una línea de sabor ("beautifully marbled... rich, steakhouse flavor") + claim de crianza SIEMPRE presente: *"pasture-raised with no antibiotics and no added hormones"* [OBSERVED].
- Hero: foto macro del corte crudo sobre papel oscuro, headline blanco serif gigante superpuesto, CTA rojo sólido.
- Voice: primera persona del carnicero, no de la marca ("We dry age our beef whole...").

## Force of Nature — patrón clave: taxonomía y misión

- Colecciones: beef, bison, elk, chicken, ancestral-blends, curated-bundles [OBSERVED]. Por animal primero, por preparación después. Nuestra taxonomía actual (`parrilla/diario/listos`) es funcional pero anónima — falta el "por qué esta carne".
- Cada card lleva el claim regenerativo aunque sea 1 línea; el bundle lleva cantidad ("16 Products").
- Ground Beef se vende como `85/15` [OBSERVED] — especificación técnica como título. Para nosotros: `%` de grasa en picada.

## White Oak Pastures — patrón clave: certificado visible

- Claims con nombre propio: "Certified Humane, and EOV (Ecological Outcome Verified)" [OBSERVED]. No genéricos tipo "calidad premium".
- Descripción de producto enseña cocción: "pan-seared... finished with butter, garlic, and thyme. We recommend wet-aging..." [OBSERVED] — el dueño que lee esto confía porque le enseñan.
- Foto de producto: corte crudo sobre fondo neutro claro, luz pareja, sin platos ni decoración [INFERENCE de nombres de archivo `uncooked-beef-dsc*`].

## Patterns for our demo (specs accionables)

1. **Precio doble estilo PR**: `$18.900/kg` grande bordó + `~ $9.450 el ½ kg` chico debajo. Ya existe `priceLabel()` — agregar la segunda línea con tilde `~`.
2. **Claim de campo en cada card**: badge o subtítulo fijo "A pastura" / "De campo" en los 6 cortes de parrilla. Una sola palabra, no párrafo.
3. **Badge de corte real**: reemplazar "Más pedido"/"Rinde 2–3" genéricos por corte+uso: `PARA LENTA` (vacío), `AL HORNO` (matambre), `MILANESA` (nalga).
4. **Copy con voz de mostrador**: descripciones actuales son catálogo telefónico ("Tira pareja para parrilla"). Reescribir a 1 línea de sabor + uso: vacío → "Jugoso y parejo, pide cocción lenta y paciencia."
5. **Sección confianza entre hero y grid** (ya existe la strip Clock3/ShieldCheck): cambiar tercer ítem "Pedido de prueba" → "De campo, faena diaria" o equivalente que Canavesi pueda firmar.
6. **Fondo papel, no blanco**: cards hoy `bg-white shadow-sm` sobre hueso. Con `#fffdf9` + borde `border-black/8` se ve papel de carnicero, menos e-commerce genérico.
7. **Foto consistente**: todos los cortes sobre la misma superficie. Hoy mezcla fondos. Regla WOP: corte crudo, fondo neutro, sin props.
8. **Certificación nombrada**: si Canavesi tiene algo verificable (senasa, trazabilidad, "faena en frigorífico habilitado"), nombre propio en footer, no ícono genérico ShieldCheck.
9. **Combo con contenido explícito**: "16 Products" de FON → nuestro combo parrillero lista qué trae EN la card, no solo description.
10. **Hero copy de identidad, no de logística**: hoy "Carne de Canavesi, lista para tu cocina" es delivery-speak. Estilo PR "Not just a piece of meat" → algo como "Del campo al barrio, sin intermediarios" [a validar con ellos].

## Qué NO copiar

- Suscripciones/boxes (Porter Road) — no aplica a trueque Gate A.
- Precios por libra/oz — mantener kg, es AR.
- Dark mode completo — el hueso/papel claro es correcto para carnicería de barrio.

## Fuente

- Investigación directa porterroad.com, forceofnature.com/collections/all, whiteoakpastures.com (HTML live, 2026-08-24).
