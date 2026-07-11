# Tablet armado — dejar con el cliente

Purpose: el cliente carga su menú y fotos desde una tablet, sin IA ni terminal.

## Antes de entregar la tablet

1. Abrí la tienda en el navegador (Chrome o Safari).
2. Entrá al admin: `/admin` o `/s/{slug}/admin`.
3. Login por defecto: **admin** / **admin123** (cambiar antes de go-live).
4. Si es primera vez, se abre **Armado** solo. También podés forzar con `/admin?setup=1`.

## Pasos para el cliente (5 minutos)

| Paso | Qué hacer |
|------|-----------|
| **1. Negocio** | Nombre, WhatsApp, alias CBU, logo opcional, **paleta y disposición**. Dejá marcado **Empezar menú vacío**. |
| **2. Categorías** | Ej: Bebidas, Platos, Postres. |
| **3. Productos** | Nombre + precio + ingredientes opcionales por producto. |
| **4. Fotos** | Cámara o galería por plato. Opcional — **Saltar fotos** si no hay tiempo. |
| **5. Listo** | **Ver mi tienda**, QR para mostrador, copiar link. Cambiá la contraseña del admin. |

## Modo simple (plan Menu)

Sin **Modo avanzado**: nav incluye Armado, Menú, Fotos, Apariencia, Configuración.

## Modo avanzado

En Armado → **Modo avanzado** aparece el resto del panel (pedidos, editor completo, archivos).

## Datos en el dispositivo

- Todo se guarda en el navegador de la tablet (localStorage).
- **No borrar historial ni datos del sitio** en esa tablet.
- Cuando la nube esté activa (badge **Nube**), los cambios se sincronizan solos.

## Vos en casa (Firebase)

Desde una PC con navegador interactivo:

```bash
npx firebase-tools@latest login
npm run deploy:rules
```

Luego en admin → Configuración → **Probar escritura Firestore** (verde).

Ver también: [firebase-setup.md](./firebase-setup.md), [onboarding.md](./onboarding.md)
