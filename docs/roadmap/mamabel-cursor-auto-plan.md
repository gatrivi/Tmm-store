# Plan Cursor Auto — Las Tortas de Mamá Mabel

Usar estos prompts **uno por vez**. Cada etapa debe terminar verificada antes de iniciar la siguiente.

## Reglas comunes

- Trabajá sólo sobre la experiencia de Mamá Mabel. No rediseñes otras demos ni reescribas la arquitectura general de TMM.
- Antes de editar, identificá la ruta, componentes, datos y assets reales que la alimentan.
- Preservá cambios ajenos y reutilizá componentes existentes cuando sirvan.
- No inventes premios, reseñas, clientes, fechas, precios, zonas, medios de pago ni capacidades.
- Usá únicamente fotos reales de Mamá Mabel. No generes repostería falsa con IA ni uses stock.
- Si un dato comercial no está confirmado, usá “Consultar” o dejalo centralizado y claramente marcado para completar.
- No muestres placeholders en producción: reemplazalos con una foto real o escondé el ítem.
- Sin dependencias nuevas salvo necesidad demostrable.
- Al cerrar cada etapa: ejecutar lint, tests disponibles y build; corregir errores; revisar 390×844 y 1440×900; resumir archivos cambiados, decisiones y pruebas.

---

## Prompt 1 — Marca y portada

Quiero que conviertas el primer tramo de `/demo/mamabel` en la web de una casa pastelera familiar excepcional, no en una plantilla TMM.

### Objetivo

En cinco segundos deben quedar claras tres cosas: pastelería artesanal de alto nivel, familia real y oficio desde 1979. El CTA principal debe llevar a iniciar un encargo.

### Implementación

1. Inspeccioná primero la implementación y el inventario de imágenes existentes.
2. En la vista cliente de Mamá Mabel:
   - quitá del recorrido principal la franja “sitio demo”, “Volver a Trufi”, selector Cliente/Local y “Pedí tu demo”;
   - ocultá el asistente IA flotante;
   - conservá acceso a esas herramientas sólo mediante el mecanismo demo/admin existente. Si no existe, agregá una bandera local o query param; no las borres globalmente.
3. Rehacé el hero con la mejor foto real disponible:
   - recorte nítido y apetecible;
   - sin velo blanco que destruya contraste;
   - logo visible pero no protagonista;
   - navegación discreta y CTA claro.
4. Usá este copy como base:
   - eyebrow: `PASTELERÍA FAMILIAR · DESDE 1979`
   - H1: `Tortas que se recuerdan`
   - cuerpo: `Clásicas, temáticas y piezas extraordinarias, decoradas a mano por Mabel y su familia.`
   - CTA primario: `Contanos tu idea`
   - CTA secundario: `Ver trabajos`
5. Reordená el bloque siguiente como prueba de oficio:
   - retrato de Mabel o foto donde aparezca con una obra;
   - título: `Casi medio siglo haciendo lo difícil a mano.`
   - una galería editorial corta con 4–6 trabajos fuertes, sin duplicados ni fotos flojas;
   - usá la pieza escultórica del barco como evidencia de amplitud técnica, no como imagen aleatoria.
6. Unificá tratamiento visual de fotos: proporciones, recorte, temperatura, bordes y espaciado. No sobreedites los originales.

### Fuera de alcance

- No rehagas todavía catálogo, carrito, formulario de pedido ni cursos.
- No inventes historia adicional.

### Aceptación

- Primer viewport sin chrome de TMM ni asistente IA.
- H1 y CTA legibles sobre la imagen en desktop y móvil.
- Ningún placeholder o imagen rota en portada/galería.
- La página conserva acceso funcional a Encargos, Cursos y Contacto.
- Adjuntá al cierre capturas de 390×844 y 1440×900.

Detenete al completar y verificar esta etapa.

---

## Prompt 2 — Portfolio y encargo

Sobre la versión ya mejorada de `/demo/mamabel`, convertí “Encargos” en un recorrido realista para tortas hechas a medida.

### Objetivo

Separar inspiración de compra. Una torta personalizada no se vende bien como “½ kg + cantidad”; el flujo debe recopilar lo necesario y abrir WhatsApp con un pedido claro.

### Implementación

1. Auditá primero el catálogo, carrito y flujo de WhatsApp existentes. Reutilizá lo que funcione.
2. Separá:
   - `Trabajos` o portfolio: ejemplos reales, no necesariamente comprables;
   - `Encargar`: solicitud guiada;
   - productos estándar, sólo si hay precio y definición confiables.
3. Reemplazá el modelo genérico de peso/cantidad para encargos personalizados por un configurador breve:
   - ocasión;
   - cantidad aproximada de porciones;
   - sabor y relleno, con `A definir` disponible;
   - fecha necesaria;
   - retiro o delivery;
   - idea/tema;
   - notas;
   - indicación para adjuntar una referencia al abrir WhatsApp.
4. Al confirmar, generá un mensaje de WhatsApp ordenado, legible y completo. No envíes nada automáticamente.
5. Fecha y porciones son obligatorias. Mostrá errores junto al campo y conservá los valores al corregir.
6. En móvil, mantené un único CTA persistente: `Encargar por WhatsApp`.
7. Ampliá el portfolio sólo con assets reales ya disponibles. Ocultá “Torta temática” mientras tenga el bloque rosa sin foto.
8. No publiques precios viejos como actuales. Centralizá precios y fecha de actualización; cuando no haya certeza, mostrale al cliente `Cotizar`.

### Fuera de alcance

- No agregues pagos online.
- No inventes catálogo, sabores, zonas o tiempos.
- No cambies la identidad visual fijada en la etapa 1.

### Aceptación

- Se puede completar un encargo de punta a punta con teclado y táctil.
- El enlace final abre WhatsApp al `5491156196941` con todos los datos elegidos, correctamente codificados.
- No hay botones `Agregar`, cantidades o pesos engañosos en piezas personalizadas.
- Filtros y CTAs tienen estados visibles y accesibles.
- Agregá una prueba del generador del mensaje y un smoke test del flujo principal.
- Lint, tests y build pasan.

Detenete al completar y verificar esta etapa.

---

## Prompt 3 — Confianza, cursos y cierre

Terminá `/demo/mamabel` como sitio publicable: confianza real, cursos honestos, información útil y calidad móvil.

### Objetivo

Eliminar señales de demo o contenido vencido y dar suficiente certeza para que una persona contacte sin dudar.

### Implementación

1. Cursos:
   - no presentes el volante “Domingo 18 de abril · Concordia” como curso actual;
   - si no hay una próxima fecha confirmada, convertí la sección en `Aprendé con Mabel`, marcá la imagen como `Edición anterior` y usá CTA `Consultar próxima fecha`;
   - separá claramente consulta de cursos y encargo de tortas.
2. Confianza:
   - incorporá Instagram real y fotos de alumnas/trabajos como prueba;
   - sólo agregá reseñas, prensa o cifras si existen en datos verificables del repo;
   - destacá `Desde 1979` sin convertirlo en una afirmación grandilocuente no demostrable.
3. Información práctica:
   - prepará bloques para anticipación, retiro/delivery, pagos y conservación;
   - mostrales contenido sólo si está confirmado; de lo contrario, CTA `Consultar por WhatsApp`;
   - hacé que teléfono, mail e Instagram tengan etiquetas claras y áreas táctiles cómodas.
4. Cierre:
   - CTA final con una sola acción principal;
   - footer sobrio, con marca y datos reales;
   - sin asistentes, banners ni promoción de TMM en la vista cliente.
5. Calidad:
   - imágenes responsivas, dimensiones reservadas, lazy loading bajo el hero y formatos optimizados;
   - texto alternativo útil, foco visible, landmarks correctos y contraste AA;
   - metadata propia de Mamá Mabel y preview social usando una imagen real;
   - respetar `prefers-reduced-motion`;
   - cero overflow horizontal a 320 px.
6. Creá `docs/mamabel-content-gaps.md` con todo lo que todavía requiere confirmación familiar: fotos faltantes, precios, sabores, zonas, anticipación, pagos, próximas fechas y testimonios. No bloquees el sitio por esos datos.

### Aceptación

- No se ve ningún evento vencido presentado como vigente.
- No hay afirmaciones o datos inventados.
- Todos los enlaces de contacto funcionan.
- No hay errores de consola en carga ni en el flujo de encargo.
- Lint, tests y build pasan.
- Entregá capturas finales de home y encargo en 390×844 y 1440×900, más un resumen de pendientes reales.

Detenete al completar y verificar esta etapa.

---

## Orden recomendado

1. Marca y portada.
2. Portfolio y encargo.
3. Confianza, cursos y cierre.

No ejecutar las tres etapas en un solo turno: el control visual entre etapas es parte del trabajo.
